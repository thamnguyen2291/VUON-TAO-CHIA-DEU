import React, { useState } from 'react';
import { Check, X, ArrowRight, Delete, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface Question {
  dividend: number;
  divisor: number;
  answer: number;
  multiplicationCheck: string;
}

const QUESTIONS: Question[] = [
  { dividend: 15, divisor: 5, answer: 3, multiplicationCheck: '3 × 5 = 15' },
  { dividend: 24, divisor: 6, answer: 4, multiplicationCheck: '4 × 6 = 24' },
  { dividend: 35, divisor: 7, answer: 5, multiplicationCheck: '5 × 7 = 35' },
];

interface Step1KhoiDongProps {
  onComplete: () => void;
  onTriggerConfetti: () => void;
  onAddScore: (points: number) => void;
}

export const Step1KhoiDong: React.FC<Step1KhoiDongProps> = ({
  onComplete,
  onTriggerConfetti,
  onAddScore,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [results, setResults] = useState<(boolean | null)[]>([null, null, null]);
  const [isAllCompleted, setIsAllCompleted] = useState<boolean>(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleKeypad = (digit: string) => {
    if (isAnswered) return;
    sound.playClick();
    if (digit === 'backspace') {
      setInputVal((prev) => prev.slice(0, -1));
    } else if (digit === 'enter') {
      handleSubmit();
    } else {
      if (inputVal.length < 2) {
        setInputVal((prev) => prev + digit);
      }
    }
  };

  const handleSubmit = () => {
    if (isAnswered || inputVal.trim() === '') return;
    const num = parseInt(inputVal, 10);
    const correct = num === currentQ.answer;

    setIsAnswered(true);
    setIsCorrect(correct);

    const newRes = [...results];
    newRes[currentIdx] = correct;
    setResults(newRes);

    if (correct) {
      sound.playCorrect();
      onTriggerConfetti();
      onAddScore(1);
    } else {
      sound.playIncorrect();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setInputVal('');
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsAllCompleted(true);
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5 animate-fadeIn">
      {/* Thanh tiến trình 3 câu */}
      <div className="w-full bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm flex items-center justify-between">
        <div className="font-display font-extrabold text-slate-800 text-sm sm:text-base">
          Ôn lại bảng chia: Câu {currentIdx + 1} / 3
        </div>
        <div className="flex items-center gap-2">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all ${
                i === currentIdx ? 'ring-3 ring-orange-400 scale-110 font-black' : ''
              } ${
                results[i] === true
                  ? 'bg-[#3F9B4A] text-white'
                  : results[i] === false
                  ? 'bg-[#E2463B] text-white'
                  : 'bg-slate-100 text-slate-500 border border-slate-300'
              }`}
            >
              {results[i] === true ? '✓' : results[i] === false ? '✗' : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Thẻ phép tính chính */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F0DCC0] shadow-md flex flex-col items-center gap-5">
        <div className="w-full max-w-md py-6 px-4 rounded-3xl border-4 border-dashed border-[#F39A1E]/50 bg-[#FFFDF8] flex items-center justify-center shadow-inner">
          <div className="font-display font-black text-4xl sm:text-6xl text-slate-800 tracking-wider">
            {currentQ.dividend} : {currentQ.divisor} ={' '}
            <span className="text-[#2F80D0] bg-blue-50 px-3 py-1 rounded-2xl border-2 border-[#2F80D0]/40 inline-block min-w-16 text-center">
              {inputVal || '?'}
            </span>
          </div>
        </div>

        {/* Bàn phím số trên màn hình */}
        {!isAnswered && (
          <div className="w-full max-w-xs bg-amber-100/70 p-3 rounded-2xl border-2 border-amber-200">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypad(digit)}
                  className="py-3 bg-white hover:bg-amber-50 text-slate-800 font-display font-black text-xl rounded-xl border border-amber-300 shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeypad('0')}
                className="py-3 bg-white hover:bg-amber-50 text-slate-800 font-display font-black text-xl rounded-xl border border-amber-300 shadow-sm active:translate-y-0.5 transition-all cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypad('backspace')}
                className="py-3 bg-red-50 hover:bg-red-100 text-[#E2463B] font-display font-black text-lg rounded-xl border border-red-300 shadow-sm active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
                title="Xóa"
              >
                <Delete className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="py-3 bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm rounded-xl shadow-[0_3px_0_#2C7535] active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer"
              >
                Trả lời
              </button>
            </div>
          </div>
        )}

        {/* Phản hồi sau khi trả lời */}
        {isAnswered && (
          <div
            className={`w-full max-w-md p-4 rounded-2xl border-2 transition-all ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl text-white font-bold shrink-0 ${
                  isCorrect ? 'bg-[#3F9B4A]' : 'bg-[#E2463B]'
                }`}
              >
                {isCorrect ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5 stroke-[3]" />}
              </div>
              <div className="space-y-1 text-xs sm:text-sm font-bold flex-1">
                <p className="text-base font-extrabold">
                  {isCorrect ? '🎉 Rất giỏi! Em tính nhẩm chính xác!' : 'Chưa đúng rồi!'}
                </p>
                <p className="text-slate-700">
                  {currentQ.dividend} : {currentQ.divisor} ={' '}
                  <span className="text-[#2F80D0] font-black">{currentQ.answer}</span>
                </p>
                <p className="text-slate-600 font-semibold bg-white/80 p-1.5 rounded border border-slate-200">
                  Vì {currentQ.multiplicationCheck}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-5 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-bold text-sm shadow-[0_3px_0_#aa4f03] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentIdx < QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành khởi động'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Lời kết khi hoàn thành cả 3 câu */}
        {isAllCompleted && (
          <div className="w-full max-w-md bg-amber-100/90 border-2 border-amber-300 p-4 rounded-2xl text-center space-y-1 animate-fadeIn">
            <p className="font-display font-black text-amber-950 text-base flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Giỏi lắm! Các phép chia vừa rồi đều chia hết.</span>
            </p>
            <p className="text-xs sm:text-sm font-bold text-amber-900">
              Nhưng nếu chia táo mà còn thừa thì sao nhỉ? Chúng mình cùng sang phần Khám phá nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
