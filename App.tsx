
import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultCard from './components/ResultCard';
import SkeletonLoader from './components/SkeletonLoader';
import { performInstaSearch } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    query: '',
    isLoading: false,
    result: null,
    error: null,
  });

  const handleSearch = async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true, query, error: null, result: null }));
    
    try {
      const result = await performInstaSearch(query);
      setState(prev => ({ ...prev, isLoading: false, result }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "ID not found." 
      }));
    }
  };

  const isInitial = !state.result && !state.isLoading && !state.error;

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col items-center selection:bg-[#ee2a7b]/30 font-sans">
      <Header />
      
      {/* Branding Section */}
      <div className={`w-full flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${isInitial ? 'mt-[18vh]' : 'mt-10'}`}>
        {isInitial && (
          <div className="flex flex-col items-center mb-10 animate-fadeIn">
             <div className="w-20 h-20 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 scale-110">
                <i className="fab fa-instagram text-white text-4xl"></i>
             </div>
             <h2 className="text-4xl font-black tracking-tight text-center">
                Insta<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ee2a7b] to-[#6228d7]">ID Finder</span>
             </h2>
             <p className="text-slate-500 text-sm mt-2 font-medium">Identify any Instagram profile in seconds</p>
          </div>
        )}

        <SearchForm onSearch={handleSearch} isLoading={state.isLoading} isInitial={isInitial} />
      </div>

      {/* Content Area */}
      <main className="w-full max-w-2xl px-4 mt-12 pb-24">
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-center mb-6 animate-fadeIn text-sm font-bold">
            <i className="fas fa-ghost mr-2"></i>
            {state.error}
          </div>
        )}

        {state.isLoading ? (
          <div className="mt-8">
             <div className="text-center mb-8">
                <p className="text-[#ee2a7b] text-xs font-black uppercase tracking-[0.2em] animate-pulse">Scanning Instagram Network...</p>
             </div>
             <SkeletonLoader />
          </div>
        ) : (
          state.result && state.result.profiles.length > 0 && (
            <div className="animate-slideUp flex flex-col items-center gap-8">
              <ResultCard profile={state.result.profiles[0]} />
              
              <div className="w-full max-w-sm bg-[#121212]/60 border border-[#262626] rounded-2xl p-5 group hover:border-[#ee2a7b]/30 transition-all">
                 <div className="flex items-center gap-2 mb-2 text-[#ee2a7b] text-[10px] uppercase font-black tracking-widest">
                    <i className="fas fa-magic"></i>
                    <span>AI Brain</span>
                 </div>
                 <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                   {state.result.text.slice(0, 200)}...
                 </p>
              </div>
            </div>
          )
        )}
      </main>

      {isInitial && (
        <footer className="fixed bottom-10 text-slate-800 text-[9px] uppercase tracking-[0.8em] font-black pointer-events-none">
          Deep Search Active
        </footer>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
