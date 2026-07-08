import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Sun, Moon, Menu, X, ChevronDown, 
  Sparkles, Code, Smartphone, Cpu, 
  BarChart3, RefreshCw, Globe, Share2, 
  Video, ShieldAlert, Mail, ClipboardCheck 
} from 'lucide-react';

// Mega Menu Service list with corresponding icons
const servicesCategories = [
  { name: 'AI Solutions', path: '/services?cat=ai', desc: 'AI Chatbots, RAG, voice & calling agents', icon: Sparkles, color: 'text-cyan-400' },
  { name: 'Web Development', path: '/services?cat=web', desc: 'Modern landing pages, e-commerce & custom apps', icon: Code, color: 'text-indigo-400' },
  { name: 'Mobile App Dev', path: '/services?cat=mobile', desc: 'iOS, Android, React Native & Flutter apps', icon: Smartphone, color: 'text-purple-400' },
  { name: 'Custom Software', path: '/services?cat=software', desc: 'Enterprise ERP, CRM & tailored dashboard software', icon: Cpu, color: 'text-pink-400' },
  { name: 'CRM & Management', path: '/services?cat=crm', desc: 'Lead tracking, pipelines & sales flow dashboards', icon: BarChart3, color: 'text-emerald-400' },
  { name: 'Automation Services', path: '/services?cat=automation', desc: 'WhatsApp, Instagram & email funnel triggers', icon: RefreshCw, color: 'text-amber-400' },
  { name: 'Digital Marketing', path: '/services?cat=marketing', desc: 'SEO optimization, Google & Meta advertising campaigns', icon: Globe, color: 'text-rose-400' },
  { name: 'Social Media Handling', path: '/services?cat=smm', desc: 'Content calendar management & organic audience growth', icon: Share2, color: 'text-teal-400' },
  { name: 'Content Creation', path: '/services?cat=content', desc: 'Video reel editing, Motion graphics & copywriting', icon: Video, color: 'text-red-400' },
  { name: 'Branding & Design', path: '/services?cat=branding', desc: 'Visual logos, brand manuals & visual corporate identity', icon: ClipboardCheck, color: 'text-orange-400' },
  { name: 'Email & WhatsApp', path: '/services?cat=email', desc: 'Bulk newsletters, API broadcasts & campaigns', icon: Mail, color: 'text-sky-400' },
  { name: 'Business Registration', path: '/services?cat=registration', desc: 'MSME, Startup India, Private Ltd & LLP filings', icon: ShieldAlert, color: 'text-yellow-400' },
];

export default function Navbar() {
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change and close menu
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  }, [location.pathname, location.search]);

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  };

  const activeStyle = ({ isActive }) => 
    `text-sm font-semibold transition-colors duration-200 ${
      isActive 
        ? 'text-neon-cyan' 
        : 'text-zinc-300 hover:text-white light:text-zinc-600 light:hover:text-zinc-950'
    }`;

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-xl tracking-tighter">A</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white light:text-zinc-900">
                AMARIX <span className="text-neon-cyan font-normal text-lg">SOLUTION</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavLink to="/" className={activeStyle}>Home</NavLink>
            <NavLink to="/about" className={activeStyle}>About Us</NavLink>
            
            {/* Services Dropdown Trigger */}
            <div 
              className="relative group"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                  location.pathname.startsWith('/services') 
                    ? 'text-neon-cyan' 
                    : 'text-zinc-300 hover:text-white light:text-zinc-600 light:hover:text-zinc-950'
                }`}
              >
                Services <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Mega Menu */}
              {megaMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-[800px] mt-2 p-6 glass-panel rounded-2xl shadow-2xl animate-fade-in pointer-events-auto grid grid-cols-3 gap-4">
                  <div className="col-span-3 border-b border-zinc-800 light:border-zinc-200 pb-3 mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neon-cyan">Amarix Capabilities</span>
                    <Link to="/services" className="text-xs font-medium text-neon-purple hover:underline">Explore All Services &rarr;</Link>
                  </div>
                  {servicesCategories.map((cat, idx) => {
                    const IconComp = cat.icon;
                    return (
                      <Link 
                        key={idx} 
                        to={cat.path} 
                        className="flex gap-3 p-3 rounded-xl hover:bg-white/5 light:hover:bg-zinc-800/5 group/item transition-colors"
                      >
                        <div className={`p-2 rounded-lg bg-zinc-900/60 light:bg-zinc-200/50 ${cat.color} group-hover/item:scale-110 transition-transform`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100 light:text-zinc-800 group-hover/item:text-neon-cyan transition-colors">{cat.name}</h4>
                          <p className="text-xs text-zinc-400 light:text-zinc-500 line-clamp-1 mt-0.5">{cat.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <NavLink to="/portfolio" className={activeStyle}>Portfolio</NavLink>
            <NavLink to="/case-studies" className={activeStyle}>Case Studies</NavLink>
            <NavLink to="/industries" className={activeStyle}>Industries</NavLink>
            <NavLink to="/pricing" className={activeStyle}>Pricing</NavLink>
            <NavLink to="/blog" className={activeStyle}>Blog</NavLink>
            <NavLink to="/faq" className={activeStyle}>FAQ</NavLink>
            <NavLink to="/contact" className={activeStyle}>Contact</NavLink>
          </nav>

          {/* Toolbar CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-zinc-400 hover:text-white light:text-zinc-600 light:hover:text-zinc-900 hover:bg-white/10 light:hover:bg-zinc-800/10 transition-all active:scale-90"
              aria-label="Toggle light/dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* CTA */}
            <Link 
              to="/contact" 
              className="px-5 py-2.5 rounded-full text-sm font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan shadow-lg shadow-neon-cyan/15 hover:shadow-neon-purple/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              Free Consultation
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-400 light:text-zinc-600 hover:bg-white/10 light:hover:bg-zinc-800/10"
              aria-label="Toggle light/dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 light:text-zinc-600 hover:bg-white/10 light:hover:bg-zinc-800/10 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-zinc-800 light:border-zinc-200 py-4 px-6 animate-fade-in absolute w-full left-0 z-40 bg-zinc-950/95 light:bg-slate-50/95 shadow-xl">
          <div className="flex flex-col space-y-4">
            <NavLink to="/" className={activeStyle}>Home</NavLink>
            <NavLink to="/about" className={activeStyle}>About Us</NavLink>
            
            {/* Mobile Services Collapse */}
            <div className="border-b border-zinc-800 light:border-zinc-200 pb-2">
              <div className="font-semibold text-zinc-300 light:text-zinc-600 text-sm mb-2">Services Categories</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                <Link to="/services?cat=ai" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">AI Solutions</Link>
                <Link to="/services?cat=web" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">Web Dev</Link>
                <Link to="/services?cat=mobile" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">Mobile App Dev</Link>
                <Link to="/services?cat=software" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">Custom Software</Link>
                <Link to="/services?cat=crm" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">CRM & Management</Link>
                <Link to="/services?cat=automation" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">Automations</Link>
                <Link to="/services?cat=marketing" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">Marketing & SEO</Link>
                <Link to="/services?cat=smm" className="text-xs text-zinc-400 light:text-zinc-500 py-1 hover:text-neon-cyan">Social Media</Link>
                <Link to="/services" className="col-span-2 text-xs font-semibold text-neon-purple py-1 hover:underline">View All 12 Services &rarr;</Link>
              </div>
            </div>

            <NavLink to="/portfolio" className={activeStyle}>Portfolio</NavLink>
            <NavLink to="/case-studies" className={activeStyle}>Case Studies</NavLink>
            <NavLink to="/industries" className={activeStyle}>Industries</NavLink>
            <NavLink to="/pricing" className={activeStyle}>Pricing</NavLink>
            <NavLink to="/blog" className={activeStyle}>Blog</NavLink>
            <NavLink to="/faq" className={activeStyle}>FAQ</NavLink>
            <NavLink to="/contact" className={activeStyle}>Contact</NavLink>

            <Link 
              to="/contact" 
              className="w-full text-center px-4 py-3 rounded-xl text-zinc-950 font-bold bg-gradient-to-r from-neon-cyan to-neon-purple shadow-md block text-sm"
            >
              Free Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
