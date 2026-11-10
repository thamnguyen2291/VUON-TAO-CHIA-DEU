import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Sparkles, Check, Users } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface StudentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  classSize: number;
  calledStudents: number[];
  onUpdateCalledStudents: (called: number[]) => void;
}

export const StudentPickerModal: React.FC<StudentPickerModalProps> = ({
  isOpen,
  onClose,
  classSize,
  calledStudents,
  onUpdateCalledStudents,
}) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [cycleResetNotice, setCycleResetNotice] = useState<boolean>(false);
  const spinTimerRef = useRef<number | null>(null);

  // Chọn bạn ngẫu nhiên
  const pickRandomStudent = (ignoreCurrent = false) => {
    sound.playClick();
    setIsSpinning(true);
    setCycleResetNotice(false);

    let pool = calledStudents;
    if (ignoreCurrent && displayNumber !== null) {
      pool = pool.filter((id) => id !== displayNumber);
    }

    // Các số còn lại chưa gọi
    let available = Array.from({ length: classSize }, (_, i) => i + 1).filter(
      (id) => !pool.includes(id)
    );

    let resetNotice = false;
    if (available.length === 0) {
      // Đã gọi hết cả lớp -> bắt đầu vòng mới
      available = Array.from({ length: classSize }, (_, i) => i + 1);
      pool = [];
      resetNotice = true;
    }

    const chosen = available[Math.floor(Math.random() * available.length)];

    // Hiệu ứng quay số nhanh trong 1.5 giây
    const startTime = Date.now();
    const duration = 1400;

    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const tempRand = Math.floor(Math.random() * classSize) + 1;
      setDisplayNumber(tempRand);
      sound.playTick();

      if (elapsed >= duration) {
        clearInterval(spinInterval);
        setDisplayNumber(chosen);
        setIsSpinning(false);
        sound.playCorrect();
        if (resetNotice) {
          setCycleResetNotice(true);
        }
        onUpdateCalledStudents([...pool, chosen]);
      }
    }, 70);
  };

  useEffect(() => {
    if (isOpen && displayNumber === null && !isSpinning) {
      pickRandomStudent();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCalled = calledStudents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border-3 border-amber-300 shadow-2xl overflow-hidden flex flex-col p-6 sm:p-7 items-center text-center gap-5">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2 text-amber-950 font-display font-black text-lg">
            <span>🎲</span>
            <span>Chọn Bạn Lên Bấm</span>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông báo nếu vừa bắt đầu vòng mới */}
        {cycleResetNotice && (
          <div className="w-full bg-amber-100 text-amber-950 border border-amber-300 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Cả lớp đã được gọi, bắt đầu vòng mới!</span>
          </div>
        )}

        {/* Ô quay số khổng lồ */}
        <div className="w-full py-8 px-4 rounded-3xl bg-linear-to-b from-amber-50 to-orange-50 border-3 border-dashed border-[#F39A1E] flex flex-col items-center justify-center gap-2 shadow-inner">
          <span className="text-xs font-display font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full">
            {isSpinning ? 'Đang quay số ngẫu nhiên...' : 'Chúc mừng!'}
          </span>

          <div
            className={`font-display font-black text-5xl sm:text-7xl text-[#E2463B] transition-transform ${
              isSpinning ? 'scale-110 blur-[0.5px]' : 'scale-100 drop-shadow-md'
            }`}
          >
            {displayNumber ? `Bạn số ${displayNumber}` : '...'}
          </div>

          <p className="text-xs font-bold text-slate-600">
            {isSpinning ? 'Cùng hồi hộp chờ xem nhé...' : 'Mời em lên bấm câu trả lời trên màn hình!'}
          </p>
        </div>

        {/* Thanh đếm tiến độ sĩ số */}
        <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="flex items-center gap-1.5 text-slate-800">
            <Users className="w-4 h-4 text-[#3F9B4A]" />
            <span>Sĩ số: {classSize} bạn</span>
          </span>
          <span className="text-[#2F80D0] font-black">
            Đã gọi {totalCalled} / {classSize} bạn
          </span>
        </div>

        {/* Cụm nút: Chọn lại & Bắt đầu làm */}
        <div className="w-full flex items-center gap-3 pt-1">
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => pickRandomStudent(true)}
            className="flex-1 py-3 px-4 rounded-2xl bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-display font-bold text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Bỏ qua bạn vừa gọi (khi bạn vắng mặt) và chọn bạn khác"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chọn lại</span>
          </button>

          <button
            type="button"
            disabled={isSpinning}
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex-1 py-3 px-6 rounded-2xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-black text-base shadow-[0_4px_0_#205a27] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 btn-press"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Lên bấm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
