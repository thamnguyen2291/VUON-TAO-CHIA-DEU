import React from 'react';
import { X, Clock, HelpCircle, Check, Lightbulb } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-3 border-[#F0DCC0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Tiêu đề modal */}
        <div className="bg-amber-100/90 px-6 py-4 border-b-2 border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1.5 rounded-xl text-[#2C7535] shadow-xs">
              <HelpCircle className="w-6 h-6 text-[#3F9B4A]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                Hướng Dẫn Sử Dụng Hoạt Động (10 Phút)
              </h3>
              <p className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Toán 3 · Bài 25: Phép chia hết, phép chia có dư</span>
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

        {/* Nội dung các bước hướng dẫn */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-2">
            <h4 className="font-display font-black text-amber-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F39A1E] text-white text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>Khởi động tiết dạy</span>
            </h4>
            <p className="pl-8 text-slate-700">
              Bấm nút <strong>Bắt đầu</strong> trên đồng hồ 10:00. Chia lớp thành hai đội thi đua:{' '}
              <span className="text-[#2F80D0] font-black">Đội Xanh</span> và{' '}
              <span className="text-[#F07B12] font-black">Đội Cam</span>.
            </p>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
            <h4 className="font-display font-black text-emerald-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#3F9B4A] text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>Chặng 1 (3 phút) – Khám phá: Chia táo</span>
            </h4>
            <p className="pl-8 text-slate-700">
              Học sinh lên bấm chia táo. Thử với 15 quả/5 giỏ, 17 quả/5 giỏ, 20 quả/3 giỏ... Sau đó quan sát bảng ghi và bấm nút <em>"Xem kết luận"</em> để tự phát hiện ra: <strong>SỐ DƯ BAO GIỜ CŨNG BÉ HƠN SỐ CHIA</strong>.
            </p>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 space-y-2">
            <h4 className="font-display font-black text-blue-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2F80D0] text-white text-xs flex items-center justify-center font-black">
                3
              </span>
              <span>Chặng 2 (3 phút) – Luyện tập: Hết hay dư?</span>
            </h4>
            <p className="pl-8 text-slate-700">
              Hai đội lần lượt chọn <strong>"Chia hết"</strong> hay <strong>"Có dư"</strong> qua 8 phép tính ngẫu nhiên. Trả lời đúng được +1 điểm cho đội của mình.
            </p>
          </div>

          <div className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200 space-y-2">
            <h4 className="font-display font-black text-orange-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F07B12] text-white text-xs flex items-center justify-center font-black">
                4
              </span>
              <span>Chặng 3 (3 phút) – Vận dụng: Thử thách</span>
            </h4>
            <p className="pl-8 text-slate-700">
              Cả đội cùng nhau thảo luận để giải quyết 6 thử thách: tìm thương và số dư, tìm số dư lớn nhất, phát hiện lỗi sai của bạn, và bài toán thực tế cuộc sống.
            </p>
          </div>

          <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200 space-y-2">
            <h4 className="font-display font-black text-purple-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-black">
                5
              </span>
              <span>Chặng 4 (1 phút) – Tổng kết & Tự đánh giá</span>
            </h4>
            <p className="pl-8 text-slate-700">
              Xem vinh danh đội thắng, tổng kết các câu học sinh còn hay nhầm, khắc sâu ghi nhớ kiến thức và các em tự bấm biểu cảm để đánh giá mức độ hiểu bài.
            </p>
          </div>

          {/* Mẹo cho giáo viên */}
          <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 flex items-start gap-2 text-sky-950">
            <Lightbulb className="w-5 h-5 text-[#2F80D0] shrink-0 mt-0.5" />
            <p className="text-xs">
              <strong>Mẹo hữu ích:</strong> Thầy cô có thể bấm trực tiếp vào ô điểm của một đội trên thanh đầu trang bất cứ lúc nào để chỉ định đội đó trả lời!
            </p>
          </div>
        </div>

        {/* Chân modal */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2.5 px-6 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm sm:text-base shadow-xs flex items-center gap-2 cursor-pointer btn-press"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Đã hiểu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
