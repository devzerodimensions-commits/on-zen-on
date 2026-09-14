import React, {useEffect, useRef, useState} from "react";
import photos from "../../shared/service-photos.json";
import marketing from "../../shared/marketing-offering-images.json";
import sections from "../../shared/service-section-images.json";

const bundled = [...new Map([
 {image:"/assets/on-zen-on-official-logo.png",alt:"On Zen On logo"},
 {image:"/assets/software-laptop-3d.png",alt:"Software illustration"},
 {image:"/assets/portfolio-floating-sites.png",alt:"Portfolio illustration"},
 ...Object.values(photos), ...Object.values(marketing), ...sections,
].map(m=>[m.image,m])).values()];

export function MediaSelect({label="Image",value,onChange,media,upload}) {
 const [file,setFile]=useState(null),[description,setDescription]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const alive=useRef(true),input=useRef(null),change=useRef(onChange);
 change.current=onChange;
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 const options=[...bundled.map(m=>({url:m.image,label:m.title||m.alt})),...media.map(m=>({url:m.url,label:m.alt||m.original_name}))];
 const replace=async()=>{
  if(!file || !description.trim()) {setMessage("Choose an image and describe it first.");return;}
  setBusy(true);setMessage("");
  try {
   const data=new FormData();data.append("file",file);data.append("alt",description.trim());
   const result=await upload(data);
   window.dispatchEvent(new CustomEvent("cms-media-uploaded",{detail:{...result,original_name:file.name}}));
   if(alive.current) {
    change.current(result.url,result.alt);setFile(null);setDescription("");
    if(input.current)input.current.value="";
    setMessage("Image selected. Save draft to keep it, then Publish to update the website.");
   }
  } catch(error) {if(alive.current)setMessage(error.message);}
  finally {if(alive.current)setBusy(false);}
 };
 return <div className="image-picker">
  {value && <img className="image-picker-preview" src={value} alt="Current selected image" loading="lazy"/>}
  <label className="field"><span>{label}</span>
   <select value={value||""} disabled={busy} onChange={e=>onChange(e.target.value)}>
    <option value="">No image</option>
    {value && !options.some(m=>m.url===value) && <option value={value}>Current image — {value.split("/").pop()}</option>}
    {options.map(m=><option key={m.url} value={m.url}>{m.label}</option>)}
   </select>
  </label>
  <details className="image-upload"><summary>Upload a new image</summary>
   <label className="field"><span>PNG, JPG or WebP (up to 8 MB)</span><input ref={input} type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
   <label className="field"><span>Describe the new image</span><input value={description} maxLength={250} disabled={busy} onChange={e=>setDescription(e.target.value)} placeholder="For example: developer reviewing a database diagram"/></label>
   <button type="button" disabled={busy||!file||!description.trim()} onClick={replace}>{busy?"Uploading…":"Upload & use image"}</button>
  </details>
  {message && <p className="image-picker-message" role="status">{message}</p>}
 </div>;
}
