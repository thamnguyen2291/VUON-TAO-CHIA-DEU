import React, { useState } from 'react';
import { ClassroomConfig, GroupFormat, DEFAULT_CLASSROOM_CONFIG } from '../../types/classroom.ts';
import { AppleSvg } from '../AppleSvg.tsx';
import { Play, Users, Clock, Printer, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface ClassroomSetupProps {
  initialConfig?: ClassroomConfig;
  onStart: (config: ClassroomConfig) => void;
  onBackToModeSelect: () => void;
  onOpenPrintCards: () => void;
}

export const ClassroomSetup: React.FC<ClassroomSetupProps> = ({
  initialConfig = DEFAULT_CLASSROOM_CONFIG,
  onStart,
  onBackToModeSelect,
  onOpenPrintCards,
}) => {
  const [groupFormat, setGroupFormat] = useState<GroupFormat>(initialConfig.groupFormat);
  const [classSize, setClassSize] = useState<number>(initialConfig.classSize);
  const [enableCountdown, setEnableCountdown] = useState<boolean>(initialConfig.enableCountdown);
  const [countdownDuration, setCountdownDuration] = useState<5 | 10 | 15>(initialConfig.countdownDuration);

  const handleStart = () => {
    sound.playClick();
    onStart({
      groupFormat,
      classSize,
      enableCountdown,
      countdownDuration,
    });
  };

  const groupOptions: { format: GroupFormat; label: string; desc: string }[] = [
    { format: 2, label: '2 đội', desc: 'Đội Xanh & Đội Cam' },
    { format: 3, label: '3 nhóm', desc: 'Nhóm 1, Nhóm 2, Nhóm 3' },
    { format: 4, label: '4 nhóm', desc: 'Nhóm 1 đến Nhóm 4' },
    { format: 5, label: '5 nhóm', desc: 'Nhóm 1 đến Nhóm 5' },
    { format: 6, label: '6 nhóm', desc: 'Nhóm 1 đến Nhóm 6' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EC] py-6 px-4 sm:px-6 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center gap-6">
        {/* Nút quay lại & Tiêu đề */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBackToModeSelect();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Chọn chế độ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenPrintCards();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#F07B12]" />
            <span>🖨 In thẻ trả lời</span>
          </button>
        </div>

        {/* Khung thiết lập chính */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-[#F0DCC0] shadow-md space-y-6">
          <div className="text-center space-y-1 border-b border-amber-100 pb-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-1">
              <AppleSvg size="xs" />
              <span className="font-display font-black text-xs text-[#2C7535]">
                Chế độ Trên lớp · Cả lớp cùng tham gia
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-[#2C7535]">
              Thiết Lập Tiết Học
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-bold">
              Thầy cô tùy chỉnh số nhóm, sĩ số và thời gian suy nghĩ của cả lớp trước khi bắt đầu
            </p>
          </div>

          {/* 1. HÌNH THỨC THI ĐUA */}
          <div className="space-y-2.5">
            <label className="font-display font-black text-base text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2F80D0]" />
              <span>1. Hình thức thi đua:</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {groupOptions.map((opt) => {
                const isSelected = groupFormat === opt.format;
                return (
                  <button
                    key={opt.format}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setGroupFormat(opt.format);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1 btn-press ${
                      isSelected
                        ? 'border-[#2F80D0] bg-blue-50/90 text-blue-950 shadow-sm ring-3 ring-blue-200 scale-102'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-display font-black text-base sm:text-lg">
                      {opt.label}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SĨ SỐ LỚP */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-display font-black text-base text-slate-800 flex items-center gap-2">
                <span>🎒</span>
                <span>2. Sĩ số học sinh cả lớp:</span>
              </label>
              <span className="text-xs text-slate-500 font-semibold">(từ 10 đến 45 học sinh)</span>
            </div>

            <div className="flex items-center justify-center gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
              <button
                type="button"
                disabled={classSize <= 10}
                onClick={() => {
                  sound.playClick();
                  setClassSize((prev) => Math.max(10, prev - 1));
                }}
                className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-300 text-amber-950 font-black text-2xl flex items-center justify-center hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs btn-press"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="text-center min-w-28">
                <span className="font-display font-black text-4xl text-[#E2463B] tabular-nums">
                  {classSize}
                </span>
                <span className="block text-xs font-bold text-slate-600">học sinh</span>
              </div>

              <button
                type="button"
                disabled={classSize >= 45}
                onClick={() => {
                  sound.playClick();
                  setClassSize((prev) => Math.min(45, prev + 1));
                }}
                className="w-12 h-12 rounded-2xl bg-white border-2 border-amber-300 text-amber-950 font-black text-2xl flex items-center justify-center hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs btn-press"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3. CÔNG TẮC ĐẾM NGƯỢC CẢ LỚP */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="font-display font-black text-base text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>3. Đếm ngược cả lớp cùng trả lời trước mỗi câu:</span>
              </label>

              {/* Nút bật/tắt công tắc */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setEnableCountdown(!enableCountdown);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-display font-black text-xs transition-colors cursor-pointer ${
                  enableCountdown
                    ? 'bg-[#3F9B4A] text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <span>{enableCountdown ? 'BẬT' : 'TẮT'}</span>
              </button>
            </div>

            {enableCountdown && (
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-2 animate-fadeIn">
                <p className="text-xs font-bold text-amber-950">
                  Thời gian suy nghĩ (ghi bảng con hoặc giơ thẻ):
                </p>
                <div className="flex items-center gap-3">
                  {[5, 10, 15].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCountdownDuration(sec as 5 | 10 | 15);
                      }}
                      className={`flex-1 py-2 rounded-xl font-display font-extrabold text-sm border-2 transition-all cursor-pointer ${
                        countdownDuration === sec
                          ? 'bg-[#F07B12] text-white border-orange-600 shadow-xs scale-102'
                          : 'bg-white border-amber-300 text-slate-700 hover:bg-amber-100/60'
                      }`}
                    >
                      {sec} giây {sec === 10 && '(mặc định)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* NÚT BẮT ĐẦU TIẾT HỌC */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-4 px-6 rounded-2xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-black text-xl shadow-[0_5px_0_#205a27] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer btn-press"
            >
              <span>Bắt đầu tiết học</span>
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 font-semibold pt-4">
        GV Nguyễn Thị Hồng Thắm · Lớp 3/3 · Trường Tiểu học Huỳnh Thúc Kháng
      </div>
    </div>
  );
};
