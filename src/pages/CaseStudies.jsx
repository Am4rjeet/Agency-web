import React from 'react';
import { Award, ShieldAlert, CheckCircle2, TrendingUp, Cpu, Globe, MessageSquare } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const cases = [
  {
    title: "AI Patient Calling & Intake System",
    client: "HealthSync Clinics",
    industry: "Healthcare Systems",
    icon: Cpu,
    challenge: "HealthSync experienced a huge backlog in medical reception bookings, leading to lost customer follow-ups and high clerical overhead. Receptionists were answering repetitive policy questions instead of coordinating triage care.",
    solution: "We engineered a Node.js webhook orchestrator connecting Twilio voice streams to OpenAI GPT-4o, backed by a vectorized clinic information database. This allowed the bot to answer complex clinic operations questions and set appointments directly inside their booking platform.",
    impact: [
      { val: "50", suff: "%", label: "Call Center Costs Cut" },
      { val: "99", suff: "%", label: "Scheduling Accuracy" },
      { val: "10", suff: "s", label: "Average Response Time" }
    ],
    resultsDescription: "The AI agent successfully handled over 40,000 inquiries in its first month, scheduling appointments with zero double-bookings. Clerical staff shifted fully to in-clinic patient care, increasing clinic capacity by 15%."
  },
  {
    title: "VogueThreads Headless Storefront",
    client: "VogueThreads Corp",
    industry: "E-Commerce & Retail",
    icon: Globe,
    challenge: "Their legacy monolithic WooCommerce setup suffered from slow load times (4.8s average), resulting in a high shopping cart abandonment rate on mobile devices, dragging down their Meta Ads performance.",
    solution: "Overhauled the architecture to a headless React configuration. By serving static pages from edge networks and fetching dynamic inventory via Shopify GraphQL API, page load times dropped to 0.7s, leading to immediate transaction growth.",
    impact: [
      { val: "240", suff: "%", label: "Conversion Rate Increase" },
      { val: "85", suff: "%", label: "Page Load Time Cut" },
      { val: "30", suff: "%", label: "Bounce Rate Reduction" }
    ],
    resultsDescription: "With instantaneous page transitions and a single-step checkout flow, VogueThreads saw conversion increase across all channels, raising monthly recurring revenue by $140,000 within 60 days."
  },
  {
    title: "Instagram DM Campaign Automation",
    client: "GlowCosmetics Group",
    industry: "Consumer Brand Marketing",
    icon: MessageSquare,
    challenge: "GlowCosmetics was spending thousands on influencer marketing but lost hundreds of leads in direct messages because their customer service team could not reply fast enough to product inquiries.",
    solution: "Developed an automated Instagram DM lead capturing flow using the official Meta Graph API. The system scans comments, auto-replies with product recommendations, and prompts users to join their WhatsApp VIP list.",
    impact: [
      { val: "40", suff: "K", label: "Leads Captured in 30 Days" },
      { val: "150", suff: "K", label: "Attributed Sales ($)" },
      { val: "22", suff: "%", label: "WhatsApp List Signups" }
    ],
    resultsDescription: "By automating direct-to-consumer conversations, GlowCosmetics maintained a 100% response rate within 2 seconds. The system converted organic comment threads into sales directly, without manual oversight."
  }
];

export default function CaseStudies() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
          <Award className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan font-display">Flagship Cases</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          Success Stories & In-Depth Studies
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          Deep-dives into how we solve real-world problems. Read the details of our challenges, technical implementations, and quantifiable business results.
        </p>
      </div>

      {/* Case studies list */}
      <div className="space-y-20">
        {cases.map((cs, idx) => {
          const IconComp = cs.icon;
          return (
            <div 
              key={idx}
              className="p-8 sm:p-12 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800 light:border-zinc-200 rounded-3xl space-y-8 relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neon-cyan/5 to-transparent rounded-bl-3xl pointer-events-none" />

              {/* Case Title Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 light:border-zinc-250 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neon-cyan/10 rounded-xl">
                    <IconComp className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white light:text-zinc-950">{cs.title}</h2>
                    <span className="text-xs text-zinc-500 light:text-zinc-400 font-bold uppercase tracking-wider">{cs.industry}</span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-neon-purple uppercase tracking-widest bg-zinc-950 light:bg-white/80 border border-zinc-850 light:border-zinc-200 px-4 py-2 rounded-full w-fit">
                  Client: {cs.client}
                </div>
              </div>

              {/* Challenge / Solution Detail Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white light:text-zinc-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-neon-pink shrink-0" />
                    The Business Challenge
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 light:text-zinc-650 leading-relaxed font-light">{cs.challenge}</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white light:text-zinc-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-neon-cyan shrink-0" />
                    Our Technical Solution
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 light:text-zinc-650 leading-relaxed font-light">{cs.solution}</p>
                </div>
              </div>

              {/* Results & Big Numbers */}
              <div className="border-t border-zinc-850 light:border-zinc-250 pt-8 space-y-6">
                <h3 className="font-display font-bold text-sm text-white light:text-zinc-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neon-emerald" />
                  Attributed Performance Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {cs.impact.map((imp, impIdx) => (
                    <div key={impIdx} className="p-6 bg-zinc-950/60 light:bg-white/60 border border-zinc-900 light:border-zinc-200 rounded-2xl text-center">
                      <div className="text-3xl sm:text-4xl font-extrabold text-neon-emerald">
                        <AnimatedCounter value={imp.val} suffix={imp.suff} />
                      </div>
                      <div className="text-xs text-zinc-400 light:text-zinc-500 font-semibold uppercase tracking-wider mt-1">{imp.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 light:text-zinc-700 leading-relaxed font-light italic bg-zinc-950/20 light:bg-slate-50 p-4 rounded-xl border border-zinc-900 light:border-zinc-200">
                  {cs.resultsDescription}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
