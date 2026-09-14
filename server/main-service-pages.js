import {mainServices,mainServiceLinks} from "../shared/main-services.js";

export function mainServicePages(stableId){
 const specs=[
  {slug:"software-engineering",title:"Software Engineering",heading:"From your first idea to a connected digital product.",body:"Bring your website, application, data and cloud infrastructure together. We shape the scope around the people using your product and the team maintaining it, then build and review in manageable stages.",services:[
   ["Frontend Development","Responsive business websites, React applications, customer portals and accessible interfaces.","frontend-development","code"],
   ["Backend Development","APIs, databases, authentication, payments and reliable business workflows.","backend-development","server"],
   ["Mobile App Development","Android, iOS and cross-platform applications with connected services and thoughtful mobile experiences.","mobile-app-development","phone"],
   ["Cloud, API & DevOps","Hosting architecture, deployments, monitoring, backups and operational handover.","cloud-api-devops","cloud"],
  ],outcomes:[
   ["Business platforms","Connect customer-facing pages to the admin tools, data and processes behind them."],
   ["Customer and team apps","Build booking, commerce or operational journeys that work across web and mobile."],
   ["Modernisation","Review an existing product, identify priorities and improve it in planned stages."],
  ],questions:[
   ["Can you build the complete product?","Yes. A project can combine frontend, backend, mobile and cloud work. We agree the requirements, deliverables and responsibilities before implementation."],
   ["Can you improve an existing system?","We can start with a review of your current product and plan changes around its constraints, integrations and maintenance needs."],
   ["What is included after launch?","Handover, documentation and any ongoing support are defined in the agreed scope. Hosting, third-party subscriptions and future feature work are discussed separately."],
  ]},
  {slug:"secure-experience-design",title:"Secure Experience Design",heading:"Make every interaction clear, useful and secure.",body:"Combine thoughtful product design with practical security work. We consider how people navigate, sign in, manage their data and recover from errors, then review the controls that support those journeys.",services:[
   ["UI/UX & Product Design","User research, information architecture, prototypes, accessible interfaces and reusable design systems.","ui-ux-product-design","design"],
   ["Cybersecurity","Application and API reviews, access hardening, configuration checks and prioritised remediation.","cybersecurity","shield"],
  ],outcomes:[
   ["Clear customer journeys","Simplify important tasks such as registration, onboarding, account management and checkout."],
   ["Appropriate access","Plan roles, permissions, sign-in and recovery experiences around real user needs and risks."],
   ["Design and review together","Use prototypes and scoped security checks to identify improvements before and after implementation."],
  ],questions:[
   ["Is this only a design service?","It combines product design with scoped security review and implementation support. You can choose design, security or a coordinated engagement."],
   ["Can you work with our development team?","Yes. We can provide prototypes, design guidance, review findings and a prioritised handover for your team."],
   ["Does this guarantee complete security or compliance?","No. Security depends on implementation and ongoing operations. Review scope, limitations and follow-up work are documented; formal certification is not implied."],
  ]}
 ];
 return specs.map(s=>{
  const block=(key,type,heading,body,items=[],extra={})=>({id:stableId(s.slug+"-"+key),type,anchor:key,eyebrow:"",heading,body,image:"",alt:"",buttonLabel:"",href:"",items:items.map(([title,text])=>({title,text,href:"",image:"",alt:""})),...extra});
  const path="/services/"+s.slug,image="/assets/main-"+s.slug+".webp";
  const data={schemaVersion:1,title:s.title,path,seo:{title:s.title+" | On Zen On",description:mainServices.find(m=>m.slug===s.slug).description,canonical:path,ogImage:image,noindex:false},blocks:[
   block("overview","hero",s.heading,s.body,[],{eyebrow:s.title,image,alt:s.title+" collaborative digital product studio",buttonLabel:"Discuss your project",href:"#contact"}),
   block("specialist-services","services","Explore "+s.title.toLowerCase()+" services.","Choose a specialist service below, or combine them into one coordinated project.",[],{cardLinkLabel:"View service details",items:s.services.map(([title,text,slug,icon])=>({title,text,href:"/services/"+slug,icon,image:"",alt:""}))}),
   block("possibilities","features","Built around your next step.","Start with a concrete business need and shape the work around it.",s.outcomes),
   block("process","process","A clear process, from discovery to delivery.","Each stage has a purpose and a review point.",[["Discover","Understand your users, business goals, existing systems and constraints."],["Plan","Agree the scope, priorities, responsibilities and measures of success."],["Create and review","Build or design in stages, with feedback and validation against the agreed requirements."],["Deliver and support","Hand over the agreed work and plan ongoing maintenance or the next improvement."]]),
   block("questions","faq","Your questions, answered.","",s.questions),
   block("contact","contact","Let’s talk about "+s.title.toLowerCase()+".","Tell us what you want to achieve, what you already have and where you need support.",[],{eyebrow:"YOUR NEXT CHAPTER"})
  ]};
  return ["service-"+s.slug,"page",data,"page:"+path];
 });
}

export function connectMainServices(page,stableId){
 let changed=false;
 for(const b of page.blocks||[]){
  if(b.type!=="template"||b.template!=="services")continue;
  for(const [key,href]of Object.entries(mainServiceLinks)){
   if(["","/#contact","#contact","/services"].includes(b.fields[key])){
    b.fields[key]=href;changed=true;
   }
  }
 }
 if(page.path==="/services"&&!page.blocks.some(b=>b.anchor==="main-services")){
  page.blocks.splice(1,0,{id:stableId("main-service-categories"),type:"services",anchor:"main-services",eyebrow:"OUR FOUR MAIN SERVICES",heading:"Four services. One connected team.",body:"Choose your starting point, then explore the specialist services within each area.",image:"",alt:"",buttonLabel:"",href:"",cardLinkLabel:"Explore this service",items:mainServices.map(s=>({title:s.title,text:s.description,href:"/services/"+s.slug,icon:s.icon,image:"",alt:""}))});changed=true;
 }
 return changed;
}

export async function migrateMainServices(db,stableId){
 await db.transaction(async q=>{
  const marker=await q.query("INSERT INTO cms_migrations (id) VALUES ($1) ON CONFLICT(id) DO NOTHING RETURNING id",["main-service-links-v1"]);
  if(!marker.length)return;
  for(const row of await q.query("SELECT id,draft,published FROM documents WHERE kind='page'")){
   const next={...row};let changed=false;
   for(const field of ["draft","published"]){if(!row[field])continue;const page=JSON.parse(row[field]);if(connectMainServices(page,stableId)){next[field]=JSON.stringify(page);changed=true;}}
   if(changed)await q.query("UPDATE documents SET draft=$1,published=$2,version=version+1,updated=$3 WHERE id=$4",[next.draft,next.published,Date.now(),row.id]);
  }
 });
}
