import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t-2 border-[#F0DCC0] bg-white/80 py-4 px-3 sm:px-6 text-center text-xs sm:text-sm text-slate-600 font-semibold">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-1.5">
        <p className="text-slate-800">
          Sản phẩm dự thi: <strong>Hội thi &ldquo;Ứng dụng công nghệ số – Đổi mới hoạt động dạy học, phát huy năng lực học sinh tiểu học&rdquo;</strong> (Năm học 2026–2027)
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-700">
          <span className="font-bold text-[#2C7535]">GV Nguyễn Thị Hồng Thắm</span>
          <span>·</span>
          <span>Lớp 3/3</span>
          <span>·</span>
          <span>Trường Tiểu học Huỳnh Thúc Kháng</span>
        </div>
        <p className="text-[11px] sm:text-xs text-amber-900 font-bold bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200 mt-0.5">
          ✨ Sáng tạo trong thiết kế – Tích cực trong học tập – Lan tỏa tri thức số
        </p>
      </div>
    </footer>
  );
};
