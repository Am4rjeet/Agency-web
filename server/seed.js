import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Models
import User from './models/User.js';
import Project from './models/Project.js';

dotenv.config();

const defaultProjects = [
  {
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

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amarix';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Seed Admin User
    const adminEmail = 'admin@amarixsolution.com';
    const adminPassword = 'AdminAmarix2026!';
    
    // Clear old admin
    await User.deleteMany({ email: adminEmail });
    console.log('Cleared existing admin user account.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword
    });

    await adminUser.save();
    console.log(`========================================`);
    console.log(`Admin account successfully initialized!`);
    console.log(`Login: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`========================================`);

    // 2. Seed Projects
    // Clear old projects
    await Project.deleteMany({});
    console.log('Cleared existing portfolio projects.');

    await Project.insertMany(defaultProjects);
    console.log(`Successfully seeded ${defaultProjects.length} portfolio items.`);

    console.log('Seeding process finished.');
    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed with error:', err);
    process.exit(1);
  }
}

seedDatabase();
