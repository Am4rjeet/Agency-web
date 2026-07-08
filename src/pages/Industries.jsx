import React from 'react';
import { 
  Building2, Activity, ShoppingBag, DollarSign, 
  GraduationCap, Hotel, Terminal, Briefcase, Landmark 
} from 'lucide-react';

const industries = [
  {
    name: "Healthcare & Biotech",
    icon: Activity,
    desc: "Deploy HIPAA-compliant conversational bots, calendar synchronization schedules, and local SEO optimizations for hospitals, doctors, and biotech firms.",
    useCase: "Example: Automated booking agents parsing physician shifts to route callers with 99% accuracy."
  },
  {
    name: "E-Commerce & Retail",
    icon: ShoppingBag,
    desc: "Speed-optimized headless Next.js frontends, Shopify integrations, Meta Ads, and automated WhatsApp abandoned cart retargeting loops.",
    useCase: "Example: Capturing Instagram comments and delivering direct DM discount vouchers automatically."
  },
  {
    name: "FinTech & Banking",
    icon: DollarSign,
    desc: "Highly secure enterprise dashboards, customer records databases, automated billing, and search rankings for financial brokers.",
    useCase: "Example: Secure client document portals coordinating multi-signature approvals."
  },
  {
    name: "EdTech & Education",
    icon: GraduationCap,
    desc: "Custom Learning Management Systems (LMS) with student analytics, school registration, and Google performance ads.",
    useCase: "Example: Portals managing assignments, student rosters, and online payments."
  },
  {
    name: "Real Estate & Housing",
    icon: Building2,
    desc: "Automatic lead capture tools, CRM pipeline routing, localized SEO maps, and virtual tour interactive panels.",
    useCase: "Example: Route geographic inquiries to regional brokers in under 10 seconds."
  },
  {
    name: "SaaS & Tech Startups",
    icon: Terminal,
    desc: "Product landing designs, Claude/OpenAI API fine-tunings, automated billing scripts, and technical SEO crawls.",
    useCase: "Example: Fine-tuning vector models on software wikis to auto-resolve client tickets."
  },
  {
    name: "Hospitality & Travel",
    icon: Hotel,
    desc: "Centralized room reservation calendars, POS terminal integrations, FSSAI compliance documents registration, and review aggregators.",
    useCase: "Example: Dynamic SPA calendars synced with reservation systems."
  },
  {
    name: "Legal & Professional",
    icon: Briefcase,
    desc: "Corporate brand guidelines, LLP registration guides, contract template repositories, and high-conversions search ad groups.",
    useCase: "Example: High-intent local Google Search Ads driving inbound consultations."
  }
];

export default function Industries() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
          <Landmark className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan font-display">Target Markets</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          Sectors We Empower
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          We customize solutions for specific industries. Our team tailors AI automations and digital marketing campaigns to meet the compliance and conversion goals of your market segment.
        </p>
      </div>

      {/* Industries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {industries.map((ind, idx) => {
          const IconComp = ind.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-zinc-900/40 light:bg-zinc-200/50 border border-zinc-800/85 light:border-zinc-200 rounded-3xl flex flex-col justify-between hover:border-neon-cyan/40 hover:-translate-y-1 transition-all"
            >
              <div className="space-y-4">
                <div className="p-3 bg-neon-purple/10 light:bg-zinc-200/60 rounded-xl w-fit">
                  <IconComp className="w-6 h-6 text-neon-cyan" />
                </div>
                <h3 className="font-display font-bold text-lg text-white light:text-zinc-900">{ind.name}</h3>
                <p className="text-xs text-zinc-400 light:text-zinc-555 leading-relaxed font-light">{ind.desc}</p>
              </div>
              <div className="pt-4 border-t border-zinc-900 light:border-zinc-200 mt-4">
                <p className="text-[10px] text-neon-emerald font-semibold italic">{ind.useCase}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
