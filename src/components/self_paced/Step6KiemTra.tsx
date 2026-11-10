import React, { useState } from 'react';
import { Award, Check, X, RotateCcw, ArrowRight, Star, AlertCircle, Compass } from 'lucide-react';
import { sound } from '../../utils/audio.ts';
import { ghiDiem, hoanThanh } from '../../utils/tracking.ts';

export interface ExamQuestion {
  id: number;
  type: 'input' | 'choice';
  question: string;
  // Dạng input
  dividend?: number;
  divisor?: number;
  correctQ?: number;
  correctR?: number;
  labelQ?: string;
  labelR?: string;
  // Dạng choice
  options?: string[];
  correctChoice?: number;
  explanation: string;
}

const SET_A: ExamQuestion[] = [
  {
    id: 1,
    type: 'input',
    question: 'Tính: 31 : 4 = ? (dư ?)',
    dividend: 31,
    divisor: 4,
    correctQ: 7,
    correctR: 3,
    labelQ: 'thương',
    labelR: 'số dư',
    explanation: '31 : 4 = 7 (dư 3). Thử lại: 7 × 4 + 3 = 31 (số dư 3 < 4).',
  },
  {
    id: 2,
    type: 'choice',
    question: 'Phép chia nào dưới đây là phép chia hết?',
    options: ['22 : 3', '40 : 8', '50 : 6'],
    correctChoice: 1, // 40 : 8
    explanation: '40 : 8 = 5 (số dư bằng 0 là phép chia hết). Còn 22 : 3 = 7 (dư 1); 50 : 6 = 8 (dư 2).',
  },
  {
    id: 3,
    type: 'choice',
    question: 'Một phép chia có số chia là 6. Số dư lớn nhất có thể là số nào?',
    options: ['5', '6', '7'],
    correctChoice: 0, // 5
    explanation: 'Số dư luôn bé hơn số chia (bé hơn 6). Do đó số dư lớn nhất có thể là 5.',
  },
  {
    id: 4,
    type: 'input',
    question: 'Tính: 45 : 7 = ? (dư ?)',
    dividend: 45,
    divisor: 7,
    correctQ: 6,
    correctR: 3,
    labelQ: 'thương',
    labelR: 'số dư',
    explanation: '45 : 7 = 6 (dư 3). Thử lại: 6 × 7 + 3 = 45 (số dư 3 < 7).',
  },
  {
    id: 5,
    type: 'input',
    question: 'Có 20 cái bánh xếp vào các hộp, mỗi hộp 3 cái. Xếp được nhiều nhất mấy hộp, còn thừa mấy cái?',
    dividend: 20,
    divisor: 3,
    correctQ: 6,
    correctR: 2,
    labelQ: 'hộp',
    labelR: 'cái bánh thừa',
    explanation: '20 : 3 = 6 (dư 2). Vậy xếp được 6 hộp và còn thừa 2 cái bánh.',
  },
];

// Bộ đề B đổi số khi làm lại bài kiểm tra
const SET_B: ExamQuestion[] = [
  {
    id: 1,
    type: 'input',
    question: 'Tính: 34 : 5 = ? (dư ?)',
    dividend: 34,
    divisor: 5,
    correctQ: 6,
    correctR: 4,
    labelQ: 'thương',
    labelR: 'số dư',
    explanation: '34 : 5 = 6 (dư 4). Thử lại: 6 × 5 + 4 = 34 (số dư 4 < 5).',
  },
  {
    id: 2,
    type: 'choice',
    question: 'Phép chia nào dưới đây là phép chia hết?',
    options: ['28 : 5', '36 : 6', '43 : 7'],
    correctChoice: 1, // 36 : 6
    explanation: '36 : 6 = 6 (số dư bằng 0 là phép chia hết). Còn 28 : 5 = 5 (dư 3); 43 : 7 = 6 (dư 1).',
  },
  {
    id: 3,
    type: 'choice',
    question: 'Một phép chia có số chia là 8. Số dư lớn nhất có thể là số nào?',
    options: ['7', '8', '9'],
    correctChoice: 0, // 7
    explanation: 'Số dư luôn bé hơn số chia (bé hơn 8). Do đó số dư lớn nhất có thể là 7.',
  },
  {
    id: 4,
    type: 'input',
    question: 'Tính: 39 : 6 = ? (dư ?)',
    dividend: 39,
    divisor: 6,
    correctQ: 6,
    correctR: 3,
    labelQ: 'thương',
    labelR: 'số dư',
    explanation: '39 : 6 = 6 (dư 3). Thử lại: 6 × 6 + 3 = 39 (số dư 3 < 6).',
  },
  {
    id: 5,
    type: 'input',
    question: 'Có 25 quả cam chia vào các rổ, mỗi rổ 4 quả. Chia được nhiều nhất mấy rổ, còn thừa mấy quả?',
    dividend: 25,
    divisor: 4,
    correctQ: 6,
    correctR: 1,
    labelQ: 'rổ',
    labelR: 'quả cam thừa',
    explanation: '25 : 4 = 6 (dư 1). Vậy chia được 6 rổ và còn thừa 1 quả cam.',
  },
];

interface Step6KiemTraProps {
  onComplete: (score: number, stars: number) => void;
  onTriggerConfetti: () => void;
  onGoToKhamPha: () => void;
}

export const Step6KiemTra: React.FC<Step6KiemTraProps> = ({
  onComplete,
  onTriggerConfetti,
  onGoToKhamPha,
}) => {
  const [useSetB, setUseSetB] = useState<boolean>(false);
  const questions = useSetB ? SET_B : SET_A;

  // Lưu câu trả lời của học sinh cho 5 câu
  const [answers, setAnswers] = useState<{ [id: number]: { q?: string; r?: string; choice?: number } }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleInputAnswer = (id: number, field: 'q' | 'r', val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: val },
    }));
  };

  const handleChoiceAnswer = (id: number, optIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], choice: optIdx },
    }));
  };

  const handleSubmitExam = () => {
    sound.playClick();
    let totalScore = 0;

    questions.forEach((q) => {
      const userAns = answers[q.id];
      if (!userAns) return;

      if (q.type === 'input') {
        const uQ = parseInt(userAns.q || '', 10);
        const uR = parseInt(userAns.r || '', 10);
        if (uQ === q.correctQ && uR === q.correctR) {
          totalScore += 2;
        }
      } else {
        if (userAns.choice === q.correctChoice) {
          totalScore += 2;
        }
      }
    });

    setScore(totalScore);
    setIsSubmitted(true);

    const stars = totalScore >= 9 ? 3 : totalScore >= 7 ? 2 : 1;

    // Ghi điểm và trạng thái vào SCORM
    ghiDiem(totalScore, 10);
    hoanThanh(totalScore >= 5);

    if (totalScore >= 7) {
      sound.playCorrect();
      onTriggerConfetti();
    } else {
      sound.playIncorrect();
    }

    onComplete(totalScore, stars);
  };

  const handleRetryExam = () => {
    sound.playClick();
    setUseSetB(!useSetB);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const stars = score >= 9 ? 3 : score >= 7 ? 2 : 1;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Banner đầu bài kiểm tra */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 rounded-2xl text-amber-900 font-black text-xl">
            📝
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-800">
              Bài Kiểm Tra Đánh Giá (5 câu · 10 điểm)
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              Em hãy làm bài một mình, không có gợi ý. Khi làm xong, hãy bấm &quot;Nộp bài&quot; nhé!
            </p>
          </div>
        </div>

        {useSetB && (
          <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
            Đề số 2 (Đã đổi số)
          </span>
        )}
      </div>

      {/* DANH SÁCH 5 CÂU HỎI */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAns = answers[q.id];
          const isCorrect =
            isSubmitted &&
            (q.type === 'input'
              ? parseInt(userAns?.q || '', 10) === q.correctQ &&
                parseInt(userAns?.r || '', 10) === q.correctR
              : userAns?.choice === q.correctChoice);

          return (
            <div
              key={q.id}
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-red-50/70 border-red-300'
                  : 'bg-white border-[#F0DCC0] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-display font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-display font-black text-base sm:text-lg text-slate-800">
                    {q.question}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0">
                  2 điểm
                </span>
              </div>

              {/* DẠNG NHẬP SỐ */}
              {q.type === 'input' && (
                <div className="flex flex-wrap items-center gap-3 pl-9 text-sm font-bold">
                  <div className="flex items-center gap-1.5">
                    <span>Thương:</span>
                    <input
                      type="number"
                      disabled={isSubmitted}
                      value={userAns?.q || ''}
                      onChange={(e) => handleInputAnswer(q.id, 'q', e.target.value)}
                      placeholder="?"
                      className="w-14 h-11 text-center font-display font-black text-xl rounded-xl border-2 border-[#2F80D0] text-[#2F80D0] bg-blue-50/70"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span>Số dư:</span>
                    <input
                      type="number"
                      disabled={isSubmitted}
                      value={userAns?.r || ''}
                      onChange={(e) => handleInputAnswer(q.id, 'r', e.target.value)}
                      placeholder="?"
                      className="w-14 h-11 text-center font-display font-black text-xl rounded-xl border-2 border-[#E2463B] text-[#E2463B] bg-red-50/70"
                    />
                  </div>
                </div>
              )}

              {/* DẠNG CHỌN */}
              {q.type === 'choice' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pl-9">
                  {q.options?.map((opt, optIdx) => {
                    const isSel = userAns?.choice === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleChoiceAnswer(q.id, optIdx)}
                        className={`py-2.5 px-4 rounded-xl font-display font-bold text-sm sm:text-base border-2 transition-all cursor-pointer ${
                          isSel
                            ? 'bg-amber-100 border-[#F07B12] text-amber-950 font-black shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* LỜI GIẢI SAU KHI NỘP BÀI */}
              {isSubmitted && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 pl-9 text-xs sm:text-sm font-bold space-y-1">
                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-[#3F9B4A] flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" /> Đúng (+2 điểm)
                      </span>
                    ) : (
                      <span className="text-[#E2463B] flex items-center gap-1">
                        <X className="w-4 h-4 stroke-[3]" /> Chưa đúng (0 điểm)
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700">
                    💡 <strong>Lời giải:</strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* NÚT NỘP BÀI */}
      {!isSubmitted && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleSubmitExam}
            className="py-4 px-10 rounded-2xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-black text-xl shadow-[0_5px_0_#205a27] active:translate-y-1 active:shadow-none transition-all cursor-pointer btn-press"
          >
            Nộp bài kiểm tra ✍️
          </button>
        </div>
      )}

      {/* KẾT QUẢ ĐIỂM SỐ SAU KHI NỘP BÀI */}
      {isSubmitted && (
        <div className="w-full bg-linear-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-6 sm:p-8 border-3 border-amber-400 shadow-md flex flex-col items-center text-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs">
            {stars === 3 ? '🏆' : stars === 2 ? '⭐' : '💪'}
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-black text-3xl sm:text-4xl text-amber-950">
              Điểm của em: {score} / 10 điểm
            </h3>
            <div className="flex justify-center items-center gap-1 text-3xl">
              {Array.from({ length: stars }).map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <p className="text-sm sm:text-base font-bold text-amber-900 pt-1">
              {score >= 9
                ? 'Tuyệt đỉnh! Em đã xuất sắc nắm vững toàn bộ bài học!'
                : score >= 7
                ? 'Rất tốt! Em đã hiểu bài và làm đúng hầu hết các câu!'
                : 'Cố lên em nhé! Em hãy xem lại phần Khám phá hoặc làm lại bài kiểm tra nhé!'}
            </p>
          </div>

          {/* Nếu dưới 7 điểm, có nút Ôn lại khám phá và Làm lại kiểm tra */}
          {score < 7 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onGoToKhamPha}
                className="py-2.5 px-5 rounded-xl bg-[#2F80D0] hover:bg-[#2069b2] text-white font-display font-bold text-sm shadow-xs flex items-center gap-1.5 cursor-pointer btn-press"
              >
                <Compass className="w-4 h-4" />
                <span>Ôn lại phần Khám phá</span>
              </button>

              <button
                type="button"
                onClick={handleRetryExam}
                className="py-2.5 px-5 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-bold text-sm shadow-xs flex items-center gap-1.5 cursor-pointer btn-press"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài kiểm tra (Đề mới)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
