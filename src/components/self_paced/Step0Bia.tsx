import React from 'react';
import { AppleSvg } from '../AppleSvg.tsx';
import { THONG_TIN_BIA } from '../../config/biaBaiGiang.ts';
import { Play, Sparkles, BookOpen, School, Mail, Award, Calendar } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface Step0BiaProps {
  onStart: () => void;
  onOpenTaiLieu: () => void;
}

export const Step0Bia: React.FC<Step0BiaProps> = ({ onStart, onOpenTaiLieu }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-4 animate-fadeIn">
      {/* Khung bài giảng trang bìa tiêu chuẩn */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border-3 border-amber-300 shadow-xl flex flex-col items-center text-center gap-6 relative overflow-hidden">
        {/* Họa tiết góc */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-100/60 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-100/60 rounded-full blur-xl pointer-events-none" />

        {/* Tên cuộc thi (Dễ dàng tùy biến trong file cấu hình) */}
        <div className="bg-amber-50 border border-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-display font-extrabold text-amber-900 shadow-2xs">
          🏆 {THONG_TIN_BIA.tenCuocThi}
        </div>

        {/* Biểu tượng quả táo hoạt hình */}
        <div className="relative">
          <div className="p-4 bg-linear-to-b from-red-50 to-amber-50 rounded-3xl border-2 border-red-200 shadow-sm animate-bounce">
            <AppleSvg size="xl" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-[#3F9B4A] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs">
            E-Learning
          </span>
        </div>

        {/* Tiêu đề bài học */}
        <div className="space-y-2 max-w-2xl">
          <p className="font-display font-black text-emerald-800 text-sm sm:text-base uppercase tracking-wider">
            {THONG_TIN_BIA.monHoc} · {THONG_TIN_BIA.baiHoc}
          </p>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#2C7535] tracking-tight leading-tight">
            {THONG_TIN_BIA.tieuDeBai}
          </h1>
          <p className="text-slate-600 font-bold text-sm sm:text-base">
            {THONG_TIN_BIA.boSach}
          </p>
        </div>

        {/* Nút Bắt đầu to nổi bật */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onStart();
            }}
            className="py-4 px-10 rounded-2xl bg-[#E2463B] hover:bg-[#c93329] text-white font-display font-black text-xl sm:text-2xl shadow-[0_6px_0_#A81D14] active:translate-y-1.5 active:shadow-none transition-all flex items-center gap-3 cursor-pointer btn-press"
          >
            <span>Bắt đầu học</span>
            <Play className="w-6 h-6 fill-current" />
          </button>
        </div>

        {/* Thông tin tác giả và bản quyền sư phạm */}
        <div className="w-full pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs font-semibold text-slate-700 bg-slate-50/60 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <School className="w-4 h-4 text-[#2C7535] shrink-0" />
              <span>GV: {THONG_TIN_BIA.giaoVien}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Email: {THONG_TIN_BIA.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-[#2F80D0] shrink-0 mt-0.5" />
              <span>{THONG_TIN_BIA.donVi}</span>
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Thời gian: {THONG_TIN_BIA.thangNam}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{THONG_TIN_BIA.giayPhep}</span>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenTaiLieu();
                }}
                className="text-xs text-[#2F80D0] hover:text-[#1c538e] font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tài liệu tham khảo & căn cứ xây dựng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Khẩu hiệu hội thi */}
        <div className="text-[11px] sm:text-xs text-amber-900 font-bold bg-amber-100/70 px-4 py-1.5 rounded-full border border-amber-300">
          ✨ {THONG_TIN_BIA.thongDiep}
        </div>
      </div>
    </div>
  );
};
