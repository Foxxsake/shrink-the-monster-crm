import React from 'react';

interface MonsterMascotProps {
  size?: 'sm' | 'md' | 'lg';
  shrunk?: boolean;
}

export const MonsterMascot: React.FC<MonsterMascotProps> = ({ size = 'md', shrunk = false }) => {
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center transition-all duration-500 transform ${shrunk ? 'scale-75' : 'scale-100'}`}>
      <div className={`${dimensions} bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 rounded-3xl p-1 shadow-lg flex items-center justify-center animate-pulse`}>
        <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
          {/* Monster Horns */}
          <div className="absolute top-1 left-3 w-3 h-4 bg-amber-400 rounded-t-full transform -rotate-12" />
          <div className="absolute top-1 right-3 w-3 h-4 bg-amber-400 rounded-t-full transform rotate-12" />

          {/* Eyes */}
          <div className="flex gap-2 items-center z-10">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" />
            </div>
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce delay-100" />
            </div>
          </div>

          {/* Friendly Mouth */}
          <div className="absolute bottom-3 w-6 h-2 border-b-2 border-white rounded-full" />
        </div>
      </div>
    </div>
  );
};
