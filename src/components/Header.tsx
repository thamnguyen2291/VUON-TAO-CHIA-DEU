import React from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, HelpCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { AppleSvg } from './AppleSvg.tsx';
import { sound } from '../utils/audio.ts';

export type Team = 'blue' | 'orange';

interface HeaderProps {
  timeRemaining: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  scoreBlue: number;
  scoreOrange: number;
  currentTeam: Team;
  onSelectTeam: (team: Team) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  timeRemaining,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  scoreBlue,
  scoreOrange,
  currentTeam,
  onSelectTeam,
  isSoundOn,
  onToggleSound,
  onOpenHelp,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = timeRemaining <= 60 && timeRemaining > 0;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b-2 border-[#F0DCC0] shadow-sm sticky top-0 z-40 px-3 py-2 md:px-6 md:py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo và Tiêu đề */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="bg-red-50 p-1.5 rounded-2xl border border-red-200 shadow-sm flex items-center justify-center">
            <AppleSvg size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-[#2C7535] leading-tight tracking-tight">
                Vườn Táo Chia Đều
              </h1>
              <span className="hidden lg:inline-block bg-[#3F9B4A]/15 text-[#2C7535] text-xs font-bold px-2 py-0.5 rounded-full border border-[#3F9B4A]/30">
                Toán 3
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold flex items-center gap-1.5">
              <span>Bài 25: Phép chia hết, phép chia có dư</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                Tuần 11
              </span>
            </p>
          </div>
        </div>

        {/* Cụm Đồng hồ + Bảng điểm + Nút tiện ích */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4 ml-auto">
          {/* Đồng hồ đếm ngược 10:00 */}
          <div className="flex items-center gap-1.5 bg-amber-50/90 border-2 border-amber-200 px-2.5 py-1 rounded-xl shadow-xs">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block -mb-1">
                Thời gian
              </span>
              <span
                className={`font-display text-lg sm:text-xl font-black tabular-nums ${
                  isUrgent ? 'text-red-600 animate-pulse' : 'text-slate-800'
                }`}
              >
                {timeFormatted}
              </span>
            </div>
            <div className="flex items-center gap-1 border-l border-amber-200 pl-1.5 ml-0.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleTimer();
                }}
                className={`p-1.5 rounded-lg font-bold text-xs transition-colors ${
                  isTimerRunning
                    ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                    : 'bg-[#3F9B4A] text-white hover:bg-[#2C7535]'
                }`}
                title={isTimerRunning ? 'Tạm dừng đồng hồ' : 'Bắt đầu đếm ngược'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onResetTimer();
                }}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-amber-200/60 transition-colors"
                title="Đặt lại 10 phút"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bảng điểm 2 Đội: Bấm để chọn lượt */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Đội Xanh */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onSelectTeam('blue');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                currentTeam === 'blue'
                  ? 'bg-blue-50 border-[#2F80D0] ring-4 ring-blue-300/60 shadow-md scale-102 font-bold'
                  : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50/50 opacity-80'
              }`}
              title="Bấm để chọn lượt Đội Xanh"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#2F80D0]" />
              <div className="text-left">
                <span className="text-[11px] sm:text-xs text-blue-900 font-bold block leading-none">
                  Đội Xanh
                </span>
                <span className="font-display font-black text-base sm:text-lg text-[#2F80D0] leading-none">
                  {scoreBlue} <span className="text-xs font-normal">đ</span>
                </span>
              </div>
            </button>

            {/* Đội Cam */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onSelectTeam('orange');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                currentTeam === 'orange'
                  ? 'bg-orange-50 border-[#F07B12] ring-4 ring-orange-300/60 shadow-md scale-102 font-bold'
                  : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-50/50 opacity-80'
              }`}
              title="Bấm để chọn lượt Đội Cam"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#F07B12]" />
              <div className="text-left">
                <span className="text-[11px] sm:text-xs text-orange-900 font-bold block leading-none">
                  Đội Cam
                </span>
                <span className="font-display font-black text-base sm:text-lg text-[#F07B12] leading-none">
                  {scoreOrange} <span className="text-xs font-normal">đ</span>
                </span>
              </div>
            </button>
          </div>

          {/* Các nút công cụ: Hướng dẫn, Âm thanh, Toàn màn hình */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenHelp();
              }}
              className="p-2 rounded-xl bg-emerald-50 text-[#2C7535] hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="Xem hướng dẫn sử dụng (10 phút)"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                isSoundOn
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
              title={isSoundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:flex p-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình (trình chiếu)'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
