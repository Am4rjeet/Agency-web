import React, { useState } from 'react';
import { HelpCircle, Search, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqCatalog = [
  {
    category: "General",
    q: "How does Amarix Solution handle project discovery?",
    a: "We begin with a detailed audit of your business logs, CRM pipeline data, and current website speeds. From there, we coordinate a strategic document outlining timelines, architecture choices, API lists, and exact project fees."
  },
  {
    category: "General",
    q: "What is your typical turnaround time?",
    a: "Corporate websites and landing pages average 3 to 5 weeks. More complex dashboard systems, ERP platforms, or deep LLM calling integrations average 6 to 12 weeks from visual approval to deployment."
  },
  {
    category: "AI Solutions",
    q: "What is a RAG chatbot and how does it differ from a standard bot?",
    a: "Retrieval-Augmented Generation (RAG) connects an LLM to your internal files in real-time. Standard chatbots only recall static text. RAG queries vectorized document stores to output answers based on your internal guidelines with source citations."
  },
  {
    category: "AI Solutions",
    q: "Are the AI voice calling bots HIPAA compliant?",
    a: "Yes. For our medical partners, we host vector models on secure dedicated virtual servers, use encrypted data storage, and configure secure API protocols that do not log patient metadata."
  },
  {
    category: "Web & Mobile",
    q: "Why do you recommend headless Next.js layouts?",
    a: "Monolithic templates query databases for every visitor, causing delay. Headless Next.js hosts pages statically on globally distributed CDN edges. Page loading drops under 1 second, raising transaction conversion by up to 2.4x."
  },
  {
    category: "Web & Mobile",
    q: "Will we own the source code after development?",
    a: "Absolutely. Once the project completes and final retainers resolve, we transfer full repository permissions, Cloudflare domain control, and developer credentials directly to your staff."
  },
  {
    category: "Marketing",
    q: "How do you coordinate Meta and Google PPC campaigns?",
    a: "We build multi-stage paid media campaigns. Rather than targeting generic keywords, we set up conversion trackers logging actual customer signups, using direct Instagram/WhatsApp pipelines to lower acquisition cost."
  },
  {
    category: "Registrations",
    q: "Can you help our corporate startup register for tax exemptions?",
    a: "Yes. Through our Business Registration division, we file Startup India profiles, LLP agreements, trademark requests, and local MSME profiles to ensure you qualify for taxation exemptions and government benefits."
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = ["All", "General", "AI Solutions", "Web & Mobile", "Marketing", "Registrations"];

  const filteredFAQs = faqCatalog.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
          <HelpCircle className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan font-display">FAQ Portal</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          FAQ & Knowledge Base
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-555 leading-relaxed font-light">
          Search our catalog for common technical queries regarding AI integrations, custom headless configurations, and digital campaigns.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <input 
          type="text" 
          placeholder="Search questions or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900/60 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-300 rounded-2xl pl-12 pr-6 py-4 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 placeholder-zinc-500 focus:outline-none focus:border-neon-cyan transition-colors shadow-inner"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedCategory(c); setOpenFAQ(null); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === c 
                ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-zinc-950 shadow-md" 
                : "bg-zinc-900/60 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-300 text-zinc-400 light:text-zinc-650 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-panel border border-zinc-800 light:border-zinc-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-bold text-sm sm:text-base text-white light:text-zinc-800 flex items-start gap-3">
                  <span className="text-[10px] uppercase font-bold text-neon-purple mt-1 shrink-0 bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-200 px-2.5 py-0.5 rounded-md">
                    {faq.category}
                  </span>
                  {faq.q}
                </span>
                <span className={`text-neon-cyan font-extrabold transform transition-transform ${openFAQ === idx ? 'rotate-90' : ''}`}>
                  &rarr;
                </span>
              </button>
              {openFAQ === idx && (
                <div className="px-6 pb-6 pl-[86px] text-xs sm:text-sm text-zinc-400 light:text-zinc-550 leading-relaxed animate-fade-in font-light">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-zinc-900/20 light:bg-zinc-100 rounded-2xl text-zinc-500 border border-dashed border-zinc-800 light:border-zinc-300">
            No matching questions found in this category.
          </div>
        )}
      </div>

      {/* CTA Footer help block */}
      <div className="p-8 bg-zinc-900/40 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-200 rounded-3xl text-center space-y-4">
        <h3 className="font-display font-bold text-lg text-white light:text-zinc-950">Still Have Questions?</h3>
        <p className="text-xs text-zinc-400 light:text-zinc-555 max-w-md mx-auto leading-relaxed font-light">
          Can't find the answers regarding custom system API deployments or pricing tags? Connect with our support desk.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link 
            to="/contact" 
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all"
          >
            Direct Consulting Inquiry
          </Link>
          <a 
            href="mailto:hello@amarixsolution.com" 
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white light:text-zinc-700 border border-zinc-800 light:border-zinc-300 hover:bg-white/5 light:hover:bg-zinc-250 transition-all"
          >
            Email Support Desk
          </a>
        </div>
      </div>

    </div>
  );
}
