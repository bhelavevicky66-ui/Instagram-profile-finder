
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-transparent">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-lg flex items-center justify-center shadow-lg">
          <i className="fab fa-instagram text-white text-xl"></i>
        </div>
        <span className="font-bold text-lg tracking-tight">Insta<span className="text-[#ee2a7b]">Finder</span></span>
      </div>
      <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
        <span className="bg-slate-800/50 px-2 py-1 rounded">Real-time Search</span>
      </div>
    </header>
  );
};

export default Header;
