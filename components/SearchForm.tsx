
import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  isInitial: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, isInitial }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto transition-all duration-700 ${isInitial ? 'mt-0' : 'mt-4'}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-500 group-focus-within:text-[#ee2a7b] transition-colors">
            <i className="fas fa-search"></i>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search Instagram name or @username..."
            className="w-full pl-12 pr-32 py-4 bg-[#121212] border border-[#262626] rounded-2xl focus:outline-none focus:border-[#ee2a7b]/50 focus:ring-4 focus:ring-[#ee2a7b]/10 transition-all text-slate-100 placeholder:text-slate-600 shadow-xl"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bg-gradient-to-r from-[#ee2a7b] to-[#6228d7] text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : "Find ID"}
          </button>
        </div>
      </form>
      
      {isInitial && (
        <div className="mt-6 flex flex-wrap gap-4 justify-center animate-fadeIn">
           <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
             <span className="w-1.5 h-1.5 rounded-full bg-[#ee2a7b] animate-pulse"></span>
             Direct ID Extraction
           </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
