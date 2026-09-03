import React, { useEffect, useState } from 'react';

interface MonsterMascotProps {
  size?: 'sm' | 'md' | 'lg';
  stage?: 'bloated' | 'shrinking' | 'small';
  unwantedCount?: number;
}

export const MonsterMascot: React.FC<MonsterMascotProps> = ({ size = 'md', stage = 'small', unwantedCount = 0 }) => {
  const [currentStage, setCurrentStage] = useState(stage);

  useEffect(() => {
    if (stage === 'shrinking') {
      setCurrentStage('bloated');
      const timer = setTimeout(() => {
        setCurrentStage('small');
      }, 100); // Trigger CSS transition almost immediately for the shrink effect
      return () => clearTimeout(timer);
    } else {
      setCurrentStage(stage);
    }
  }, [stage]);

  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }[size];

  // Base classes for the monster body transition
  const baseScale = currentStage === 'bloated' ? 'scale-125' : 'scale-100';
  const opacityClutter = currentStage === 'bloated' ? 'opacity-100 scale-100' : 'opacity-0 scale-50 translate-y-[-20px]';

  return (
    <div className={`relative inline-flex items-center justify-center ${dimensions}`}>
      {/* Background Clutter - Only visible in bloated state, animated away when shrinking */}
      {unwantedCount > 0 && (
        <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] @media(prefers-reduced-motion:reduce){duration-0} ${opacityClutter}`}>
          {/* Simulated clutter blocks */}
          <div className="absolute top-0 left-0 w-8 h-6 bg-neutral-800 rounded border border-neutral-700 transform -rotate-12 translate-x-[-10px] translate-y-[-10px] shadow-lg flex items-center justify-center opacity-60">
            <div className="w-4 h-1 bg-neutral-600 rounded"></div>
          </div>
          <div className="absolute top-2 right-0 w-10 h-8 bg-neutral-800 rounded-lg border border-neutral-700 transform rotate-12 translate-x-[15px] translate-y-[-5px] shadow-lg flex items-center justify-center opacity-50">
             <div className="w-5 h-1 bg-neutral-600 rounded"></div>
          </div>
          <div className="absolute bottom-4 left-[-10px] w-6 h-6 bg-neutral-800 rounded-full border border-neutral-700 shadow-lg opacity-40"></div>
          <div className="absolute bottom-0 right-[-15px] w-12 h-10 bg-neutral-800 rounded border border-neutral-700 transform -rotate-6 shadow-lg flex items-center justify-center opacity-70">
             <div className="w-6 h-1 bg-neutral-600 rounded"></div>
          </div>
        </div>
      )}

      {/* Monster SVG Container */}
      <div className={`relative z-10 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] @media(prefers-reduced-motion:reduce){duration-0} ${baseScale}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible drop-shadow-xl">
          {/* Side Arms */}
          <path d="M15 45 C5 40, 5 60, 15 55" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
          <path d="M85 45 C95 40, 95 60, 85 55" stroke="#FF5722" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />

          {/* Two Feet */}
          <rect x="30" y="85" width="12" height="10" rx="4" fill="#9333ea" />
          <rect x="58" y="85" width="12" height="10" rx="4" fill="#9333ea" />

          {/* Chunky Square Body with slightly uneven corners */}
          <path d="M20 25 C30 18, 70 22, 80 25 C85 40, 82 70, 80 80 C70 85, 30 88, 20 80 C18 70, 15 40, 20 25 Z" fill="#FF5722" />
          <path d="M20 25 C30 18, 70 22, 80 25 C85 40, 82 70, 80 80 C70 85, 30 88, 20 80 C18 70, 15 40, 20 25 Z" fill="url(#grad)" />

          {/* Horns / Blocky Ears */}
          <rect x="25" y="10" width="10" height="15" rx="2" fill="#00FF9D" transform="rotate(-15 30 15)" />
          <rect x="65" y="10" width="10" height="15" rx="2" fill="#00FF9D" transform="rotate(15 70 15)" />

          {/* Expressive Eyes */}
          <ellipse cx="35" cy="45" rx="8" ry="10" fill="white" />
          <ellipse cx="65" cy="45" rx="8" ry="10" fill="white" />
          <circle cx="35" cy="46" r="4" fill="#171717" className="animate-bounce" style={{ animationDuration: '2s' }} />
          <circle cx="65" cy="46" r="4" fill="#171717" className="animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.1s' }} />

          {/* Toothy Mouth */}
          <path d="M35 65 Q50 75 65 65" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M40 67 L45 72 L50 68 L55 72 L60 67" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />

          <defs>
            <linearGradient id="grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF5722" stopOpacity="0" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
