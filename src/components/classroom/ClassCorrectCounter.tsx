import React from 'react';
import { Minus, Plus, Users } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface ClassCorrectCounterProps {
  classSize: number;
  correctCount: number;
  onChange: (count: number) => void;
}

export const ClassCorrectCounter: React.FC<ClassCorrectCounterProps> = ({
  classSize,
  correctCount,
  onChange,
}) => {
  const percent = Math.round((correctCount / classSize) * 100);

  return (
    <div className="w-full bg-amber-50/90 border-2 border-amber-300 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-amber-700 shrink-0" />
        <div>
          <span className="font-display font-black text-sm sm:text-base text-amber-950 block">
            Số bạn dưới lớp trả lời đúng:
          </span>
          <span className="text-[11px] text-amber-800 font-bold">
            Thầy cô kiểm đếm nhanh bảng con hoặc thẻ giơ của học sinh
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap justify-end">
        {/* Nút trừ/cộng */}
        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-amber-300 shadow-xs">
          <button
            type="button"
            disabled={correctCount <= 0}
            onClick={() => {
              sound.playClick();
              onChange(Math.max(0, correctCount - 1));
            }}
            className="w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-lg flex items-center justify-center disabled:opacity-40 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="font-display font-black text-xl text-[#2F80D0] min-w-8 text-center tabular-nums">
            {correctCount}
          </span>
          <span className="text-xs font-bold text-slate-500">/ {classSize}</span>

          <button
            type="button"
            disabled={correctCount >= classSize}
            onClick={() => {
              sound.playClick();
              onChange(Math.min(classSize, correctCount + 1));
            }}
            className="w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-lg flex items-center justify-center disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Nút nhanh: Cả lớp đúng & Không bạn nào */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onChange(classSize);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-display font-extrabold text-xs border border-emerald-300 transition-colors cursor-pointer"
          >
            Cả lớp đúng ({classSize})
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onChange(0);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-display font-extrabold text-xs border border-red-300 transition-colors cursor-pointer"
          >
            Không bạn nào (0)
          </button>
        </div>

        {/* Tỉ lệ phần trăm */}
        <span className="text-xs font-display font-extrabold bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-700">
          {percent}%
        </span>
      </div>
    </div>
  );
};
