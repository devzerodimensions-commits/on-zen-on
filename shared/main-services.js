export const mainServices = [
 { title:"Software engineering", slug:"software-engineering", icon:"code", description:"Web applications, backend systems, mobile apps and cloud platforms built as one connected product." },
 { title:"Digital marketing", slug:"digital-marketing", icon:"growth", description:"SEO, paid campaigns, content, social media and measurement aligned with your business goals." },
 { title:"AI & automation", slug:"ai-workflow-automation", icon:"spark", description:"Practical AI assistants, connected workflows and internal tools that reduce repetitive work." },
 { title:"Secure experience design", slug:"secure-experience-design", icon:"shield", description:"User research, intuitive interfaces and security reviews brought together from the start." },
];
export const mainServiceLinks = Object.fromEntries(mainServices.map((s,i)=>["link_"+(8+i*5),"/services/"+s.slug]));
