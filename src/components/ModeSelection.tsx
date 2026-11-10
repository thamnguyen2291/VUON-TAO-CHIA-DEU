import React from 'react';
import { AppleSvg } from './AppleSvg.tsx';
import { Users, User, ArrowRight, Sparkles, BookOpen, Clock, Award } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface ModeSelectionProps {
  onSelectMode: (mode: 'classroom' | 'self-paced', resumeStep?: number) => void;
  savedStep: number | null;
  savedScore: number | null;
  onClearSavedProgress: () => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  onSelectMode,
  savedStep,
  savedScore,
  onClearSavedProgress,
}) => {
  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col justify-between py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center items-center gap-6">
        {/* Tiêu đề ứng dụng */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border-2 border-[#F0DCC0] shadow-sm mb-2">
            <AppleSvg size="sm" />
            <span className="font-display font-extrabold text-[#2C7535] text-lg sm:text-xl">
              Vườn Táo Chia Đều
            </span>
            <span className="bg-[#3F9B4A]/15 text-[#2C7535] text-xs font-bold px-2 py-0.5 rounded-full">
              Toán 3
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#2C7535] tracking-tight">
            Chào Mừng Em Đến Với Vườn Táo!
          </h1>
          <p className="text-slate-600 font-bold text-sm sm:text-base max-w-xl mx-auto">
            Bài 25: Phép chia hết, phép chia có dư · Sách Kết nối tri thức với cuộc sống.
            <br />
            Em hãy chọn hình thức học phù hợp nhé:
          </p>
        </div>

        {/* Thông báo gợi ý tiếp tục nếu có dữ liệu lưu trong localStorage */}
        {savedStep !== null && savedStep > 0 && (
          <div className="w-full max-w-xl bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="space-y-0.5">
              <p className="font-display font-black text-amber-950 text-base flex items-center gap-2">
                <span>🔄</span>
                <span>Em có muốn học tiếp từ chỗ cũ không?</span>
              </p>
              <p className="text-xs text-amber-800 font-bold">
                Lần trước em đang học ở <strong>Bước {savedStep}</strong>
                {savedScore !== null ? ` (đang có ${savedScore} điểm)` : ''}.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSelectMode('self-paced', savedStep);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#F07B12] hover:bg-[#d46709] text-white font-display font-extrabold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer btn-press"
              >
                Học tiếp ngay ▶
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClearSavedProgress();
                }}
                className="px-2.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Xóa để học lại
              </button>
            </div>
          </div>
        )}

        {/* 2 THẺ CHỌN CHẾ ĐỘ LỚN */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Chế độ 1: TRÊN LỚP (Giáo viên điều khiển, thi đua 2 đội) */}
          <div
            onClick={() => {
              sound.playClick();
              onSelectMode('classroom');
            }}
            className="group relative bg-white rounded-3xl p-6 sm:p-7 border-3 border-emerald-300 hover:border-[#3F9B4A] shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer btn-press"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 border-2 border-emerald-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  👩‍🏫
                </div>
                <span className="text-xs font-display font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  Dành cho lớp học
                </span>
              </div>

              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-emerald-950 flex items-center gap-2">
                  <span>Trên lớp</span>
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-1.5 leading-relaxed">
                  Thi đua 2 đội sôi nổi (Đội Xanh & Đội Cam). Giáo viên trình chiếu trên TV hoặc máy chiếu, học sinh lên bảng bấm và giải toán theo nhóm.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-emerald-100 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#3F9B4A]" />
                  <span>Chia lớp thành 2 đội thi đua</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Hoạt động 10 phút có đồng hồ đếm ngược</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Bảng điểm tự động và vinh danh đội thắng</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-700 group-hover:text-emerald-900 font-display font-black text-base">
              <span>Vào chế độ Trên lớp</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Chế độ 2: EM TỰ HỌC (Bài giảng E-learning từng bước) */}
          <div
            onClick={() => {
              sound.playClick();
              onSelectMode('self-paced', 0);
            }}
            className="group relative bg-white rounded-3xl p-6 sm:p-7 border-3 border-orange-300 hover:border-[#F07B12] shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer btn-press"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-orange-100/80 border-2 border-orange-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🧒
                </div>
                <span className="text-xs font-display font-bold uppercase tracking-wider bg-orange-50 text-orange-800 px-3 py-1 rounded-full border border-orange-200">
                  Bài giảng E-learning
                </span>
              </div>

              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-orange-950 flex items-center gap-2">
                  <span>Em tự học</span>
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-1.5 leading-relaxed">
                  Bài giảng điện tử hoàn chỉnh 20–25 phút. Bạn Táo Đỏ dẫn dắt với giọng đọc thuyết minh, em tự học từng bước và làm bài kiểm tra nhận giấy khen.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-orange-100 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#F07B12]" />
                  <span>Học sinh tự học 1 mình, không cần cô giáo kèm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Bạn Táo Đỏ thuyết minh bằng giọng nói</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>8 bước học chuẩn: Khởi động đến Kiểm tra & Giấy khen</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[#F07B12] group-hover:text-amber-900 font-display font-black text-base">
              <span>Bắt đầu Em tự học</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 font-semibold pt-4">
        Hội thi Ứng dụng công nghệ số – GV Nguyễn Thị Hồng Thắm · Trường TH Huỳnh Thúc Kháng
      </div>
    </div>
  );
};
