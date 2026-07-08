import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, Calendar, Mail, LogOut, Trash2, Edit2, Plus, X, Check, AlertCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings'); // 'projects' | 'bookings' | 'messages'
  const [token, setToken] = useState('');
  
  // Data lists
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States for CRUD Projects
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [projectForm, setProjectForm] = useState({
    title: '',
    client: '',
    category: 'AI Solutions',
    metric: '',
    techInput: '',
    desc: '',
    challenge: '',
    solution: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const navigate = useNavigate();

  // Authentication check and data fetch
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      navigate('/admin/login');
      return;
    }
    setToken(savedToken);

    // Fetch dashboard content
    Promise.all([
      fetch('http://localhost:5000/api/bookings', { headers: { 'Authorization': `Bearer ${savedToken}` } }),
      fetch('http://localhost:5000/api/messages', { headers: { 'Authorization': `Bearer ${savedToken}` } }),
      fetch('http://localhost:5000/api/projects')
    ])
      .then(async ([resB, resM, resP]) => {
        if (resB.status === 401 || resB.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          return;
        }
        
        const bData = await resB.json();
        const mData = await resM.json();
        const pData = await resP.json();

        setBookings(bData);
        setMessages(mData);
        setProjects(pData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard records:', err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Delete Handlers
  const handleDeleteBooking = (id) => {
    if (!window.confirm('Delete this booking log?')) return;
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setBookings(bookings.filter(b => b._id !== id));
      })
      .catch(() => alert('Failed to delete booking.'));
  };

  const handleDeleteMessage = (id) => {
    if (!window.confirm('Delete this message log?')) return;
    fetch(`http://localhost:5000/api/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setMessages(messages.filter(m => m._id !== id));
      })
      .catch(() => alert('Failed to delete message.'));
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm('Delete this project permanently from live site?')) return;
    fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setProjects(projects.filter(p => p._id !== id));
      })
      .catch(() => alert('Failed to delete project.'));
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm({ ...projectForm, [name]: value });
  };

  const handleEditClick = (p) => {
    setIsEditing(true);
    setEditingId(p._id);
    setProjectForm({
      title: p.title,
      client: p.client,
      category: p.category,
      metric: p.metric,
      techInput: p.tech.join(', '),
      desc: p.desc,
      challenge: p.challenge,
      solution: p.solution
    });
    setFormSuccess('');
    setFormError('');
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId('');
    setProjectForm({
      title: '',
      client: '',
      category: 'AI Solutions',
      metric: '',
      techInput: '',
      desc: '',
      challenge: '',
      solution: ''
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const payload = {
      ...projectForm,
      tech: projectForm.techInput.split(',').map(s => s.trim()).filter(Boolean)
    };

    const url = isEditing 
      ? `http://localhost:5000/api/projects/${editingId}`
      : 'http://localhost:5000/api/projects';
    
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save project document.');
        return res.json();
      })
      .then(data => {
        if (isEditing) {
          setProjects(projects.map(p => p._id === editingId ? data : p));
          setFormSuccess('Project details updated successfully!');
        } else {
          setProjects([data, ...projects]);
          setFormSuccess('New project created and published successfully!');
        }
        resetForm();
      })
      .catch(err => {
        setFormError(err.message || 'Error occurred.');
      });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-bold">Synchronizing administrative database logs...</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-850 light:border-zinc-200 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white light:text-zinc-950">Administrative Control Panel</h1>
          <p className="text-xs text-neon-cyan font-bold uppercase tracking-wider mt-1">Status: Session Connected</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink text-xs font-bold rounded-xl transition-all border border-neon-pink/25 focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>

      {/* Tabs Switcher Grid */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'bookings'
              ? 'bg-gradient-to-r from-neon-purple to-neon-cyan border-none text-zinc-950 shadow-md'
              : 'bg-zinc-900/40 light:bg-zinc-200/50 border-zinc-850 light:border-zinc-300 text-zinc-400 light:text-zinc-600 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'messages'
              ? 'bg-gradient-to-r from-neon-purple to-neon-cyan border-none text-zinc-950 shadow-md'
              : 'bg-zinc-900/40 light:bg-zinc-200/50 border-zinc-850 light:border-zinc-300 text-zinc-400 light:text-zinc-650 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          Messages ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'projects'
              ? 'bg-gradient-to-r from-neon-purple to-neon-cyan border-none text-zinc-950 shadow-md'
              : 'bg-zinc-900/40 light:bg-zinc-200/50 border-zinc-850 light:border-zinc-300 text-zinc-400 light:text-zinc-600 hover:text-white'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          Portfolio ({projects.length})
        </button>
      </div>

      {/* Main Tab Panels content */}
      <div className="space-y-6">
        
        {/* 1. TAB: BOOKINGS LOG */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-white light:text-zinc-900">Submitted Consultation Schedules</h2>
            
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div key={b._id} className="p-6 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800 light:border-zinc-200 rounded-3xl relative flex flex-col justify-between">
                    <button
                      onClick={() => handleDeleteBooking(b._id)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-950 light:bg-white hover:bg-neon-pink/10 hover:text-neon-pink transition-colors text-zinc-500 focus:outline-none"
                      aria-label="Delete booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neon-cyan bg-zinc-950 light:bg-white border border-white/5 px-2.5 py-0.5 rounded-full">
                          {b.service}
                        </span>
                        <h3 className="font-display font-bold text-base text-white light:text-zinc-950 mt-2">{b.name}</h3>
                        <span className="text-[10px] text-zinc-500 light:text-zinc-450 uppercase tracking-widest font-bold">Org: {b.company || 'Individual'}</span>
                      </div>
                      
                      <div className="p-3 bg-zinc-950 light:bg-white rounded-2xl grid grid-cols-2 gap-2 text-xs border border-zinc-900 light:border-zinc-200">
                        <div><strong className="text-zinc-400 font-normal">Date:</strong> {b.date}</div>
                        <div><strong className="text-zinc-400 font-normal">Time:</strong> {b.time}</div>
                        <div><strong className="text-zinc-400 font-normal">Budget:</strong> {b.budget}</div>
                        <div><strong className="text-zinc-400 font-normal">Phone:</strong> {b.phone || 'N/A'}</div>
                      </div>

                      {b.message && (
                        <p className="text-xs text-zinc-400 light:text-zinc-650 leading-relaxed font-light italic">
                          "{b.message}"
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-zinc-900 light:border-zinc-200 mt-4 text-[10px] text-zinc-500 light:text-zinc-450 flex items-center justify-between">
                      <span>Submitted: {new Date(b.createdAt).toLocaleString()}</span>
                      <a href={`mailto:${b.email}`} className="text-neon-cyan hover:underline">Reply to Email &rarr;</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-zinc-900/10 rounded-2xl text-zinc-500 border border-dashed border-zinc-800">
                No consultation bookings found in the database.
              </div>
            )}
          </div>
        )}

        {/* 2. TAB: INBOUND MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-white light:text-zinc-900">Standard Contact Inquiries</h2>
            
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map((m) => (
                  <div key={m._id} className="p-6 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800 light:border-zinc-200 rounded-3xl relative flex flex-col justify-between">
                    <button
                      onClick={() => handleDeleteMessage(m._id)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-950 light:bg-white hover:bg-neon-pink/10 hover:text-neon-pink transition-colors text-zinc-500 focus:outline-none"
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neon-purple bg-zinc-950 light:bg-white border border-white/5 px-2.5 py-0.5 rounded-full">
                          {m.service}
                        </span>
                        <h3 className="font-display font-bold text-base text-white light:text-zinc-950 mt-2">{m.name}</h3>
                        <span className="text-[10px] text-zinc-500 light:text-zinc-450 uppercase tracking-widest font-bold">Company: {m.company || 'N/A'}</span>
                      </div>

                      <div className="p-3 bg-zinc-950 light:bg-white rounded-2xl grid grid-cols-2 gap-2 text-xs border border-zinc-900/80 light:border-zinc-200">
                        <div><strong className="text-zinc-400 font-normal">Budget:</strong> {m.budget}</div>
                        <div><strong className="text-zinc-400 font-normal">Phone:</strong> {m.phone || 'N/A'}</div>
                      </div>

                      <p className="text-xs text-zinc-400 light:text-zinc-650 leading-relaxed font-light italic">
                        "{m.message}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 light:border-zinc-200 mt-4 text-[10px] text-zinc-500 light:text-zinc-450 flex items-center justify-between">
                      <span>Submitted: {new Date(m.createdAt).toLocaleString()}</span>
                      <a href={`mailto:${m.email}`} className="text-neon-cyan hover:underline">Reply to Email &rarr;</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-zinc-900/10 rounded-2xl text-zinc-500 border border-dashed border-zinc-800">
                No general contact inquiries found.
              </div>
            )}
          </div>
        )}

        {/* 3. TAB: PORTFOLIO CRUD */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Project Entry Form (5 Cols) */}
            <div className="lg:col-span-5">
              <form onSubmit={handleFormSubmit} className="p-6 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800 light:border-zinc-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 light:border-zinc-200 pb-3">
                  <h3 className="font-display font-bold text-base text-white light:text-zinc-900">
                    {isEditing ? 'Modify Project' : 'Publish Project'}
                  </h3>
                  {isEditing && (
                    <button 
                      type="button" 
                      onClick={resetForm}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>

                {/* Form messages */}
                {formError && (
                  <div className="p-3 bg-neon-pink/15 text-neon-pink rounded-xl text-xs flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="p-3 bg-neon-emerald/20 text-neon-emerald rounded-xl text-xs flex items-center gap-1">
                    <Check className="w-4 h-4" /> <span>{formSuccess}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Project Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={projectForm.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Next.js Headless E-Commerce"
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-850 focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Client Name</label>
                    <input 
                      type="text" 
                      name="client"
                      value={projectForm.client}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. VogueThreads"
                      className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-850 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Metric Achieved</label>
                    <input 
                      type="text" 
                      name="metric"
                      value={projectForm.metric}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. +240% Sales"
                      className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-850 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Category Tag</label>
                    <select 
                      name="category"
                      value={projectForm.category}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-350 light:text-zinc-700 focus:outline-none focus:border-neon-cyan cursor-pointer"
                    >
                      <option>AI Solutions</option>
                      <option>Web Development</option>
                      <option>Mobile Apps</option>
                      <option>Custom Software</option>
                      <option>Automation</option>
                      <option>Branding</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Tech Stack (comma split)</label>
                    <input 
                      type="text" 
                      name="techInput"
                      value={projectForm.techInput}
                      onChange={handleInputChange}
                      placeholder="e.g. React, Next.js, API"
                      className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-850 focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Brief Summary</label>
                  <textarea 
                    name="desc"
                    value={projectForm.desc}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    placeholder="Short summary for case listings..."
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-850 focus:outline-none focus:border-neon-cyan resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Business Challenge</label>
                  <textarea 
                    name="challenge"
                    value={projectForm.challenge}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    placeholder="Describe client bottlenecks..."
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-850 focus:outline-none focus:border-neon-cyan resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 light:text-zinc-500">Our Solution</label>
                  <textarea 
                    name="solution"
                    value={projectForm.solution}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    placeholder="Describe architecture deployed..."
                    className="w-full bg-zinc-950 light:bg-white border border-zinc-850 light:border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-200 light:text-zinc-850 focus:outline-none focus:border-neon-cyan resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all mt-4"
                >
                  {isEditing ? 'Apply Changes' : 'Publish to live website'}
                </button>
              </form>
            </div>

            {/* Live Project List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <h3 className="font-display font-bold text-base text-white light:text-zinc-900">Live Projects</h3>
              {projects.map((p) => (
                <div key={p._id} className="p-4 bg-zinc-900/40 light:bg-zinc-200/40 border border-zinc-800 light:border-zinc-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-neon-cyan bg-zinc-950 light:bg-white border border-white/5 px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                    <h4 className="font-display font-bold text-sm text-white light:text-zinc-950 mt-1">{p.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold">{p.client} — {p.metric}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="p-2 rounded-lg bg-zinc-950 light:bg-white hover:bg-neon-purple/10 text-zinc-400 hover:text-neon-purple transition-all"
                      aria-label="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p._id)}
                      className="p-2 rounded-lg bg-zinc-950 light:bg-white hover:bg-neon-pink/10 text-zinc-400 hover:text-neon-pink transition-all"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
