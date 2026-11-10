import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { TabNav, TabId } from './components/TabNav.tsx';
import { ExploreTab } from './components/ExploreTab.tsx';
import { PracticeTab, generatePracticeQuestions } from './components/PracticeTab.tsx';
import { ChallengeTab } from './components/ChallengeTab.tsx';
import { SummaryTab, AnswerRecord } from './components/SummaryTab.tsx';
import { HelpModal } from './components/HelpModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Confetti } from './components/Confetti.tsx';
import { ModeSelection } from './components/ModeSelection.tsx';
import { SelfPacedContainer } from './components/self_paced/SelfPacedContainer.tsx';
import { ClassroomSetup } from './components/classroom/ClassroomSetup.tsx';
import { PrintCardsModal } from './components/classroom/PrintCardsModal.tsx';
import {
  ClassroomConfig,
  GroupInfo,
  DEFAULT_CLASSROOM_CONFIG,
  createInitialGroups,
} from './types/classroom.ts';
import { sound } from './utils/audio.ts';

export type AppMode = 'select' | 'classroom-setup' | 'classroom' | 'self-paced';

export default function App() {
  // Quản lý chế độ hiển thị: Chọn chế độ | Thiết lập lớp học | Trên lớp | Em tự học
  const [appMode, setAppMode] = useState<AppMode>('select');
  const [selfPacedResumeStep, setSelfPacedResumeStep] = useState<number>(0);

  // Đọc tiến độ đã lưu từ localStorage cho chế độ Em tự học
  const [savedStep, setSavedStep] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vuon_tao_self_paced');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.step === 'number' && parsed.step > 0) {
          setSavedStep(parsed.step);
          setSavedScore(typeof parsed.score === 'number' ? parsed.score : 0);
        }
      }
    } catch {
      // Bỏ qua lỗi đọc localStorage
    }
  }, [appMode]);

  const handleClearSavedProgress = () => {
    try {
      localStorage.removeItem('vuon_tao_self_paced');
      setSavedStep(null);
      setSavedScore(null);
    } catch {
      // Bỏ qua
    }
  };

  // =================== TRẠNG THÁI CHẾ ĐỘ TRÊN LỚP NÂNG CẤP ===================
  // Cấu hình tiết học (2 đội hoặc 3–6 nhóm, sĩ số 10–45, đếm ngược bật/tắt)
  const [classroomConfig, setClassroomConfig] = useState<ClassroomConfig>(DEFAULT_CLASSROOM_CONFIG);

  // Danh sách các nhóm thi đua với màu sắc và điểm số
  const [groups, setGroups] = useState<GroupInfo[]>(() =>
    createInitialGroups(DEFAULT_CLASSROOM_CONFIG.groupFormat)
  );
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const activeGroupId = groups[activeGroupIndex]?.id || groups[0]?.id || 'group-1';

  // Danh sách học sinh đã được gọi lên bảng (số thứ tự 1..classSize)
  const [calledStudents, setCalledStudents] = useState<number[]>([]);

  // Quản lý tab hiện tại trong chế độ Trên lớp
  const [currentTab, setCurrentTab] = useState<TabId>('explore');

  // Quản lý đồng hồ 10 phút (600 giây)
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Quản lý âm thanh
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  // Quản lý hộp thoại hướng dẫn & in thẻ trả lời
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isPrintCardsOpen, setIsPrintCardsOpen] = useState<boolean>(false);

  // Hiệu ứng pháo giấy
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const confettiTimeoutRef = useRef<number | null>(null);

  // Nhật ký trả lời của học sinh cho bảng thống kê giáo viên (kèm tỉ lệ cả lớp)
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);

  // Bộ câu hỏi chặng 2 (lấy 4 chia hết, 4 có dư xáo trộn)
  const [practiceQuestions, setPracticeQuestions] = useState(() => generatePracticeQuestions());

  // Kích hoạt pháo giấy
  const triggerConfetti = useCallback(() => {
    setConfettiActive(true);
    if (confettiTimeoutRef.current) {
      window.clearTimeout(confettiTimeoutRef.current);
    }
    confettiTimeoutRef.current = window.setTimeout(() => {
      setConfettiActive(false);
    }, 3200);
  }, []);

  // Đếm ngược đồng hồ trong chế độ Trên lớp
  useEffect(() => {
    let interval: number | null = null;
    if (appMode === 'classroom' && isTimerRunning && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Hết giờ: phát âm báo và tự chuyển sang tab Tổng kết
            sound.playTimeout();
            setCurrentTab('summary');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [appMode, isTimerRunning, timeRemaining]);

  // Bật / Tắt âm thanh
  const toggleSound = () => {
    const nextVal = !isSoundOn;
    setIsSoundOn(nextVal);
    sound.enabled = nextVal;
    if (nextVal) {
      sound.playClick();
    }
  };

  // Chọn nhóm theo ID khi giáo viên bấm trực tiếp vào thẻ nhóm
  const handleSelectGroup = (groupId: string) => {
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx !== -1) {
      setActiveGroupIndex(idx);
    }
  };

  // Đổi lượt sang nhóm kế tiếp theo vòng tròn: 1 -> 2 -> ... -> N -> 1
  const handleNextGroup = () => {
    setActiveGroupIndex((prev) => (prev + 1) % groups.length);
  };

  // Cộng điểm cho nhóm theo ID
  const handleScoreGroup = (groupId: string, points: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, score: g.score + points } : g))
    );
  };

  // Ghi nhận học sinh đã được gọi
  const handleCallStudent = (num: number) => {
    setCalledStudents((prev) => (prev.includes(num) ? prev : [...prev, num]));
  };

  // Bỏ qua / xóa bạn vắng khỏi danh sách đã gọi
  const handleSkipStudent = (num: number) => {
    setCalledStudents((prev) => prev.filter((n) => n !== num));
  };

  // Lưu lịch sử câu trả lời kèm số bạn đúng của cả lớp
  const handleRecordAnswer = (
    stage: string,
    questionText: string,
    isCorrect: boolean,
    classCorrect?: number,
    classSize?: number
  ) => {
    setAnswerRecords((prev) => [
      ...prev,
      {
        stage,
        questionText,
        isCorrect,
        classCorrect,
        classSize: classSize || classroomConfig.classSize,
      },
    ]);
  };

  // Bắt đầu tiết học từ màn hình thiết lập
  const handleStartClassroom = (config: ClassroomConfig) => {
    setClassroomConfig(config);
    setGroups(createInitialGroups(config.groupFormat));
    setActiveGroupIndex(0);
    setCalledStudents([]);
    setAnswerRecords([]);
    setTimeRemaining(600);
    setIsTimerRunning(false);
    setPracticeQuestions(generatePracticeQuestions());
    setCurrentTab('explore');
    setAppMode('classroom');
  };

  // Chơi lại từ đầu (chế độ Trên lớp)
  const handleResetAll = () => {
    setTimeRemaining(600);
    setIsTimerRunning(false);
    setGroups(createInitialGroups(classroomConfig.groupFormat));
    setActiveGroupIndex(0);
    setCalledStudents([]);
    setAnswerRecords([]);
    setPracticeQuestions(generatePracticeQuestions());
    setCurrentTab('explore');
  };

  const handleSelectMode = (mode: 'classroom' | 'self-paced', resumeStep?: number) => {
    if (mode === 'self-paced') {
      setSelfPacedResumeStep(resumeStep ?? 0);
      setAppMode('self-paced');
    } else {
      // Vào màn hình thiết lập trước khi bắt đầu tiết học
      setAppMode('classroom-setup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EC] text-[#2C3E50]">
      {/* Pháo giấy toàn màn hình khi có thành tích */}
      <Confetti active={confettiActive} duration={3000} />

      {/* 1. MÀN HÌNH CHỌN CHẾ ĐỘ ĐẦU TIÊN */}
      {appMode === 'select' && (
        <ModeSelection
          onSelectMode={handleSelectMode}
          savedStep={savedStep}
          savedScore={savedScore}
          onClearSavedProgress={handleClearSavedProgress}
        />
      )}

      {/* 2. MÀN HÌNH THIẾT LẬP TIẾT HỌC TRÊN LỚP */}
      {appMode === 'classroom-setup' && (
        <ClassroomSetup
          initialConfig={classroomConfig}
          onStart={handleStartClassroom}
          onBackToModeSelect={() => setAppMode('select')}
          onOpenPrintCards={() => setIsPrintCardsOpen(true)}
        />
      )}

      {/* 3. CHẾ ĐỘ EM TỰ HỌC (E-LEARNING) - GIỮ NGUYÊN 100% */}
      {appMode === 'self-paced' && (
        <SelfPacedContainer
          onBackToModeSelect={() => setAppMode('select')}
          onTriggerConfetti={triggerConfetti}
          initialStep={selfPacedResumeStep}
        />
      )}

      {/* 4. CHẾ ĐỘ TRÊN LỚP NÂNG CẤP (CẢ LỚP CÙNG THAM GIA) */}
      {appMode === 'classroom' && (
        <>
          {/* Thanh đầu trang với bảng điểm nhiều nhóm (2–6 nhóm) */}
          <Header
            timeRemaining={timeRemaining}
            isTimerRunning={isTimerRunning}
            onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
            onResetTimer={() => {
              setTimeRemaining(600);
              setIsTimerRunning(false);
            }}
            groups={groups}
            activeGroupId={activeGroupId}
            onSelectGroup={handleSelectGroup}
            isSoundOn={isSoundOn}
            onToggleSound={toggleSound}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenSetup={() => setAppMode('classroom-setup')}
            onBackToModeSelect={() => setAppMode('select')}
          />

          {/* Thanh tab lựa chọn 4 chặng học tập */}
          <TabNav currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />

          {/* Khu vực nội dung chính theo từng Tab */}
          <main className="flex-1 pb-8">
            {currentTab === 'explore' && (
              <ExploreTab
                classSize={classroomConfig.classSize}
                calledStudents={calledStudents}
                onCallStudent={handleCallStudent}
                onSkipStudent={handleSkipStudent}
              />
            )}

            {currentTab === 'practice' && (
              <PracticeTab
                groups={groups}
                activeGroupId={activeGroupId}
                onScoreGroup={handleScoreGroup}
                onNextGroup={handleNextGroup}
                onGoToTab={(tab) => setCurrentTab(tab)}
                onTriggerConfetti={triggerConfetti}
                onRecordAnswer={handleRecordAnswer}
                questions={practiceQuestions}
                onResetQuestions={() => setPracticeQuestions(generatePracticeQuestions())}
                classSize={classroomConfig.classSize}
                enableCountdown={classroomConfig.enableCountdown}
                countdownDuration={classroomConfig.countdownDuration}
                calledStudents={calledStudents}
                onCallStudent={handleCallStudent}
                onSkipStudent={handleSkipStudent}
              />
            )}

            {currentTab === 'challenge' && (
              <ChallengeTab
                groups={groups}
                activeGroupId={activeGroupId}
                onScoreGroup={handleScoreGroup}
                onNextGroup={handleNextGroup}
                onGoToTab={(tab) => setCurrentTab(tab)}
                onTriggerConfetti={triggerConfetti}
                onRecordAnswer={handleRecordAnswer}
                classSize={classroomConfig.classSize}
                enableCountdown={classroomConfig.enableCountdown}
                countdownDuration={classroomConfig.countdownDuration}
                calledStudents={calledStudents}
                onCallStudent={handleCallStudent}
                onSkipStudent={handleSkipStudent}
              />
            )}

            {currentTab === 'summary' && (
              <SummaryTab
                groups={groups}
                answerRecords={answerRecords}
                classSize={classroomConfig.classSize}
                calledCount={calledStudents.length}
                onResetAll={handleResetAll}
                onTriggerConfetti={triggerConfetti}
              />
            )}
          </main>

          {/* Chân trang thông tin cuộc thi & giáo viên */}
          <Footer />

          {/* Hộp thoại hướng dẫn sử dụng & in thẻ */}
          <HelpModal
            isOpen={isHelpOpen}
            onClose={() => setIsHelpOpen(false)}
            onOpenPrintCards={() => setIsPrintCardsOpen(true)}
          />
        </>
      )}

      {/* Hộp thoại in thẻ trả lời A4 */}
      <PrintCardsModal
        isOpen={isPrintCardsOpen}
        onClose={() => setIsPrintCardsOpen(false)}
      />
    </div>
  );
}
