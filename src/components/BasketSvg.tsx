import React from 'react';
import { AppleSvg } from './AppleSvg.tsx';

interface BasketSvgProps {
  index: number;
  appleCount: number;
  isReceiving?: boolean;
}

export const BasketSvg: React.FC<BasketSvgProps> = ({
  index,
  appleCount,
  isReceiving = false,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center p-3 rounded-2xl bg-amber-50/70 border-2 transition-all duration-200 ${
        isReceiving
          ? 'scale-105 border-[#F39A1E] shadow-lg ring-4 ring-[#F39A1E]/30 bg-amber-100/80'
          : 'border-[#F0DCC0] shadow-sm hover:shadow-md'
      }`}
      style={{ minWidth: '110px' }}
    >
      {/* Tên giỏ */}
      <div className="font-display font-bold text-sm text-[#2C7535] bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 mb-1">
        Giỏ {index}
      </div>

      {/* Vùng chứa táo trong giỏ */}
      <div className="relative w-24 h-28 flex flex-col items-center justify-end">
        {/* Quai giỏ */}
        <div className="absolute top-1 left-2 right-2 h-16 border-4 border-[#C88A4B] rounded-t-full pointer-events-none z-0" />

        {/* Táo xếp trong giỏ */}
        <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-wrap-reverse justify-center items-end gap-0.5 px-2 max-h-20 overflow-hidden pointer-events-none">
          {Array.from({ length: appleCount }).map((_, i) => (
            <AppleSvg
              key={i}
              size="xs"
              animateDrop={isReceiving && i === appleCount - 1}
              className="drop-shadow"
            />
          ))}
        </div>

        {/* Thân giỏ mây đan SVG */}
        <div className="relative z-20 w-full h-14">
          <svg
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            <defs>
              <linearGradient id={`basketGrad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2A669" />
                <stop offset="100%" stopColor="#A86A2D" />
              </linearGradient>
            </defs>

            {/* Vành miệng giỏ */}
            <ellipse cx="50" cy="12" rx="46" ry="8" fill="#F4C78B" stroke="#8C531F" strokeWidth="2" />

            {/* Đáy giỏ */}
            <path
              d="M 6 12 C 12 48, 22 56, 50 56 C 78 56, 88 48, 94 12 Z"
              fill={`url(#basketGrad-${index})`}
              stroke="#8C531F"
              strokeWidth="2"
            />

            {/* Các nan đan ngang dọc */}
            <path d="M 18 16 Q 50 24 82 16" stroke="#8C531F" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
            <path d="M 22 28 Q 50 36 78 28" stroke="#8C531F" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
            <path d="M 28 42 Q 50 48 72 42" stroke="#8C531F" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />

            {/* Nan chéo đan mây */}
            <path d="M 28 14 L 38 52" stroke="#683B13" strokeWidth="1" strokeOpacity="0.5" />
            <path d="M 50 14 L 50 54" stroke="#683B13" strokeWidth="1" strokeOpacity="0.5" />
            <path d="M 72 14 L 62 52" stroke="#683B13" strokeWidth="1" strokeOpacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Số lượng táo hiện có dưới giỏ */}
      <div className="mt-1 font-display font-bold text-base text-[#2F80D0] bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-200">
        {appleCount} quả
      </div>
    </div>
  );
};
