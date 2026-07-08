import React, { useState, useEffect } from 'react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip after 4 seconds to catch user attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {showTooltip && (
        <div className="mb-3 max-w-xs p-4 bg-zinc-900/90 border border-zinc-800 text-zinc-100 text-sm rounded-2xl shadow-2xl glass-panel relative animate-bounce pointer-events-auto">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-3 text-xs text-zinc-400 hover:text-zinc-200"
          >
            ×
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="font-semibold text-xs text-neon-cyan">Amarix Advisor</span>
          </div>
          <p className="mt-1.5 text-xs text-zinc-300">
            Let's grow! 🚀 Send a message to chat about custom AI automation or digital campaigns for your business.
          </p>
        </div>
      )}
      
      <a
        href="https://wa.me/918000294846?text=Hello%20Amarix%20Solution,%20I'm%20interested%20in%20your%20services!"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShowTooltip(false)}
        className="pointer-events-auto w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="Contact us on WhatsApp"
      >
        <svg 
          className="w-7 h-7 fill-current transition-transform group-hover:rotate-12" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.864-9.852.002-2.632-1.02-5.107-2.882-6.97C16.39 1.946 13.918.922 11.29.922 5.856.922 1.431 5.341 1.428 10.776c-.001 1.517.399 2.997 1.157 4.316l-.986 3.6 3.69-.968c1.3.714 2.658 1.085 4.358 1.086zm10.767-6.84c-.29-.146-1.72-.85-1.986-.948-.267-.099-.462-.146-.656.146-.194.291-.75.948-.918 1.14-.168.193-.337.217-.628.072-.29-.146-1.227-.453-2.338-1.444-.864-.771-1.448-1.724-1.617-2.015-.17-.29-.018-.448.128-.592.13-.13.29-.34.436-.509.145-.17.194-.291.291-.485.097-.194.049-.364-.025-.509-.072-.146-.656-1.58-.9-2.167-.236-.57-.478-.49-.656-.5-.177-.008-.378-.01-.58-.01-.202 0-.531.075-.81.378-.278.303-1.062 1.037-1.062 2.529 0 1.492 1.084 2.932 1.233 3.131.149.199 2.133 3.256 5.166 4.568.72.312 1.282.499 1.72.638.723.23 1.382.198 1.9.12.579-.087 1.72-.703 1.964-1.384.243-.68.243-1.262.17-1.384-.073-.12-.267-.193-.559-.339z" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
      </a>
    </div>
  );
}
