import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header, Team } from './components/Header.tsx';
import { TabNav, TabId } from './components/TabNav.tsx';
import { ExploreTab } from './components/ExploreTab.tsx';
import { PracticeTab, generatePracticeQuestions } from './components/PracticeTab.tsx';
import { ChallengeTab } from './components/ChallengeTab.tsx';
import { SummaryTab, AnswerRecord } from './components/SummaryTab.tsx';
import { HelpModal } from './components/HelpModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Confetti } from './components/Confetti.tsx';
import { sound } from './utils/audio.ts';

export default function App() {
  // Quản lý tab hiện tại
  const [currentTab, setCurrentTab] = useState<TabId>('explore');

  // Quản lý đồng hồ 10 phút (600 giây)
  const [timeRemaining, setTimeRemaining] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Quản lý điểm số 2 đội
  const [scoreBlue, setScoreBlue] = useState<number>(0);
  const [scoreOrange, setScoreOrange] = useState<number>(0);
  const [currentTeam, setCurrentTeam] = useState<Team>('blue');

  // Quản lý âm thanh
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  // Quản lý hộp thoại hướng dẫn
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Hiệu ứng pháo giấy
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const confettiTimeoutRef = useRef<number | null>(null);

  // Nhật ký trả lời của học sinh cho bảng thống kê giáo viên
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

  // Đếm ngược đồng hồ
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && timeRemaining > 0) {
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
  }, [isTimerRunning, timeRemaining]);

  // Bật / Tắt âm thanh
  const toggleSound = () => {
    const nextVal = !isSoundOn;
    setIsSoundOn(nextVal);
    sound.enabled = nextVal;
    if (nextVal) {
      sound.playClick();
    }
  };

  // Đổi lượt sang đội còn lại
  const handleNextTeam = () => {
    setCurrentTeam((prev) => (prev === 'blue' ? 'orange' : 'blue'));
  };

  // Cộng điểm cho đội
  const handleScoreTeam = (team: Team, points: number) => {
    if (team === 'blue') {
      setScoreBlue((prev) => prev + points);
    } else {
      setScoreOrange((prev) => prev + points);
    }
  };

  // Lưu lịch sử câu trả lời
  const handleRecordAnswer = (stage: string, questionText: string, isCorrect: boolean) => {
    setAnswerRecords((prev) => [...prev, { stage, questionText, isCorrect }]);
  };

  // Chơi lại từ đầu
  const handleResetAll = () => {
    setTimeRemaining(600);
    setIsTimerRunning(false);
    setScoreBlue(0);
    setScoreOrange(0);
    setCurrentTeam('blue');
    setAnswerRecords([]);
    setPracticeQuestions(generatePracticeQuestions());
    setCurrentTab('explore');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EC] text-[#2C3E50]">
      {/* Pháo giấy toàn màn hình khi có thành tích */}
      <Confetti active={confettiActive} duration={3000} />

      {/* Thanh đầu trang luôn cố định */}
      <Header
        timeRemaining={timeRemaining}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
        onResetTimer={() => {
          setTimeRemaining(600);
          setIsTimerRunning(false);
        }}
        scoreBlue={scoreBlue}
        scoreOrange={scoreOrange}
        currentTeam={currentTeam}
        onSelectTeam={(team) => setCurrentTeam(team)}
        isSoundOn={isSoundOn}
        onToggleSound={toggleSound}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Thanh tab lựa chọn 4 chặng học tập */}
      <TabNav currentTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />

      {/* Khu vực nội dung chính theo từng Tab */}
      <main className="flex-1 pb-8">
        {currentTab === 'explore' && <ExploreTab />}

        {currentTab === 'practice' && (
          <PracticeTab
            currentTeam={currentTeam}
            onScoreTeam={handleScoreTeam}
            onNextTeam={handleNextTeam}
            onGoToTab={(tab) => setCurrentTab(tab)}
            onTriggerConfetti={triggerConfetti}
            onRecordAnswer={handleRecordAnswer}
            questions={practiceQuestions}
            onResetQuestions={() => setPracticeQuestions(generatePracticeQuestions())}
          />
        )}

        {currentTab === 'challenge' && (
          <ChallengeTab
            currentTeam={currentTeam}
            onScoreTeam={handleScoreTeam}
            onNextTeam={handleNextTeam}
            onGoToTab={(tab) => setCurrentTab(tab)}
            onTriggerConfetti={triggerConfetti}
            onRecordAnswer={handleRecordAnswer}
          />
        )}

        {currentTab === 'summary' && (
          <SummaryTab
            scoreBlue={scoreBlue}
            scoreOrange={scoreOrange}
            answerRecords={answerRecords}
            onResetAll={handleResetAll}
            onTriggerConfetti={triggerConfetti}
          />
        )}
      </main>

      {/* Chân trang thông tin cuộc thi & giáo viên */}
      <Footer />

      {/* Hộp thoại hướng dẫn sử dụng 10 phút */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
