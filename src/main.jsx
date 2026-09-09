import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './tech-theme.css';
import './growth-layout.css';
import './golden-sections.css';
import './balanced-brand.css';
import './stack-showcase.css';
import './showcase.css';

const services = [
  ['01', 'Software engineering', 'Custom software, cloud platforms and API-first systems that turn your next idea into reliable growth.'],
  ['02', 'Digital marketing', 'SEO, PPC, content and social campaigns engineered for visibility, qualified traffic and momentum.'],
  ['03', 'AI & automation', 'Practical AI assistants and workflow automation that make every customer interaction more useful.'],
  ['04', 'Secure experience design', 'Fast, intuitive digital products with zero-trust thinking and protection built in from day one.'],
];

function App() {
  const [menu, setMenu] = useState(false);
  const [formState, setFormState] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setFormState('Sending…');
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error();
      form.reset(); setFormState('Thanks—your inquiry has been received.');
    } catch { setFormState('Your inquiry could not be sent yet. Please connect the Neon database and API.'); }
  };
  return <>
    <div className="notice"><span className="pulse" />Always on for your next big move <span>24/7 support</span></div>
    <header>
      <a className="brand" href="#home" aria-label="On Zen On home"><img src="/assets/on-zen-on-logo-transparent.png" alt="On Zen On Private Limited" /></a>
      <button className="mobile-toggle" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? '×' : '☰'}</button>
      <nav className={menu ? 'open' : ''}>
        <a href="#about">About us</a><a href="#services">Services</a><a href="#industries">Industries</a><a href="#work">Portfolios</a><a href="#updates">Tech updates</a><a href="#contact">Contact</a>
      </nav>
      <a className="button button-small desktop-cta" href="#contact">Inquire now <b>↗</b></a>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ON ZEN ON / DIGITAL SYSTEMS <i /></p>
          <div className="signal"><span /> LIVE DIGITAL INTELLIGENCE</div>
          <h1>Web, apps & AI<br />built to <em>grow</em><br />your business.</h1>
          <p className="hero-text">One expert team for web development, mobile applications, AI solutions, SEO and digital marketing—built around your business goals.</p>
          <div className="hero-actions"><a className="button" href="#contact">Launch a project <b>↗</b></a><a className="text-link" href="#services">View capabilities <span>↓</span></a></div>
          <div className="proof"><div><strong>24/7</strong><span>Always-on support</span></div><div><strong>AI-first</strong><span>Smarter operations</span></div><div><strong>Zero trust</strong><span>Security built in</span></div></div>
        </div>
        <div className="hero-art" aria-label="3D software platform visual"><div className="tech-grid" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><img src="/assets/software-laptop-3d.png" alt="3D laptop with software dashboard, cloud and AI panels" /><div className="floating-card card-one"><span>AI WORKFLOW</span><strong>Automation, active</strong><i>✦</i></div><div className="floating-card card-two"><span>PLATFORM STATUS</span><strong>All systems go</strong><i>●</i></div><div className="axis"><span>01</span><i /><span>ON</span></div></div>
      </section>

      <section className="ticker" aria-label="Service highlights"><div>SOFTWARE DEVELOPMENT <b>✦</b> DIGITAL MARKETING <b>✦</b> AI AUTOMATION <b>✦</b> SECURE BY DESIGN <b>✦</b> SOFTWARE DEVELOPMENT <b>✦</b></div></section>

      <section className="trust-bar"><p>YOUR END-TO-END DIGITAL PARTNER</p><div><span>WEB DEVELOPMENT</span><span>APP DEVELOPMENT</span><span>AI SOLUTIONS</span><span>SEO + PPC</span><span>UI / UX</span></div></section>

      <section className="intro section" id="about"><p className="eyebrow">BUILT FOR WHAT'S NEXT <i /></p><div className="split"><h2>Technology that makes business <em>move.</em></h2><div><p>On Zen On is a digital technology company for businesses that refuse to stand still. We turn ambitious ideas into products, platforms and campaigns people choose.</p><a className="text-link" href="#contact">Discover our approach <span>↗</span></a></div></div><div className="system-pills"><span>PRODUCT STRATEGY</span><span>WEB + APP ENGINEERING</span><span>AI AUTOMATION</span><span>SEO + PERFORMANCE</span><span>CLOUD ARCHITECTURE</span></div></section>

      <section className="services section" id="services"><div className="section-head"><div><p className="eyebrow">WHAT WE DO <i /></p><h2>One connected team.<br />Endless possibility.</h2></div><p>From an early-stage idea to an enterprise-scale platform, we join technology and marketing into a single growth engine.</p></div><div className="service-grid">{services.map(([number, title, text]) => <article className="service-card" key={number}><span>{number}</span><div className="service-icon">{number === '01' ? '⌘' : number === '02' ? '↗' : number === '03' ? '✦' : '◈'}</div><h3>{title}</h3><p>{text}</p><a href="#contact" aria-label={`Learn about ${title}`}>Explore <b>↗</b></a></article>)}</div></section>

      <section className="capability" id="industries"><div className="capability-copy"><p className="eyebrow">CONNECTED BY DESIGN <i /></p><h2>Your operations.<br /><em>More intelligent.</em></h2><p>AI-powered customer assistants, self-service portals, online booking and automation make it easier for people to do business with you—at every hour.</p><a className="button button-light" href="#contact">Design your solution <b>↗</b></a></div><div className="capability-list"><div><span>01</span><h3>AI-powered experiences</h3><p>Virtual assistants that guide, support and convert.</p></div><div><span>02</span><h3>Workflow automation</h3><p>Better processes, fewer handoffs and more time to grow.</p></div><div><span>03</span><h3>Cloud-native foundations</h3><p>Flexible, API-first systems ready for the future.</p></div></div></section>

      <section className="technology section"><div className="technology-title"><p className="eyebrow">OUR TECHNOLOGY STACK <i /></p><h2>The right technology<br />for every <em>ambition.</em></h2><p>From a high-converting website to an AI-ready product, we choose dependable tools that make your digital future easier to build and scale.</p></div><div className="stack-groups"><article><div className="stack-heading"><span>01</span><h3>Frontend</h3><p>Fast, accessible experiences people enjoy.</p></div><div className="tech-badges"><b className="html">HTML<span>5</span></b><b className="css">CSS<span>3</span></b><b className="js">JS</b><b className="react">⚛<small>React</small></b><b className="next">N<small>Next.js</small></b></div></article><article><div className="stack-heading"><span>02</span><h3>Backend & Cloud</h3><p>Secure services built for long-term scale.</p></div><div className="tech-badges"><b className="node">⬡<small>Node.js</small></b><b className="python">Py<small>Python</small></b><b className="java">J<small>Java</small></b><b className="azure">◆<small>Azure</small></b><b className="aws">AWS</b></div></article><article><div className="stack-heading"><span>03</span><h3>Data, mobile & AI</h3><p>Connected foundations for smart products.</p></div><div className="tech-badges"><b className="postgres">▣<small>PostgreSQL</small></b><b className="mongo">◒<small>MongoDB</small></b><b className="flutter">ϟ<small>Flutter</small></b><b className="ai">✦<small>AI / ML</small></b><b className="api">&lt;/&gt;<small>API</small></b></div></article></div></section>

      <section className="outcomes section" id="work"><p className="eyebrow">WHY ON ZEN ON <i /></p><div className="split"><h2>Digital work that earns attention—and trust.</h2><p>We combine a creative point of view with robust engineering, practical security and measurable marketing. The result is technology people enjoy using and growth you can see.</p></div><div className="outcome-grid"><div><strong>Motion-ready</strong><span>Interfaces that feel alive, with accessible dark-mode experiences.</span></div><div><strong>Secure by default</strong><span>Zero-trust principles and protective defence at every layer.</span></div><div><strong>Built to perform</strong><span>Fast loading, SEO-aware experiences designed to be discovered.</span></div></div></section>

      <section className="industries-showcase"><div><p className="eyebrow">INDUSTRIES WE SERVE <i /></p><h2>Whatever you do,<br />we make it <em>digital-first.</em></h2></div><div className="industry-tags"><span>E-commerce</span><span>Healthcare</span><span>Education</span><span>Real estate</span><span>Finance</span><span>Travel</span><span>SaaS</span><span>Manufacturing</span><span>Startups</span></div></section>

      <section className="results section"><div className="results-intro"><p className="eyebrow">BUILT FOR BUSINESS RESULTS <i /></p><h2>More than a website.<br /><em>A growth machine.</em></h2><p>Every project has one purpose: make your business easier to find, easier to trust and easier to choose.</p></div><div className="result-cards"><article><b>01</b><strong>Discover</strong><p>We understand your audience, goals and opportunities before a single line is built.</p></article><article><b>02</b><strong>Build</strong><p>Our designers, developers and marketing specialists build one connected solution.</p></article><article><b>03</b><strong>Grow</strong><p>We launch, measure and optimise so your digital investment keeps working harder.</p></article></div></section>

      <section className="process"><div className="process-label"><span>THE ON ZEN ON METHOD</span><b>01—03</b></div><div className="process-stages"><article><span>01</span><h3>Plan with purpose</h3><p>Strategy, discovery and a clear roadmap for digital success.</p></article><article><span>02</span><h3>Create with clarity</h3><p>Human-focused design, dependable code and strong storytelling.</p></article><article><span>03</span><h3>Scale with confidence</h3><p>AI, analytics and optimisation that keep you ahead.</p></article></div></section>

      <section className="updates section" id="updates"><div className="section-head"><div><p className="eyebrow">TECH UPDATES <i /></p><h2>Ideas for<br /><em>what’s next.</em></h2></div><a className="button" href="#contact">Talk to an expert <b>↗</b></a></div><div className="update-grid"><article><span>AI & AUTOMATION</span><h3>How AI assistants are changing customer service</h3><a href="#contact">Read insight ↗</a></article><article><span>WEB DEVELOPMENT</span><h3>What a high-performing business website needs in 2026</h3><a href="#contact">Read insight ↗</a></article><article><span>DIGITAL MARKETING</span><h3>Building visibility across search and AI platforms</h3><a href="#contact">Read insight ↗</a></article></div></section>

      <section className="showcase"><div className="showcase-heading"><p className="eyebrow">YOUR NEXT DIGITAL EXPERIENCE <i /></p><h2>Built for ambitious<br /><em>businesses worldwide.</em></h2><p>From local startups to global teams, we craft digital experiences that make a confident first impression—and keep delivering after launch.</p><a className="button" href="#contact">Create your website <b>↗</b></a></div><div className="site-previews" aria-label="Example website previews"><article className="browser-preview retail"><div className="browser-bar"><i /><i /><i /><span>northstar.co</span></div><div className="preview-hero"><b>NORTH<br />STAR</b><span>01 / COLLECTION</span><div className="preview-shape" /></div><div className="preview-bottom"><span>Designed to be discovered</span><b>↗</b></div></article><article className="browser-preview data"><div className="browser-bar"><i /><i /><i /><span>flowmetric.io</span></div><div className="data-panel"><div><span>MONTHLY GROWTH</span><b>+28.4%</b></div><div className="chart"><i /><i /><i /><i /><i /></div><div className="data-grid"><span>Users <b>8,420</b></span><span>Revenue <b>$24k</b></span></div></div></article><article className="browser-preview studio"><div className="browser-bar"><i /><i /><i /><span>atelier.studio</span></div><div className="studio-panel"><span>DESIGN / DEVELOP / DELIVER</span><b>Make the<br /><em>complex</em> clear.</b><div className="studio-orb" /></div></article></div></section>

      <section className="floating-work" aria-label="Selected digital experiences"><div className="screen-field" aria-hidden="true"><i className="screen-card screen-one" /><i className="screen-card screen-two" /><i className="screen-card screen-three" /><i className="screen-card screen-four" /><i className="screen-card screen-five" /><i className="screen-card screen-six" /><i className="screen-card screen-seven" /><i className="screen-card screen-eight" /><i className="screen-card screen-nine" /><i className="screen-card screen-ten" /><i className="screen-card screen-eleven" /><i className="screen-card screen-twelve" /></div><div className="floating-work-copy"><p>Built with</p><h2>On Zen On</h2><span>CREATION MEETS GROWTH</span></div></section>

      <section className="contact" id="contact"><div><p className="eyebrow">LET'S CREATE <i /></p><h2>Ready when<br />you are.</h2><p>Tell us where you want to go. We’ll help map the digital path to get there.</p></div><form onSubmit={submit}>{formState && <p className="success">{formState}</p>}<label>Name<input required name="name" placeholder="Your name" /></label><label>Business email<input required type="email" name="email" placeholder="you@company.com" /></label><label>What can we help with?<textarea required name="message" placeholder="Tell us a little about your project" rows="3" /></label><button className="button" type="submit">Send inquiry <b>↗</b></button></form></section>
    </main>
    <footer>
      <div className="footer-brand"><img src="/assets/on-zen-on-logo-transparent.png" alt="On Zen On" /><p>We create secure digital products, intelligent automation and growth-focused marketing for businesses ready to move forward.</p><p className="footer-tagline">Creation meets growth.</p></div>
      <div><strong>Useful links</strong><a href="#home">Home</a><a href="#about">About us</a><a href="#services">Services & technologies</a><a href="#industries">Industries</a><a href="#updates">Blog</a><a href="#contact">Newsletter</a><a href="#contact">Contact us</a></div>
      <div><strong>All services</strong><a href="#services">Frontend development</a><a href="#services">Backend development</a><a href="#services">Web & mobile applications</a><a href="#services">AI & workflow automation</a><a href="#services">Digital marketing</a><a href="#services">SEO, PPC & AEO</a><a href="#services">Cloud, API & security</a></div>
      <div className="reach-us"><strong>Reach us</strong><p><b>Canada</b><br />1102 3 Avenue South<br />Lethbridge, AB T1J 0J6<br />Canada</p><p><b>Australia</b><br />2/54 Hotham Street<br />St Kilda East, Melbourne<br />Victoria 3183, Australia</p><a href="tel:+910000000000">+91 00000 00000</a><a href="mailto:hello@onzenon.com">hello@onzenon.com</a></div>
      <small>© {new Date().getFullYear()} On Zen On Private Limited. All rights reserved.</small>
    </footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
