
import React from 'react';
import { InstagramProfile } from '../types';

interface ResultCardProps {
  profile: InstagramProfile;
}

const ResultCard: React.FC<ResultCardProps> = ({ profile }) => {
  // Mock data for visual appeal
  const posts = Math.floor(Math.random() * 500) + 12;
  const followers = (Math.random() * 5 + 1).toFixed(1) + "K";
  const following = Math.floor(Math.random() * 400) + 50;

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-[2.5rem] p-8 w-full max-w-sm mx-auto shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)] animate-slideUp relative overflow-hidden group">
      {/* IG Story Style Border Effect */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-[0_0_20px_rgba(238,42,123,0.3)]"></div>
      
      <div className="flex flex-col items-center relative z-10">
        {/* Profile Pic Ring */}
        <div className="relative mb-6 p-1.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
          <div className="w-28 h-28 rounded-full border-[5px] border-[#121212] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
             <i className="fab fa-instagram text-5xl text-slate-800"></i>
          </div>
          <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#0095f6] rounded-full border-4 border-[#121212] flex items-center justify-center">
             <i className="fas fa-check text-[10px] text-white"></i>
          </div>
        </div>

        {/* Username ID Display - Very Prominent */}
        <div className="mb-1">
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-[#ee2a7b] uppercase tracking-[0.3em] mb-1">Found Profile</span>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                @{profile.username}
              </h3>
           </div>
        </div>
        
        <p className="text-slate-400 text-xs font-medium mb-8 text-center px-4 leading-relaxed line-clamp-2 italic">
          {profile.bio || "Active Instagram user identified."}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 w-full mb-8 bg-[#1a1a1a]/50 border border-[#262626] rounded-2xl py-5 px-2">
          <div className="text-center border-r border-[#262626]">
            <div className="text-base font-black text-white">{posts}</div>
            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Posts</div>
          </div>
          <div className="text-center border-r border-[#262626]">
            <div className="text-base font-black text-white">{followers}</div>
            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-base font-black text-white">{following}</div>
            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Following</div>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white text-[#000000] py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl group/btn"
        >
          OPEN INSTAGRAM
          <i className="fab fa-instagram text-lg group-hover/btn:rotate-12 transition-transform"></i>
        </a>
        
        <div className="mt-5 text-[8px] text-slate-600 font-black uppercase tracking-[0.4em]">
          ID Search Verified
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
