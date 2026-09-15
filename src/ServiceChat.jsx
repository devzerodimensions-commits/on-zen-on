import React, {useEffect, useRef, useState} from "react";
import {serviceCatalog} from "../shared/services.js";
import {mainServices} from "../shared/main-services.js";
import "./service-chat.css";

const greeting={text:"Hello! I can help you explore On Zen On services or start an inquiry. What would you like to know?"};
const contact={label:"Send a project inquiry",href:"/#contact"};
export function ServiceChat({page}) {
 const [open,setOpen]=useState(false),[input,setInput]=useState(""),[messages,setMessages]=useState([greeting]);
 const field=useRef(null),log=useRef(null),launcher=useRef(null);
 useEffect(()=>{if(open)field.current?.focus();},[open]);
 useEffect(()=>{if(open&&log.current)log.current.scrollTop=log.current.scrollHeight;},[messages,open]);
 const close=()=>{setOpen(false);launcher.current?.focus();};
 const answer=(question)=>{
  const q=question.toLowerCase();
  if(/price|cost|budget|quote|pricing/.test(q))return {text:"Pricing depends on your requirements, integrations and project scope. Tell us what you need and the team can discuss a suitable quote.",links:[contact]};
  if(/time|long|deadline|deliver|duration/.test(q))return {text:"Timelines depend on the scope and your existing setup. The team agrees deliverables and a schedule after reviewing your requirements.",links:[contact]};
  if(/contact|human|person|talk|support|email|call|inquiry/.test(q))return {text:"Use our inquiry form to send your question to the team. This automated guide does not connect to a live agent.",links:[contact]};
  const faq=page.blocks?.filter(b=>b.type==="faq").flatMap(b=>b.items||[]).find(i=>i.title.toLowerCase()===q);
  if(faq)return {text:faq.text,links:[contact]};
  const groups=[
   [/frontend|front.end|website|web design|react/,"frontend-development"],
   [/backend|back.end|database|api development/,"backend-development"],
   [/mobile|android|ios|flutter|app development/,"mobile-app-development"],
   [/marketing|seo|ppc|advertis|social media/,"digital-marketing"],
   [/automation|chatbot|artificial|\bai\b/,"ai-workflow-automation"],
   [/cyber|security/,"cybersecurity"],
   [/\bui\b|\bux\b|product design/,"ui-ux-product-design"],
   [/cloud|devops|hosting/,"cloud-api-devops"],
  ];
  const match=groups.find(([pattern])=>pattern.test(q));
  if(match){const service=serviceCatalog.find(s=>s.slug===match[1]);return {text:service.body,links:[{label:"Explore "+service.title,href:"/services/"+service.slug},contact]};}
  if(/service|software|offer|help|hello|hi\b/.test(q))return {text:"Our work covers four main areas. Choose a service to see the details:",links:mainServices.map(s=>({label:s.title,href:"/services/"+s.slug}))};
  return {text:"I can help with services, pricing, timelines and contacting the team. For a specific requirement, please send an inquiry.",links:[contact]};
 };
 const send=(text)=>{
  const question=text.trim().slice(0,500);if(!question)return;
  setMessages(current=>[...current.slice(-38),{text:question,user:true},answer(question)]);setInput("");
 };
 return <div className="service-chat">
  {open&&<section className="service-chat-panel" aria-label="On Zen On chat" onKeyDown={e=>{if(e.key==="Escape")close();}}>
   <header className="service-chat-head"><div><strong>On Zen On helper</strong><small>Automated service guide</small></div><button type="button" onClick={close} aria-label="Close chat">×</button></header>
   <div className="service-chat-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
    {messages.map((m,i)=><div key={i} className={m.user?"service-chat-message from-user":"service-chat-message"}><p>{m.text}</p>{m.links?.map(link=><a key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.label} ↗</a>)}</div>)}
   </div>
   <div className="service-chat-prompts">{["Our services","Pricing","Project timeline","Contact team"].map(q=><button key={q} type="button" onClick={()=>send(q)}>{q}</button>)}</div>
   <form className="service-chat-form" onSubmit={e=>{e.preventDefault();send(input);}}><input ref={field} aria-label="Your question" value={input} onChange={e=>setInput(e.target.value)} maxLength={500} placeholder="Ask about our services…" autoComplete="off"/><button type="submit" disabled={!input.trim()} aria-label="Send question">↑</button></form>
   <small className="service-chat-note">Preset answers. Please don’t enter passwords or sensitive information.</small>
  </section>}
  <button ref={launcher} className="service-chat-launcher" type="button" aria-expanded={open} aria-label={open?"Close chat":"Chat with On Zen On"} onClick={()=>open?close():setOpen(true)}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h6"/></svg> {open?"Close":"Chat with us"}</button>
 </div>;
}
