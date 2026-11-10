import React, { useEffect, useState, useRef } from 'react';
import { Clock, FastForward, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

export type QuestionStage = 'countdown' | 'answering' | 'results';

interface QuestionStepBannerProps {
  stage: QuestionStage;
  enableCountdown: boolean;
  countdownSeconds: number;
  onCountdownFinish: () => void;
  onSkipCountdown: () => void;
}

export const QuestionStepBanner: React.FC<QuestionStepBannerProps> = ({
  stage,
  enableCountdown,
  countdownSeconds,
  onCountdownFinish,
  onSkipCountdown,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(countdownSeconds);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enableCountdown) return;

    if (stage === 'countdown') {
      setTimeLeft(countdownSeconds);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            sound.playBell();
            onCountdownFinish();
            return 0;
          }
          sound.playTick();
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, enableCountdown, countdownSeconds, onCountdownFinish]);

  return (
    <div className="w-full space-y-2.5">
      {/* 3 BƯỚC CHỈ DẪN NHỎ */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-xs font-display font-extrabold text-slate-500 bg-amber-50/80 p-2 rounded-2xl border border-amber-200">
        <span
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
            stage === 'countdown'
              ? 'bg-[#F07B12] text-white shadow-xs font-black'
              : 'text-slate-600'
          }`}
        >
          ① Cả lớp trả lời
        </span>
        <span className="text-slate-400">➔</span>
        <span
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
            stage === 'answering'
              ? 'bg-[#2F80D0] text-white shadow-xs font-black'
              : 'text-slate-600'
          }`}
        >
          ② Đại diện lên bấm
        </span>
        <span className="text-slate-400">➔</span>
        <span
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all ${
            stage === 'results'
              ? 'bg-[#3F9B4A] text-white shadow-xs font-black'
              : 'text-slate-600'
          }`}
        >
          ③ Xem kết quả
        </span>
      </div>

      {/* DẢI LỚN MÀU VÀNG KHI ĐANG ĐẾM NGƯỢC (BƯỚC ①) */}
      {stage === 'countdown' && enableCountdown && (
        <div className="w-full bg-linear-to-r from-amber-100 via-yellow-100 to-amber-100 border-3 border-amber-400 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-300 text-amber-950 font-display font-black text-2xl flex items-center justify-center border border-amber-400 shadow-inner tabular-nums animate-pulse">
              {timeLeft}s
            </div>
            <div>
              <p className="font-display font-black text-base sm:text-xl text-amber-950">
                ✋ Cả lớp ghi bảng con hoặc giơ thẻ!
              </p>
              <p className="text-xs text-amber-900 font-bold">
                Các bạn có {countdownSeconds} giây suy nghĩ trước khi đại diện lên bấm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (timerRef.current) clearInterval(timerRef.current);
              onSkipCountdown();
            }}
            className="py-2 px-3.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-display font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <FastForward className="w-4 h-4 text-amber-700" />
            <span>Bỏ qua đếm ngược</span>
          </button>
        </div>
      )}

      {/* DẢI BÁO MỜI ĐẠI DIỆN LÊN BẤM (BƯỚC ②) */}
      {stage === 'answering' && (
        <div className="w-full bg-emerald-50 border-2 border-emerald-300 p-3 rounded-2xl flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#3F9B4A]" />
            <p className="font-display font-extrabold text-sm sm:text-base text-emerald-950">
              Hết giờ suy nghĩ! Mời đại diện lên chọn đáp án.
            </p>
          </div>
          <span className="text-xs font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Đang mở nút bấm
          </span>
        </div>
      )}
    </div>
  );
};
