import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Check, HelpCircle, Globe } from 'lucide-react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'INR'
  const [countryName, setCountryName] = useState('Global');
  const [loadingLoc, setLoadingLoc] = useState(true);

  // IP Geolocation check
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code === 'IN' || data.country === 'IN' || (data.country_name && data.country_name.toLowerCase().includes('india'))) {
          setCurrency('INR');
          setCountryName('India');
        } else {
          setCurrency('USD');
          setCountryName(data.country_name || 'United States');
        }
        setLoadingLoc(false);
      })
      .catch(err => {
        console.log('IP Geolocation error, defaulting to USD pricing:', err);
        setCurrency('USD');
        setCountryName('Global');
        setLoadingLoc(false);
      });
  }, []);

  const getPlans = () => {
    const isINR = currency === 'INR';
    return [
      {
        name: "Growth Tier",
        desc: "Perfect for local businesses and growing startups looking to establish presence and basic AI chat capture.",
        priceMonthly: isINR ? 99000 : 1499,
        priceYearly: isINR ? 79000 : 1199,
        features: [
          "Premium 5-Page React Website",
          "Basic RAG AI Chatbot Integration",
          "Core SEO Audit & Optimization",
          "Google Business Profile Setup",
          "Weekly Cloud Database Backups",
          "Standard Email Support (24h turnaround)"
        ],
        cta: "Get Started Growth",
        popular: false
      },
      {
        name: "Scale Engine",
        desc: "Ideal for mid-market firms looking to aggressively acquire leads via ads and automate client intake loops.",
        priceMonthly: isINR ? 249000 : 3499,
        priceYearly: isINR ? 199000 : 2799,
        features: [
          "Next.js Headless Web Application",
          "Custom Voice/Call AI Twilio Integration",
          "Meta & Google Ads Campaign Handling",
          "WhatsApp Business API Automation",
          "Sales Pipeline CRM Synchronization",
          "Monthly ROI Audits & Performance Reports",
          "Priority Slack Support Channel (2h response)"
        ],
        cta: "Activate Scale Engine",
        popular: true
      },
      {
        name: "Enterprise Custom",
        desc: "Custom architectures for organizations requiring fine-tuned models, CRM systems, and dedicated advertising teams.",
        priceMonthly: "Custom",
        priceYearly: "Custom",
        features: [
          "Tailored ERP & POS Software Systems",
          "Fine-Tuned LLMs & Local GPU Deployment",
          "Multilingual Global Campaign Strategy",
          "Unlimited Multi-User Management Portals",
          "Dedicated System Engineers & Media Buyers",
          "Custom SLAs & Technical Onboarding Support",
          "Dedicated Account Executive"
        ],
        cta: "Schedule Enterprise Briefing",
        popular: false
      }
    ];
  };

  const plans = getPlans();
  const curSymbol = currency === 'INR' ? '₹' : '$';

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
          <Globe className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan font-display flex items-center gap-1.5">
            Pricing For: {loadingLoc ? 'Locating...' : countryName} ({currency})
          </span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          Flexible Pricing Programs
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          Scale your commitment as you grow. Plan retainers automatically adjust to your region. Choose an option or contact us for custom plans.
        </p>
      </div>

      {/* Switcher Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-neon-cyan' : 'text-zinc-400 light:text-zinc-500'}`}>Monthly Billing</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="w-14 h-8 bg-zinc-900 light:bg-zinc-200 border border-zinc-800 light:border-zinc-300 rounded-full p-1 relative flex items-center transition-colors"
          aria-label="Toggle billing interval"
        >
          <div 
            className={`w-6 h-6 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-neon-cyan' : 'text-zinc-400 light:text-zinc-500'}`}>
          Annual Billing 
          <span className="px-2 py-0.5 bg-neon-emerald/20 text-neon-emerald text-[9px] font-bold rounded-full uppercase">
            Save 20%
          </span>
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((p, idx) => {
          const isCustom = typeof p.priceMonthly === 'string';
          const displayedPrice = isCustom 
            ? p.priceMonthly 
            : (billingCycle === 'monthly' ? p.priceMonthly : p.priceYearly);
          
          return (
            <div 
              key={idx}
              className={`glow-card glass-panel rounded-3xl border flex flex-col justify-between relative p-8 ${
                p.popular 
                  ? 'border-neon-cyan/50 shadow-lg shadow-neon-cyan/5' 
                  : 'border-zinc-800 light:border-zinc-200'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-neon-purple to-neon-cyan text-zinc-950 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Recommended Tier
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-xl text-white light:text-zinc-950">{p.name}</h3>
                  <p className="text-xs text-zinc-400 light:text-zinc-500 mt-2 leading-relaxed font-light">{p.desc}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 py-4 border-t border-b border-zinc-900 light:border-zinc-200">
                  {!isCustom && <span className="text-lg font-bold text-zinc-400">{curSymbol}</span>}
                  <span className="text-3xl sm:text-4xl font-black text-white light:text-zinc-950 tracking-tight">
                    {typeof displayedPrice === 'number' ? displayedPrice.toLocaleString() : displayedPrice}
                  </span>
                  {!isCustom && (
                    <span className="text-xs text-zinc-400 light:text-zinc-500 font-semibold ml-1">
                      / mo {billingCycle === 'yearly' && 'billed annually'}
                    </span>
                  )}
                </div>

                {/* Features Checkbox Grid */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 light:text-zinc-400">Included Allocations:</span>
                  {p.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                      <span className="text-xs text-zinc-350 light:text-zinc-700 leading-normal">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to="/contact"
                  className={`block w-full text-center py-3.5 rounded-xl text-xs font-bold transition-all ${
                    p.popular
                      ? 'bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-zinc-950 shadow-md'
                      : 'border border-zinc-800 light:border-zinc-300 text-zinc-200 light:text-zinc-850 hover:bg-white/5 light:hover:bg-zinc-200/50'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
