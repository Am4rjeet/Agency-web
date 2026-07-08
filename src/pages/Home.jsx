import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Code, Smartphone, Cpu, 
  BarChart3, RefreshCw, Star, CheckCircle, ChevronRight,
  Database, ShieldCheck, Zap, Globe, MessageSquare
} from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import AnimatedCounter from '../components/AnimatedCounter';

const techStack = [
  { name: 'React.js', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Firebase', category: 'Database' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'WordPress', category: 'CMS' },
  { name: 'Shopify', category: 'CMS' },
  { name: 'OpenAI', category: 'AI' },
  { name: 'LangChain', category: 'AI' },
  { name: 'Python', category: 'AI & Data' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'AWS', category: 'DevOps' },
  { name: 'Vercel', category: 'DevOps' },
  { name: 'Cloudflare', category: 'DevOps' }
];

const homeFAQs = [
  { q: "What does Amarix Solution specialize in?", a: "We specialize in combining advanced AI Solutions (like RAG chatbots and voice calling agents) with custom software development, custom high-performance web systems, and data-driven digital marketing to scale businesses aggressively." },
  { q: "How long does a standard web development project take?", a: "A standard corporate website takes about 3 to 5 weeks. Complex custom web applications, LMS, or e-commerce setups with deep AI integrations take 6 to 12 weeks including discovery, UI design, coding, testing, and deployment." },
  { q: "Can you integrate custom AI models into our existing software?", a: "Absolutely. We build customized OpenAI, Gemini, and Claude integrations that fit seamlessly into your existing CRM, database, or legacy administrative software using tools like LangChain." },
  { q: "What is your pricing model?", a: "We offer both custom project-based pricing and monthly agency retainer models depending on your goals. You can explore standard options on our Pricing page or request a customized proposal." }
];

export default function Home() {
  const [activeTechCat, setActiveTechCat] = useState('All');
  const [activeFAQ, setActiveFAQ] = useState(null);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Mobile', 'CMS', 'AI', 'DevOps'];
  const filteredTech = activeTechCat === 'All' 
    ? techStack 
    : techStack.filter(t => t.category.includes(activeTechCat) || t.category === activeTechCat);

  return (
    <div className="relative w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden border-b border-zinc-900 light:border-zinc-200">
        
        {/* Three.js interactive 3D background */}
        <ThreeBackground />
        
        {/* Neon Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full glow-blur" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full glow-blur" />
        
        {/* Background Grid */}
        <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 px-4">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 light:bg-zinc-800/5 border border-white/10 light:border-zinc-200/50 shadow-inner backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-300 light:text-zinc-600">
              Transforming Operations With AI & Growth Marketing
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight text-white light:text-zinc-900">
            Automate with <span className="text-gradient-purple-cyan font-extrabold">Artificial Intelligence</span>.<br />
            Scale with <span className="text-gradient-pink-orange font-extrabold">Modern Code</span>.
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-zinc-400 light:text-zinc-600 leading-relaxed font-sans font-light">
            Amarix Solution engineer solutions that scale. We deploy customized autonomous agents, custom enterprise software platforms, and high-performance digital marketing funnels.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan shadow-xl shadow-neon-cyan/20 hover:shadow-neon-purple/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              to="/portfolio" 
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white light:text-zinc-800 bg-white/5 light:bg-zinc-200/40 border border-white/10 light:border-zinc-300 hover:bg-white/10 light:hover:bg-zinc-200/80 backdrop-blur-md transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              View Our Portfolio
            </Link>
          </div>

          {/* Interactive Floating Micro Metrics */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { val: '250', suff: '+', label: 'Projects Completed' },
              { val: '98', suff: '%', label: 'Client Retention Rate' },
              { val: '60', suff: '+', label: 'AI Bots Integrated' },
              { val: '300', suff: '%', label: 'Average ROI Growth' }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl glass-panel text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-white light:text-zinc-900 flex items-center justify-center">
                  <AnimatedCounter value={stat.val} suffix={stat.suff} />
                </div>
                <div className="text-xs text-zinc-400 light:text-zinc-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. TRUSTED BY LOGO SLIDER */}
      <section className="py-12 bg-zinc-950/40 light:bg-slate-50/40 border-b border-zinc-900 light:border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500 light:text-zinc-400 font-bold mb-6">
            Trusted by innovators, fast-growing startups, and legacy enterprises globally
          </p>
          {/* Sliding Ticker */}
          <div className="overflow-hidden relative w-full flex items-center">
            <div className="flex w-[200%] space-x-12 animate-spin-slow" style={{ animation: 'spin-slow 40s linear infinite', animationName: 'none' }}>
              <div className="flex justify-around w-full shrink-0 items-center gap-8 text-zinc-400 light:text-zinc-500 text-lg font-bold tracking-widest">
                <span className="hover:text-neon-cyan transition-colors">MICROSOFT SPARK</span>
                <span className="hover:text-neon-cyan transition-colors">META INC.</span>
                <span className="hover:text-neon-cyan transition-colors">STRIPE CLOUD</span>
                <span className="hover:text-neon-cyan transition-colors">AIRBNB PARTNERS</span>
                <span className="hover:text-neon-cyan transition-colors">SHOPIFY PLUS</span>
                <span className="hover:text-neon-cyan transition-colors">DELL AI</span>
              </div>
              <div className="flex justify-around w-full shrink-0 items-center gap-8 text-zinc-400 light:text-zinc-500 text-lg font-bold tracking-widest">
                <span className="hover:text-neon-cyan transition-colors">MICROSOFT SPARK</span>
                <span className="hover:text-neon-cyan transition-colors">META INC.</span>
                <span className="hover:text-neon-cyan transition-colors">STRIPE CLOUD</span>
                <span className="hover:text-neon-cyan transition-colors">AIRBNB PARTNERS</span>
                <span className="hover:text-neon-cyan transition-colors">SHOPIFY PLUS</span>
                <span className="hover:text-neon-cyan transition-colors">DELL AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT AGENCY */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* About Image / 3D Composition Placeholder */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 to-neon-cyan/20 rounded-3xl blur-2xl group-hover:scale-105 transition-transform" />
            <div className="relative glass-panel p-8 rounded-3xl border border-zinc-800 light:border-zinc-200 overflow-hidden flex flex-col justify-center min-h-[400px]">
              {/* Abstract decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-neon-cyan/25 animate-pulse" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-neon-purple/20" />
              
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-neon-purple font-bold">Who We Are</h3>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white light:text-zinc-900 leading-tight">
                  We bridge the gap between AI automation & market presence.
                </h2>
                <p className="text-zinc-400 light:text-zinc-600 leading-relaxed font-light">
                  Amarix Solution was founded with a singular purpose: to empower businesses with the tools and strategies required to dominate the digital landscape.
                </p>
                <div className="space-y-3">
                  {[
                    "Custom LLMs & Neural Networks tailored to operations.",
                    "Fast, SEO-optimized, highly responsive web infrastructures.",
                    "Hyper-targeted ad setup and automated lead capturing.",
                  ].map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-300 light:text-zinc-700">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About Text & Content */}
          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest text-neon-cyan font-bold">Why Amarix Solution</h4>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white light:text-zinc-900 leading-tight">
              An ecosystem built for enterprise speed & startup scale.
            </h2>
            <p className="text-zinc-400 light:text-zinc-600 leading-relaxed">
              We aren't just developers, and we aren't just marketers. We are a specialized team of AI integration specialists, software engineers, and performance marketers.
            </p>
            <p className="text-zinc-400 light:text-zinc-600 leading-relaxed">
              Our unique approach combines customized machine learning architectures (chatbots, internal knowledge bases, voice calling bots) with stellar UI/UX and automation scripts to trim waste and maximize bottom-line profit.
            </p>
            
            <div className="pt-4">
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 text-sm font-bold text-neon-cyan hover:text-white transition-colors group"
              >
                Learn More About Our Team
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SERVICES OVERVIEW */}
      <section className="py-24 bg-zinc-950/30 light:bg-slate-50/30 border-t border-b border-zinc-900 light:border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-neon-cyan font-bold">What We Deliver</h4>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white light:text-zinc-900">
              End-to-End Agency Offerings
            </h2>
            <p className="text-zinc-400 light:text-zinc-600 leading-relaxed">
              Explore our core capabilities. We combine AI technology with design and marketing to build comprehensive, self-sustaining sales machines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'AI Solutions', desc: 'RAG Chatbots, automated AI caller systems, Claude/Gemini/OpenAI APIs, and cognitive internal knowledge bases.', icon: Sparkles, cat: 'ai' },
              { title: 'Web Development', desc: 'Futuristic React/Next.js corporate assets, Shopify e-commerce, complex corporate portals, and interactive websites.', icon: Code, cat: 'web' },
              { title: 'Mobile App Dev', desc: 'High-performance native iOS & Android development, cross-platform apps using Flutter & React Native.', icon: Smartphone, cat: 'mobile' },
              { title: 'Custom Software', desc: 'Sleek ERP platforms, customer CRM dashboards, sales billing systems, and interactive POS software.', icon: Cpu, cat: 'software' },
              { title: 'CRM & Integrations', desc: 'Active lead management, comprehensive sales pipeline dashboards, and automated multi-user setups.', icon: BarChart3, cat: 'crm' },
              { title: 'Automation Services', desc: 'WhatsApp & Instagram direct API automations, appointment setting workflows, and active sales funnels.', icon: RefreshCw, cat: 'automation' },
            ].map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <div 
                  key={idx} 
                  className="glow-card glass-panel p-8 rounded-3xl border border-zinc-800 light:border-zinc-200 space-y-4 hover:border-neon-cyan/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-neon-purple/10 light:bg-zinc-200/50 rounded-2xl w-fit">
                      <IconComp className="w-8 h-8 text-neon-cyan" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white light:text-zinc-800">{srv.title}</h3>
                    <p className="text-sm text-zinc-400 light:text-zinc-500 leading-relaxed">{srv.desc}</p>
                  </div>
                  <div className="pt-4">
                    <Link 
                      to={`/services?cat=${srv.cat}`} 
                      className="text-xs font-bold text-neon-cyan hover:underline flex items-center gap-1 group"
                    >
                      Explore Options
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white light:text-zinc-800 border border-zinc-800 light:border-zinc-300 hover:bg-white/5 light:hover:bg-zinc-200/50 transition-all"
            >
              View All 12 Capability Divisions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. FEATURED PROJECTS PREVIEW */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <h4 className="text-xs uppercase tracking-widest text-neon-purple font-bold">Case Previews</h4>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white light:text-zinc-900">
              Projects That Generated Real Value
            </h2>
          </div>
          <Link 
            to="/portfolio" 
            className="text-sm font-bold text-neon-cyan hover:underline flex items-center gap-1 shrink-0 group"
          >
            Browse Full Portfolio
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: "Cognitive AI Assistant & Calling Flow", 
              client: "HealthSync Clinics", 
              metric: "50% Call Center Costs Saved", 
              category: "AI Solutions",
              color: "from-cyan-500/10 to-blue-500/10",
              desc: "Built a custom HIPAA-compliant OpenAI agent integrated with Twilio calling and appointment scheduling systems."
            },
            { 
              title: "Next.js 14 Headless E-Commerce platform", 
              client: "VogueThreads Fashion", 
              metric: "+240% Conversion Rates", 
              category: "Web Development",
              color: "from-purple-500/10 to-pink-500/10",
              desc: "A custom Shopify headless storefront leveraging React/Next.js Server Components, structured with seamless page updates."
            }
          ].map((project, idx) => (
            <div 
              key={idx}
              className={`glow-card glass-panel rounded-3xl border border-zinc-800 light:border-zinc-200 overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-all`}
            >
              <div className={`p-8 bg-gradient-to-tr ${project.color} border-b border-zinc-900 light:border-zinc-200 min-h-[160px] flex flex-col justify-between`}>
                <span className="px-3 py-1 bg-zinc-900/80 light:bg-white/80 rounded-full text-xs font-semibold text-neon-cyan w-fit border border-white/5">
                  {project.category}
                </span>
                <div>
                  <h4 className="text-xs uppercase text-zinc-400 light:text-zinc-500 tracking-wider font-semibold">{project.client}</h4>
                  <h3 className="font-display font-extrabold text-2xl text-white light:text-zinc-800 mt-1 leading-tight">{project.title}</h3>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-sm text-zinc-400 light:text-zinc-500 leading-relaxed">{project.desc}</p>
                <div className="flex items-center justify-between border-t border-zinc-900 light:border-zinc-200 pt-4">
                  <span className="text-sm font-bold text-neon-emerald">{project.metric}</span>
                  <Link to="/case-studies" className="text-xs font-semibold text-zinc-300 hover:text-white light:text-zinc-600 light:hover:text-zinc-900 flex items-center gap-1">
                    Read Case Study <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-24 bg-zinc-950/20 light:bg-slate-50/20 border-t border-zinc-900 light:border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-neon-cyan font-bold">Why Choose Us</h4>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white light:text-zinc-900">
              Engineered for Enterprise Impact
            </h2>
            <p className="text-zinc-400 light:text-zinc-600">
              We stand apart by linking development with data-driven marketing campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Full-Stack AI Implementation', desc: 'We do not just wrap OpenAI APIs. We write custom vector stores, fine-tune models, and configure complex RAG networks.', icon: Database },
              { title: 'High-Converting UI Speeds', desc: 'Utilizing Next.js SSR, Tailwind v4, and clean assets, we compile sites with perfect Lighthouse speeds and mobile compliance.', icon: Zap },
              { title: 'Total Revenue Attribution', desc: 'Every campaign and software build is integrated with active GA4/CRM dashboards to track direct customer signups and CPA.', icon: BarChart3 }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="glass-panel p-8 rounded-3xl border border-zinc-800 light:border-zinc-200 space-y-4">
                  <div className="p-3 bg-neon-purple/10 light:bg-zinc-200/50 rounded-2xl w-fit">
                    <IconComp className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white light:text-zinc-800">{item.title}</h3>
                  <p className="text-sm text-zinc-400 light:text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. TECHNOLOGIES SECTION */}
      <section className="py-24 px-4 max-w-7xl mx-auto border-t border-zinc-900 light:border-zinc-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-neon-purple font-bold">Tools of Dominance</h4>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white light:text-zinc-900">
            Our Technology Stack
          </h2>
          <p className="text-zinc-400 light:text-zinc-600">
            We use stable, high-performance platforms to power our client systems.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTechCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTechCat === cat 
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-zinc-950 shadow-md' 
                  : 'bg-zinc-900/60 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-300 text-zinc-400 light:text-zinc-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTech.map((tech, idx) => (
            <div 
              key={idx}
              className="p-4 bg-zinc-900/40 light:bg-zinc-200/30 border border-zinc-800/80 light:border-zinc-200 rounded-2xl flex items-center justify-center flex-col text-center hover:border-neon-cyan/40 hover:-translate-y-1 transition-all"
            >
              <span className="font-semibold text-sm text-zinc-200 light:text-zinc-800">{tech.name}</span>
              <span className="text-[10px] text-zinc-500 light:text-zinc-400 uppercase tracking-widest mt-1">{tech.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. DEVELOPMENT PROCESS */}
      <section className="py-24 bg-zinc-950/30 light:bg-slate-50/30 border-t border-b border-zinc-900 light:border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-neon-cyan font-bold">How We Scale</h4>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white light:text-zinc-900">
              The Development Roadmap
            </h2>
            <p className="text-zinc-400 light:text-zinc-600">
              A structured roadmap ensuring absolute quality, security compliance, and conversion efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[50px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple z-0 opacity-20" />

            {[
              { step: '01', title: 'Consultation', desc: 'Understand KPIs, business logic gaps, and outline budget requirements.' },
              { step: '02', title: 'Roadmap & UI', desc: 'Wireframe designs and document architecture details.' },
              { step: '03', title: 'AI & Development', desc: 'Write clean code, train RAG systems, and configure cloud servers.' },
              { step: '04', title: 'Auditing & QA', desc: 'Lighthouse audits, code review, and functional mock testing.' },
              { step: '05', title: 'Launch & Scale', desc: 'Deploy codebase and run performance search & ads campaigns.' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 light:bg-white border border-zinc-800 light:border-zinc-200 flex items-center justify-center mx-auto text-lg font-black text-neon-cyan shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-lg text-white light:text-zinc-800">{item.title}</h3>
                <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed px-2">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-neon-purple font-bold">Client Success</h4>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white light:text-zinc-900">
            What Our Partners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "Amarix Solution automated our client booking using AI voice calling bots. Our administrative overhead dropped by 40% in just two months.",
              author: "Sophia Alvarez",
              role: "COO, MedStar Wellness",
              stars: 5
            },
            {
              quote: "The Next.js storefront they custom engineered performs flawlessly. Our page load speed dropped under 1s, and conversion immediately increased by 2.4x.",
              author: "Marcus Vance",
              role: "Founder, PeakGear Apparel",
              stars: 5
            },
            {
              quote: "Their performance Meta & Google campaign setups completely turned our SaaS around. The cost-per-acquisition dropped by 35% with total pipeline clarity.",
              author: "Dr. Ryan Kovic",
              role: "Marketing VP, EduQuest Systems",
              stars: 5
            }
          ].map((test, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-zinc-800 light:border-zinc-200 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(test.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-zinc-300 light:text-zinc-600 leading-relaxed italic">"{test.quote}"</p>
              </div>
              <div className="border-t border-zinc-900 light:border-zinc-200 pt-4">
                <h4 className="font-bold text-sm text-white light:text-zinc-900">{test.author}</h4>
                <p className="text-xs text-zinc-500 light:text-zinc-400">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQs PREVIEW */}
      <section className="py-24 bg-zinc-950/20 light:bg-slate-50/20 border-t border-b border-zinc-900 light:border-zinc-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-neon-cyan font-bold">Frequently Asked</h4>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white light:text-zinc-900">
              General Queries
            </h2>
          </div>

          <div className="space-y-4">
            {homeFAQs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-panel border border-zinc-800 light:border-zinc-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-white light:text-zinc-800">{faq.q}</span>
                  <span className={`text-neon-cyan font-extrabold transform transition-transform ${activeFAQ === idx ? 'rotate-90' : ''}`}>
                    &rarr;
                  </span>
                </button>
                {activeFAQ === idx && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-zinc-400 light:text-zinc-500 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/faq" className="text-sm font-bold text-neon-cyan hover:underline">
              View FAQ Portal &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 11. CONTACT CTA */}
      <section className="py-24 px-4 max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 via-neon-cyan/20 to-transparent rounded-3xl blur-xl" />
        
        <div className="relative glass-panel rounded-3xl border border-zinc-800 light:border-zinc-200 p-8 sm:p-16 text-center space-y-6">
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white light:text-zinc-900 leading-tight">
            Ready to integrate custom AI agents or<br />launch your marketing campaigns?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 light:text-zinc-600 leading-relaxed font-light">
            We will conduct a detailed digital audit on your website, search ranking, and workflow bottlenecks. Schedule your audit call today.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan shadow-lg transition-all"
            >
              Book Free Strategy Session
            </Link>
            <a 
              href="mailto:hello@amarixsolution.com" 
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-white light:text-zinc-800 border border-zinc-800 light:border-zinc-300 hover:bg-white/5 light:hover:bg-zinc-200/50 transition-all"
            >
              Email Our Executives
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
