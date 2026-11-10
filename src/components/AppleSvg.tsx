import React from 'react';

interface AppleSvgProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isRemainder?: boolean;
  className?: string;
  animateDrop?: boolean;
  countLabel?: number;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-13 h-13',
  xl: 'w-16 h-16',
};

export const AppleSvg: React.FC<AppleSvgProps> = ({
  size = 'md',
  isRemainder = false,
  className = '',
  animateDrop = false,
  countLabel,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform ${sizeMap[size]} ${
        isRemainder ? 'animate-apple-wiggle drop-shadow-[0_0_8px_rgba(226,70,59,0.7)]' : ''
      } ${animateDrop ? 'animate-apple-drop' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          <radialGradient id="appleGradient" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FF7A6E" />
            <stop offset="45%" stopColor="#E2463B" />
            <stop offset="100%" stopColor="#A81D14" />
          </radialGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6BC248" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
        </defs>

        {/* Cuống táo */}
        <path
          d="M 50 25 C 50 12, 60 8, 64 6 C 63 12, 54 18, 52 26 Z"
          fill="#5D4037"
        />

        {/* Lá xanh xinh xắn */}
        <path
          d="M 52 18 C 66 10, 78 18, 76 28 C 64 28, 56 22, 52 18 Z"
          fill="url(#leafGrad)"
        />
        <path
          d="M 54 19 Q 65 20 74 27"
          stroke="#A5D6A7"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Thân quả táo mọng đỏ */}
        <path
          d="M 50 30 C 44 26, 26 26, 16 38 C 4 52, 10 78, 28 92 C 38 98, 48 94, 50 90 C 52 94, 62 98, 72 92 C 90 78, 96 52, 84 38 C 74 26, 56 26, 50 30 Z"
          fill="url(#appleGradient)"
        />

        {/* Đốm sáng phản quang bóng bẩy */}
        <ellipse
          cx="34"
          cy="44"
          rx="10"
          ry="6"
          transform="rotate(-30 34 44)"
          fill="#FFFFFF"
          fillOpacity="0.45"
        />
        <circle
          cx="28"
          cy="52"
          r="2.5"
          fill="#FFFFFF"
          fillOpacity="0.35"
        />
      </svg>

      {/* Nhãn số nếu có */}
      {countLabel !== undefined && (
        <span className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-white text-xs drop-shadow-md pt-2 pointer-events-none">
          {countLabel}
        </span>
      )}
    </div>
  );
};
