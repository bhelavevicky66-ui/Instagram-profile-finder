
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4 max-w-2xl mx-auto px-4 mt-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex gap-4">
          <div className="w-12 h-12 bg-[#0d1117] rounded-lg border border-[#30363d]"></div>
          <div className="flex-grow space-y-3">
            <div className="h-4 bg-[#21262d] rounded w-1/3"></div>
            <div className="h-3 bg-[#21262d] rounded w-1/2"></div>
            <div className="h-8 bg-[#21262d] rounded w-1/4 mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
