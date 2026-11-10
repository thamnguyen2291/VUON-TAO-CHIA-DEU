import React, { useState, useEffect, useRef } from 'react';
import { Dice5, RotateCcw, X, Check, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface StudentCallerProps {
  classSize: number;
  calledStudents: number[];
  onCallStudent: (rollNumber: number, batDauVongMoi: boolean) => void;
  onSkipStudent: (rollNumber: number) => void;
  className?: string;
}

export const StudentCaller: React.FC<StudentCallerProps> = ({
  classSize,
  calledStudents,
  onCallStudent,
  onSkipStudent,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [justResetCycle, setJustResetCycle] = useState<boolean>(false);

  const rollIntervalRef = useRef<number | null>(null);

  // Danh sách các số chưa được gọi
  const getRemainingNumbers = () => {
    const all = Array.from({ length: classSize }, (_, i) => i + 1);
    return all.filter((num) => !calledStudents.includes(num));
  };

  const handleStartRolling = () => {
    sound.playClick();
    setIsOpen(true);
    setIsRolling(true);
    setJustResetCycle(false);

    let remaining = getRemainingNumbers();
    let willReset = false;

    if (remaining.length === 0) {
      // Đã gọi hết cả lớp -> Reset vòng mới
      willReset = true;
      remaining = Array.from({ length: classSize }, (_, i) => i + 1);
    }

    // Chọn số trúng trước
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const chosenNumber = remaining[randomIndex];

    let count = 0;
    const maxTicks = 16;

    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

    rollIntervalRef.current = window.setInterval(() => {
      count++;
      // Hiệu ứng số chạy ngẫu nhiên
      const tempNum = Math.floor(Math.random() * classSize) + 1;
      setDisplayNumber(tempNum);
      sound.playTick();

      if (count >= maxTicks) {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
        setDisplayNumber(chosenNumber);
        setIsRolling(false);
        if (willReset) {
          setJustResetCycle(true);
        }
        sound.playPop();
        onCallStudent(chosenNumber, willReset);
      }
    }, 90);
  };

  const handleReroll = () => {
    handleStartRolling();
  };

  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  return (
    <>
      {/* Nút bấm đặt cạnh nhãn lượt */}
      <button
        type="button"
        onClick={handleStartRolling}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-display font-black text-xs sm:text-sm border border-amber-300 shadow-xs cursor-pointer btn-press transition-all ${className}`}
        title="Quay số ngẫu nhiên chọn học sinh lên bảng"
      >
        <Dice5 className="w-4 h-4 text-amber-700 animate-spin-slow" />
        <span>🎲 Chọn bạn lên bấm</span>
        <span className="text-[11px] font-bold text-amber-800 opacity-80">
          ({calledStudents.length}/{classSize})
        </span>
      </button>

      {/* Modal quay số xuất hiện to rõ trên màn hình TV */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-3 border-amber-400 shadow-2xl flex flex-col items-center text-center gap-5 relative">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="font-display font-extrabold text-xs uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                Gọi bạn lên bảng
              </span>
              <h3 className="font-display font-black text-2xl text-slate-800">
                {isRolling ? 'Đang quay số ngẫu nhiên...' : 'Mời bạn lên bấm!'}
              </h3>
            </div>

            {/* Ô hiển thị số thứ tự khổng lồ */}
            <div className="w-48 h-48 rounded-3xl bg-linear-to-b from-amber-50 to-orange-50 border-4 border-amber-400 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest -mb-1">
                Số thứ tự
              </span>
              <span
                className={`font-display font-black text-7xl text-[#E2463B] tabular-nums transition-transform ${
                  isRolling ? 'scale-110' : 'scale-100 animate-bounce'
                }`}
              >
                {displayNumber !== null ? displayNumber : '?'}
              </span>
              <span className="font-display font-bold text-sm text-amber-900 mt-1">
                {displayNumber !== null ? `Bạn số ${displayNumber}` : ''}
              </span>
            </div>

            {/* Thông báo bắt đầu vòng mới khi đã gọi hết cả lớp */}
            {justResetCycle && !isRolling && (
              <div className="bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-1.5 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Cả lớp đã được gọi, bắt đầu vòng mới!</span>
              </div>
            )}

            {/* Tiến độ đã gọi */}
            <div className="text-xs font-bold text-slate-600">
              Đã gọi: <span className="text-[#2F80D0] font-black">{calledStudents.length}</span> / {classSize} bạn
            </div>

            {/* Các nút hành động */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                disabled={isRolling}
                onClick={handleReroll}
                className="flex-1 py-3 px-4 rounded-xl bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-display font-bold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Bỏ qua khi bạn vắng mặt và chọn bạn khác"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chọn lại (Bạn vắng)</span>
              </button>

              <button
                type="button"
                disabled={isRolling}
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer btn-press"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Đã gọi xong</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
