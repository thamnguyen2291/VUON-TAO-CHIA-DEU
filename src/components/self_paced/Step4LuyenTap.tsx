import React, { useState, useMemo } from 'react';
import { Check, X, ArrowRight, AlertTriangle, Delete, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface QuestionPartA {
  dividend: number;
  divisor: number;
  isExact: boolean;
  explanation: string;
}

const POOL_PART_A: QuestionPartA[] = [
  { dividend: 24, divisor: 6, isExact: true, explanation: '24 : 6 = 4 (dư 0). Đây là phép chia hết vì 4 × 6 = 24.' },
  { dividend: 42, divisor: 7, isExact: true, explanation: '42 : 7 = 6 (dư 0). Đây là phép chia hết vì 6 × 7 = 42.' },
  { dividend: 36, divisor: 9, isExact: true, explanation: '36 : 9 = 4 (dư 0). Đây là phép chia hết vì 4 × 9 = 36.' },
  { dividend: 23, divisor: 4, isExact: false, explanation: '23 : 4 = 5 (dư 3). Đây là phép chia có dư vì 5 × 4 + 3 = 23 (số dư 3 < 4).' },
  { dividend: 29, divisor: 6, isExact: false, explanation: '29 : 6 = 4 (dư 5). Đây là phép chia có dư vì 4 × 6 + 5 = 29 (số dư 5 < 6).' },
  { dividend: 38, divisor: 7, isExact: false, explanation: '38 : 7 = 5 (dư 3). Đây là phép chia có dư vì 5 × 7 + 3 = 38 (số dư 3 < 7).' },
];

interface QuestionPartB {
  dividend: number;
  divisor: number;
  correctQ: number;
  correctR: number;
  stepByStep: string;
}

const QUESTIONS_PART_B: QuestionPartB[] = [
  {
    dividend: 19,
    divisor: 3,
    correctQ: 6,
    correctR: 1,
    stepByStep: '19 chia 3 được 6 (vì 6 × 3 = 18). 19 - 18 = 1. Vậy 19 : 3 = 6 (dư 1). Thử lại: 6 × 3 + 1 = 19.',
  },
  {
    dividend: 26,
    divisor: 8,
    correctQ: 3,
    correctR: 2,
    stepByStep: '26 chia 8 được 3 (vì 3 × 8 = 24). 26 - 24 = 2. Vậy 26 : 8 = 3 (dư 2). Thử lại: 3 × 8 + 2 = 26.',
  },
];

interface Step4LuyenTapProps {
  onComplete: () => void;
  onTriggerConfetti: () => void;
  onAddScore: (points: number) => void;
}

export const Step4LuyenTap: React.FC<Step4LuyenTapProps> = ({
  onComplete,
  onTriggerConfetti,
  onAddScore,
}) => {
  // Mode: 'A' (6 câu trắc nghiệm hết/dư) hoặc 'B' (2 câu nhập thương & dư)
  const [currentPart, setCurrentPart] = useState<'A' | 'B'>('A');

  // Trạng thái phần A
  const [shuffledA] = useState(() => [...POOL_PART_A].sort(() => Math.random() - 0.5));
  const [indexA, setIndexA] = useState<number>(0);
  const [choiceA, setChoiceA] = useState<boolean | null>(null);
  const [isAnsweredA, setIsAnsweredA] = useState<boolean>(false);
  const [resultsA, setResultsA] = useState<(boolean | null)[]>(new Array(6).fill(null));

  // Trạng thái phần B
  const [indexB, setIndexB] = useState<number>(0);
  const [inputQ, setInputQ] = useState<string>('');
  const [inputR, setInputR] = useState<string>('');
  const [activeBox, setActiveBox] = useState<'q' | 'r'>('q');
  const [attemptsB, setAttemptsB] = useState<number>(0); // 0: chưa thử, 1: sai 1 lần, 2: đã nộp
  const [isAnsweredB, setIsAnsweredB] = useState<boolean>(false);
  const [isCorrectB, setIsCorrectB] = useState<boolean>(false);
  const [warningB, setWarningB] = useState<string | null>(null);

  const qA = shuffledA[indexA];
  const qB = QUESTIONS_PART_B[indexB];

  // Xử lý nộp phần A
  const handleSelectA = (selectedExact: boolean) => {
    if (isAnsweredA) return;
    setChoiceA(selectedExact);
    setIsAnsweredA(true);

    const isCorrect = selectedExact === qA.isExact;
    const newRes = [...resultsA];
    newRes[indexA] = isCorrect;
    setResultsA(newRes);

    if (isCorrect) {
      sound.playCorrect();
      onTriggerConfetti();
      onAddScore(1);
    } else {
      sound.playIncorrect();
    }
  };

  const handleNextA = () => {
    sound.playClick();
    if (indexA < shuffledA.length - 1) {
      setIndexA((prev) => prev + 1);
      setChoiceA(null);
      setIsAnsweredA(false);
    } else {
      // Sang phần B
      setCurrentPart('B');
    }
  };

  // Xử lý nộp phần B
  const handleKeypadB = (digit: string) => {
    if (isAnsweredB) return;
    sound.playClick();
    setWarningB(null);

    if (digit === 'backspace') {
      if (activeBox === 'r') {
        if (inputR.length > 0) {
          setInputR((prev) => prev.slice(0, -1));
        } else {
          setActiveBox('q');
        }
      } else {
        setInputQ((prev) => prev.slice(0, -1));
      }
    } else if (digit === 'enter') {
      handleSubmitB();
    } else {
      if (activeBox === 'q') {
        if (inputQ.length < 2) {
          const next = inputQ + digit;
          setInputQ(next);
          if (next.length >= 1) {
            setTimeout(() => setActiveBox('r'), 80);
          }
        }
      } else {
        if (inputR.length < 2) {
          setInputR((prev) => prev + digit);
        }
      }
    }
  };

  const handleSubmitB = () => {
    if (isAnsweredB) return;
    setWarningB(null);

    if (inputQ.trim() === '' || inputR.trim() === '') {
      setWarningB('Em điền đủ cả ô thương và ô số dư nhé.');
      sound.playIncorrect();
      return;
    }

    const q = parseInt(inputQ, 10);
    const r = parseInt(inputR, 10);

    // Kiểm tra số dư >= số chia
    if (r >= qB.divisor) {
      setWarningB(
        `Số dư ${r} không bé hơn số chia ${qB.divisor}. Số dư phải bé hơn số chia, em thử chia thêm một lượt nữa nhé!`
      );
      sound.playIncorrect();
      return;
    }

    const isCorrect = q === qB.correctQ && r === qB.correctR;

    if (isCorrect) {
      setIsAnsweredB(true);
      setIsCorrectB(true);
      sound.playCorrect();
      onTriggerConfetti();
      onAddScore(2);
    } else {
      if (attemptsB === 0) {
        // Cho làm lại 1 lần
        setAttemptsB(1);
        setWarningB('Chưa đúng rồi! Em được thử lại 1 lần nữa nhé.');
        sound.playIncorrect();
        setInputQ('');
        setInputR('');
        setActiveBox('q');
      } else {
        // Lần 2 sai thì khóa và hiện lời giải
        setIsAnsweredB(true);
        setIsCorrectB(false);
        sound.playIncorrect();
      }
    }
  };

  const handleNextB = () => {
    sound.playClick();
    if (indexB < QUESTIONS_PART_B.length - 1) {
      setIndexB((prev) => prev + 1);
      setInputQ('');
      setInputR('');
      setActiveBox('q');
      setAttemptsB(0);
      setIsAnsweredB(false);
      setIsCorrectB(false);
      setWarningB(null);
    } else {
      onComplete(); // Đã hoàn thành toàn bộ bài Luyện tập
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 animate-fadeIn">
      {/* Header chỉ báo phần A / B */}
      <div className="w-full bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm flex items-center justify-between">
        <div className="font-display font-extrabold text-slate-800 text-sm sm:text-base">
          {currentPart === 'A' ? (
            <span>Phần A: Phép chia này hết hay có dư? ({indexA + 1}/6)</span>
          ) : (
            <span>Phần B: Tính thương và số dư ({indexB + 1}/2)</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              currentPart === 'A' ? 'bg-[#3F9B4A] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Phần A
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              currentPart === 'B' ? 'bg-[#F07B12] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Phần B
          </span>
        </div>
      </div>

      {/* GIAO DIỆN PHẦN A: 2 NÚT "CHIA HẾT" / "CÓ DƯ" */}
      {currentPart === 'A' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F0DCC0] shadow-md flex flex-col items-center gap-6">
          {/* Thẻ phép chia to */}
          <div className="w-full max-w-md py-8 px-6 rounded-3xl border-4 border-dashed border-[#F39A1E]/50 bg-[#FFFDF8] flex items-center justify-center shadow-inner">
            <div className="font-display font-black text-5xl sm:text-7xl text-slate-800 tracking-wider">
              {qA.dividend} : {qA.divisor} = ?
            </div>
          </div>

          {/* 2 Nút lựa chọn */}
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled={isAnsweredA}
              onClick={() => handleSelectA(true)}
              className={`py-4 px-4 rounded-2xl font-display font-black text-xl transition-all cursor-pointer flex flex-col items-center gap-1 btn-press ${
                isAnsweredA && choiceA === true
                  ? qA.isExact
                    ? 'bg-[#3F9B4A] text-white shadow-xs ring-4 ring-emerald-300'
                    : 'bg-[#E2463B] text-white shadow-xs'
                  : 'bg-[#3F9B4A] hover:bg-[#2C7535] text-white shadow-[0_5px_0_#2C7535]'
              }`}
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>Chia hết</span>
            </button>

            <button
              type="button"
              disabled={isAnsweredA}
              onClick={() => handleSelectA(false)}
              className={`py-4 px-4 rounded-2xl font-display font-black text-xl transition-all cursor-pointer flex flex-col items-center gap-1 btn-press ${
                isAnsweredA && choiceA === false
                  ? !qA.isExact
                    ? 'bg-[#E2463B] text-white shadow-xs ring-4 ring-red-300'
                    : 'bg-slate-400 text-white'
                  : 'bg-[#E2463B] hover:bg-[#c93329] text-white shadow-[0_5px_0_#A81D14]'
              }`}
            >
              <span className="text-xl">◐</span>
              <span>Có dư</span>
            </button>
          </div>

          {/* Phản hồi sau khi bấm */}
          {isAnsweredA && (
            <div
              className={`w-full max-w-md p-4 rounded-2xl border-2 space-y-2 animate-fadeIn ${
                choiceA === qA.isExact ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
              }`}
            >
              <p className="font-display font-black text-base text-slate-900">
                {choiceA === qA.isExact ? '🎉 Hoan hô! Em trả lời đúng!' : 'Chưa đúng rồi!'}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {qA.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextA}
                  className="py-2 px-5 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-bold text-sm shadow-xs flex items-center gap-1.5 cursor-pointer btn-press"
                >
                  <span>{indexA < shuffledA.length - 1 ? 'Câu tiếp theo →' : 'Sang Phần B →'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GIAO DIỆN PHẦN B: TÍNH THƯƠNG VÀ SỐ DƯ (NHẬP Ô XANH, Ô ĐỎ) */}
      {currentPart === 'B' && (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F0DCC0] shadow-md flex flex-col items-center gap-5">
          <p className="font-display font-black text-xl sm:text-2xl text-slate-800 text-center">
            Em hãy tìm thương và số dư của phép chia:
          </p>

          {/* Ô nhập Thương (Xanh) và Dư (Đỏ) */}
          <div className="flex flex-wrap items-center justify-center gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            <span className="font-display font-black text-3xl text-slate-800">
              {qB.dividend} : {qB.divisor} =
            </span>

            <button
              type="button"
              disabled={isAnsweredB}
              onClick={() => setActiveBox('q')}
              className={`w-18 h-16 rounded-2xl border-3 flex items-center justify-center font-display font-black text-3xl cursor-pointer ${
                activeBox === 'q' && !isAnsweredB
                  ? 'border-[#2F80D0] bg-blue-100 ring-4 ring-blue-300 text-[#2F80D0] scale-105'
                  : 'border-[#2F80D0]/50 bg-blue-50 text-[#2F80D0]'
              }`}
            >
              {inputQ || '?'}
            </button>

            <span className="font-display font-black text-2xl text-slate-700">(dư</span>

            <button
              type="button"
              disabled={isAnsweredB}
              onClick={() => setActiveBox('r')}
              className={`w-18 h-16 rounded-2xl border-3 flex items-center justify-center font-display font-black text-3xl cursor-pointer ${
                activeBox === 'r' && !isAnsweredB
                  ? 'border-[#E2463B] bg-red-100 ring-4 ring-red-300 text-[#E2463B] scale-105'
                  : 'border-[#E2463B]/50 bg-red-50 text-[#E2463B]'
              }`}
            >
              {inputR || '?'}
            </button>

            <span className="font-display font-black text-2xl text-slate-700">)</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <span className="text-[#2F80D0]">Ô xanh: Thương</span>
            <span>·</span>
            <span className="text-[#E2463B]">Ô đỏ: Số dư</span>
          </div>

          {/* Cảnh báo / Gợi ý khi sai hoặc số dư quá lớn */}
          {warningB && (
            <div className="bg-amber-100 border border-amber-300 p-3 rounded-xl text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2 animate-fadeIn max-w-md">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <span>{warningB}</span>
            </div>
          )}

          {/* Bàn phím số trên màn hình */}
          {!isAnsweredB && (
            <div className="w-full max-w-xs bg-amber-100/70 p-3 rounded-2xl border-2 border-amber-200">
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadB(digit)}
                    className="py-3 bg-white hover:bg-amber-50 text-slate-800 font-display font-black text-xl rounded-xl border border-amber-300 shadow-sm active:translate-y-0.5 cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleKeypadB('0')}
                  className="py-3 bg-white hover:bg-amber-50 text-slate-800 font-display font-black text-xl rounded-xl border border-amber-300 shadow-sm active:translate-y-0.5 cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadB('backspace')}
                  className="py-3 bg-red-50 hover:bg-red-100 text-[#E2463B] font-display font-black text-lg rounded-xl border border-red-300 shadow-sm active:translate-y-0.5 flex items-center justify-center cursor-pointer"
                >
                  <Delete className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleSubmitB}
                  className="py-3 bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm rounded-xl shadow-[0_3px_0_#2C7535] active:translate-y-0.5 flex items-center justify-center cursor-pointer"
                >
                  Kiểm tra
                </button>
              </div>
            </div>
          )}

          {/* Lời giải sau khi trả lời */}
          {isAnsweredB && (
            <div
              className={`w-full max-w-md p-4 rounded-2xl border-2 space-y-2 animate-fadeIn ${
                isCorrectB ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
              }`}
            >
              <p className="font-display font-black text-base text-slate-900">
                {isCorrectB ? '🎉 Rất xuất sắc! Em làm đúng rồi!' : 'Lời giải từng bước:'}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                {qB.stepByStep}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextB}
                  className="py-2 px-5 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-bold text-sm shadow-xs flex items-center gap-1.5 cursor-pointer btn-press"
                >
                  <span>
                    {indexB < QUESTIONS_PART_B.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành phần Luyện tập ✓'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
