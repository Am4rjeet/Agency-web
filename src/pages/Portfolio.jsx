import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, ExternalLink, X, Tag } from 'lucide-react';

const portfolioItems = [
  {
    id: 1,
    title: "AI Patient Calling & Intake System",
    client: "HealthSync Clinics",
    category: "AI Solutions",
    metric: "-50% Call Center Overhead",
    tech: ["OpenAI API", "Twilio Voice", "Vector Database", "Next.js"],
    desc: "A custom, HIPAA-compliant automated calling solution integrated directly with healthcare clinics to parse schedules, check insurances, and answer patient queries using conversational AI models.",
    challenge: "HealthSync experienced a huge backlog in medical reception bookings, leading to lost customer follow-ups and high clerical overhead.",
    solution: "We engineered a Node.js webhook orchestrator connecting Twilio voice streams to OpenAI GPT-4o, backed by a vectorized clinic information database. This allowed the bot to answer complex clinic operations questions and set appointments directly inside their booking platform."
  },
  {
    id: 2,
    title: "VogueThreads Headless Storefront",
    client: "VogueThreads Corp",
    category: "Web Development",
    metric: "+240% Conversion Rates",
    tech: ["Next.js", "Shopify GraphQL API", "Tailwind CSS", "Vercel"],
    desc: "A custom headless commerce storefront utilizing Next.js Server Components and edge caching to load instantly, optimizing mobile user flows and purchasing pipelines.",
    challenge: "Legacy monolithic WooCommerce setup suffered from slow load times (4.8s average), resulting in a high shopping cart abandonment rate.",
    solution: "Overhauled the architecture to a headless React configuration. By serving static pages from edge networks and fetching dynamic inventory via Shopify API, page load times dropped to 0.7s, leading to immediate transaction growth."
  },
  {
    id: 3,
    title: "OmniChannel Delivery Application",
    client: "QuickBites Logistics",
    category: "Mobile Apps",
    metric: "120K Monthly Active Users",
    tech: ["Flutter", "Dart", "Node.js", "Google Maps API", "Socket.io"],
    desc: "High-performance native mobile apps targeting iOS and Android devices, complete with real-time driver tracking, automated billing, and localized push notifications.",
    challenge: "The client needed a cost-efficient cross-platform codebase that maintained butter-smooth animations and low-latency driver GPS tracking.",
    solution: "Built a reactive Flutter application combined with a Socket.io backend to coordinate active location telemetry. Compiled optimized native binaries that successfully passed Apple and Google security audits."
  },
  {
    id: 4,
    title: "LeadVenture CRM & Allocation Suite",
    client: "LeadVenture Real Estate",
    category: "Custom Software",
    metric: "15,000+ Auto-Routed Leads",
    tech: ["React.js", "Express.js", "PostgreSQL", "Tailwind CSS", "Docker"],
    desc: "A secure, enterprise-level CRM dashboard logging thousands of customer accounts and automating routing policies to regional sales offices.",
    challenge: "Manual lead sorting via spreadsheets led to slow response times, with leads taking over 24 hours to reach agents.",
    solution: "Developed a custom web platform that parses incoming web forms, uses geographic and load-balancing algorithms, and routes leads to agents in under 10 seconds, backed by Slack alert triggers."
  },
  {
    id: 5,
    title: "Claude-Powered Internal Knowledge Base",
    client: "CloudDesk SaaS",
    category: "AI Solutions",
    metric: "92% Auto-Resolved Queries",
    tech: ["Claude API", "LlamaIndex", "Pinecone", "Express.js"],
    desc: "An internal vector-search repository scanning millions of company pages to auto-resolve employee onboarding and customer inquiries instantly.",
    challenge: "Customer support staff spent significant time looking for complex technical articles across disparate PDFs and folders.",
    solution: "Structured a custom knowledge ingestion script indexing company documents into Pinecone vector storage. An internal chat portal answers employee questions with source annotations in seconds."
  },
  {
    id: 6,
    title: "WhatsApp API Booking Funnel",
    client: "Zenith Care & Spa",
    category: "Automation",
    metric: "40% Appointment Booking Boost",
    tech: ["WhatsApp Business API", "Node.js", "Google Calendar API", "Make"],
    desc: "Automatic conversational chatbot mapping calendar reservations and triggering visual service catalogs directly inside WhatsApp messages.",
    challenge: "Customers dropped off during traditional web-form bookings. The client needed a direct conversational sales method.",
    solution: "Registered custom WhatsApp API templates, creating automated node-flows prompting customers to select treatments, dates, and therapists with real-time calendar syncing."
  },
  {
    id: 7,
    title: "Corporate Visual Rebrand Portfolio",
    client: "Zenith Dynamics",
    category: "Branding",
    metric: "Premium Brand Standard",
    tech: ["Figma", "Adobe Illustrator", "Brand Positioning Plan"],
    desc: "A complete overhaul of corporate identity, compiling vector logo assets, corporate guidelines manuals, and custom corporate profiles.",
    challenge: "The client looked dated compared to modern tech competitors, hindering enterprise sales conversations.",
    solution: "Created a futuristic logo symbol representing data streams, structured custom color rules, choseOutfit as primary typeface, and created premium layouts for all business documents."
  }
];

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('API response error');
        return res.json();
      })
      .then(data => {
        setItems(data.length > 0 ? data : portfolioItems);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching portfolio database logs, falling back to static lists:', err);
        setItems(portfolioItems);
        setLoading(false);
      });
  }, []);

  const filters = ["All", "AI Solutions", "Web Development", "Mobile Apps", "Custom Software", "Automation", "Branding"];

  const filteredItems = activeFilter === "All"
    ? items
    : items.filter(item => item.category === activeFilter);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-purple/10 rounded-full border border-neon-purple/20">
          <Folder className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan font-display">Client Portfolio</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          Projects We Are Proud Of
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          We focus on measurable value. Browse our case history demonstrating operational efficiency improvements and customer acquisition gains.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === f 
                ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-zinc-950 shadow-md" 
                : "bg-zinc-900/60 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-300 text-zinc-400 light:text-zinc-600 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="glow-card glass-panel rounded-3xl border border-zinc-800 light:border-zinc-200 overflow-hidden flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform"
          >
            {/* Visual Box */}
            <div className="p-8 h-48 bg-gradient-to-br from-zinc-900 to-zinc-950 light:from-zinc-100 light:to-zinc-200 border-b border-zinc-900 light:border-zinc-200 flex flex-col justify-between relative group/visual">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neon-cyan bg-zinc-900/80 light:bg-white/80 border border-white/5 px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-neon-emerald">{item.metric}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 light:text-zinc-400 font-bold uppercase tracking-wider">{item.client}</span>
                <h3 className="font-display font-extrabold text-lg text-white light:text-zinc-800 leading-tight">{item.title}</h3>
              </div>
              
              {/* Hover indicator overlay */}
              <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover/visual:opacity-100 flex items-center justify-center transition-opacity">
                <span className="flex items-center gap-1.5 text-xs font-bold text-neon-cyan border border-neon-cyan/40 px-4 py-2 rounded-full bg-zinc-900/80">
                  <ExternalLink className="w-3.5 h-3.5" /> View Case Details
                </span>
              </div>
            </div>

            {/* Description Box */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed line-clamp-3 font-light">{item.desc}</p>
              
              <div className="flex flex-wrap gap-1.5">
                {item.tech.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[10px] text-zinc-300 light:text-zinc-700 bg-zinc-900/60 light:bg-zinc-200 px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
                {item.tech.length > 3 && <span className="text-[10px] text-zinc-500 font-bold">+{item.tech.length - 3} more</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-zinc-800 light:border-zinc-200 overflow-hidden bg-zinc-950 light:bg-slate-50 shadow-2xl p-6 sm:p-8 animate-scale-up pointer-events-auto max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 light:bg-zinc-200 hover:text-white light:hover:text-zinc-950 transition-colors focus:outline-none"
              aria-label="Close details modal"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            {/* Header info */}
            <div className="space-y-4 pt-4 border-b border-zinc-900 light:border-zinc-200 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan bg-zinc-900/60 light:bg-zinc-200 px-3 py-1 rounded-full border border-white/5">
                  {selectedItem.category}
                </span>
                <span className="text-xs font-bold text-neon-emerald">{selectedItem.metric}</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white light:text-zinc-900 leading-tight">
                {selectedItem.title}
              </h2>
              <p className="text-xs text-zinc-400 light:text-zinc-500 uppercase tracking-widest font-bold">Client: {selectedItem.client}</p>
            </div>

            {/* Body contents */}
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white light:text-zinc-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-neon-purple" />
                  Project Overview
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 light:text-zinc-600 leading-relaxed font-light">{selectedItem.desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-neon-cyan tracking-wider">The Challenge</h4>
                  <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed font-light">{selectedItem.challenge}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-neon-purple tracking-wider">Our Solution</h4>
                  <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed font-light">{selectedItem.solution}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900 light:border-zinc-200">
                <span className="text-xs text-zinc-500 font-bold block mb-2 uppercase">Tech Stack Deployed:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tech.map((t, idx) => (
                    <span key={idx} className="text-xs font-semibold text-zinc-300 light:text-zinc-700 bg-zinc-900 light:bg-zinc-200 border border-zinc-800 light:border-zinc-200 px-3 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-4 pt-4 border-t border-zinc-900 light:border-zinc-200">
              <Link 
                to="/case-studies"
                className="flex-1 text-center py-3 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-zinc-950 text-xs font-bold rounded-xl transition-all"
              >
                Read Full Case Study
              </Link>
              <button 
                onClick={() => setSelectedItem(null)}
                className="flex-1 text-center py-3 border border-zinc-800 light:border-zinc-300 hover:bg-white/5 text-zinc-300 light:text-zinc-700 hover:text-white text-xs font-bold rounded-xl transition-all"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
