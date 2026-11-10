import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, HelpCircle, Play, Pause, RotateCcw, ArrowLeft, Settings, AlertTriangle } from 'lucide-react';
import { AppleSvg } from './AppleSvg.tsx';
import { sound } from '../utils/audio.ts';
import { GroupInfo } from '../types/classroom.ts';

interface HeaderProps {
  timeRemaining: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  groups: GroupInfo[];
  activeGroupId: string;
  onSelectGroup: (groupId: string) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onOpenSetup: () => void;
  onBackToModeSelect?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  timeRemaining,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  groups,
  activeGroupId,
  onSelectGroup,
  isSoundOn,
  onToggleSound,
  onOpenHelp,
  onOpenSetup,
  onBackToModeSelect,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfirmSetup, setShowConfirmSetup] = useState(false);

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
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b-2 border-[#F0DCC0] shadow-sm sticky top-0 z-40 px-3 py-2 md:px-6 md:py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Logo và Tiêu đề */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onBackToModeSelect && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onBackToModeSelect();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-display font-bold text-xs transition-colors cursor-pointer mr-0.5"
                title="Quay lại chọn chế độ"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chọn chế độ</span>
              </button>
            )}

            <div className="bg-red-50 p-1.5 rounded-2xl border border-red-200 shadow-sm flex items-center justify-center">
              <AppleSvg size="sm" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-lg sm:text-2xl text-[#2C7535] leading-tight tracking-tight">
                  Vườn Táo Chia Đều
                </h1>
                <span className="hidden lg:inline-block bg-[#3F9B4A]/15 text-[#2C7535] text-xs font-bold px-2 py-0.5 rounded-full border border-[#3F9B4A]/30">
                  Toán 3
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                <span>Bài 25: Phép chia hết, phép chia có dư</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  Tuần 11
                </span>
              </p>
            </div>
          </div>

          {/* Cụm Đồng hồ + Bảng điểm các nhóm + Nút công cụ */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 ml-auto">
            {/* Đồng hồ đếm ngược 10:00 */}
            <div className="flex items-center gap-1.5 bg-amber-50/90 border-2 border-amber-200 px-2.5 py-1 rounded-xl shadow-xs">
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider block -mb-1">
                  Thời gian
                </span>
                <span
                  className={`font-display text-base sm:text-lg font-black tabular-nums ${
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
                  className={`p-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
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
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-amber-200/60 transition-colors cursor-pointer"
                  title="Đặt lại 10 phút"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* BẢNG ĐIỂM NHIỀU NHÓM (2 ĐẾN 6 NHÓM) */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              {groups.map((group) => {
                const isActive = group.id === activeGroupId;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onSelectGroup(group.id);
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl border-2 transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-yellow-50 border-yellow-400 ring-4 ring-yellow-300 shadow-md scale-103 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 opacity-80'
                    }`}
                    title={`Bấm để chọn lượt ${group.name}`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: group.colorHex }}
                    />
                    <div className="text-left">
                      <span className="text-[10px] sm:text-xs font-bold block leading-none">
                        {group.name}
                      </span>
                      <span
                        className="font-display font-black text-sm sm:text-base leading-none"
                        style={{ color: group.colorHex }}
                      >
                        {group.score} <span className="text-[10px] font-normal text-slate-500">đ</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Các nút công cụ: Thiết lập, Hướng dẫn, Âm thanh, Toàn màn hình */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowConfirmSetup(true);
                }}
                className="p-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer"
                title="⚙ Thiết lập lại lớp học"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#F07B12]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenHelp();
                }}
                className="p-2 rounded-xl bg-emerald-50 text-[#2C7535] hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                title="Xem hướng dẫn sử dụng (10 phút)"
              >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={onToggleSound}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
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
                className="hidden sm:flex p-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
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

      {/* Hộp thoại xác nhận thiết lập lại */}
      {showConfirmSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-3 border-amber-300 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-2xl text-amber-800 shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-lg text-slate-900">
                  Xác nhận quay lại màn hình thiết lập?
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Khi mở lại thiết lập, điểm số hiện tại của các nhóm sẽ được đặt lại từ đầu. Thầy cô có muốn tiếp tục không?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowConfirmSetup(false);
                }}
                className="py-2 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-display font-bold text-xs sm:text-sm cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowConfirmSetup(false);
                  onOpenSetup();
                }}
                className="py-2 px-5 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-black text-xs sm:text-sm shadow-xs cursor-pointer btn-press"
              >
                Đồng ý thiết lập
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
