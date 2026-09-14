import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './admin.css';
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
  const getRoute = () => window.location.pathname === '/admin' ? '/admin' : window.location.hash || '#home';
  const [route, setRoute] = useState(getRoute);
  const [menu, setMenu] = useState(false);
  const [formState, setFormState] = useState('');
  useEffect(() => {
    const updateRoute = () => setRoute(getRoute());
    window.addEventListener('hashchange', updateRoute);
    window.addEventListener('popstate', updateRoute);
    return () => {
      window.removeEventListener('hashchange', updateRoute);
      window.removeEventListener('popstate', updateRoute);
    };
  }, []);
  if (route === '/admin' || route.startsWith('#/admin')) return <AdminPanel />;
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

const adminNav = [
  ['dashboard', 'Dashboard', 'dashicons-dashboard'],
  ['inquiries', 'Inquiries', 'dashicons-email'],
  ['content', 'Pages & Posts', 'dashicons-admin-page'],
  ['media', 'Media Library', 'dashicons-format-image'],
  ['users', 'Users', 'dashicons-admin-users'],
  ['settings', 'Settings', 'dashicons-admin-generic'],
];

const emptyContent = { type: 'page', title: '', slug: '', status: 'draft', excerpt: '', body: '' };
const emptyMedia = { title: '', url: '', alt: '', category: 'Website' };
const emptyUser = { name: '', email: '', role: 'Editor', status: 'active' };

function AdminPanel() {
  const [token, setToken] = useState(sessionStorage.getItem('oz_admin_token') || '');
  const [user, setUser] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [active, setActive] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [summary, setSummary] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [content, setContent] = useState([]);
  const [editing, setEditing] = useState(emptyContent);
  const [settings, setSettings] = useState({});
  const [media, setMedia] = useState([]);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [mediaForm, setMediaForm] = useState(emptyMedia);
  const [userForm, setUserForm] = useState(emptyUser);

  const headers = useMemo(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token]);

  const api = async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    if (response.status === 401) {
      sessionStorage.removeItem('oz_admin_token');
      setToken('');
      throw new Error('Please login again.');
    }
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Admin request failed.');
    return response.json();
  };

  const loadAdmin = async () => {
    if (!token) return;
    setLoading(true);
    setNotice('');
    try {
      const [summaryData, inquiryData, contentData, settingsData, mediaData, userData, activityData] = await Promise.all([
        api('/api/admin/summary'),
        api('/api/admin/inquiries'),
        api('/api/admin/content'),
        api('/api/admin/settings'),
        api('/api/admin/media'),
        api('/api/admin/users'),
        api('/api/admin/activity'),
      ]);
      setSummary(summaryData);
      setInquiries(inquiryData);
      setContent(contentData);
      setSettings(settingsData);
      setMedia(mediaData);
      setUsers(userData);
      setActivity(activityData);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmin(); }, [token]);

  const login = async (event) => {
    event.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed.');
      sessionStorage.setItem('oz_admin_token', data.token);
      setToken(data.token);
      setPassword('');
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const saveInquiry = async (item, changes) => {
    await api(`/api/admin/inquiries/${item.id}`, { method: 'PATCH', body: JSON.stringify({ ...item, ...changes }) });
    await loadAdmin();
    setNotice('Inquiry updated.');
  };

  const deleteInquiry = async (id) => {
    await api(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
    await loadAdmin();
    setNotice('Inquiry moved out of the queue.');
  };

  const saveContent = async (event) => {
    event.preventDefault();
    const method = editing.id ? 'PATCH' : 'POST';
    const url = editing.id ? `/api/admin/content/${editing.id}` : '/api/admin/content';
    const saved = await api(url, { method, body: JSON.stringify(editing) });
    setEditing(saved);
    await loadAdmin();
    setNotice('Content saved.');
  };

  const removeContent = async (id) => {
    await api(`/api/admin/content/${id}`, { method: 'DELETE' });
    setEditing(emptyContent);
    await loadAdmin();
    setNotice('Content deleted.');
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    await api('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(settings) });
    await loadAdmin();
    setNotice('Settings saved.');
  };

  const saveMedia = async (event) => {
    event.preventDefault();
    const method = mediaForm.id ? 'PATCH' : 'POST';
    const url = mediaForm.id ? `/api/admin/media/${mediaForm.id}` : '/api/admin/media';
    await api(url, { method, body: JSON.stringify(mediaForm) });
    setMediaForm(emptyMedia);
    await loadAdmin();
    setNotice('Media library updated.');
  };

  const deleteMedia = async (id) => {
    await api(`/api/admin/media/${id}`, { method: 'DELETE' });
    setMediaForm(emptyMedia);
    await loadAdmin();
    setNotice('Media item deleted.');
  };

  const saveUser = async (event) => {
    event.preventDefault();
    const method = userForm.id ? 'PATCH' : 'POST';
    const url = userForm.id ? `/api/admin/users/${userForm.id}` : '/api/admin/users';
    await api(url, { method, body: JSON.stringify(userForm) });
    setUserForm(emptyUser);
    await loadAdmin();
    setNotice('User saved.');
  };

  const deleteUser = async (id) => {
    await api(`/api/admin/users/${id}`, { method: 'DELETE' });
    setUserForm(emptyUser);
    await loadAdmin();
    setNotice('User deleted.');
  };

  if (!token) {
    return <main className="wp-login">
      <form onSubmit={login} className="wp-login-card">
        <img src="/assets/on-zen-on-logo-transparent.png" alt="On Zen On" />
        <h1>Admin Login</h1>
        <p>Manage On Zen On website content, inquiries and settings.</p>
        {loginError && <span className="wp-error">{loginError}</span>}
        <label>Admin ID<input value={user} onChange={(event) => setUser(event.target.value)} placeholder="admin" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter admin password" required /></label>
        <button type="submit">Log In</button>
        <a href="#home">Back to website</a>
      </form>
    </main>;
  }

  return <main className="wp-admin">
    <aside className="wp-sidebar">
      <a className="wp-admin-brand" href="#home"><img src="/assets/on-zen-on-logo-transparent.png" alt="On Zen On" /><span>On Zen On</span></a>
      <nav>{adminNav.map(([id, label, icon]) => <button className={active === id ? 'active' : ''} key={id} onClick={() => setActive(id)}><i className={icon} />{label}</button>)}</nav>
      <button className="wp-logout" onClick={() => { sessionStorage.removeItem('oz_admin_token'); setToken(''); }}>Log out</button>
    </aside>
    <section className="wp-workspace">
      <div className="wp-topbar">
        <div><span>WordPress-style Admin</span><h1>{adminNav.find(([id]) => id === active)?.[1]}</h1></div>
        <div className="wp-top-actions"><a href="#home">View site</a><button onClick={loadAdmin}>{loading ? 'Refreshing...' : 'Refresh'}</button></div>
      </div>
      {notice && <p className="wp-notice">{notice}</p>}
      {active === 'dashboard' && <AdminDashboard summary={summary} inquiries={inquiries} content={content} activity={activity} />}
      {active === 'inquiries' && <AdminInquiries inquiries={inquiries} onSave={saveInquiry} onDelete={deleteInquiry} />}
      {active === 'content' && <AdminContent content={content} editing={editing} setEditing={setEditing} onSave={saveContent} onDelete={removeContent} />}
      {active === 'media' && <AdminMedia media={media} mediaForm={mediaForm} setMediaForm={setMediaForm} onSave={saveMedia} onDelete={deleteMedia} />}
      {active === 'users' && <AdminUsers users={users} userForm={userForm} setUserForm={setUserForm} onSave={saveUser} onDelete={deleteUser} />}
      {active === 'settings' && <AdminSettings settings={settings} setSettings={setSettings} onSave={saveSettings} />}
    </section>
  </main>;
}

function AdminDashboard({ summary, inquiries, content, activity }) {
  const cards = [
    ['Total inquiries', summary?.inquiries?.total ?? 0, 'All contact form leads'],
    ['New leads', summary?.inquiries?.fresh ?? 0, 'Need review'],
    ['Content items', summary?.content?.total ?? 0, 'Pages and posts'],
    ['Published', summary?.content?.published ?? 0, 'Live content records'],
  ];
  return <div className="wp-screen">
    <div className="wp-card-grid">{cards.map(([label, value, help]) => <article className="wp-stat" key={label}><span>{label}</span><strong>{value}</strong><p>{help}</p></article>)}</div>
    <div className="wp-two-column">
      <section className="wp-panel"><h2>Recent Inquiries</h2>{inquiries.slice(0, 5).map((item) => <div className="wp-feed" key={item.id}><b>{item.name}</b><span>{item.email}</span><p>{item.message}</p></div>)}{!inquiries.length && <p className="wp-empty">No inquiries yet.</p>}</section>
      <section className="wp-panel"><h2>Latest Activity</h2>{activity.slice(0, 7).map((item, index) => <div className="wp-feed" key={`${item.type}-${item.title}-${index}`}><b>{item.title}</b><span>{item.type}</span><p>{item.detail}</p></div>)}{!activity.length && <p className="wp-empty">No admin activity yet.</p>}</section>
    </div>
  </div>;
}

function AdminInquiries({ inquiries, onSave, onDelete }) {
  return <div className="wp-panel"><div className="wp-panel-head"><h2>Contact Form Leads</h2><span>{inquiries.length} records</span></div><div className="wp-table-wrap"><table className="wp-table"><thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead><tbody>{inquiries.map((item) => <tr key={item.id}><td><b>{item.name}</b><small>{new Date(item.created_at).toLocaleDateString()}</small></td><td><a href={`mailto:${item.email}`}>{item.email}</a></td><td>{item.message}</td><td><select value={item.status} onChange={(event) => onSave(item, { status: event.target.value })}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="closed">Closed</option></select></td><td><input defaultValue={item.notes} onBlur={(event) => onSave(item, { notes: event.target.value })} placeholder="Internal note" /></td><td><button onClick={() => onDelete(item.id)}>Delete</button></td></tr>)}</tbody></table></div>{!inquiries.length && <p className="wp-empty">No inquiries found.</p>}</div>;
}

function AdminContent({ content, editing, setEditing, onSave, onDelete }) {
  return <div className="wp-content-layout">
    <section className="wp-panel"><div className="wp-panel-head"><h2>All Pages & Posts</h2><button onClick={() => setEditing(emptyContent)}>Add New</button></div>{content.map((item) => <button className={`wp-content-item ${editing.id === item.id ? 'active' : ''}`} key={item.id} onClick={() => setEditing(item)}><b>{item.title}</b><span>{item.type} / {item.status} / {item.slug}</span></button>)}{!content.length && <p className="wp-empty">No content yet.</p>}</section>
    <form className="wp-editor wp-panel" onSubmit={onSave}><div className="wp-panel-head"><h2>{editing.id ? 'Edit Content' : 'Add New Content'}</h2><div><button type="submit">Save</button>{editing.id && <button type="button" className="danger" onClick={() => onDelete(editing.id)}>Delete</button>}</div></div><div className="wp-form-grid"><label>Title<input value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} required /></label><label>Slug<input value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} placeholder="auto-from-title" /></label><label>Type<select value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value })}><option value="page">Page</option><option value="post">Post</option><option value="case-study">Case Study</option></select></label><label>Status<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="private">Private</option></select></label></div><label>Excerpt<textarea rows="3" value={editing.excerpt} onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })} /></label><label>Body<textarea rows="13" value={editing.body} onChange={(event) => setEditing({ ...editing, body: event.target.value })} placeholder="Write page or blog content here..." /></label></form>
  </div>;
}

function AdminMedia({ media, mediaForm, setMediaForm, onSave, onDelete }) {
  return <div className="wp-content-layout">
    <section className="wp-panel"><div className="wp-panel-head"><h2>Media Library</h2><button onClick={() => setMediaForm(emptyMedia)}>Add New</button></div><div className="wp-media-grid">{media.map((item) => <article key={item.id} onClick={() => setMediaForm(item)}><img src={item.url} alt={item.alt || item.title} /><b>{item.title}</b><span>{item.category}</span><input readOnly value={item.url} /></article>)}</div>{!media.length && <p className="wp-empty">No media records yet.</p>}</section>
    <form className="wp-panel wp-settings" onSubmit={onSave}><div className="wp-panel-head"><h2>{mediaForm.id ? 'Edit Media' : 'Add Media'}</h2><div><button type="submit">Save</button>{mediaForm.id && <button type="button" className="danger" onClick={() => onDelete(mediaForm.id)}>Delete</button>}</div></div><label>Title<input value={mediaForm.title} onChange={(event) => setMediaForm({ ...mediaForm, title: event.target.value })} required /></label><label>Image URL<input value={mediaForm.url} onChange={(event) => setMediaForm({ ...mediaForm, url: event.target.value })} placeholder="/assets/example.png" required /></label><label>Alt text<input value={mediaForm.alt || ''} onChange={(event) => setMediaForm({ ...mediaForm, alt: event.target.value })} /></label><label>Category<input value={mediaForm.category || 'Website'} onChange={(event) => setMediaForm({ ...mediaForm, category: event.target.value })} /></label></form>
  </div>;
}

function AdminUsers({ users, userForm, setUserForm, onSave, onDelete }) {
  return <div className="wp-content-layout">
    <section className="wp-panel"><div className="wp-panel-head"><h2>Users</h2><button onClick={() => setUserForm(emptyUser)}>Add User</button></div><table className="wp-table"><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td><b>{item.name}</b><small>{item.email}</small></td><td>{item.role}</td><td><span className="wp-badge">{item.status}</span></td><td><button onClick={() => setUserForm(item)}>Edit</button></td></tr>)}</tbody></table>{!users.length && <p className="wp-empty">No users found.</p>}</section>
    <form className="wp-panel wp-settings" onSubmit={onSave}><div className="wp-panel-head"><h2>{userForm.id ? 'Edit User' : 'Add User'}</h2><div><button type="submit">Save</button>{userForm.id && <button type="button" className="danger" onClick={() => onDelete(userForm.id)}>Delete</button>}</div></div><label>Name<input value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} required /></label><label>Email<input type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required /></label><label>Role<select value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}><option>Administrator</option><option>Editor</option><option>Marketing</option><option>Viewer</option></select></label><label>Status<select value={userForm.status} onChange={(event) => setUserForm({ ...userForm, status: event.target.value })}><option value="active">Active</option><option value="paused">Paused</option></select></label></form>
  </div>;
}

function AdminSettings({ settings, setSettings, onSave }) {
  return <form className="wp-panel wp-settings" onSubmit={onSave}><div className="wp-panel-head"><h2>General Settings</h2><button type="submit">Save Changes</button></div><label>Site title<input value={settings.siteTitle || ''} onChange={(event) => setSettings({ ...settings, siteTitle: event.target.value })} /></label><label>Tagline<input value={settings.tagline || ''} onChange={(event) => setSettings({ ...settings, tagline: event.target.value })} /></label><label>Admin email<input value={settings.adminEmail || ''} onChange={(event) => setSettings({ ...settings, adminEmail: event.target.value })} /></label><label>Business hours<input value={settings.businessHours || ''} onChange={(event) => setSettings({ ...settings, businessHours: event.target.value })} /></label></form>;
}

createRoot(document.getElementById('root')).render(<App />);
