import React from 'react';
import { ClassroomConfig } from '../../types/classroom.ts';
import { AppleSvg } from '../AppleSvg.tsx';
import { Users, Clock, Play, Printer, ArrowLeft, Minus, Plus, Settings } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface ClassroomSettingsScreenProps {
  config: ClassroomConfig;
  onChangeConfig: (newConfig: ClassroomConfig) => void;
  onStartLesson: () => void;
  onBackToModeSelect: () => void;
  onOpenPrintCards: () => void;
}

export const ClassroomSettingsScreen: React.FC<ClassroomSettingsScreenProps> = ({
  config,
  onChangeConfig,
  onStartLesson,
  onBackToModeSelect,
  onOpenPrintCards,
}) => {
  const updateGroupCount = (count: 2 | 3 | 4 | 5 | 6) => {
    sound.playClick();
    onChangeConfig({ ...config, groupCount: count });
  };

  const updateClassSize = (delta: number) => {
    sound.playClick();
    const next = Math.max(10, Math.min(45, config.classSize + delta));
    onChangeConfig({ ...config, classSize: next });
  };

  const toggleCountdown = () => {
    sound.playClick();
    onChangeConfig({ ...config, enableCountdown: !config.enableCountdown });
  };

  const updateDuration = (dur: 5 | 10 | 15) => {
    sound.playClick();
    onChangeConfig({ ...config, countdownDuration: dur });
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col justify-between py-6 px-4 sm:px-6 animate-fadeIn">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center gap-6">
        {/* Nút quay lại chọn chế độ */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBackToModeSelect();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-display font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Quay lại chọn chế độ</span>
          </button>

          <button
            type="button"
            onClick={onOpenPrintCards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-display font-bold text-xs sm:text-sm hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-700" />
            <span>🖨 In thẻ trả lời</span>
          </button>
        </div>

        {/* Khung thiết lập chính */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-900">
              <Settings className="w-6 h-6 text-[#2C7535]" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-800">
                Thiết Lập Tiết Học Trên Lớp
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-bold">
                Tùy biến hình thức thi đua, sĩ số và đếm ngược phù hợp với lớp của em
              </p>
            </div>
          </div>

          {/* 1. HÌNH THỨC THI ĐUA */}
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-display text-base text-slate-900">
                <Users className="w-4 h-4 text-[#3F9B4A]" />
                <span>Hình thức thi đua:</span>
              </span>
              <span className="text-xs text-[#2C7535] font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {config.groupCount === 2 ? '2 đội (Đội Xanh & Đội Cam)' : `${config.groupCount} nhóm thi đua`}
              </span>
            </label>

            <div className="grid grid-cols-5 gap-2">
              {([2, 3, 4, 5, 6] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => updateGroupCount(cnt)}
                  className={`py-3 px-2 rounded-2xl font-display font-black text-sm sm:text-base border-2 transition-all cursor-pointer btn-press ${
                    config.groupCount === cnt
                      ? 'bg-[#3F9B4A] text-white border-[#2C7535] shadow-xs scale-102 ring-3 ring-emerald-300'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  {cnt === 2 ? '2 đội' : `${cnt} nhóm`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. SĨ SỐ LỚP */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div>
              <span className="font-display font-black text-base text-amber-950 block">
                Sĩ số học sinh cả lớp:
              </span>
              <span className="text-xs text-slate-500 font-bold">
                (Dùng để quay số gọi bạn lên bảng & tính tỉ lệ đúng)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={config.classSize <= 10}
                onClick={() => updateClassSize(-1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 hover:bg-amber-100 text-slate-700 flex items-center justify-center font-black text-lg disabled:opacity-40 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="font-display font-black text-2xl text-[#E2463B] w-12 text-center">
                {config.classSize}
              </span>

              <button
                type="button"
                disabled={config.classSize >= 45}
                onClick={() => updateClassSize(1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 hover:bg-amber-100 text-slate-700 flex items-center justify-center font-black text-lg disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. CÔNG TẮC ĐẾM NGƯỢC CẢ LỚP */}
          <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display font-black text-base text-sky-950 block">
                  Đếm ngược cả lớp cùng trả lời:
                </span>
                <span className="text-xs text-slate-600 font-bold">
                  (Cả lớp ghi bảng con hoặc giơ thẻ trước khi đại diện lên bấm)
                </span>
              </div>

              <button
                type="button"
                onClick={toggleCountdown}
                className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                  config.enableCountdown ? 'bg-[#3F9B4A]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md absolute top-1 transition-transform ${
                    config.enableCountdown ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {config.enableCountdown && (
              <div className="flex items-center justify-between pt-2 border-t border-sky-200/80 animate-fadeIn">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-700" />
                  <span>Thời gian đếm ngược:</span>
                </span>
                <div className="flex items-center gap-2">
                  {([5, 10, 15] as const).map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => updateDuration(sec)}
                      className={`px-3 py-1 rounded-xl text-xs font-display font-bold transition-all cursor-pointer ${
                        config.countdownDuration === sec
                          ? 'bg-[#2F80D0] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {sec} giây
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* NÚT BẮT ĐẦU TIẾT HỌC */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onStartLesson();
              }}
              className="w-full py-4 px-8 rounded-2xl bg-[#E2463B] hover:bg-[#c93329] text-white font-display font-black text-xl shadow-[0_5px_0_#A81D14] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer btn-press"
            >
              <span>Bắt đầu tiết học</span>
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
