import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, Calendar, Mail, LogOut, Trash2, Edit2, Plus, X, Check, AlertCircle,
  UploadCloud, Activity, Database, RefreshCw, FileText, DownloadCloud, Sparkles, Clock, Server, Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings'); // 'projects' | 'bookings' | 'messages' | 'knowledge' | 'analytics'
  const [token, setToken] = useState('');
  
  // Data lists
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // RAG Knowledge Base States
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [kbStats, setKbStats] = useState({
    totalDocs: 0,
    totalChunks: 0,
    totalVectors: 0,
    storageUsed: '0 KB',
    embeddingModel: 'gemini-embedding-001'
  });
  
  // Upload States
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Reindex States
  const [reindexing, setReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState('');
  const [reindexError, setReindexError] = useState('');

  // Backup States
  const [backupFile, setBackupFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  // Analytics States
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

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

  // Load documents or analytics when tab changes
  useEffect(() => {
    if (!token) return;

    if (activeTab === 'knowledge') {
      fetchDocuments();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, token]);

  const fetchDocuments = () => {
    setDocLoading(true);
    fetch('http://localhost:5000/api/v1/documents', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load documents');
        return res.json();
      })
      .then(data => {
        setDocuments(data);
        
        let chunksSum = 0;
        let sizeSum = 0;
        data.forEach(d => {
          chunksSum += d.chunkCount || 0;
          sizeSum += d.sizeBytes || 0;
        });

        let sizeStr = '0.00 KB';
        if (sizeSum > 1024 * 1024) {
          sizeStr = `${(sizeSum / 1024 / 1024).toFixed(2)} MB`;
        } else if (sizeSum > 0) {
          sizeStr = `${(sizeSum / 1024).toFixed(2)} KB`;
        }

        setKbStats({
          totalDocs: data.length,
          totalChunks: chunksSum,
          totalVectors: chunksSum,
          storageUsed: sizeStr,
          embeddingModel: 'gemini-embedding-001'
        });
        setDocLoading(false);
      })
      .catch(err => {
        console.error(err);
        setDocLoading(false);
      });
  };

  const fetchAnalytics = () => {
    setAnalyticsLoading(true);
    fetch('http://localhost:5000/api/v1/analytics/daily', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setAnalyticsData(data);
        setAnalyticsLoading(false);
      })
      .catch(() => {
        setAnalyticsLoading(false);
      });
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('file', uploadFile);
    if (uploadTitle.trim()) {
      formData.append('title', uploadTitle.trim());
    }

    fetch('http://localhost:5000/api/v1/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'File upload failed');
        return data;
      })
      .then(() => {
        setUploadSuccess('File uploaded successfully! Indexing has started in the background.');
        setUploadFile(null);
        setUploadTitle('');
        setTimeout(fetchDocuments, 2000);
      })
      .catch(err => {
        setUploadError(err.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDeleteDocument = (id) => {
    if (!window.confirm('Delete this document and all its indexed vector chunks permanently?')) return;
    
    fetch(`http://localhost:5000/api/v1/documents/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message);
        }
        fetchDocuments();
      })
      .catch(err => alert(err.message || 'Failed to delete document'));
  };

  const handleReindexSite = () => {
    setReindexing(true);
    setReindexSuccess('');
    setReindexError('');

    fetch('http://localhost:5000/api/v1/reindex', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setReindexSuccess('Re-indexing pipeline launched! Content is updating in the background.');
        setTimeout(fetchDocuments, 3000);
      })
      .catch(err => {
        setReindexError(err.message || 'Failed to launch re-indexing');
      })
      .finally(() => {
        setReindexing(false);
      });
  };

  const handleExportBackup = () => {
    fetch('http://localhost:5000/api/v1/backup/export', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Backup creation failed');
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `knowledge_base_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => alert(err.message));
  };

  const handleImportBackup = (e) => {
    e.preventDefault();
    if (!backupFile) {
      setImportError('Select a backup JSON file first.');
      return;
    }

    if (!window.confirm('Importing this snapshot will clear all existing knowledge base documents, chunks, and vectors! Do you want to proceed?')) return;

    setImporting(true);
    setImportError('');
    setImportSuccess('');

    const formData = new FormData();
    formData.append('file', backupFile);

    fetch('http://localhost:5000/api/v1/backup/import', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Import failed');
        return data;
      })
      .then(() => {
        setImportSuccess('Knowledge base restored successfully!');
        setBackupFile(null);
        setTimeout(fetchDocuments, 2000);
      })
      .catch(err => {
        setImportError(err.message);
      })
      .finally(() => {
        setImporting(false);
      });
  };

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
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
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'knowledge'
              ? 'bg-gradient-to-r from-neon-purple to-neon-cyan border-none text-zinc-950 shadow-md'
              : 'bg-zinc-900/40 light:bg-zinc-200/50 border-zinc-850 light:border-zinc-300 text-zinc-400 light:text-zinc-600 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          Knowledge Base ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-neon-purple to-neon-cyan border-none text-zinc-950 shadow-md'
              : 'bg-zinc-900/40 light:bg-zinc-200/50 border-zinc-850 light:border-zinc-300 text-zinc-400 light:text-zinc-600 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          Analytics
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
        
        {/* 4. TAB: KNOWLEDGE BASE */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Total Documents</div>
                <div className="text-2xl font-black text-white">{kbStats.totalDocs}</div>
              </div>
              <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Total Chunks</div>
                <div className="text-2xl font-black text-white">{kbStats.totalChunks}</div>
              </div>
              <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Total Vectors</div>
                <div className="text-2xl font-black text-neon-cyan">{kbStats.totalVectors}</div>
              </div>
              <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Storage Consumed</div>
                <div className="text-2xl font-black text-white">{kbStats.storageUsed}</div>
              </div>
              <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1 col-span-2 lg:col-span-1">
                <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Embedding Model</div>
                <div className="text-xs font-bold text-neon-purple mt-1 truncate">{kbStats.embeddingModel}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Document upload / actions zone (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* File Upload card */}
                <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
                    <UploadCloud className="w-5 h-5 text-neon-cyan" />
                    Upload Knowledge File
                  </h3>
                  
                  {uploadError && (
                    <div className="p-3.5 bg-neon-pink/15 text-neon-pink border border-neon-pink/20 rounded-xl text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> <span>{uploadError}</span>
                    </div>
                  )}
                  {uploadSuccess && (
                    <div className="p-3.5 bg-neon-emerald/20 text-neon-emerald rounded-xl text-xs flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> <span>{uploadSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Display Title (Optional)</label>
                      <input 
                        type="text" 
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="e.g. Q3 Company Return Policy"
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-neon-cyan"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Document (.pdf, .docx, .txt, .md)</label>
                      <input 
                        type="file"
                        accept=".pdf,.docx,.txt,.md"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        required
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 cursor-pointer"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={uploading}
                      className="w-full py-3.5 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all disabled:opacity-50"
                    >
                      {uploading ? 'Processing & Vectorizing Chunks...' : 'Upload & Start Indexing'}
                    </button>
                  </form>
                </div>

                {/* Operations & Re-index trigger card */}
                <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
                    <RefreshCw className="w-5 h-5 text-neon-purple" />
                    Synchronize Site Data
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Aggregates hardcoded content (FAQs, Services catalog, Blog posts, About details) and pulls live Portfolio projects from MongoDB to re-index them inside the vector database.
                  </p>
                  
                  {reindexError && (
                    <div className="p-3 bg-neon-pink/15 text-neon-pink rounded-xl text-xs">
                      {reindexError}
                    </div>
                  )}
                  {reindexSuccess && (
                    <div className="p-3 bg-neon-emerald/20 text-neon-emerald rounded-xl text-xs">
                      {reindexSuccess}
                    </div>
                  )}

                  <button 
                    onClick={handleReindexSite}
                    disabled={reindexing}
                    className="w-full py-3.5 rounded-xl text-xs font-bold text-white border border-zinc-800 hover:bg-zinc-900 hover:border-neon-cyan transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 animate-pulse"
                  >
                    <RefreshCw className={`w-4 h-4 ${reindexing ? 'animate-spin' : ''}`} />
                    {reindexing ? 'Reindexing Website Data...' : 'Re-index Dynamic & Static Site Pages'}
                  </button>
                </div>

                {/* Backup Snapshots Panel (Feature 17) */}
                <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-4">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
                    <DownloadCloud className="w-5 h-5 text-neon-cyan" />
                    Backup & Recovery
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handleExportBackup}
                      className="py-2.5 rounded-xl text-[10px] font-bold text-white border border-zinc-850 hover:bg-zinc-900 transition-all flex items-center justify-center gap-1"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      Export Backup
                    </button>
                    
                    <label className="py-2.5 rounded-xl text-[10px] font-bold text-white border border-zinc-850 hover:bg-zinc-900 transition-all flex items-center justify-center gap-1 cursor-pointer">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Select Snapshot</span>
                      <input 
                        type="file"
                        accept=".json"
                        onChange={(e) => setBackupFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {backupFile && (
                    <form onSubmit={handleImportBackup} className="pt-2 border-t border-zinc-850 space-y-2">
                      <div className="text-[10px] text-zinc-400 font-semibold truncate">Selected: {backupFile.name}</div>
                      
                      {importError && <div className="p-2.5 bg-neon-pink/15 text-neon-pink rounded-lg text-[10px]">{importError}</div>}
                      {importSuccess && <div className="p-2.5 bg-neon-emerald/20 text-neon-emerald rounded-lg text-[10px]">{importSuccess}</div>}

                      <button 
                        type="submit"
                        disabled={importing}
                        className="w-full py-2 bg-neon-purple text-zinc-950 text-[10px] font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
                      >
                        {importing ? 'Restoring snapshots...' : 'Confirm Restore & Synchronize'}
                      </button>
                    </form>
                  )}
                </div>

              </div>

              {/* Document List Panel (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white">Indexed Documents & Wikis</h3>
                  <button 
                    onClick={fetchDocuments}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                    aria-label="Refresh Documents List"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {docLoading ? (
                  <div className="py-8 text-center text-zinc-500 animate-pulse text-xs font-semibold">
                    Fetching indexed knowledge document logs...
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-3 max-h-[78vh] overflow-y-auto pr-2">
                    {documents.map((d) => (
                      <div key={d._id} className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-2xl flex items-center justify-between gap-4 hover:border-zinc-800 transition-colors">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-full shrink-0">
                              {d.type}
                            </span>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5 ${
                              d.status === 'completed' ? 'bg-neon-emerald/15 text-neon-emerald' :
                              d.status === 'processing' ? 'bg-neon-cyan/15 text-neon-cyan animate-pulse' :
                              d.status === 'failed' ? 'bg-neon-pink/15 text-neon-pink' :
                              'bg-zinc-800 text-zinc-400'
                            }`}>
                              {d.status}
                            </span>
                          </div>
                          
                          <h4 className="font-display font-bold text-sm text-white truncate pr-2">{d.title}</h4>
                          
                          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                            {d.type === 'file' && <span>{(d.sizeBytes / 1024).toFixed(1)} KB</span>}
                            <span>{d.chunkCount || 0} chunks</span>
                            <span>Indexed: {new Date(d.lastIndexedAt || d.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {d.errorMessage && (
                            <p className="text-[10px] text-neon-pink italic truncate max-w-md">Err: {d.errorMessage}</p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleDeleteDocument(d._id)}
                          className="p-2 rounded-lg bg-zinc-950 hover:bg-neon-pink/15 text-zinc-500 hover:text-neon-pink transition-all shrink-0"
                          aria-label="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-zinc-900/10 rounded-2xl text-zinc-500 border border-dashed border-zinc-850 text-xs">
                    No documents currently loaded. Index files or site pages above.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* 5. TAB: SYSTEM ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-lg text-white">System Observability & Latency Analytics</h2>

            {analyticsLoading ? (
              <div className="py-12 text-center text-zinc-500 animate-pulse text-xs font-semibold">
                Aggregating real-time telemetry metrics...
              </div>
            ) : analyticsData ? (
              <div className="space-y-6">
                
                {/* Stats widgets */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                    <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Total AI Requests</div>
                    <div className="text-3xl font-black text-white">{analyticsData.totalRequests}</div>
                  </div>
                  <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                    <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Active Conversations</div>
                    <div className="text-3xl font-black text-white">{analyticsData.activeSessions}</div>
                  </div>
                  <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                    <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Avg Latency Time</div>
                    <div className="text-3xl font-black text-neon-cyan">{analyticsData.avgResponseTime} ms</div>
                  </div>
                  <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-1">
                    <div className="text-zinc-550 text-[10px] font-bold uppercase tracking-wider">Failed Requests</div>
                    <div className="text-3xl font-black text-neon-pink">{analyticsData.failedRequests}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Latency Breakdown Bar Chart (7 cols) */}
                  <div className="lg:col-span-7 p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
                        <Clock className="w-5 h-5 text-neon-cyan" />
                        Execution Latency Breakdown
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        Measures the time spent across the critical checkpoints of the RAG querying loop.
                      </p>
                    </div>

                    <div className="space-y-4 py-4">
                      {/* Embedding */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-400">Embedding Vectorization</span>
                          <span className="text-white font-bold">{analyticsData.breakdown?.avgEmbedding || 0} ms</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-neon-purple rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, ((analyticsData.breakdown?.avgEmbedding || 0) / (analyticsData.avgResponseTime || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Vector Search */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-400">Vector Search Retrieval</span>
                          <span className="text-white font-bold">{analyticsData.breakdown?.avgSearch || 0} ms</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-neon-cyan rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, ((analyticsData.breakdown?.avgSearch || 0) / (analyticsData.avgResponseTime || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* LLM Inference */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-zinc-400">LLM Generation Time</span>
                          <span className="text-white font-bold">{analyticsData.breakdown?.avgLlm || 0} ms</span>
                        </div>
                        <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, ((analyticsData.breakdown?.avgLlm || 0) / (analyticsData.avgResponseTime || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-550 border-t border-zinc-850 pt-3">
                      * Values represent moving average counts over recent telemetry queries.
                    </div>
                  </div>

                  {/* Provider Diagnostics status (5 cols) */}
                  <div className="lg:col-span-5 p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
                        <Server className="w-5 h-5 text-neon-purple" />
                        Infrastructure Health
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        Status diagnostics verifying credentials and endpoint connection links.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-900">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-neon-cyan" />
                          <span className="text-xs font-bold text-zinc-350">Vector Database</span>
                        </div>
                        <span className="text-[10px] font-bold text-neon-emerald bg-neon-emerald/10 border border-neon-emerald/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Ready (Qdrant)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-900">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-neon-purple" />
                          <span className="text-xs font-bold text-zinc-350">AI LLM Provider</span>
                        </div>
                        <span className="text-[10px] font-bold text-neon-emerald bg-neon-emerald/10 border border-neon-emerald/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Online (Gemini)
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-900">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-350">Storage Allocation</span>
                        </div>
                        <span className="text-[10px] font-bold text-white bg-zinc-800 px-2.5 py-0.5 rounded-full uppercase">
                          {analyticsData.storageUsage || '0.0 MB'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider text-center">
                      Security Protection Active: rate-limiting & helmet
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="p-8 text-center bg-zinc-900/10 rounded-2xl text-zinc-500 border border-dashed border-zinc-800 text-xs">
                No telemetry analytics reports found. Run some chat interactions first.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
