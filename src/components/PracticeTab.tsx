import React, { useState, useMemo } from 'react';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { TabId } from './TabNav.tsx';
import { GroupInfo } from '../types/classroom.ts';
import { QuestionStepBanner, QuestionStage } from './classroom/QuestionStepBanner.tsx';
import { ClassCorrectCounter } from './classroom/ClassCorrectCounter.tsx';
import { StudentCaller } from './classroom/StudentCaller.tsx';

interface Question {
  id: string;
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  isExact: boolean;
}

const POOL_EXACT: [number, number][] = [
  [24, 6],
  [35, 5],
  [42, 7],
  [27, 3],
  [36, 9],
  [32, 4],
  [48, 8],
  [18, 2],
];

const POOL_REMAINDER: [number, number][] = [
  [17, 5],
  [23, 4],
  [29, 6],
  [19, 3],
  [38, 7],
  [26, 8],
  [44, 9],
  [13, 2],
];

export function generatePracticeQuestions(): Question[] {
  // Trộn ngẫu nhiên 4 phép chia hết và 4 phép chia có dư
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const exactChosen = shuffle(POOL_EXACT).slice(0, 4);
  const remainderChosen = shuffle(POOL_REMAINDER).slice(0, 4);

  const combined = shuffle([
    ...exactChosen.map(([d, v]) => ({
      dividend: d,
      divisor: v,
      quotient: Math.floor(d / v),
      remainder: d % v,
      isExact: true,
    })),
    ...remainderChosen.map(([d, v]) => ({
      dividend: d,
      divisor: v,
      quotient: Math.floor(d / v),
      remainder: d % v,
      isExact: false,
    })),
  ]);

  return combined.map((item, idx) => ({
    id: `p-${idx + 1}-${item.dividend}-${item.divisor}`,
    ...item,
  }));
}

interface PracticeTabProps {
  groups: GroupInfo[];
  activeGroupId: string;
  onScoreGroup: (groupId: string, points: number) => void;
  onNextGroup: () => void;
  onGoToTab: (tab: TabId) => void;
  onTriggerConfetti: () => void;
  onRecordAnswer: (stage: string, questionText: string, isCorrect: boolean, classCorrect?: number, classSize?: number) => void;
  questions: Question[];
  onResetQuestions: () => void;
  classSize?: number;
  enableCountdown?: boolean;
  countdownDuration?: 5 | 10 | 15;
  calledStudents?: number[];
  onCallStudent?: (num: number, batDauVongMoi: boolean) => void;
  onSkipStudent?: (num: number) => void;
}

export const PracticeTab: React.FC<PracticeTabProps> = ({
  groups,
  activeGroupId,
  onScoreGroup,
  onNextGroup,
  onGoToTab,
  onTriggerConfetti,
  onRecordAnswer,
  questions,
  classSize = 35,
  enableCountdown = true,
  countdownDuration = 10,
  calledStudents = [],
  onCallStudent = () => {},
  onSkipStudent = () => {},
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userChoice, setUserChoice] = useState<'exact' | 'remainder' | null>(null);
  const [results, setResults] = useState<(boolean | null)[]>(new Array(8).fill(null));

  // 3 bước câu hỏi: 'countdown' | 'answering' | 'results'
  const [questionStage, setQuestionStage] = useState<QuestionStage>(
    enableCountdown ? 'countdown' : 'answering'
  );
  const [classCorrectCount, setClassCorrectCount] = useState<number>(classSize);

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) || groups[0],
    [groups, activeGroupId]
  );

  const currentQ = useMemo(() => questions[currentIndex] || questions[0], [questions, currentIndex]);

  const isButtonsLocked = questionStage === 'countdown';

  const handleSelectChoice = (choice: 'exact' | 'remainder') => {
    if (questionStage !== 'answering') return;

    setUserChoice(choice);
    setQuestionStage('results');

    const isCorrect = (choice === 'exact' && currentQ.isExact) || (choice === 'remainder' && !currentQ.isExact);

    const newResults = [...results];
    newResults[currentIndex] = isCorrect;
    setResults(newResults);

    if (isCorrect) {
      sound.playCorrect();
      onTriggerConfetti();
      onScoreGroup(activeGroup.id, 1);
    } else {
      sound.playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    const questionText = `${currentQ.dividend} : ${currentQ.divisor}`;
    const isCorrect = results[currentIndex] === true;

    // Ghi nhận cả kết quả đại diện và số bạn dưới lớp đúng
    onRecordAnswer('Chặng 2: Hết hay dư', questionText, isCorrect, classCorrectCount, classSize);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserChoice(null);
      setQuestionStage(enableCountdown ? 'countdown' : 'answering');
      setClassCorrectCount(classSize);
      onNextGroup(); // Tự đổi lượt sang nhóm tiếp theo (vòng tròn)
    } else {
      onGoToTab('challenge');
    }
  };

  const isCurrentCorrect = results[currentIndex] === true;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 items-center">
      {/* TIẾN TRÌNH 8 CÂU */}
      <div className="w-full bg-white rounded-2xl p-4 border-2 border-[#F0DCC0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-base text-slate-800">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            (Đúng +1 điểm)
          </span>
        </div>

        {/* Dãy chấm tròn trạng thái */}
        <div className="flex items-center gap-2">
          {questions.map((q, idx) => {
            const res = results[idx];
            const isCur = idx === currentIndex;
            return (
              <div
                key={q.id}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all ${
                  isCur ? 'ring-4 ring-orange-300 scale-110 font-black' : ''
                } ${
                  res === true
                    ? 'bg-[#3F9B4A] text-white shadow-xs'
                    : res === false
                    ? 'bg-[#E2463B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 border border-slate-300'
                }`}
              >
                {res === true ? '✓' : res === false ? '✗' : idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* DẢI 3 BƯỚC: ① CẢ LỚP TRẢ LỜI ➔ ② ĐẠI DIỆN LÊN BẤM ➔ ③ XEM KẾT QUẢ */}
      <QuestionStepBanner
        stage={questionStage}
        enableCountdown={enableCountdown}
        countdownSeconds={countdownDuration}
        onCountdownFinish={() => setQuestionStage('answering')}
        onSkipCountdown={() => setQuestionStage('answering')}
      />

      {/* THẺ BÀI CHÍNH */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#F0DCC0] shadow-md flex flex-col items-center gap-5">
        {/* Nhãn lượt đội đang chơi + Nút chọn bạn lên bấm */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full font-display font-black text-sm sm:text-base border-2 shadow-xs transition-all bg-white"
            style={{
              borderColor: activeGroup.colorHex,
              color: activeGroup.colorHex,
            }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: activeGroup.colorHex }}
            />
            <span>Lượt của {activeGroup.name}</span>
            <Sparkles className="w-4 h-4" />
          </div>

          {/* NÚT CHỌN BẠN LÊN BẤM */}
          <StudentCaller
            classSize={classSize}
            calledStudents={calledStudents}
            onCallStudent={onCallStudent}
            onSkipStudent={onSkipStudent}
          />
        </div>

        {/* THẺ LỚN VIỀN NÉT ĐỨT HIỂN THỊ PHÉP TÍNH KHỔNG LỒ */}
        <div className="w-full max-w-lg py-7 px-6 rounded-3xl border-4 border-dashed border-[#F39A1E]/60 bg-[#FFFDF8] flex items-center justify-center shadow-inner">
          <div className="font-display font-black text-5xl sm:text-7xl text-slate-800 tracking-wider select-none text-center">
            {currentQ.dividend} : {currentQ.divisor} = ?
          </div>
        </div>

        {/* 2 NÚT LỚN: CHIA HẾT & CÓ DƯ */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={isButtonsLocked || questionStage === 'results'}
            onClick={() => handleSelectChoice('exact')}
            className={`py-5 px-4 rounded-2xl font-display font-black text-lg sm:text-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 btn-press ${
              questionStage === 'results' && userChoice === 'exact'
                ? currentQ.isExact
                  ? 'bg-[#3F9B4A] text-white shadow-[0_4px_0_#2C7535] scale-102 ring-4 ring-emerald-300'
                  : 'bg-[#E2463B] text-white shadow-[0_4px_0_#A81D14] ring-4 ring-red-300'
                : isButtonsLocked
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#3F9B4A] hover:bg-[#32853b] text-white shadow-[0_6px_0_#2C7535] active:translate-y-1 active:shadow-none'
            } disabled:opacity-80`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-6 h-6 stroke-[3]" />
              <span>Chia hết</span>
            </div>
            <span className="text-xs font-semibold opacity-90">(Dư 0)</span>
          </button>

          <button
            type="button"
            disabled={isButtonsLocked || questionStage === 'results'}
            onClick={() => handleSelectChoice('remainder')}
            className={`py-5 px-4 rounded-2xl font-display font-black text-lg sm:text-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 btn-press ${
              questionStage === 'results' && userChoice === 'remainder'
                ? !currentQ.isExact
                  ? 'bg-[#E2463B] text-white shadow-[0_4px_0_#A81D14] scale-102 ring-4 ring-red-300'
                  : 'bg-slate-400 text-white shadow-[0_4px_0_#64748b]'
                : isButtonsLocked
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#E2463B] hover:bg-[#c93329] text-white shadow-[0_6px_0_#A81D14] active:translate-y-1 active:shadow-none'
            } disabled:opacity-80`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">◐</span>
              <span>Có dư</span>
            </div>
            <span className="text-xs font-semibold opacity-90">(Dư &gt; 0)</span>
          </button>
        </div>

        {/* BƯỚC ③: HỘP PHẢN HỒI KÈM Ô GHI SỐ BẠN TRẢ LỜI ĐÚNG */}
        {questionStage === 'results' && (
          <div
            className={`w-full max-w-lg p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-3 animate-fadeIn ${
              isCurrentCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl text-white font-bold shrink-0 ${
                  isCurrentCorrect ? 'bg-[#3F9B4A]' : 'bg-[#E2463B]'
                }`}
              >
                {isCurrentCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </div>
              <div className="space-y-1.5 text-xs sm:text-sm font-bold flex-1">
                {isCurrentCorrect ? (
                  <>
                    <p className="text-emerald-800 text-sm sm:text-base font-extrabold">
                      🎉 Đúng rồi! +1 điểm cho {activeGroup.name}!
                    </p>
                    <p className="text-slate-800">
                      {currentQ.dividend} : {currentQ.divisor} ={' '}
                      <span className="text-[#2F80D0] font-black">
                        {currentQ.quotient}
                      </span>
                      {currentQ.remainder > 0 ? (
                        <>
                          {' '}
                          (dư{' '}
                          <span className="text-[#E2463B] font-black">
                            {currentQ.remainder}
                          </span>
                          ) &rarr;{' '}
                          <span className="text-[#E2463B] underline">
                            phép chia có dư
                          </span>
                        </>
                      ) : (
                        <>
                          {' '}
                          &rarr;{' '}
                          <span className="text-emerald-800 underline">
                            phép chia hết
                          </span>
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-red-700 text-sm sm:text-base font-extrabold">
                      Chưa đúng rồi, cùng xem lại nhé!
                    </p>
                    <p className="text-slate-800">
                      {currentQ.dividend} : {currentQ.divisor} ={' '}
                      <span className="text-[#2F80D0] font-black">
                        {currentQ.quotient}
                      </span>
                      {currentQ.remainder > 0 ? (
                        <>
                          {' '}
                          (dư{' '}
                          <span className="text-[#E2463B] font-black">
                            {currentQ.remainder}
                          </span>
                          ) &rarr;{' '}
                          <span className="text-[#E2463B]">
                            phép chia có dư
                          </span>
                        </>
                      ) : (
                        <>
                          {' '}
                          &rarr;{' '}
                          <span className="text-emerald-800">
                            phép chia hết
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-600 bg-white/80 p-1.5 rounded border border-slate-200">
                      Thử lại: {currentQ.quotient} × {currentQ.divisor}
                      {currentQ.remainder > 0 ? ` + ${currentQ.remainder}` : ''} = {currentQ.dividend}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Ô KIỂM ĐẾM SỐ BẠN DƯỚI LỚP TRẢ LỜI ĐÚNG */}
            <ClassCorrectCounter
              classSize={classSize}
              correctCount={classCorrectCount}
              onChange={setClassCorrectCount}
            />

            {/* Nút Câu tiếp theo */}
            <div className="pt-2 border-t border-slate-200/60 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="py-2.5 px-6 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-extrabold text-sm sm:text-base shadow-[0_4px_0_#aa4f03] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer btn-press"
              >
                <span>
                  {currentIndex < questions.length - 1
                    ? 'Câu tiếp theo'
                    : 'Sang Chặng 3: Thử thách'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
