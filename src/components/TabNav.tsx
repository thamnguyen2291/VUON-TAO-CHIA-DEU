import React from 'react';
import { Sparkles, Compass, CheckCircle2, Trophy } from 'lucide-react';
import { sound } from '../utils/audio.ts';

export type TabId = 'explore' | 'practice' | 'challenge' | 'summary';

interface TabNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: React.FC<{ className?: string }>; task: string }[] = [
  {
    id: 'explore',
    label: '1 · Khám phá: Chia táo',
    icon: Compass,
    task: 'Chia đều số táo vào các giỏ: mỗi lượt, mỗi giỏ nhận 1 quả. Khi không đủ chia cho tất cả các giỏ thì dừng lại. Còn thừa mấy quả?',
  },
  {
    id: 'practice',
    label: '2 · Luyện tập: Hết hay dư?',
    icon: CheckCircle2,
    task: 'Đến lượt đội nào, đội đó chọn: phép chia này là chia hết hay có dư? Đúng được 1 điểm.',
  },
  {
    id: 'challenge',
    label: '3 · Vận dụng: Thử thách',
    icon: Sparkles,
    task: 'Thử thách: đọc kĩ đề, cả đội bàn bạc rồi trả lời. Đúng được 1 điểm.',
  },
  {
    id: 'summary',
    label: '★ · Tổng kết',
    icon: Trophy,
    task: 'Vinh danh các đội xuất sắc, khắc sâu kiến thức trọng tâm và tự đánh giá bài học.',
  },
];

export const TabNav: React.FC<TabNavProps> = ({ currentTab, onTabChange }) => {
  const activeTabObj = TABS.find((t) => t.id === currentTab) || TABS[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3">
      {/* Thanh tab lớn, bấm nảy dễ chạm */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-amber-100/60 p-1.5 rounded-2xl border-2 border-[#F0DCC0]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                onTabChange(tab.id);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-display font-bold text-sm sm:text-base transition-all cursor-pointer btn-press ${
                isActive
                  ? 'bg-white text-[#2C7535] shadow-[0_4px_0_#C5A574] -translate-y-0.5 border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-[#3F9B4A]' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dải nhiệm vụ màu cam nhạt */}
      <div className="mt-2.5 bg-[#FFF2DE] border border-[#F39A1E]/40 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs">
        <span className="bg-[#F39A1E] text-white font-display font-extrabold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
          Nhiệm vụ
        </span>
        <p className="text-xs sm:text-sm text-amber-950 font-bold leading-snug">
          {activeTabObj.task}
        </p>
      </div>
    </div>
  );
};
