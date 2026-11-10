import React from 'react';
import { X, BookOpen, ExternalLink, Award } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface TaiLieuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaiLieuModal: React.FC<TaiLieuModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-3 border-[#F0DCC0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-100/90 px-6 py-4 border-b-2 border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-2 rounded-xl text-[#2C7535] shadow-xs">
              <BookOpen className="w-6 h-6 text-[#3F9B4A]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                Tài Liệu Tham Khảo & Căn Cứ Xây Dựng
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                Bài giảng điện tử Toán 3 – Bài 25
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-amber-200/60 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <h4 className="font-display font-bold text-base text-amber-950 flex items-center gap-2">
              <span className="text-[#3F9B4A]">1.</span>
              <span>Sách giáo khoa & Tài liệu dạy học</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
              <li>
                Sách giáo khoa Toán 3, tập một – bộ sách <strong>Kết nối tri thức với cuộc sống</strong>, Nhà xuất bản Giáo dục Việt Nam.
              </li>
              <li>
                Vở bài tập Toán 3, tập một (Bài 25: Phép chia hết, phép chia có dư – tiết 1).
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <h4 className="font-display font-bold text-base text-emerald-950 flex items-center gap-2">
              <span className="text-[#3F9B4A]">2.</span>
              <span>Chương trình giáo dục chuẩn</span>
            </h4>
            <p className="pl-2 text-slate-700">
              Chương trình Giáo dục phổ thông môn Toán (ban hành kèm theo <strong>Thông tư số 32/2018/TT-BGDĐT</strong> ngày 26 tháng 12 năm 2018 của Bộ trưởng Bộ Giáo dục và Đào tạo).
            </p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
            <h4 className="font-display font-bold text-base text-blue-950 flex items-center gap-2">
              <span className="text-[#2F80D0]">3.</span>
              <span>Học liệu số & Bản quyền</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
              <li>
                <strong>Hình ảnh & Đồ họa:</strong> Tác giả tự thiết kế vector trực tiếp bằng mã SVG (không sử dụng hình ảnh bản quyền từ internet).
              </li>
              <li>
                <strong>Âm thanh hiệu ứng:</strong> Được tạo trực tiếp bằng công nghệ Web Audio API trong trình duyệt.
              </li>
              <li>
                <strong>Lời thuyết minh:</strong> Thu âm giọng đọc giáo viên kết hợp trợ lý giọng đọc Web Speech API.
              </li>
              <li>
                <strong>Giấy phép:</strong> Học liệu mở Creative Commons (CC BY 4.0).
              </li>
            </ul>
          </div>

          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
            <h4 className="font-display font-bold text-base text-purple-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Công nghệ phát triển</span>
            </h4>
            <p className="pl-2 text-slate-700">
              Ứng dụng được xây dựng và tối ưu bằng Google AI Studio, sử dụng React 19, TypeScript, Tailwind CSS, hỗ trợ đóng gói SCORM 1.2 cho các hệ thống LMS trường học.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2.5 px-6 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm sm:text-base cursor-pointer btn-press"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
