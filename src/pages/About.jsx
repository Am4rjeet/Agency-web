import React from 'react';
import { Target, Users, Landmark, Zap, Shield, Sparkles } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const coreValues = [
  { title: "AI-First Architectures", desc: "We prioritize modern machine learning capabilities to save operations time and human resources.", icon: Zap },
  { title: "Iterative Excellence", desc: "We deploy and refine daily. Code is validated through active functional testing and automated audits.", icon: Sparkles },
  { title: "Absolute Transparency", desc: "We track costs, pipeline indicators, and conversions with complete client sharing dashboard logs.", icon: Shield },
];

const teamMembers = [
  { name: "Aarav Sharma", role: "CEO & Co-Founder", desc: "Ex-Google AI product manager, driving strategy and enterprise partnerships.", initials: "AS" },
  { name: "Sarah Jenkins", role: "Head of Artificial Intelligence", desc: "Ph.D. in Computer Science (Stanford). Specialist in LLM training and Vector database architectures.", initials: "SJ" },
  { name: "Rohan Verma", role: "Lead Full-Stack Architect", desc: "Senior developer with 10+ years scaling React, Node.js, and cloud Kubernetes frameworks.", initials: "RV" },
  { name: "Elena Rostova", role: "Creative Director & UI/UX Specialist", desc: "Designs award-winning agency user interfaces, optimizing user flow patterns and high-conversions.", initials: "ER" },
  { name: "Devon Carter", role: "VP of Performance Marketing", desc: "Configures high-ROI ads channels, Google PPC structures, and digital metrics audits.", initials: "DC" },
];

export default function About() {
  return (
    <div className="py-16 space-y-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
          <Users className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neon-cyan">About Amarix Solution</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white light:text-zinc-900 leading-tight">
          Who We Are & What We Stand For
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          We combine cutting-edge technology with high-conversions. Amarix Solution is an engineering-centric agency helping enterprises deploy custom AI models and launch marketing programs.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white light:text-zinc-900 leading-snug">
            Our Journey: Bridging the Gap
          </h2>
          <p className="text-zinc-400 light:text-zinc-500 leading-relaxed">
            Amarix Solution started in 2024 as a small collective of AI engineers and growth marketers who recognized a major issue: developers built great tools that nobody used, while marketers ran great ads that directed traffic to slow, broken websites.
          </p>
          <p className="text-zinc-400 light:text-zinc-500 leading-relaxed">
            By unifying custom software engineering with data-driven performance marketing under one roof, we created a streamlined scaling engine. Today, we work with mid-market companies and tech startups across North America, Europe, and Asia to automate operations and drive pipeline growth.
          </p>
        </div>
        
        {/* Metric Grid */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { val: '25', suff: '+', label: 'Engineers & Creators' },
            { val: '10', suff: 'M+', label: 'Ad Budget Managed ($)' },
            { val: '99', suff: '%', label: 'Uptime SLA Guarantee' },
            { val: '5', suff: '★', label: 'Average Client Rating' }
          ].map((stat, idx) => (
            <div key={idx} className="p-6 bg-zinc-900/40 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-200 rounded-3xl text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-white light:text-zinc-900">
                <AnimatedCounter value={stat.val} suffix={stat.suff} />
              </div>
              <div className="text-xs text-zinc-400 light:text-zinc-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core values */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white light:text-zinc-900">Our Core Pillars</h2>
          <p className="text-zinc-400 light:text-zinc-500">The parameters that guide our coding standards and marketing campaigns.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, idx) => {
            const IconComp = value.icon;
            return (
              <div key={idx} className="p-8 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800/80 light:border-zinc-200 rounded-3xl space-y-4">
                <div className="p-3 bg-neon-cyan/10 rounded-xl w-fit">
                  <IconComp className="w-6 h-6 text-neon-cyan" />
                </div>
                <h3 className="font-display font-bold text-lg text-white light:text-zinc-800">{value.title}</h3>
                <p className="text-sm text-zinc-400 light:text-zinc-500 leading-relaxed">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Profiles */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white light:text-zinc-900">Our Executive Board</h2>
          <p className="text-zinc-400 light:text-zinc-500">Meet the technicians and strategists coordinating your project lifecycle.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="p-6 bg-zinc-900/40 light:bg-zinc-200/50 border border-zinc-800/80 light:border-zinc-200 rounded-3xl space-y-4 flex flex-col justify-between hover:border-neon-purple/40 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white light:text-zinc-900">{member.name}</h3>
                  <p className="text-xs text-neon-cyan font-semibold uppercase tracking-wider">{member.role}</p>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 light:text-zinc-500 leading-relaxed font-light">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
