import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass, BookOpen } from 'lucide-react';
import { TaoDoMascot } from '../mascot/TaoDoMascot.tsx';
import { Step0Bia } from './Step0Bia.tsx';
import { Step1KhoiDong } from './Step1KhoiDong.tsx';
import { Step2KhamPha } from './Step2KhamPha.tsx';
import { Step3GhiNho } from './Step3GhiNho.tsx';
import { Step4LuyenTap } from './Step4LuyenTap.tsx';
import { Step5VanDung } from './Step5VanDung.tsx';
import { Step6KiemTra } from './Step6KiemTra.tsx';
import { Step7TongKet } from './Step7TongKet.tsx';
import { TaiLieuModal } from './TaiLieuModal.tsx';
import { sound } from '../../utils/audio.ts';
import { narrator } from '../../utils/narration.ts';
import { batDau, ghiTienDo } from '../../utils/tracking.ts';

interface StepMeta {
  index: number;
  id: string;
  name: string;
  defaultTranscript: string;
}

const STEPS: StepMeta[] = [
  {
    index: 0,
    id: 'bia',
    name: 'Bìa',
    defaultTranscript:
      'Chào em! Mình là Táo Đỏ. Hôm nay chúng mình cùng học bài Phép chia hết, phép chia có dư. Em bấm Bắt đầu học nhé!',
  },
  {
    index: 1,
    id: 'khoi-dong',
    name: 'Khởi động',
    defaultTranscript:
      'Trước khi vào bài mới, em hãy cùng Táo Đỏ ôn lại bảng chia nhé! Em tính nhẩm rồi bấm số trên màn hình nha.',
  },
  {
    index: 2,
    id: 'kham-pha-1',
    name: 'Khám phá',
    defaultTranscript:
      'Bác nông dân có 15 quả táo, chia đều vào 5 giỏ. Em hãy bấm nút để chia, mỗi lượt mỗi giỏ một quả nhé!',
  },
  {
    index: 3,
    id: 'ghi-nho',
    name: 'Ghi nhớ',
    defaultTranscript:
      'Em hãy đọc thật kỹ và ghi nhớ những kiến thức quan trọng của bài học hôm nay nhé! Đặc biệt: số dư bao giờ cũng bé hơn số chia.',
  },
  {
    index: 4,
    id: 'luyen-tap',
    name: 'Luyện tập',
    defaultTranscript:
      'Chúng mình cùng sang phần Luyện tập! Em hãy xác định xem phép chia nào là chia hết, phép chia nào có dư và tìm thương cùng số dư nhé.',
  },
  {
    index: 5,
    id: 'van-dung',
    name: 'Vận dụng',
    defaultTranscript:
      'Rất tốt! Giờ là lúc em vận dụng kiến thức để giải quyết 3 tình huống thực tế thú vị. Nếu gặp khó, em có thể bấm nút Gợi ý nhé!',
  },
  {
    index: 6,
    id: 'kiem-tra',
    name: 'Kiểm tra',
    defaultTranscript:
      'Bây giờ em làm bài kiểm tra nhỏ nhé. Em làm một mình thật cẩn thận, không có gợi ý đâu nha!',
  },
  {
    index: 7,
    id: 'tong-ket',
    name: 'Tổng kết',
    defaultTranscript:
      'Chúc mừng em đã hoàn thành xuất sắc bài học hôm nay! Em hãy gõ tên mình để nhận giấy khen và nhớ làm Vở bài tập Toán nhé!',
  },
];

interface SelfPacedContainerProps {
  onBackToModeSelect: () => void;
  onTriggerConfetti: () => void;
  initialStep?: number;
}

export const SelfPacedContainer: React.FC<SelfPacedContainerProps> = ({
  onBackToModeSelect,
  onTriggerConfetti,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<{ [step: number]: boolean }>({
    0: true, // Trang bìa luôn sẵn sàng
  });
  const [score, setScore] = useState<number>(0);
  const [examStars, setExamStars] = useState<number>(1);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [currentTranscript, setCurrentTranscript] = useState<string>(
    STEPS[initialStep]?.defaultTranscript || STEPS[0].defaultTranscript
  );
  const [currentAudioCode, setCurrentAudioCode] = useState<string>(
    STEPS[initialStep]?.id || STEPS[0].id
  );
  const [isTaiLieuOpen, setIsTaiLieuOpen] = useState<boolean>(false);

  // Khởi động SCORM khi vào chế độ tự học
  useEffect(() => {
    batDau();
  }, []);

  // Cập nhật phụ đề khi đổi bước
  useEffect(() => {
    const meta = STEPS[currentStep] || STEPS[0];
    setCurrentTranscript(meta.defaultTranscript);
    setCurrentAudioCode(meta.id);
    narrator.stop();
    ghiTienDo(meta.name);

    // Lưu vào localStorage an toàn
    try {
      localStorage.setItem(
        'vuon_tao_self_paced',
        JSON.stringify({
          step: currentStep,
          score,
          completedSteps,
        })
      );
    } catch {
      // Bỏ qua lỗi
    }
  }, [currentStep, score, completedSteps]);

  const handleStepComplete = useCallback((stepIdx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [stepIdx]: true }));
  }, []);

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1 && completedSteps[currentStep]) {
      sound.playClick();
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      sound.playClick();
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleAudio = () => {
    const next = !isAudioOn;
    setIsAudioOn(next);
    narrator.enabled = next;
    sound.playClick();
    if (!next) {
      narrator.stop();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFF8EC]">
      {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG: QUAY LẠI CHỌN CHẾ ĐỘ & TIẾN TRÌNH 8 BƯỚC */}
      <header className="bg-white/95 backdrop-blur-xs border-b-2 border-[#F0DCC0] sticky top-0 z-40 px-3 py-2.5 sm:px-6 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Nút thoát về màn chọn chế độ */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                narrator.stop();
                sound.playClick();
                onBackToModeSelect();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Chọn chế độ</span>
            </button>

            {/* Điểm tích lũy */}
            <div className="md:hidden flex items-center gap-1 bg-amber-100 text-amber-950 font-display font-black text-xs px-2.5 py-1 rounded-xl border border-amber-300">
              <span>⭐ {score} điểm</span>
            </div>
          </div>

          {/* DÃY 8 CHẶNG TIẾN TRÌNH */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
            {STEPS.map((step) => {
              const isCurrent = step.index === currentStep;
              const isDone = completedSteps[step.index];
              return (
                <button
                  key={step.index}
                  type="button"
                  disabled={!isDone && step.index > currentStep}
                  onClick={() => {
                    if (isDone || step.index <= currentStep) {
                      sound.playClick();
                      setCurrentStep(step.index);
                    }
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-[#F07B12] text-white shadow-xs scale-105'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span>{isDone && !isCurrent ? '✓' : step.index + 1}</span>
                  <span className="hidden sm:inline">{step.name}</span>
                </button>
              );
            })}
          </div>

          {/* Điểm tích lũy màn hình lớn */}
          <div className="hidden md:flex items-center gap-2 bg-amber-100 text-amber-950 font-display font-black text-sm px-3.5 py-1.5 rounded-xl border border-amber-300">
            <span>⭐ {score} điểm</span>
          </div>
        </div>
      </header>

      {/* VÙNG NỘI DUNG CHÍNH CỦA BƯỚC ĐANG CHỌN */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col justify-center">
        {currentStep === 0 && (
          <Step0Bia
            onStart={() => {
              handleStepComplete(0);
              setCurrentStep(1);
            }}
            onOpenTaiLieu={() => setIsTaiLieuOpen(true)}
          />
        )}

        {currentStep === 1 && (
          <Step1KhoiDong
            onComplete={() => handleStepComplete(1)}
            onTriggerConfetti={onTriggerConfetti}
            onAddScore={(pts) => setScore((s) => s + pts)}
          />
        )}

        {currentStep === 2 && (
          <Step2KhamPha
            onComplete={() => handleStepComplete(2)}
            onTriggerConfetti={onTriggerConfetti}
            onAddScore={(pts) => setScore((s) => s + pts)}
            onChangeTranscript={(txt, code) => {
              setCurrentTranscript(txt);
              setCurrentAudioCode(code);
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3GhiNho
            onComplete={() => handleStepComplete(3)}
            onTriggerConfetti={onTriggerConfetti}
          />
        )}

        {currentStep === 4 && (
          <Step4LuyenTap
            onComplete={() => handleStepComplete(4)}
            onTriggerConfetti={onTriggerConfetti}
            onAddScore={(pts) => setScore((s) => s + pts)}
          />
        )}

        {currentStep === 5 && (
          <Step5VanDung
            onComplete={() => handleStepComplete(5)}
            onTriggerConfetti={onTriggerConfetti}
            onAddScore={(pts) => setScore((s) => s + pts)}
          />
        )}

        {currentStep === 6 && (
          <Step6KiemTra
            onComplete={(finalScore, finalStars) => {
              setScore((s) => s + finalScore);
              setExamStars(finalStars);
              handleStepComplete(6);
            }}
            onTriggerConfetti={onTriggerConfetti}
            onGoToKhamPha={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 7 && (
          <Step7TongKet
            score={score}
            stars={examStars}
            onRestart={() => {
              setCurrentStep(0);
              setScore(0);
              setCompletedSteps({ 0: true });
            }}
            onOpenTaiLieu={() => setIsTaiLieuOpen(true)}
          />
        )}
      </main>

      {/* NHÂN VẬT TÁO ĐỎ DẪN DẮT & THANH ĐIỀU HƯỚNG BƯỚC Ở DƯỚI CÙNG */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xs border-t-2 border-[#F0DCC0] p-3 sm:p-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Nhân vật Táo Đỏ với lời thoại và nút đọc */}
          <div className="w-full sm:flex-1">
            <TaoDoMascot
              transcript={currentTranscript}
              stepId={currentAudioCode}
              isAudioOn={isAudioOn}
              onToggleAudio={handleToggleAudio}
            />
          </div>

          {/* Cụm 2 nút: Quay lại & Tiếp tục */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handlePrevStep}
              className="py-2.5 px-4 rounded-xl bg-white border-2 border-slate-300 text-slate-700 font-display font-bold text-xs sm:text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Quay lại
            </button>

            <button
              type="button"
              disabled={currentStep >= STEPS.length - 1 || !completedSteps[currentStep]}
              onClick={handleNextStep}
              className="py-2.5 px-6 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-black text-sm sm:text-base shadow-[0_4px_0_#aa4f03] active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer btn-press"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modal Tài liệu tham khảo */}
      <TaiLieuModal isOpen={isTaiLieuOpen} onClose={() => setIsTaiLieuOpen(false)} />
    </div>
  );
};
