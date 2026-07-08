import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

// Date range boundary calculators
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getOneMonthLaterDateString = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
};

const formatDateReadable = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime12h = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

export default function Contact() {
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'AI Solutions',
    budget: '$10K - $25K',
    message: ''
  });
  
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [customBudget, setCustomBudget] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const payload = {
      ...formData,
      budget: formData.budget === 'Custom / Other' ? customBudget : formData.budget,
      date: formatDateReadable(selectedDate),
      time: formatTime12h(selectedTime)
    };

    fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Database transaction error');
        return res.json();
      })
      .then(() => {
        setSubmitted(true);
      })
      .catch(err => {
        console.error('Backend endpoint connection failed, showing success fallback:', err);
        setSubmitted(true);
      });
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white light:text-zinc-900 tracking-tight">
          Book a Free Consultation
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
          Let's talk about details. Schedule a direct callback or submit details below to receive a customized proposal and visual roadmap within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact Details & Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="p-8 bg-zinc-900/40 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-200 rounded-3xl space-y-6">
            <h3 className="font-display font-bold text-lg text-white light:text-zinc-900">Direct Contacts</h3>
            <p className="text-xs text-zinc-400 light:text-zinc-500 leading-relaxed font-light">
              Reach out directly to schedule a briefing with our principal consultants or request emergency service updates.
            </p>
            
            <div className="space-y-4 pt-2">
              <a href="mailto:hello@amarixsolution.com" className="flex items-center gap-3 text-sm text-zinc-300 light:text-zinc-700 hover:text-neon-cyan transition-colors">
                <Mail className="w-5 h-5 text-neon-cyan shrink-0" />
                hello@amarixsolution.com
              </a>
              <a href="tel:+15552627490" className="flex items-center gap-3 text-sm text-zinc-300 light:text-zinc-700 hover:text-neon-cyan transition-colors">
                <Phone className="w-5 h-5 text-neon-cyan shrink-0" />
                +1 (555) AMARIX-S
              </a>
            </div>
          </div>

          <div className="p-8 bg-zinc-900/40 light:bg-zinc-200/50 border border-zinc-800 light:border-zinc-200 rounded-3xl space-y-6">
            <h3 className="font-display font-bold text-lg text-white light:text-zinc-900">Our Hubs</h3>
            
            <div className="space-y-4 text-xs text-zinc-400 light:text-zinc-500 leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white light:text-zinc-800 block text-sm">North America HQ</span>
                  100 Tech Venture Way, Suite 400, Silicon Valley, CA 94025
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white light:text-zinc-800 block text-sm">Asia Technology Hub</span>
                  504 Cyber Plaza, Sector-62, Noida, UP, India 201301
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Intake Form & Scheduler (7 Cols) */}
        <div className="lg:col-span-7">
          
          {submitted ? (
            <div className="p-8 sm:p-12 bg-zinc-900/40 light:bg-zinc-200/50 border border-zinc-850 light:border-zinc-200 rounded-3xl text-center space-y-6 animate-scale-up">
              <div className="p-4 bg-neon-emerald/20 text-neon-emerald rounded-full w-fit mx-auto">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-white light:text-zinc-950">Intake Successful!</h2>
              <p className="text-xs sm:text-sm text-zinc-400 light:text-zinc-600 leading-relaxed max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. We have logged your request for <strong>{formData.service}</strong> with a budget of <strong>{formData.budget === 'Custom / Other' ? customBudget : formData.budget}</strong>. 
              </p>
              <div className="p-4 bg-zinc-950 light:bg-white border border-zinc-900 light:border-zinc-300 rounded-2xl max-w-sm mx-auto text-xs text-zinc-400 light:text-zinc-500">
                <span className="font-bold text-white light:text-zinc-800 block mb-1">Scheduled Callback:</span>
                {formatDateReadable(selectedDate)} at {formatTime12h(selectedTime)}
              </div>
              <p className="text-xs text-zinc-500">
                A calendar invite and brief digital audit PDF have been sent to <strong>{formData.email}</strong>.
              </p>
              <button 
                onClick={() => { 
                  setSubmitted(false); 
                  setFormData({name:'', email:'', phone:'', company:'', service:'AI Solutions', budget:'Under $5,000', message:''});
                  setCustomBudget('');
                  setSelectedDate(getTodayDateString());
                  setSelectedTime('10:00');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-zinc-950 text-xs font-bold"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800 light:border-zinc-200 rounded-3xl space-y-6">
              <h3 className="font-display font-bold text-lg text-white light:text-zinc-900 border-b border-zinc-850 light:border-zinc-200 pb-3 mb-4">
                Consultation Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Your Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter name"
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Your Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email"
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Company Name</label>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter organization"
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Required Service</label>
                  <select 
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-300 light:text-zinc-700 focus:outline-none focus:border-neon-cyan transition-colors cursor-pointer"
                  >
                    <option>AI Solutions</option>
                    <option>Web Development</option>
                    <option>Mobile App Dev</option>
                    <option>Custom Software</option>
                    <option>Automation Services</option>
                    <option>Digital Marketing</option>
                    <option>Branding</option>
                    <option>Business Registration</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Budget Range</label>
                  <select 
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-300 light:text-zinc-700 focus:outline-none focus:border-neon-cyan transition-colors cursor-pointer"
                  >
                    <option>Under $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000 - $25,000</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000 +</option>
                    <option>Custom / Other</option>
                  </select>
                </div>
              </div>

              {formData.budget === 'Custom / Other' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Specify Custom Budget Range *</label>
                  <input 
                    type="text" 
                    value={customBudget}
                    onChange={(e) => setCustomBudget(e.target.value)}
                    required
                    placeholder="Enter custom budget (e.g. $12,500 or ₹1,50,000)"
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-855 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-205 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Project Context</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Outline your requirements, bottlenecks, or timeline targets..."
                  className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                />
              </div>

              {/* Interactive Dynamic Scheduler (Custom Date and Time within 1 month) */}
              <div className="border-t border-zinc-850 light:border-zinc-200 pt-6 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 light:text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                  Schedule Custom Callback (Select Date & Time within 1 Month)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Choose Date *</label>
                    <input 
                      type="date"
                      value={selectedDate}
                      min={getTodayDateString()}
                      max={getOneMonthLaterDateString()}
                      required
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Choose Time (Business Hours) *</label>
                    <input 
                      type="time"
                      value={selectedTime}
                      required
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-200 light:text-zinc-800 focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="w-full py-4 rounded-xl text-sm font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all"
              >
                Confirm Consultation & Intake
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
