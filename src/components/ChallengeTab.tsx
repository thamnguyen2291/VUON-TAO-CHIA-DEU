import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Check, X, ArrowRight, Delete, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { TabId } from './TabNav.tsx';
import { GroupInfo } from '../types/classroom.ts';
import { QuestionStepBanner, QuestionStage } from './classroom/QuestionStepBanner.tsx';
import { ClassCorrectCounter } from './classroom/ClassCorrectCounter.tsx';
import { StudentCaller } from './classroom/StudentCaller.tsx';

export interface ChallengeItem {
  id: number;
  type: 'input' | 'choice';
  question: string;
  context?: string;
  // Cho dạng nhập số
  dividend?: number;
  divisor?: number;
  correctQuotient?: number;
  correctRemainder?: number;
  labelQuotient?: string;
  labelRemainder?: string;
  // Cho dạng chọn
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  checkWork?: string;
}

export const CHALLENGE_QUESTIONS: ChallengeItem[] = [
  {
    id: 1,
    type: 'input',
    question: 'Tính: 22 : 4 = ? (dư ?)',
    dividend: 22,
    divisor: 4,
    correctQuotient: 5,
    correctRemainder: 2,
    labelQuotient: 'Thương',
    labelRemainder: 'Số dư',
    explanation: '22 chia 4 được 5, dư 2 (vì 5 × 4 = 20, 22 - 20 = 2; số dư 2 bé hơn số chia 4).',
    checkWork: '5 × 4 + 2 = 22',
  },
  {
    id: 2,
    type: 'choice',
    question: 'Một phép chia có số chia là 4. Số dư lớn nhất có thể là số nào?',
    options: ['3', '4', '5'],
    correctOptionIndex: 0,
    explanation: 'Số dư luôn bé hơn số chia. Bé hơn 4 thì các số dư có thể là 0, 1, 2, 3. Vậy số dư lớn nhất là 3.',
    checkWork: 'Số dư bao giờ cũng bé hơn số chia (3 < 4).',
  },
  {
    id: 3,
    type: 'choice',
    question: 'Bạn Bin tính: 29 : 5 = 4 (dư 9). Bin làm đúng hay sai?',
    options: ['Đúng', 'Sai'],
    correctOptionIndex: 1,
    explanation: 'Số dư 9 lớn hơn số chia 5 nên còn chia tiếp được. Đúng phải là 29 : 5 = 5 (dư 4).',
    checkWork: '5 × 5 + 4 = 29 (số dư 4 < 5).',
  },
  {
    id: 4,
    type: 'input',
    question: 'Có 26 quả cam xếp vào các đĩa, mỗi đĩa 6 quả. Xếp được nhiều nhất mấy đĩa, còn thừa mấy quả?',
    dividend: 26,
    divisor: 6,
    correctQuotient: 4,
    correctRemainder: 2,
    labelQuotient: 'đĩa (thương)',
    labelRemainder: 'quả thừa (số dư)',
    explanation: '26 : 6 = 4 (dư 2). Xếp được nhiều nhất 4 đĩa và còn thừa 2 quả.',
    checkWork: '4 × 6 + 2 = 26 (thừa 2 quả ít hơn 6 quả/đĩa).',
  },
  {
    id: 5,
    type: 'choice',
    question: 'Phép chia nào dưới đây là phép chia hết?',
    options: ['31 : 4', '45 : 9', '50 : 7'],
    correctOptionIndex: 1,
    explanation: '45 : 9 = 5 (số dư bằng 0 là phép chia hết). Còn 31 : 4 = 7 (dư 3); 50 : 7 = 7 (dư 1).',
    checkWork: '5 × 9 = 45 (chia hết).',
  },
  {
    id: 6,
    type: 'input',
    question: 'Lớp em có 33 bạn chia đều thành 5 nhóm. Mỗi nhóm mấy bạn, còn thừa mấy bạn?',
    dividend: 33,
    divisor: 5,
    correctQuotient: 6,
    correctRemainder: 3,
    labelQuotient: 'bạn (thương)',
    labelRemainder: 'bạn thừa (số dư)',
    explanation: '33 : 5 = 6 (dư 3). Mỗi nhóm có 6 bạn và còn thừa 3 bạn.',
    checkWork: '6 × 5 + 3 = 33 (còn thừa 3 bạn < 5 bạn).',
  },
];

interface ChallengeTabProps {
  groups: GroupInfo[];
  activeGroupId: string;
  onScoreGroup: (groupId: string, points: number) => void;
  onNextGroup: () => void;
  onGoToTab: (tab: TabId) => void;
  onTriggerConfetti: () => void;
  onRecordAnswer: (stage: string, questionText: string, isCorrect: boolean, classCorrect?: number, classSize?: number) => void;
  classSize?: number;
  enableCountdown?: boolean;
  countdownDuration?: 5 | 10 | 15;
  calledStudents?: number[];
  onCallStudent?: (num: number) => void;
  onSkipStudent?: (num: number) => void;
}

export const ChallengeTab: React.FC<ChallengeTabProps> = ({
  groups,
  activeGroupId,
  onScoreGroup,
  onNextGroup,
  onGoToTab,
  onTriggerConfetti,
  onRecordAnswer,
  classSize = 35,
  enableCountdown = true,
  countdownDuration = 10,
  calledStudents = [],
  onCallStudent = () => {},
  onSkipStudent = () => {},
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputQuotient, setInputQuotient] = useState<string>('');
  const [inputRemainder, setInputRemainder] = useState<string>('');
  const [activeInputBox, setActiveInputBox] = useState<'q' | 'r'>('q');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [results, setResults] = useState<(boolean | null)[]>(new Array(6).fill(null));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3 bước câu hỏi: 'countdown' | 'answering' | 'results'
  const [questionStage, setQuestionStage] = useState<QuestionStage>(
    enableCountdown ? 'countdown' : 'answering'
  );
  const [classCorrectCount, setClassCorrectCount] = useState<number>(classSize);

  const quotientRef = useRef<HTMLInputElement | null>(null);
  const remainderRef = useRef<HTMLInputElement | null>(null);

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) || groups[0],
    [groups, activeGroupId]
  );

  const currentQ = CHALLENGE_QUESTIONS[currentIndex];
  const isButtonsLocked = questionStage === 'countdown';

  // Xử lý nộp câu hỏi dạng nhập số
  const handleAnswerInput = useCallback(() => {
    if (questionStage !== 'answering') return;
    setErrorMessage(null);

    if (inputQuotient.trim() === '' || inputRemainder.trim() === '') {
      setErrorMessage('Em điền đủ cả hai ô nhé (nếu không có số dư thì ghi 0).');
      sound.playIncorrect();
      return;
    }

    const qVal = parseInt(inputQuotient, 10);
    const rVal = parseInt(inputRemainder, 10);

    // Cảnh báo sư phạm: số dư lớn hơn hoặc bằng số chia
    if (currentQ.divisor !== undefined && rVal >= currentQ.divisor) {
      setErrorMessage(
        `Số dư ${rVal} không bé hơn số chia ${currentQ.divisor} nên chưa chia hết lượt.`
      );
    }

    const isCorrect =
      qVal === currentQ.correctQuotient && rVal === currentQ.correctRemainder;

    setQuestionStage('results');
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
  }, [
    questionStage,
    inputQuotient,
    inputRemainder,
    currentQ,
    results,
    currentIndex,
    activeGroup.id,
    onTriggerConfetti,
    onScoreGroup,
  ]);

  // Xử lý nộp câu hỏi dạng chọn
  const handleSelectChoice = (optionIndex: number) => {
    if (questionStage !== 'answering') return;
    setErrorMessage(null);
    setSelectedChoice(optionIndex);
    setQuestionStage('results');

    const isCorrect = optionIndex === currentQ.correctOptionIndex;
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

  // Bàn phím số trên màn hình
  const handleKeypadPress = (key: string) => {
    if (questionStage !== 'answering') return;
    sound.playClick();
    setErrorMessage(null);

    if (key === 'backspace') {
      if (activeInputBox === 'r') {
        if (inputRemainder.length > 0) {
          setInputRemainder((prev) => prev.slice(0, -1));
        } else {
          setActiveInputBox('q');
        }
      } else {
        setInputQuotient((prev) => prev.slice(0, -1));
      }
    } else if (key === 'enter') {
      handleAnswerInput();
    } else {
      // Phím số 0-9
      if (activeInputBox === 'q') {
        if (inputQuotient.length < 2) {
          const newVal = inputQuotient + key;
          setInputQuotient(newVal);
          if (newVal.length >= 1) {
            setTimeout(() => setActiveInputBox('r'), 80);
          }
        }
      } else {
        if (inputRemainder.length < 2) {
          setInputRemainder((prev) => prev + key);
        }
      }
    }
  };

  // Hỗ trợ phím cứng máy tính
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (questionStage === 'results') {
        if (e.key === 'Enter') {
          handleNextQuestion();
        }
        return;
      }
      if (currentQ.type !== 'input') return;

      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        handleKeypadPress('backspace');
      } else if (e.key === 'Enter') {
        handleAnswerInput();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questionStage, currentQ.type, handleAnswerInput]);

  const handleNextQuestion = () => {
    sound.playClick();
    const isCorrect = results[currentIndex] === true;

    // Ghi nhận cả kết quả đại diện và số bạn dưới lớp đúng
    onRecordAnswer('Chặng 3: Thử thách', currentQ.question, isCorrect, classCorrectCount, classSize);

    if (currentIndex < CHALLENGE_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setInputQuotient('');
      setInputRemainder('');
      setActiveInputBox('q');
      setSelectedChoice(null);
      setErrorMessage(null);
      setQuestionStage(enableCountdown ? 'countdown' : 'answering');
      setClassCorrectCount(classSize);
      onNextGroup(); // Tự đổi lượt sang nhóm tiếp theo (vòng tròn)
    } else {
      onGoToTab('summary');
    }
  };

  const isCurrentCorrect = results[currentIndex] === true;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 items-center">
      {/* TIẾN TRÌNH 6 CÂU */}
      <div className="w-full bg-white rounded-2xl p-4 border-2 border-[#F0DCC0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-base text-slate-800">
            Câu {currentIndex + 1} / {CHALLENGE_QUESTIONS.length}
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            (Đúng +1 điểm)
          </span>
        </div>

        {/* Dãy chấm tròn */}
        <div className="flex items-center gap-2">
          {CHALLENGE_QUESTIONS.map((q, idx) => {
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

      {/* THẺ BÀI THỬ THÁCH */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#F0DCC0] shadow-md flex flex-col items-center gap-5">
        {/* Nhãn lượt đội + Nút chọn bạn lên bấm */}
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

          <StudentCaller
            classSize={classSize}
            calledStudents={calledStudents}
            onCallStudent={onCallStudent}
            onSkipStudent={onSkipStudent}
          />
        </div>

        {/* ĐỀ BÀI TO RÕ */}
        <div className="w-full text-center max-w-2xl">
          <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-slate-800 leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* DẠNG 1: NHẬP SỐ VỚI Ô XANH (THƯƠNG) VÀ Ô ĐỎ (DƯ) */}
        {currentQ.type === 'input' && (
          <div className="w-full max-w-xl flex flex-col items-center gap-4">
            {/* Phép tính trực quan */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-800">
                {currentQ.dividend} : {currentQ.divisor} =
              </span>

              {/* Ô Thương (Màu Xanh Dương) */}
              <button
                type="button"
                disabled={isButtonsLocked || questionStage === 'results'}
                onClick={() => {
                  sound.playClick();
                  setActiveInputBox('q');
                  quotientRef.current?.focus();
                }}
                className={`w-16 h-14 sm:w-20 sm:h-16 rounded-2xl border-3 flex items-center justify-center font-display font-black text-2xl sm:text-3xl transition-all cursor-pointer ${
                  activeInputBox === 'q' && questionStage === 'answering'
                    ? 'border-[#2F80D0] bg-blue-100/90 ring-4 ring-blue-300 text-[#2F80D0] scale-105'
                    : 'border-[#2F80D0]/50 bg-blue-50 text-[#2F80D0]'
                }`}
              >
                {inputQuotient || <span className="text-blue-300 text-lg">?</span>}
              </button>

              <span className="font-display font-black text-xl sm:text-2xl text-slate-700">
                (dư
              </span>

              {/* Ô Số Dư (Màu Đỏ) */}
              <button
                type="button"
                disabled={isButtonsLocked || questionStage === 'results'}
                onClick={() => {
                  sound.playClick();
                  setActiveInputBox('r');
                  remainderRef.current?.focus();
                }}
                className={`w-16 h-14 sm:w-20 sm:h-16 rounded-2xl border-3 flex items-center justify-center font-display font-black text-2xl sm:text-3xl transition-all cursor-pointer ${
                  activeInputBox === 'r' && questionStage === 'answering'
                    ? 'border-[#E2463B] bg-red-100/90 ring-4 ring-red-300 text-[#E2463B] scale-105'
                    : 'border-[#E2463B]/50 bg-red-50 text-[#E2463B]'
                }`}
              >
                {inputRemainder || <span className="text-red-300 text-lg">?</span>}
              </button>

              <span className="font-display font-black text-xl sm:text-2xl text-slate-700">
                )
              </span>
            </div>

            {/* Chú thích màu ô */}
            <div className="flex items-center gap-4 text-xs sm:text-sm font-bold">
              <span className="flex items-center gap-1.5 text-[#2F80D0]">
                <span className="w-3 h-3 rounded-full bg-[#2F80D0]" />
                <span>Ô xanh: {currentQ.labelQuotient}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-[#E2463B]">
                <span className="w-3 h-3 rounded-full bg-[#E2463B]" />
                <span>Ô đỏ: {currentQ.labelRemainder}</span>
              </span>
            </div>

            {/* BÀN PHÍM SỐ TRÊN MÀN HÌNH (0-9, ⌫, Trả lời) */}
            {questionStage === 'answering' && (
              <div className="w-full max-w-sm mt-1 bg-amber-100/70 p-3 rounded-2xl border-2 border-amber-200">
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="py-3 bg-white hover:bg-amber-50 text-slate-800 font-display font-black text-xl rounded-xl border border-amber-300 shadow-sm active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="py-3 bg-white hover:bg-amber-50 text-slate-800 font-display font-black text-xl rounded-xl border border-amber-300 shadow-sm active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={() => handleKeypadPress('backspace')}
                    className="py-3 bg-red-50 hover:bg-red-100 text-[#E2463B] font-display font-black text-lg rounded-xl border border-red-300 shadow-sm active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                    title="Xóa chữ số vừa nhập"
                  >
                    <Delete className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAnswerInput}
                    className="py-3 bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm sm:text-base rounded-xl shadow-[0_3px_0_#2C7535] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DẠNG 2: CHỌN TRẮC NGHIỆM */}
        {currentQ.type === 'choice' && (
          <div className="w-full max-w-lg flex flex-col gap-3">
            {currentQ.options?.map((opt, idx) => {
              const isSelected = selectedChoice === idx;
              const isOptionCorrect = idx === currentQ.correctOptionIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isButtonsLocked || questionStage === 'results'}
                  onClick={() => handleSelectChoice(idx)}
                  className={`w-full py-4 px-5 rounded-2xl font-display font-bold text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-between border-2 btn-press ${
                    questionStage === 'results'
                      ? isOptionCorrect
                        ? 'bg-emerald-100 border-[#3F9B4A] text-emerald-950 font-black ring-4 ring-emerald-300'
                        : isSelected
                        ? 'bg-red-100 border-[#E2463B] text-red-950 ring-4 ring-red-300'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      : isButtonsLocked
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white hover:bg-amber-50/70 border-amber-300 text-slate-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-sm font-black flex items-center justify-center">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {questionStage === 'results' && isOptionCorrect && (
                    <Check className="w-6 h-6 text-[#3F9B4A] stroke-[3]" />
                  )}
                  {questionStage === 'results' && isSelected && !isOptionCorrect && (
                    <X className="w-6 h-6 text-[#E2463B] stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* CẢNH BÁO KHI NHẬP THIẾU */}
        {errorMessage && (
          <div className="w-full max-w-lg bg-amber-100 border-2 border-amber-300 text-amber-950 p-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-fadeIn">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* BƯỚC ③: HỘP LỜI GIẢI VÀ Ô KIỂM ĐẾM SỐ BẠN DƯỚI LỚP TRẢ LỜI ĐÚNG */}
        {questionStage === 'results' && (
          <div
            className={`w-full max-w-xl p-5 rounded-2xl border-2 transition-all space-y-3 animate-fadeIn ${
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
              <div className="space-y-2 text-xs sm:text-sm font-bold flex-1">
                <p className="text-sm sm:text-base font-extrabold">
                  {isCurrentCorrect
                    ? `🎉 Rất giỏi! +1 điểm cho ${activeGroup.name}!`
                    : 'Chưa chính xác, cùng xem giải thích nhé:'}
                </p>

                {/* Lời giải chi tiết */}
                <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-slate-800 space-y-1">
                  <p className="flex items-start gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#2C7535] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#2C7535]">Lời giải:</strong>{' '}
                      {currentQ.explanation}
                    </span>
                  </p>
                  {currentQ.checkWork && (
                    <p className="text-slate-700 pl-5">
                      <strong>Thử lại:</strong>{' '}
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {currentQ.checkWork}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Ô KIỂM ĐẾM SỐ BẠN DƯỚI LỚP TRẢ LỜI ĐÚNG */}
            <ClassCorrectCounter
              classSize={classSize}
              correctCount={classCorrectCount}
              onChange={setClassCorrectCount}
            />

            {/* Nút sang câu tiếp */}
            <div className="pt-2 border-t border-slate-200/60 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="py-2.5 px-6 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-extrabold text-sm sm:text-base shadow-[0_4px_0_#aa4f03] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer btn-press"
              >
                <span>
                  {currentIndex < CHALLENGE_QUESTIONS.length - 1
                    ? 'Câu tiếp theo'
                    : 'Xem tổng kết ★'}
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
