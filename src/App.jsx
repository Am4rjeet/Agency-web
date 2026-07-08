import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import CaseStudies from './pages/CaseStudies';
import Industries from './pages/Industries';
import Blog from './pages/Blog';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark-bg text-zinc-100 transition-colors duration-300">
        
        {/* Sticky Header Navigation */}
        <Navbar />
        
        {/* Master Route Router content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        {/* Footer info index */}
        <Footer />
        
        {/* Floating WhatsApp chat widget */}
        <FloatingWhatsApp />
        
      </div>
    </Router>
  );
}

export default App;
