import React, { useState } from 'react';
import { Lightbulb, Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface Problem {
  id: number;
  type: 'input' | 'choice';
  question: string;
  hint: string;
  // Dạng nhập số
  correctQ?: number;
  correctR?: number;
  labelQ?: string;
  labelR?: string;
  // Dạng chọn
  options?: string[];
  correctChoice?: number;
  explanation: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 1,
    type: 'input',
    question: 'Có 26 quả cam xếp vào các đĩa, mỗi đĩa 6 quả. Xếp được nhiều nhất mấy đĩa, còn thừa mấy quả?',
    hint: 'Em hãy thực hiện phép chia: 26 chia 6 được mấy, dư mấy nhé!',
    correctQ: 4,
    correctR: 2,
    labelQ: 'đĩa',
    labelR: 'quả cam thừa',
    explanation: '26 : 6 = 4 (dư 2). Vậy xếp được nhiều nhất 4 đĩa và còn thừa 2 quả cam (2 < 6).',
  },
  {
    id: 2,
    type: 'choice',
    question: 'Bạn Bin tính: 29 : 5 = 4 (dư 9). Bin làm đúng hay sai?',
    hint: 'Em hãy nhìn vào số dư 9 và số chia 5 xem số dư có bé hơn số chia không nhé.',
    options: ['Đúng', 'Sai'],
    correctChoice: 1, // Sai
    explanation: 'Số dư 9 lớn hơn số chia 5 nên Bin chưa chia hết lượt. Đúng phải là: 29 : 5 = 5 (dư 4).',
  },
  {
    id: 3,
    type: 'input',
    question: 'Lớp em có 33 bạn chia đều thành 5 nhóm. Mỗi nhóm mấy bạn, còn thừa mấy bạn?',
    hint: 'Em hãy tính: 33 chia 5 được mấy và còn thừa mấy bạn nhé.',
    correctQ: 6,
    correctR: 3,
    labelQ: 'bạn',
    labelR: 'bạn thừa',
    explanation: '33 : 5 = 6 (dư 3). Mỗi nhóm có 6 bạn và còn thừa 3 bạn (3 < 5).',
  },
];

interface Step5VanDungProps {
  onComplete: () => void;
  onTriggerConfetti: () => void;
  onAddScore: (points: number) => void;
}

export const Step5VanDung: React.FC<Step5VanDungProps> = ({
  onComplete,
  onTriggerConfetti,
  onAddScore,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [inputQ, setInputQ] = useState<string>('');
  const [inputR, setInputR] = useState<string>('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const prob = PROBLEMS[currentIdx];

  const handleSubmit = () => {
    if (isAnswered) return;

    let correct = false;
    if (prob.type === 'input') {
      const q = parseInt(inputQ, 10);
      const r = parseInt(inputR, 10);
      correct = q === prob.correctQ && r === prob.correctR;
    } else {
      correct = selectedChoice === prob.correctChoice;
    }

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      onTriggerConfetti();
      onAddScore(2);
    } else {
      sound.playIncorrect();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIdx < PROBLEMS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setShowHint(false);
      setInputQ('');
      setInputR('');
      setSelectedChoice(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      onComplete(); // Hoàn thành bước Vận dụng
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5 animate-fadeIn">
      {/* Tiến trình 3 câu */}
      <div className="w-full bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm flex items-center justify-between">
        <span className="font-display font-extrabold text-slate-800 text-sm sm:text-base">
          Tình huống thực tế: Bài {currentIdx + 1} / 3
        </span>
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>{showHint ? 'Ẩn gợi ý' : '💡 Xem gợi ý'}</span>
        </button>
      </div>

      {/* Khung gợi ý nếu bật */}
      {showHint && (
        <div className="w-full bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-amber-950 flex items-start gap-2.5 animate-fadeIn">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>{prob.hint}</p>
        </div>
      )}

      {/* Thẻ bài toán */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F0DCC0] shadow-md flex flex-col gap-6">
        <h3 className="font-display font-black text-xl sm:text-2xl text-slate-800 leading-snug">
          {prob.question}
        </h3>

        {/* Dạng nhập số */}
        {prob.type === 'input' && (
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
            <div className="flex items-center gap-2">
              <span>Được nhiều nhất:</span>
              <input
                type="number"
                disabled={isAnswered}
                value={inputQ}
                onChange={(e) => setInputQ(e.target.value)}
                placeholder="?"
                className="w-14 h-12 text-center font-display font-black text-xl rounded-xl border-2 border-[#2F80D0] text-[#2F80D0] bg-blue-50"
              />
              <span>{prob.labelQ}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Còn thừa:</span>
              <input
                type="number"
                disabled={isAnswered}
                value={inputR}
                onChange={(e) => setInputR(e.target.value)}
                placeholder="?"
                className="w-14 h-12 text-center font-display font-black text-xl rounded-xl border-2 border-[#E2463B] text-[#E2463B] bg-red-50"
              />
              <span>{prob.labelR}</span>
            </div>

            {!isAnswered && (
              <button
                type="button"
                onClick={handleSubmit}
                className="py-2.5 px-6 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm shadow-xs cursor-pointer btn-press"
              >
                Trả lời
              </button>
            )}
          </div>
        )}

        {/* Dạng chọn Đúng / Sai */}
        {prob.type === 'choice' && (
          <div className="grid grid-cols-2 gap-4">
            {prob.options?.map((opt, idx) => {
              const isSel = selectedChoice === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => {
                    setSelectedChoice(idx);
                  }}
                  className={`py-4 px-4 rounded-2xl font-display font-black text-xl border-2 transition-all cursor-pointer ${
                    isSel
                      ? 'bg-amber-100 border-[#F07B12] text-amber-950 scale-102 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}

            {!isAnswered && selectedChoice !== null && (
              <div className="col-span-2 flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="py-2.5 px-8 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm shadow-xs cursor-pointer btn-press"
                >
                  Xác nhận
                </button>
              </div>
            )}
          </div>
        )}

        {/* Lời giải sau khi nộp */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border-2 space-y-2 animate-fadeIn ${
              isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
            }`}
          >
            <p className="font-display font-black text-base text-slate-900">
              {isCorrect ? '🎉 Tuyệt vời! Em giải quyết tình huống rất tốt!' : 'Chưa đúng rồi!'}
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
              💡 <strong>Lời giải:</strong> {prob.explanation}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-5 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-bold text-sm shadow-xs flex items-center gap-1.5 cursor-pointer btn-press"
              >
                <span>{currentIdx < PROBLEMS.length - 1 ? 'Tình huống tiếp theo →' : 'Hoàn thành vận dụng ✓'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
