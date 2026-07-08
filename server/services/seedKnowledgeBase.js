import Document from '../models/Document.js';
import Project from '../models/Project.js';
import ingestionService from './ingestionService.js';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// ============================================================================
// STATIC SITE CONTENT MARKDOWN REPS
// ============================================================================

const FAQ_CONTENT = `
# Frequently Asked Questions (FAQ)

## Category: General
### Q: How does Amarix Solution handle project discovery?
A: We begin with a detailed audit of your business logs, CRM pipeline data, and current website speeds. From there, we coordinate a strategic document outlining timelines, architecture choices, API lists, and exact project fees.

### Q: What is your typical turnaround time?
A: Corporate websites and landing pages average 3 to 5 weeks. More complex dashboard systems, ERP platforms, or deep LLM calling integrations average 6 to 12 weeks from visual approval to deployment.

## Category: AI Solutions
### Q: What is a RAG chatbot and how does it differ from a standard bot?
A: Retrieval-Augmented Generation (RAG) connects an LLM to your internal files in real-time. Standard chatbots only recall static text. RAG queries vectorized document stores to output answers based on your internal guidelines with source citations.

### Q: Are the AI voice calling bots HIPAA compliant?
A: Yes. For our medical partners, we host vector models on secure dedicated virtual servers, use encrypted data storage, and configure secure API protocols that do not log patient metadata.

## Category: Web & Mobile
### Q: Why do you recommend headless Next.js layouts?
A: Monolithic templates query databases for every visitor, causing delay. Headless Next.js hosts pages statically on globally distributed CDN edges. Page loading drops under 1 second, raising transaction conversion by up to 2.4x.

### Q: Will we own the source code after development?
A: Absolutely. Once the project completes and final retainers resolve, we transfer full repository permissions, Cloudflare domain control, and developer credentials directly to your staff.

## Category: Marketing
### Q: How do you coordinate Meta and Google PPC campaigns?
A: We build multi-stage paid media campaigns. Rather than targeting generic keywords, we set up conversion trackers logging actual customer signups, using direct Instagram/WhatsApp pipelines to lower acquisition cost.

## Category: Registrations
### Q: Can you help our corporate startup register for tax exemptions?
A: Yes. Through our Business Registration division, we file Startup India profiles, LLP agreements, trademark requests, and local MSME profiles to ensure you qualify for taxation exemptions and government benefits.
`;

const SERVICES_CONTENT = `
# Amarix Solutions Service Catalog

## 1. AI Solutions
We deploy custom machine learning models, autonomous bots, and retrieval-augmented systems to streamline operations and interact with customers 24/7.
* **AI Chatbot Development:** Custom conversational flows with structured NLP response graphs.
* **RAG AI Chatbot:** Knowledge-retrieval agents connected to your internal files, wikis, or PDF documents.
* **AI Voice Agent:** Real-time conversational voice agents for hands-free support terminals.
* **AI Calling Agent:** Outbound and inbound automated phone assistants integrated via Twilio and LLMs.
* **AI Customer Support Bot:** 24/7 client support bot that handles queries and files support tickets in CRM.
* **AI Workflow Automation:** Connect LLMs to Zapier, Make, or custom APIs to run operations on autopilot.
* **OpenAI Integration:** Deep custom API connections using GPT-4o models for cognitive reasoning.
* **Gemini Integration:** Multimodal data analysis and generation utilizing Google's latest Gemini models.
* **Claude Integration:** Advanced analysis, coding support, and document summarization using Anthropic APIs.
* **AI Knowledge Base:** Vectorized internal document repositories accessible by permissions-based AI agents.

## 2. Web Development
We engineer lightning-fast storefronts, company assets, and multi-user applications with clean visual frameworks.
* **Business Website:** Premium conversion-focused landings for mid-market services.
* **Corporate Website:** Secure, compliance-ready enterprise portals with robust documentation.
* **Portfolio Website:** Sleek creative showpieces with smooth hover details and transitions.
* **WordPress Website:** Optimized blogging and CMS configurations with custom themes.
* **Shopify Website:** Headless or custom Liquid setups built for fast loading and checkouts.
* **E-Commerce Website:** Custom digital storefronts supporting payment structures, catalogs, and orders.
* **LMS Website:** Learning management portals with student dashboards and course trackers.
* **Booking Website:** Integrated reservation modules, calendar checkers, and auto-reminders.
* **School Website:** Parent-teacher updates portals, admissions links, and documents archives.
* **Hospital Website:** Doctor timetables, patient files forms, and department pages.
* **Custom Web Application:** Dynamic, multi-user platforms tailored to solve unique workflow challenges.
* **Interactive 3D Website:** WebGL layouts utilizing Three.js for outstanding user experiences.
* **Website Redesign:** Audit code, overhaul UI templates, and optimize core performance.
* **Website Maintenance:** Weekly server updates, plugin security patches, and database backups.
* **Domain & Hosting Setup:** Cloudflare DNS configuration, AWS hosting, and SSL installations.

## 3. Mobile App Development
We engineer high-performance applications for iOS and Android, compiling clean binaries for app store distribution.
* **Android App:** Kotlin-based applications built for diverse screen form-factors.
* **iOS App:** Swift-based iOS/iPadOS applications targeting optimal performance.
* **React Native App:** Cross-platform app development using shared JavaScript frameworks.
* **Flutter App:** High-fidelity mobile designs compiling native arm code.
* **Hybrid Apps:** Cost-effective wrapper systems utilizing HTML5 mobile views.
* **Progressive Web Apps (PWA):** Web apps caching offline operations and sending push alerts.
* **App Maintenance:** OS updates compliance, API refreshes, and analytics monitoring.
* **App Store Deployment:** Google Play & Apple Developer panel configurations and audits.

## 4. Custom Software Development
We build scalable internal software to automate database logs, manage resource planning, and coordinate company branches.
* **ERP Software:** Enterprise resource planning for inventory, accounting, and supply chains.
* **CRM Software:** Customer relations logging, pipelines tracking, and activity checklists.
* **Inventory Management:** Barcode scanning configurations, warehouse trackers, and warning alerts.
* **HR Management:** Employee schedules logs, payroll, review pipelines, and attendance trackers.
* **Billing Software:** Invoicing configurations, dynamic taxation calculation, and PDF builders.
* **POS Software:** Point-of-Sale UI supporting barcode scanning and direct receipt printing.
* **Hospital Management:** Secure medical logs databases, staff shifts charts, and billing systems.
* **School Management:** Student enrollment directories, reports builders, and fee registers.
* **Booking System:** Centralized reservation databases with real-time double-booking protection.
* **Admin Dashboard:** Dynamic graphs, charts, and activity logs reporting database performance.

## 5. CRM & Business Management
We control pipelines, track internal milestones, and coordinate user groups with clear, permissions-based dashboards.
* **Lead Management:** Route incoming leads automatically to corresponding sales representatives.
* **Customer Management:** Centralize contact details, notes histories, and email threads logs.
* **Sales Pipeline:** Visual boards demonstrating active deal stages (Prospecting, Negotiating, Won).
* **Employee Management:** Set employee permissions levels and view performance milestones charts.
* **Analytics Dashboard:** Revenue analytics charts, close ratios, and team pipelines reports.
* **Project Management:** Task checksheets, deadline trackers, and file attachments directories.
* **Multi User Management:** Secure database setups supporting user roles (Admin, Sales, Viewers).

## 6. Automation Services
* **WhatsApp Automation:** Auto-sync contact details and schedule bookings via WhatsApp API chats.
* **Email Automation:** Set up automated welcome drops, newsletters, and reminders.
* **CRM Integration:** Sync leads from Meta ads to HubSpot, Zoho, or custom pipelines.
* **Zapier/Make setup:** Low-code workflow automation linking everyday productivity tools.
* **Google Sheets Sync:** Feed web inputs into shared spreadsheet logs automatically.
* **SMS Alert System:** Send payment notifications and bookings reminders via text gateway.

## 7. Digital Marketing
* **Search Engine Optimization (SEO):** Audit keyword profiles, write blogs, and target search rankings.
* **Meta Ads (FB/IG):** Configure conversion ads driving leads into messenger systems.
* **Google Ads (PPC):** Target high-intent queries to drive instant website signups.
* **Social Media Management:** Content schedules, graphical banners creation, and profile audits.
* **Content Writing:** Blog posting, emails newsletters, copywriting, and landing page scripts.

## 8. Startup Registrations
* **Business Registration:** Incorporate LLPs, Private Limited entities, or sole proprietorships.
* **Startup India Registration:** Avail government certification, taxation benefits, and funding pools.
* **Trademark Registration:** Protect visual brand logomarks and business trade titles.
* **MSME Registration:** MSME schemes certifications for easier loan lines and benefits.
* **GST Registration:** Setup GST numbers, taxation accounts, and filings pipelines.
* **IEC Registration:** Import Export Codes registrations for global product trades.
`;

const BLOG_CONTENT = `
# Amarix Solutions Blog Center

## Article 1: How Headless Next.js Elevates Storefront Conversion Rates
* **Category:** E-Commerce
* **Date:** July 2, 2026
* **Author:** Rohan Verma
* **Description:** Slow websites kill sales. Learn how rendering products from edge CDNs and separating UI layers from Shopify databases drives lightning-fast speeds.
* **Content:**
Monolithic storefronts suffer under high traffic due to heavy server queries on inventory databases. By splitting frontend visuals (using Next.js Server Components) from the database layer, static assets are served from global edge CDNs. Dynamic counts are loaded client-side via GraphQL. Shifting VogueThreads to headless reduced load times from 4.8s to 0.7s, leading to a conversion gain of +240%.

## Article 2: Deploying Secure RAG Chatbots in Healthcare Systems
* **Category:** AI Solutions
* **Date:** June 25, 2026
* **Author:** Sarah Jenkins, Ph.D.
* **Description:** A technical walkthrough of vector embeddings, document indexing, and configuring secure LangChain parameters to avoid data leakage.
* **Content:**
Fine-tuning models is expensive. Retrieval-Augmented Generation (RAG) lets standard LLMs securely query clinic files in real-time. Document chunking splits PDFs into overlapping text pieces, converting them to vector coordinates via OpenAI or Gemini embed models. When a user asks a query, vector databases retrieve matches to instruct the LLM, outputting citations securely.

## Article 3: Optimizing Meta Ad ROI with Automated WhatsApp Conversions
* **Category:** Digital Marketing
* **Date:** June 18, 2026
* **Author:** Devon Carter
* **Description:** Why traditional email signups are dying, and how linking Instagram comment auto-responses with WhatsApp Business APIs cuts CPA.
* **Content:**
Friction in static web forms causes a high visitor dropoff. Connecting Meta click-to-chat ads starts conversations directly in WhatsApp or DMs, auto-delivering promo codes. GlowCosmetics registered 40,000 automated VIP contacts in 30 days and observed a 35% reduction in CPA.
`;

const WEBSITE_ABOUT_CONTENT = `
# About Amarix Solutions

## Corporate Identity
Amarix Solutions is an elite technological software engineering and digital marketing agency. We specialize in deploying modern web applications, high-converting digital advertising, custom AI workflows, and corporate startup registrations.

## Core Capabilities
* Custom AI integrations (Voice Agents, RAG Chatbots, workflow automation).
* High-speed Headless Frontends (Next.js, Vite, Tailwind CSS).
* Cross-Platform Mobile Apps (Flutter, React Native).
* Enterprise Business Software (ERP, Custom CRMs, billing systems).
* Paid media campaigns (Meta, Google, SEO).
* MSME, GST, IEC, and Trademark registrations.

## Corporate Culture
Our engineering is built on speed, compliance, ownership, and performance. We deliver production-grade code, transfer full repository rights to clients upon completion, and build with security first.
`;

// ============================================================================
// SEEDING ORCHESTRATOR
// ============================================================================

export async function indexSiteContent() {
  logger.info('Starting site-wide knowledge indexing script...');

  const indexSource = async (title, type, content, metadata = {}) => {
    // Check if document exists
    const hash = crypto.createHash('md5').update(content).digest('hex');
    let doc = await Document.findOne({ type });

    if (!doc) {
      doc = new Document({
        title,
        type,
        hash,
        status: 'pending'
      });
      await doc.save();
    } else {
      // If hash matches and it is completed, skip to save resources
      if (doc.hash === hash && doc.status === 'completed') {
        logger.debug(`Content for "${title}" has not changed. Skipping embedding generation.`);
        return doc;
      }
      doc.title = title;
      doc.hash = hash;
      doc.status = 'pending';
      await doc.save();
    }

    // Ingest text in background pipeline
    await ingestionService.ingestTextContent(doc._id, content, metadata);
    return doc;
  };

  try {
    // 1. Index Static FAQ
    await indexSource('Frequently Asked Questions (FAQ)', 'static-faq', FAQ_CONTENT, { category: 'FAQ' });

    // 2. Index Static Services Catalog
    await indexSource('Agency Services Catalog', 'static-services', SERVICES_CONTENT, { category: 'Services' });

    // 3. Index Static Blog Posts
    await indexSource('Agency Blog Posts', 'static-blog', BLOG_CONTENT, { category: 'Blog' });

    // 4. Index Static About & General Page
    await indexSource('About Amarix Solutions', 'static-website', WEBSITE_ABOUT_CONTENT, { category: 'About' });

    // 5. Index MongoDB Projects Portfolio
    await indexPortfolioProjects();

    logger.info('Successfully registered re-index processes for static and dynamic site data.');
    return true;
  } catch (err) {
    logger.error('Error during site-wide knowledge indexing', { error: err.message });
    throw err;
  }
}

/**
 * Dynamics projects scraper. Queries MongoDB and aggregates projects into a markdown document.
 */
async function indexPortfolioProjects() {
  try {
    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      logger.info('No portfolio projects found in MongoDB to index.');
      return;
    }

    let markdown = '# Portfolio Projects & Case Studies\n\n';
    projects.forEach((p, idx) => {
      markdown += `## Project ${idx + 1}: ${p.title}\n`;
      markdown += `* **Client:** ${p.client}\n`;
      markdown += `* **Category:** ${p.category}\n`;
      markdown += `* **Key Outcome Metric:** ${p.metric}\n`;
      markdown += `* **Technologies Used:** ${p.tech.join(', ')}\n`;
      markdown += `* **Description:** ${p.desc}\n`;
      markdown += `* **Challenge faced:** ${p.challenge}\n`;
      markdown += `* **Solution engineered:** ${p.solution}\n\n`;
    });

    const hash = crypto.createHash('md5').update(markdown).digest('hex');
    let doc = await Document.findOne({ type: 'mongodb-portfolio' });

    if (!doc) {
      doc = new Document({
        title: 'Portfolio Projects & Case Studies',
        type: 'mongodb-portfolio',
        hash,
        status: 'pending'
      });
      await doc.save();
    } else {
      if (doc.hash === hash && doc.status === 'completed') {
        logger.debug('Portfolio projects content has not changed. Skipping re-indexing.');
        return;
      }
      doc.hash = hash;
      doc.status = 'pending';
      await doc.save();
    }

    await ingestionService.ingestTextContent(doc._id, markdown, { category: 'Portfolio' });
    logger.info(`Portfolio index pipeline triggered for ${projects.length} dynamic projects.`);
  } catch (err) {
    logger.error('Error indexing portfolio projects', { error: err.message });
    throw err;
  }
}

export default indexSiteContent;
