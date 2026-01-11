
import * as React from 'react';

export const IsabelleAvatar: React.FC = () => {
  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
       {/* Background Circle */}
      <div className="absolute inset-0 bg-ac-yellow rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
        {/* Simplified Isabelle Face SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full transform translate-y-1">
          {/* Fur */}
          <path d="M20,40 Q10,10 50,10 Q90,10 80,40 Q95,50 85,80 Q50,100 15,80 Q5,50 20,40" fill="#F2D06B" />
          {/* Hair puff */}
          <circle cx="50" cy="15" r="12" fill="#F2D06B" />
          <path d="M45,5 L55,5 L55,20 L45,20 Z" fill="#E74C3C" /> {/* Hair tie */}
          {/* Ears */}
          <path d="M20,40 Q10,60 25,70" fill="#F2D06B" stroke="#DAA520" strokeWidth="2"/>
          <path d="M80,40 Q90,60 75,70" fill="#F2D06B" stroke="#DAA520" strokeWidth="2"/>
          {/* Face Area */}
          <path d="M30,45 Q50,35 70,45 Q75,70 50,85 Q25,70 30,45" fill="#FFF8E7" />
          {/* Eyes */}
          <circle cx="40" cy="55" r="3" fill="#3E2723" />
          <circle cx="60" cy="55" r="3" fill="#3E2723" />
          {/* Nose */}
          <circle cx="50" cy="62" r="2.5" fill="#3E2723" />
          {/* Mouth */}
          <path d="M45,68 Q50,72 55,68" fill="none" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
          {/* Blush */}
          <circle cx="35" cy="62" r="3" fill="#F4A261" opacity="0.6" />
          <circle cx="65" cy="62" r="3" fill="#F4A261" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute -bottom-2 -right-2 bg-ac-blue text-white p-1 rounded-full border-2 border-white shadow-sm z-10">
        <span className="text-xs font-bold px-1">Staff</span>
      </div>
    </div>
  );
};
