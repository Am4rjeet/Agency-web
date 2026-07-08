import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, Code, Smartphone, Cpu, BarChart3, RefreshCw, 
  Globe, Share2, Video, ClipboardCheck, Mail, ShieldAlert, Check
} from 'lucide-react';

const servicesData = {
  ai: {
    title: 'AI Solutions',
    desc: 'Deploy custom machine learning models, autonomous bots, and retrieval-augmented systems to streamline operations and interact with customers 24/7.',
    icon: Sparkles,
    techs: ['OpenAI API', 'Gemini Pro', 'Claude 3.5', 'LangChain', 'Python', 'Pinecone', 'LlamaIndex'],
    items: [
      { name: 'AI Chatbot Development', desc: 'Custom conversational flows with structured NLP response graphs.' },
      { name: 'RAG AI Chatbot', desc: 'Knowledge-retrieval agents connected to your internal files, wikis, or PDF documents.' },
      { name: 'AI Voice Agent', desc: 'Real-time conversational voice agents for hands-free support terminals.' },
      { name: 'AI Calling Agent', desc: 'Outbound and inbound automated phone assistants integrated via Twilio and LLMs.' },
      { name: 'AI Customer Support Bot', desc: '24/7 client support bot that handles queries and files support tickets in CRM.' },
      { name: 'AI Workflow Automation', desc: 'Connect LLMs to Zapier, Make, or custom APIs to run operations on autopilot.' },
      { name: 'OpenAI Integration', desc: 'Deep custom API connections using GPT-4o models for cognitive reasoning.' },
      { name: 'Gemini Integration', desc: 'Multimodal data analysis and generation utilizing Google\'s latest Gemini models.' },
      { name: 'Claude Integration', desc: 'Advanced analysis, coding support, and document summarization using Anthropic APIs.' },
      { name: 'AI Knowledge Base', desc: 'Vectorized internal document repositories accessible by permissions-based AI agents.' }
    ]
  },
  web: {
    title: 'Web Development',
    desc: 'Engineering lightning-fast storefronts, company assets, and multi-user applications with clean visual frameworks.',
    icon: Code,
    techs: ['React.js', 'Next.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Shopify', 'WordPress'],
    items: [
      { name: 'Business Website', desc: 'Premium conversion-focused landings for mid-market services.' },
      { name: 'Corporate Website', desc: 'Secure, compliance-ready enterprise portals with robust documentation.' },
      { name: 'Portfolio Website', desc: 'Sleek creative showpieces with smooth hover details and transitions.' },
      { name: 'WordPress Website', desc: 'Optimized blogging and CMS configurations with custom themes.' },
      { name: 'Shopify Website', desc: 'Headless or custom Liquid setups built for fast loading and checkouts.' },
      { name: 'E-Commerce Website', desc: 'Custom digital storefronts supporting payment structures, catalogs, and orders.' },
      { name: 'LMS Website', desc: 'Learning management portals with student dashboards and course trackers.' },
      { name: 'Booking Website', desc: 'Integrated reservation modules, calendar checkers, and auto-reminders.' },
      { name: 'School Website', desc: 'Parent-teacher updates portals, admissions links, and documents archives.' },
      { name: 'Hospital Website', desc: 'Doctor timetables, patient files forms, and department pages.' },
      { name: 'Custom Web Application', desc: 'Dynamic, multi-user platforms tailored to solve unique workflow challenges.' },
      { name: 'Interactive 3D Website', desc: 'WebGL layouts utilizing Three.js for outstanding user experiences.' },
      { name: 'Website Redesign', desc: 'Audit code, overhaul UI templates, and optimize core performance.' },
      { name: 'Website Maintenance', desc: 'Weekly server updates, plugin security patches, and database backups.' },
      { name: 'Domain & Hosting Setup', desc: 'Cloudflare DNS configuration, AWS hosting, and SSL installations.' }
    ]
  },
  mobile: {
    title: 'Mobile App Development',
    desc: 'High-performance applications for iOS and Android, compiling clean binaries for app store distribution.',
    icon: Smartphone,
    techs: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Firebase', 'App Store Connect'],
    items: [
      { name: 'Android App', desc: 'Kotlin-based applications built for diverse screen form-factors.' },
      { name: 'iOS App', desc: 'Swift-based iOS/iPadOS applications targeting optimal performance.' },
      { name: 'React Native App', desc: 'Cross-platform app development using shared JavaScript frameworks.' },
      { name: 'Flutter App', desc: 'High-fidelity mobile designs compiling native arm code.' },
      { name: 'Hybrid Apps', desc: 'Cost-effective wrapper systems utilizing HTML5 mobile views.' },
      { name: 'Progressive Web Apps (PWA)', desc: 'Web apps caching offline operations and sending push alerts.' },
      { name: 'App Maintenance', desc: 'OS updates compliance, API refreshes, and analytics monitoring.' },
      { name: 'App Store Deployment', desc: 'Google Play & Apple Developer panel configurations and audits.' }
    ]
  },
  software: {
    title: 'Custom Software Development',
    desc: 'Scalable internal software to automate database logs, manage resource planning, and coordinate company branches.',
    icon: Cpu,
    techs: ['Electron', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
    items: [
      { name: 'ERP Software', desc: 'Enterprise resource planning for inventory, accounting, and supply chains.' },
      { name: 'CRM Software', desc: 'Customer relations logging, pipelines tracking, and activity checklists.' },
      { name: 'Inventory Management', desc: 'Barcode scanning configurations, warehouse trackers, and warning alerts.' },
      { name: 'HR Management', desc: 'Employee schedules logs, payroll, review pipelines, and attendance trackers.' },
      { name: 'Billing Software', desc: 'Invoicing configurations, dynamic taxation calculation, and PDF builders.' },
      { name: 'POS Software', desc: 'Point-of-Sale UI supporting barcode scanning and direct receipt printing.' },
      { name: 'Hospital Management', desc: 'Secure medical logs databases, staff shifts charts, and billing systems.' },
      { name: 'School Management', desc: 'Student enrollment directories, reports builders, and fee registers.' },
      { name: 'Booking System', desc: 'Centralized reservation databases with real-time double-booking protection.' },
      { name: 'Admin Dashboard', desc: 'Dynamic graphs, charts, and activity logs reporting database performance.' }
    ]
  },
  crm: {
    title: 'CRM & Business Management',
    desc: 'Control pipelines, track internal milestones, and coordinate user groups with clear, permissions-based dashboards.',
    icon: BarChart3,
    techs: ['Next.js', 'Supabase', 'Tailwind', 'Chart.js', 'Recharts'],
    items: [
      { name: 'Lead Management', desc: 'Route incoming leads automatically to corresponding sales representatives.' },
      { name: 'Customer Management', desc: 'Centralize contact details, notes histories, and email threads logs.' },
      { name: 'Sales Pipeline', desc: 'Visual boards demonstrating active deal stages (Prospecting, Negotiating, Won).' },
      { name: 'Employee Management', desc: 'Set employee permissions levels and view performance milestones charts.' },
      { name: 'Analytics Dashboard', desc: 'Revenue analytics charts, close ratios, and team pipelines reports.' },
      { name: 'Project Management', desc: 'Task checksheets, deadline trackers, and file attachments directories.' },
      { name: 'Multi User Management', desc: 'Secure database setups supporting user roles (Admin, Sales, Viewers).' }
    ]
  },
  automation: {
    title: 'Automation Services',
    desc: 'Eliminate repetitive tasks by building automated marketing triggers, auto-replies, and scheduled actions.',
    icon: RefreshCw,
    techs: ['Zapier', 'Make.com', 'n8n', 'Node.js', 'Webhook APIs'],
    items: [
      { name: 'WhatsApp Automation', desc: 'Trigger automated messages on incoming customer service queries.' },
      { name: 'Instagram Automation', desc: 'Auto-reply to comments or direct messages with marketing links.' },
      { name: 'Messenger Bot', desc: 'Facebook Messenger conversation graphs capturing initial leads.' },
      { name: 'CRM Automation', desc: 'Auto-move leads across pipeline stages on key user actions.' },
      { name: 'Lead Automation', desc: 'Extract web-form leads and format details directly to Slack or Discord.' },
      { name: 'Email Automation', desc: 'Trigger complex behavioral drip cycles based on link clicks or views.' },
      { name: 'Sales Funnel Automation', desc: 'Auto-send proposals, payment reminders, and onboarding schedules.' },
      { name: 'Appointment Automation', desc: 'Sync Calendly, Google Calendar, and send custom WhatsApp reminders.' }
    ]
  },
  marketing: {
    title: 'Digital Marketing',
    desc: 'Drive high-intent traffic to your systems through search optimizations and paid advertising channels.',
    icon: Globe,
    techs: ['Google Ads', 'Meta Business Suite', 'Google Search Console', 'Ahrefs', 'Semrush'],
    items: [
      { name: 'Search Engine Optimization (SEO)', desc: 'Rank high on Google for focus search phrases.' },
      { name: 'Google Ads', desc: 'Configure high-converting Google Search, Performance Max, and Shopping campaigns.' },
      { name: 'Meta Ads', desc: 'Target key audiences on Facebook and Instagram using high-converting creative structures.' },
      { name: 'YouTube Ads', desc: 'Establish brand presence through targeted video advertisements.' },
      { name: 'Performance Marketing', desc: 'Deploy multi-channel media buys tracking direct customer acquisition costs (CPA).' },
      { name: 'Local SEO', desc: 'Optimize Google Business profiles to drive localized customer reviews and maps traffic.' },
      { name: 'Technical SEO', desc: 'Speed auditing, schema markup configurations, and redirect sweeps.' }
    ]
  },
  smm: {
    title: 'Social Media Management',
    desc: 'Establish active brand presence across TikTok, Instagram, and LinkedIn with scheduled corporate feeds.',
    icon: Share2,
    techs: ['Buffer', 'Later', 'Figma', 'LinkedIn Analytics', 'Meta Creator Studio'],
    items: [
      { name: 'Social Media Handling', desc: 'Full administration of social channels, checking messages and tracking comments.' },
      { name: 'Content Calendar', desc: 'Visual calendars mapping monthly post concepts, scripts, and schedules.' },
      { name: 'Daily Posting', desc: 'Maintaining active publishing cadences to retain algorithmic visibility.' },
      { name: 'Community Management', desc: 'Liking, replying, and engaging with industry creators to grow presence.' },
      { name: 'Profile Optimization', desc: 'Auditing profile bios, linking options, and highlight templates.' },
      { name: 'Monthly Reporting', desc: 'Detailed PDF audits logging followers growth, reach, and web visits.' }
    ]
  },
  content: {
    title: 'Content Creation',
    desc: 'Stunning visual assets, video edits, and copywriting designed to catch attention and hold it.',
    icon: Video,
    techs: ['Adobe Premiere Pro', 'After Effects', 'Figma', 'Photoshop', 'Copywriting AI'],
    items: [
      { name: 'Social Media Post Design', desc: 'Premium carousels and static graphics reflecting brand guides.' },
      { name: 'Reel Editing', desc: 'High-energy short-form vertical videos with captions and sound designs.' },
      { name: 'Video Editing', desc: 'Long-form corporate videos, software guides, and brand commercials.' },
      { name: 'Motion Graphics', desc: 'Explainer animations, custom logo animations, and title transitions.' },
      { name: 'Ad Creative Design', desc: 'Static and video layouts structured for paid media campaigns.' },
      { name: 'Copywriting', desc: 'High-impact landing page sales copy and advertising angles.' },
      { name: 'Caption Writing', desc: 'Optimized social captions incorporating hashtags and CTAs.' },
      { name: 'Blog Writing', desc: 'Detailed, SEO-optimized articles addressing client search queries.' },
      { name: 'Thumbnail Design', desc: 'High-CTR video thumbnails designed to stand out on feeds.' }
    ]
  },
  branding: {
    title: 'Branding & Identity',
    desc: 'Position your business as a premium enterprise by defining logos, typography, style guidelines, and brand narratives.',
    icon: ClipboardCheck,
    techs: ['Figma', 'Adobe Illustrator', 'Brand Strategy Mapping'],
    items: [
      { name: 'Logo Design', desc: 'Vector logo suites built for icons, headers, dark/light backdrops, and printing.' },
      { name: 'Brand Identity', desc: 'Color palettes, font selections, and visual tones definition.' },
      { name: 'Brand Strategy', desc: 'Market positioning, competitor audits, and brand value statements.' },
      { name: 'Brand Guidelines', desc: 'Clear PDF manuals outlining correct logo usage, margins, and spacing.' },
      { name: 'Company Profile', desc: 'Corporate pitch decks outlining capabilities, history, and client reviews.' },
      { name: 'Business Card Design', desc: 'Premium printable business card layouts reflecting corporate styling.' },
      { name: 'Social Media Branding', desc: 'Coordinated banners, profile visuals, and template frames.' }
    ]
  },
  email: {
    title: 'Email & WhatsApp Marketing',
    desc: 'Target list segments directly with newsletters, promotions, and automated API broadcast feeds.',
    icon: Mail,
    techs: ['Klaviyo', 'Mailchimp', 'WhatsApp Cloud API', 'Twilio'],
    items: [
      { name: 'Email Marketing', desc: 'Deploy monthly promotional or informational newsletter runs.' },
      { name: 'Email Automation', desc: 'Configure onboarding drip loops, cart abandon checks, and customer loyalty feeds.' },
      { name: 'Newsletter Design', desc: 'Custom HTML layouts optimized for mobile mail clients.' },
      { name: 'Bulk WhatsApp Marketing', desc: 'Deploy target broadcasts to customer databases compliant with local laws.' },
      { name: 'WhatsApp Business API', desc: 'Register enterprise templates, set buttons, and structure interactive menus.' }
    ]
  },
  registration: {
    title: 'Business Registration',
    desc: 'Incorporate your agency, set up tax registrations, and obtain structural operating licenses legally.',
    icon: ShieldAlert,
    techs: ['Government Filings Portal', 'LLC Forms', 'GST System', 'MCA'],
    items: [
      { name: 'MSME Registration', desc: 'Obtain legal MSME certifications to qualify for corporate benefits.' },
      { name: 'Startup Registration', desc: 'Register profiles with Startup India/Hubs to access taxation grants.' },
      { name: 'Private Limited Registration', desc: 'Complete shareholder agreements, directors codes, and incorporation filings.' },
      { name: 'LLP Registration', desc: 'Incorporate limited liability partnerships for small professional groups.' },
      { name: 'GST Registration', desc: 'Register visual GST tax accounts and get active state tax codes.' },
      { name: 'FSSAI Registration', desc: 'Obtain food safety licenses and certificates for hospitality services.' },
      { name: 'Trademark Registration', desc: 'Brand trademark searches, filings preparations, and monitoring checks.' }
    ]
  }
};

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('ai');

  // Read URL search param if present, e.g. /services?cat=web
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && servicesData[cat]) {
      setActiveTab(cat);
    }
  }, [searchParams]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchParams({ cat: key });
  };

  const activeService = servicesData[activeTab];
  const ActiveIcon = activeService.icon;

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          Capabilities Dashboard
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          We offer comprehensive digital engineering services. Use the navigation panel below to inspect our detailed capabilities across 12 primary service areas.
        </p>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Nav (3 Cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-2 p-4 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800 light:border-zinc-200 rounded-3xl max-h-[75vh] overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 light:text-zinc-400 px-3 py-1.5 border-b border-zinc-800 light:border-zinc-200 mb-2">
            Capability Divisions
          </span>
          {Object.keys(servicesData).map((key) => {
            const IconComp = servicesData[key].icon;
            const isSelected = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-semibold transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-zinc-950 shadow-md font-bold' 
                    : 'text-zinc-400 light:text-zinc-600 hover:text-white light:hover:text-zinc-900 hover:bg-white/5 light:hover:bg-zinc-800/5'
                }`}
              >
                <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-zinc-950' : 'text-neon-cyan'}`} />
                {servicesData[key].title}
              </button>
            );
          })}
        </div>

        {/* Content Panel (8 Cols on lg) */}
        <div className="lg:col-span-8 space-y-8 animate-fade-in">
          
          {/* Header Card */}
          <div className="p-8 bg-zinc-900/40 light:bg-zinc-200/45 border border-zinc-800 light:border-zinc-200 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neon-cyan/15 rounded-2xl">
                <ActiveIcon className="w-8 h-8 text-neon-cyan" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white light:text-zinc-900">{activeService.title}</h2>
                <span className="text-xs font-semibold text-neon-purple uppercase tracking-widest">Division Details</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 light:text-zinc-500 leading-relaxed font-light">{activeService.desc}</p>
            
            {/* Tech tag loops */}
            <div className="pt-2 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-zinc-500 light:text-zinc-400 font-bold uppercase mr-1">Primary Stack:</span>
              {activeService.techs.map((t, i) => (
                <span key={i} className="text-xs font-semibold text-zinc-300 light:text-zinc-700 bg-zinc-900 light:bg-white/80 border border-zinc-800 light:border-zinc-200 px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Sub-services list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeService.items.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-zinc-900/20 light:bg-white/40 border border-zinc-900 light:border-zinc-200/80 rounded-2xl hover:border-neon-cyan/30 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-white light:text-zinc-800 flex items-start gap-2">
                    <Check className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed mt-1 font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tab CTA */}
          <div className="p-6 bg-gradient-to-tr from-neon-purple/10 to-neon-cyan/5 border border-zinc-800 light:border-zinc-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-sm text-white light:text-zinc-900">Interested in {activeService.title}?</h4>
              <p className="text-xs text-zinc-400 light:text-zinc-500 font-light">Get a custom business proposal and systems audit document.</p>
            </div>
            <Link 
              to="/contact" 
              className="px-5 py-2.5 rounded-full text-xs font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all w-full sm:w-auto text-center"
            >
              Request custom proposal
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
