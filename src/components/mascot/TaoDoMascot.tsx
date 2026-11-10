import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { narrator } from '../../utils/narration.ts';
import { sound } from '../../utils/audio.ts';

interface TaoDoMascotProps {
  transcript: string;
  stepId: string;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  className?: string;
  autoSpoken?: boolean;
}

export const TaoDoMascot: React.FC<TaoDoMascotProps> = ({
  transcript,
  stepId,
  isAudioOn,
  onToggleAudio,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const handlePlayVoice = () => {
    sound.playClick();
    setIsPlaying(true);
    narrator.speak(stepId, transcript, () => {
      setIsPlaying(false);
    });
  };

  return (
    <div
      className={`bg-white/95 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border-2 border-amber-300 shadow-md flex items-start gap-3 sm:gap-4 transition-all ${className}`}
    >
      {/* Nhân vật Táo Đỏ SVG hoạt hình dễ thương */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 ${isPlaying ? 'animate-bounce' : 'animate-apple-wiggle'}`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md select-none"
          >
            <defs>
              <radialGradient id="taoDoBody" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF7D71" />
                <stop offset="50%" stopColor="#E2463B" />
                <stop offset="100%" stopColor="#A81D14" />
              </radialGradient>
              <linearGradient id="taoDoLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6BC248" />
                <stop offset="100%" stopColor="#2E7D32" />
              </linearGradient>
            </defs>

            {/* Cuống */}
            <path d="M 50 24 C 50 12, 58 8, 62 6 C 61 12, 54 18, 52 25 Z" fill="#5D4037" />

            {/* Lá */}
            <path d="M 52 16 C 66 8, 76 16, 74 26 C 62 26, 56 20, 52 16 Z" fill="url(#taoDoLeaf)" />

            {/* Thân quả táo */}
            <path
              d="M 50 28 C 44 24, 26 24, 16 36 C 4 50, 10 76, 28 90 C 38 96, 48 92, 50 88 C 52 92, 62 96, 72 90 C 90 76, 96 50, 84 36 C 74 24, 56 24, 50 28 Z"
              fill="url(#taoDoBody)"
            />

            {/* Đốm sáng trên đầu */}
            <ellipse cx="32" cy="40" rx="9" ry="5" transform="rotate(-30 32 40)" fill="#FFFFFF" fillOpacity="0.4" />

            {/* Đôi mắt tròn to long lanh */}
            <circle cx="38" cy="52" r="5" fill="#1E293B" />
            <circle cx="62" cy="52" r="5" fill="#1E293B" />
            <circle cx="36.5" cy="50" r="1.8" fill="#FFFFFF" />
            <circle cx="60.5" cy="50" r="1.8" fill="#FFFFFF" />

            {/* Má hồng hào */}
            <circle cx="28" cy="59" r="4.5" fill="#FFB4A2" fillOpacity="0.85" />
            <circle cx="72" cy="59" r="4.5" fill="#FFB4A2" fillOpacity="0.85" />

            {/* Miệng cười tươi */}
            <path d="M 43 62 Q 50 71 57 62" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        <span className="font-display font-black text-xs text-[#E2463B] mt-1 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
          Táo Đỏ
        </span>
      </div>

      {/* Bong bóng lời thoại + nút tương tác âm thanh */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div className="relative bg-amber-50/90 rounded-2xl p-3 border border-amber-200 text-xs sm:text-sm text-slate-800 font-bold leading-relaxed shadow-2xs">
          {/* Mũi tên chỉ vào Táo Đỏ */}
          <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-200" />
          <div className="absolute top-4 -left-1.5 w-0 h-0 border-t-7 border-t-transparent border-b-7 border-b-transparent border-r-7 border-r-amber-50" />

          <p className="font-display text-[#2C7535] text-xs font-black uppercase tracking-wider mb-0.5">
            Táo Đỏ hướng dẫn:
          </p>
          <p>{transcript}</p>
        </div>

        {/* Thanh điều khiển lời thoại */}
        <div className="flex items-center gap-2 self-start">
          <button
            type="button"
            onClick={handlePlayVoice}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-display font-extrabold transition-all cursor-pointer shadow-xs btn-press ${
              isPlaying
                ? 'bg-amber-400 text-amber-950 scale-102 ring-2 ring-amber-300'
                : 'bg-[#2F80D0] hover:bg-[#2069b2] text-white'
            }`}
            title="Bấm để nghe Táo Đỏ thuyết minh giọng đọc"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'Đang đọc...' : '🔊 Nghe Táo Đỏ đọc'}</span>
          </button>

          <button
            type="button"
            onClick={handlePlayVoice}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Nghe lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleAudio}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isAudioOn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={isAudioOn ? 'Tắt âm thanh thuyết minh' : 'Bật âm thanh'}
          >
            {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
