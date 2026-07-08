import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Send, 
  Linkedin, Twitter, Instagram, Youtube, Sparkles
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative z-10 border-t border-zinc-900 light:border-zinc-200 bg-zinc-950/80 light:bg-slate-50/90 pt-16 pb-8 overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-neon-purple/5 rounded-full glow-blur" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-neon-cyan/5 rounded-full glow-blur" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: Logo, Newsletters, Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: About Amarix */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center overflow-hidden shadow-lg">
                <span className="text-white font-extrabold text-lg">A</span>
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-white light:text-zinc-900">
                AMARIX <span className="text-neon-cyan font-normal text-base">SOLUTION</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 light:text-zinc-500 leading-relaxed">
              Accelerating enterprise scaling and automating workflows by bridging bleeding-edge AI models, custom high-performance web systems, and high-ROI performance marketing.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 light:bg-zinc-200/50 hover:bg-neon-cyan hover:text-zinc-950 rounded-lg text-zinc-400 light:text-zinc-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 light:bg-zinc-200/50 hover:bg-neon-cyan hover:text-zinc-950 rounded-lg text-zinc-400 light:text-zinc-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 light:bg-zinc-200/50 hover:bg-neon-cyan hover:text-zinc-950 rounded-lg text-zinc-400 light:text-zinc-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 light:bg-zinc-200/50 hover:bg-neon-cyan hover:text-zinc-950 rounded-lg text-zinc-400 light:text-zinc-600 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Services Index Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-cyan mb-4">Focus Services</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services?cat=ai" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors flex items-center gap-1.5 group">
                  <Sparkles className="w-3.5 h-3.5 text-neon-cyan opacity-50 group-hover:opacity-100" />
                  AI Agent Development
                </Link>
              </li>
              <li>
                <Link to="/services?cat=web" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Custom Web Platforms</Link>
              </li>
              <li>
                <Link to="/services?cat=automation" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Business Automations</Link>
              </li>
              <li>
                <Link to="/services?cat=marketing" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Search & Ads Marketing</Link>
              </li>
              <li>
                <Link to="/services?cat=software" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">ERP & CRM Architectures</Link>
              </li>
              <li>
                <Link to="/services?cat=branding" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Identity & Design Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-cyan mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              <Link to="/about" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">About Us</Link>
              <Link to="/portfolio" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Portfolio</Link>
              <Link to="/case-studies" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Case Studies</Link>
              <Link to="/industries" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Industries</Link>
              <Link to="/pricing" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Pricing</Link>
              <Link to="/blog" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Blog</Link>
              <Link to="/faq" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">FAQ</Link>
              <Link to="/contact" className="text-sm text-zinc-400 light:text-zinc-500 hover:text-white light:hover:text-zinc-900 transition-colors">Contact Form</Link>
            </div>
          </div>

          {/* Col 4: Newsletter & Direct Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neon-cyan mb-2">Subscribe</h3>
            <p className="text-xs text-zinc-400 light:text-zinc-500">Get monthly agency case reports, software automation tips, and marketing audits directly to your inbox.</p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-zinc-900/60 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-800 placeholder-zinc-500 focus:outline-none focus:border-neon-cyan transition-colors"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-zinc-950 p-2.5 rounded-xl transition-all"
                aria-label="Subscribe to newsletter"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-neon-emerald font-semibold animate-pulse">
                ✓ Thank you for subscribing! Keep an eye on your inbox.
              </p>
            )}

            <div className="pt-2 space-y-2 border-t border-zinc-900 light:border-zinc-200">
              <a href="mailto:hello@amarixsolution.com" className="text-xs text-zinc-400 light:text-zinc-500 hover:text-neon-cyan flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neon-cyan" />
                hello@amarixsolution.com
              </a>
              <a href="tel:+15552627490" className="text-xs text-zinc-400 light:text-zinc-500 hover:text-neon-cyan flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neon-cyan" />
                +1 (555) AMARIX-S
              </a>
            </div>
          </div>

        </div>

        {/* Middle row: Address Info */}
        <div className="border-t border-zinc-900 light:border-zinc-200 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left text-xs text-zinc-500 light:text-zinc-400">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <MapPin className="w-4 h-4 text-neon-purple" />
            <span>HQ: 100 Tech Venture Way, Suite 400, Silicon Valley, CA 94025</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2 md:col-span-2 md:pl-4">
            <MapPin className="w-4 h-4 text-neon-purple" />
            <span>Asia Hub: 504 Cyber Plaza, Sector-62, Noida, UP, India 201301</span>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-zinc-900 light:border-zinc-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 light:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} Amarix Solution. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:underline hover:text-zinc-300 light:hover:text-zinc-800">Privacy Policy</a>
            <a href="#terms" className="hover:underline hover:text-zinc-300 light:hover:text-zinc-800">Terms of Service</a>
            <a href="#sitemap" className="hover:underline hover:text-zinc-300 light:hover:text-zinc-800">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
