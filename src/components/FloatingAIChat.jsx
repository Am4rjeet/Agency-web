import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Trash2, Copy, Check, Minimize2, Maximize2, Sparkles 
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What services do you offer?",
  "How do you handle AI security?",
  "Tell me about your portfolio projects.",
  "What is your turnaround time?"
];

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeCitation, setActiveCitation] = useState(null);

  const messagesEndRef = useRef(null);

  // Initialize Session ID
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('chatbotSessionId');
      if (savedSession) {
        setSessionId(savedSession);
        fetchHistory(savedSession);
      } else {
        createSession();
      }
    } catch (e) {
      console.warn('LocalStorage blocked, using memory session', e);
      createSession();
    }
  }, []);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const createSession = () => {
    fetch('http://localhost:5000/api/v1/chat/sessions', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setSessionId(data.sessionId);
        try {
          localStorage.setItem('chatbotSessionId', data.sessionId);
        } catch (e) {}
      })
      .catch(err => console.error('Failed to create chat session', err));
  };

  const fetchHistory = (id) => {
    fetch(`http://localhost:5000/api/v1/chat/sessions/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {
        // If session not found in backend database, create a new one
        createSession();
      });
  };

  const handleClearChat = () => {
    if (!window.confirm('Clear all conversation messages?')) return;
    if (!sessionId) return;

    fetch(`http://localhost:5000/api/v1/chat/sessions/${sessionId}`, {
      method: 'DELETE'
    })
      .then(() => {
        setMessages([]);
        createSession();
      })
      .catch(err => console.error(err));
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Streaming query execution
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim() || loading) return;

    setInput('');
    setLoading(true);

    // 1. Add User Message
    const userMsg = { role: 'user', content: query.trim(), _id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);

    // 2. Add empty model response shell for streaming
    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg = { role: 'model', content: '', citations: [], _id: assistantMsgId };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const response = await fetch('http://localhost:5000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          sessionId,
          query: query.trim(),
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch streaming response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = '';
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          streamBuffer += decoder.decode(value, { stream: true });
          const parts = streamBuffer.split('\n\n');
          streamBuffer = parts.pop() || ''; // Keep fragment

          for (const part of parts) {
            const cleanPart = part.trim();
            if (cleanPart.startsWith('data: ')) {
              try {
                const payload = JSON.parse(cleanPart.slice(6));
                
                if (payload.text) {
                  // Append stream text to messages
                  setMessages(prev => prev.map(m => {
                    if (m._id === assistantMsgId) {
                      return { ...m, content: m.content + payload.text };
                    }
                    return m;
                  }));
                }
                
                if (payload.done) {
                  // Attach final citations
                  setMessages(prev => prev.map(m => {
                    if (m._id === assistantMsgId) {
                      return { 
                        ...m, 
                        citations: payload.citations || [] 
                      };
                    }
                    return m;
                  }));
                }
              } catch (e) {
                // Ignore parsing errors on heartbeats/incomplete fragments
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => {
        if (m._id === assistantMsgId) {
          return { 
            ...m, 
            content: 'I encountered an error connecting to the API server. Please check your network connection.' 
          };
        }
        return m;
      }));
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================================
     CLIENT-SIDE MARKDOWN PARSER
     ========================================================================== */
  const parseMarkdown = (content) => {
    if (!content) return null;
    
    // Split code blocks: ```js ... ```
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : 'text';
        const code = match ? match[2] : part.slice(3, -3);
        
        return (
          <div key={index} className="my-3 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[10px] leading-relaxed shadow-inner">
            <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5 text-[9px] text-zinc-500 border-b border-zinc-850">
              <span className="font-sans uppercase font-bold tracking-wider">{language || 'code'}</span>
              <button 
                onClick={() => handleCopyText(code, index)}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedId === index ? <Check className="w-3 h-3 text-neon-cyan" /> : 'Copy'}
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-zinc-300 max-w-full">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }

      // Inline codes `code`, Bold **bold**, and bullet points
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      
      const renderedInline = inlineParts.map((subPart, subIdx) => {
        if (subPart.startsWith('`') && subPart.endsWith('`')) {
          return (
            <code key={subIdx} className="bg-zinc-900 border border-zinc-850 px-1 py-0.5 rounded text-neon-purple font-mono text-[10px]">
              {subPart.slice(1, -1)}
            </code>
          );
        }

        const boldParts = subPart.split(/(\*\*[^*]+\*\*)/g);
        const renderedBold = boldParts.map((boldPart, boldIdx) => {
          if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
            return <strong key={boldIdx} className="font-extrabold text-white">{boldPart.slice(2, -2)}</strong>;
          }

          if (boldPart.includes('\n* ') || boldPart.includes('\n- ')) {
            const listItems = boldPart.split(/\n[\*-]\s/);
            return (
              <span key={boldIdx}>
                {listItems[0]}
                <ul className="list-disc pl-4 my-1.5 space-y-1">
                  {listItems.slice(1).map((li, liIdx) => (
                    <li key={liIdx} className="text-zinc-300 font-light">{li}</li>
                  ))}
                </ul>
              </span>
            );
          }

          return boldPart;
        });

        return <span key={subIdx}>{renderedBold}</span>;
      });

      return <span key={index}>{renderedInline}</span>;
    });
  };

  return (
    <>
      {/* 1. Floating Launcher Button (Positioned at bottom-24, stacked above WhatsApp) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            zIndex: 9999,
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
          }}
          className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:scale-110 active:scale-95 text-zinc-950 transition-all group"
          aria-label="Toggle AI Advisor"
        >
          <span className="font-sans font-black text-sm tracking-wider text-zinc-950 select-none">AI</span>
          
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-neon-cyan"></span>
          </span>
        </button>
      )}

      {/* 2. Chat Drawer Window */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            width: isMinimized ? '288px' : 'calc(100% - 48px)',
            height: isMinimized ? '56px' : '550px',
            maxWidth: isMinimized ? '288px' : '384px',
            maxHeight: isMinimized ? '56px' : '80vh',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
          }}
          className="glass-panel rounded-3xl border border-zinc-800 bg-zinc-950/90 text-zinc-100 transition-all overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-zinc-900 border-b border-zinc-850 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-neon-cyan rounded-full animate-pulse" />
              <div className="font-display font-bold text-xs uppercase tracking-wider text-white">Amarix AI Advisor</div>
            </div>
            
            <div className="flex items-center gap-2 text-zinc-450">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:text-white transition-colors cursor-pointer"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                className="hover:text-neon-pink transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body (Only rendered when maximized) */}
          {!isMinimized && (
            <>
              <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs font-light max-h-full">
                
                {/* Initial Welcome message */}
                {messages.length === 0 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-neon-cyan font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>How can I help you today?</span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed font-light">
                        I am your dedicated AI assistant. I can query our knowledge base to answer questions regarding our services, active portfolio cases, discovery timelines, and startup filings.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-555">Suggested Questions:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_QUESTIONS.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            className="text-left px-3 py-2 bg-zinc-900 hover:bg-zinc-850 hover:text-neon-cyan text-zinc-300 border border-zinc-850 rounded-xl transition-all cursor-pointer text-[11px]"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages list */}
                {messages.map((m, idx) => (
                  <div 
                    key={m._id || idx} 
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div className={`max-w-[85%] p-3.5 rounded-2xl relative group ${
                      m.role === 'user'
                        ? 'bg-zinc-900 text-white rounded-tr-none border border-zinc-800'
                        : 'bg-zinc-900/40 text-zinc-200 rounded-tl-none border border-zinc-900'
                    }`}>
                      {/* Copy response button for assistant message */}
                      {m.role !== 'user' && (
                        <button
                          onClick={() => handleCopyText(m.content, m._id || idx)}
                          className="absolute -top-2.5 -right-2.5 p-1.5 rounded-md bg-zinc-900 border border-zinc-850 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === (m._id || idx) ? <Check className="w-3 h-3 text-neon-cyan" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                        </button>
                      )}

                      <div className="leading-relaxed whitespace-pre-line">
                        {m.role === 'user' ? m.content : parseMarkdown(m.content)}
                      </div>
                    </div>

                    {/* Citations tags rendering omitted per user request */}
                  </div>
                ))}

                {/* Loading state indicator */}
                {loading && (
                  <div className="flex gap-1.5 items-center p-2 text-zinc-500 animate-pulse font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-spin" />
                    <span>Scrutinizing documents context...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Citations metadata modal */}
              {activeCitation && (
                <div className="mx-4 p-3 bg-zinc-900 border border-neon-cyan/20 rounded-xl relative flex flex-col space-y-1 shrink-0 animate-fade-in">
                  <button 
                    onClick={() => setActiveCitation(null)}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-white"
                  >
                    ×
                  </button>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-neon-cyan">Source Metadata</div>
                  <div className="text-[11px] font-bold text-white truncate">{activeCitation.title}</div>
                  <div className="text-[9px] text-zinc-400">
                    Category: <span className="font-semibold text-zinc-350">{activeCitation.source}</span>
                    {activeCitation.pageNumber > 0 && ` | Page: ${activeCitation.pageNumber}`}
                  </div>
                </div>
              )}

              {/* Input Form Footer */}
              <div className="p-3 bg-zinc-900 border-t border-zinc-850 flex items-center justify-between gap-2 shrink-0">
                <button
                  onClick={handleClearChat}
                  disabled={messages.length === 0}
                  className="p-2.5 rounded-xl hover:bg-neon-pink/10 text-zinc-500 hover:text-neon-pink transition-colors cursor-pointer disabled:opacity-50"
                  title="Clear conversation history"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>

                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex-grow flex items-center relative"
                >
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Amarix AI Advisor..."
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-neon-cyan"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neon-cyan hover:text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
