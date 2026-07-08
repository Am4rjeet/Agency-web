import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, X, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "How Headless Next.js Elevates Storefront Conversion Rates",
    category: "E-Commerce",
    date: "July 2, 2026",
    readTime: "5 min read",
    author: "Rohan Verma",
    desc: "Slow websites kill sales. Learn how rendering products from edge CDNs and separating UI layers from Shopify databases drives lightning-fast speeds.",
    content: `
      <h2>The Core Speed Bottleneck</h2>
      <p>Traditional monolithic e-commerce platforms struggle with load times on dynamic page hits. When a user clicks a product listing, the server initiates complex query operations on inventory databases, builds the HTML, and responds. Under high traffic, page loads delay beyond the critical 3-second threshold, spiking bounce rates.</p>
      
      <h2>Ditching Monoliths for Headless Architectures</h2>
      <p>By splitting the frontend visual layers (compiled using Next.js Server Components) from the database systems (Shopify or custom SQL), we cache static page frameworks globally on Vercel or Cloudflare CDN edges. Dynamic resources (like pricing or inventory counts) are fetched client-side via GraphQL queries.</p>
      
      <h2>Quantified Case Study Impact</h2>
      <p>When we shifted our client VogueThreads to a headless Vite/Next.js store, their average page rendering dropped from 4.8 seconds to 0.7 seconds. Transactions immediately grew, causing an attributed conversion increase of +240% in just two months.</p>
    `
  },
  {
    id: 2,
    title: "Deploying Secure RAG Chatbots in Healthcare Systems",
    category: "AI Solutions",
    date: "June 25, 2026",
    readTime: "8 min read",
    author: "Sarah Jenkins, Ph.D.",
    desc: "A technical walkthrough of vector embeddings, document indexing, and configuring secure LangChain parameters to avoid data leakage.",
    content: `
      <h2>Why Retrieval-Augmented Generation (RAG) Matters</h2>
      <p>Fine-tuning LLMs is expensive and snapshots static data. RAG allows standard AI models to query external databases in real-time. This is essential for organizations like medical clinics where policies change, and data must remain confidential.</p>
      
      <h2>Step 1: Document Chunking and Embeddings</h2>
      <p>First, we parse PDF wikis and clinic directories. The files are divided into overlapping text segments (chunks) to preserve context. Each segment is converted into vector representations using OpenAI embeddings models and stored in Pinecone database indexes.</p>
      
      <h2>Step 2: Vector Searches & Context Ingestion</h2>
      <p>When a user inputs a query (e.g. "What is the copay for wellness visits?"), the orchestrator searches Pinecone for the top matching vectors. These relevant text segments are injected as system prompts to Claude or GPT models, which output the exact answer with source citations.</p>
    `
  },
  {
    id: 3,
    title: "Optimizing Meta Ad ROI with Automated WhatsApp Conversions",
    category: "Digital Marketing",
    date: "June 18, 2026",
    readTime: "6 min read",
    author: "Devon Carter",
    desc: "Why traditional email signups are dying, and how linking Instagram comment auto-responses with WhatsApp Business APIs cuts CPA.",
    content: `
      <h2>The Lead Capture Dropoff</h2>
      <p>Directing cold traffic from Facebook or Instagram to a static lead capture form is becoming inefficient. On average, only 3% to 5% of web visitors complete these forms, leaving significant advertising budget wasted on bounces.</p>
      
      <h2>Conversational Ad Funnels</h2>
      <p>By configuring Meta click-to-chat ads, users start conversations directly in Instagram DM or WhatsApp. Automated API scripts immediately deliver digital download links or coupon codes in a personal message format, recording phone contacts.</p>
      
      <h2>Results from the Field</h2>
      <p>Our cosmetics brand partner GlowCosmetics shifted to comment-to-DM triggers. They registered over 40,000 automated VIP contacts in 30 days, seeing a 35% drop in customer acquisition costs and attributing $150,000 in immediate sales.</p>
    `
  }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);

  const categories = ["All", "AI Solutions", "E-Commerce", "Digital Marketing"];

  const filteredPosts = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
          <BookOpen className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan font-display">Agency Blog</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          Knowledge Center & CMS Insights
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          Stay informed on custom web designs, machine learning workflows, and search ranking strategies written by our team leads.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(c)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === c 
                ? "bg-gradient-to-r from-neon-purple to-neon-cyan text-zinc-950 shadow-md" 
                : "bg-zinc-900/60 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-300 text-zinc-400 light:text-zinc-600 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div 
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="glow-card glass-panel rounded-3xl border border-zinc-800 light:border-zinc-200 overflow-hidden flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-all"
          >
            <div className="p-6 space-y-4">
              
              {/* Category & Date Row */}
              <div className="flex items-center justify-between text-xs text-zinc-500 light:text-zinc-400">
                <span className="px-2.5 py-1 bg-zinc-900 light:bg-zinc-200 rounded-full text-[10px] font-bold text-neon-cyan">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-lg text-white light:text-zinc-900 leading-snug group-hover:text-neon-cyan transition-colors">
                {post.title}
              </h3>
              
              {/* Abstract */}
              <p className="text-xs text-zinc-400 light:text-zinc-650 leading-relaxed font-light line-clamp-3">
                {post.desc}
              </p>

            </div>

            {/* Bottom details */}
            <div className="p-6 border-t border-zinc-900 light:border-zinc-200 flex items-center justify-between text-xs text-zinc-500 light:text-zinc-400">
              <span className="font-semibold">By {post.author}</span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neon-purple">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Blog Post Modal Overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-zinc-800 light:border-zinc-200 overflow-hidden bg-zinc-950 light:bg-slate-50 shadow-2xl p-6 sm:p-8 animate-scale-up pointer-events-auto max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 light:bg-zinc-200 hover:text-white light:hover:text-zinc-950 transition-colors focus:outline-none"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            {/* Header info */}
            <div className="space-y-4 pt-4 border-b border-zinc-900 light:border-zinc-200 pb-6">
              <div className="flex items-center justify-between text-xs text-zinc-500 light:text-zinc-400">
                <span className="px-3 py-1 bg-zinc-900 light:bg-zinc-200 rounded-full font-bold text-neon-cyan">
                  {selectedPost.category}
                </span>
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}
                  </span>
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white light:text-zinc-900 leading-tight">
                {selectedPost.title}
              </h2>
              <p className="text-xs text-zinc-400 light:text-zinc-500 uppercase tracking-widest font-bold">Author: {selectedPost.author}</p>
            </div>

            {/* Article Content Body (HTML parsed) */}
            <div 
              className="py-6 text-zinc-300 light:text-zinc-700 text-xs sm:text-sm leading-relaxed space-y-4 font-light blog-content-style"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* Modal Footer */}
            <div className="pt-4 border-t border-zinc-900 light:border-zinc-200">
              <button 
                onClick={() => setSelectedPost(null)}
                className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-zinc-950 text-xs font-bold rounded-xl transition-all"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
