import React from 'react';
import { X, Clock, HelpCircle, Check, Printer, Lightbulb, Settings, Users, Sparkles, Award } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintCards?: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onOpenPrintCards }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-3 border-[#F0DCC0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Tiêu đề modal */}
        <div className="bg-amber-100/90 px-6 py-4 border-b-2 border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-2 rounded-xl text-[#2C7535] shadow-xs">
              <HelpCircle className="w-6 h-6 text-[#3F9B4A]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                Hướng Dẫn Dạy Học: Cả Lớp Cùng Tham Gia
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

        {/* Nội dung các bước hướng dẫn cập nhật theo quy trình 4 bước */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm font-semibold text-slate-700">
          {/* Bước 1 */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
            <h4 className="font-display font-black text-amber-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F39A1E] text-white text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>Bấm &quot;⚙ Thiết lập&quot; đầu tiết dạy</span>
            </h4>
            <p className="pl-8 text-slate-700 leading-relaxed">
              Thầy cô chọn hình thức thi đua (<strong>2 đội</strong> hoặc <strong>3 đến 6 nhóm</strong>), nhập sĩ số lớp (10–45 bạn) và bật tính năng <strong>đếm ngược suy nghĩ</strong> trước mỗi câu hỏi.
            </p>
          </div>

          {/* Bước 2 */}
          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <h4 className="font-display font-black text-emerald-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#3F9B4A] text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>Chặng Khám phá: Vừa quan sát vừa thao tác que tính</span>
            </h4>
            <p className="pl-8 text-slate-700 leading-relaxed">
              Gọi một bạn lên bảng bấm chia táo. Các bạn dưới lớp cùng chia bằng <strong>que tính hoặc hạt nhựa</strong>, rồi so sánh kết quả và cùng rút ra quy tắc vàng: <em>Số dư bao giờ cũng bé hơn số chia</em>.
            </p>
          </div>

          {/* Bước 3 */}
          <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 space-y-2">
            <h4 className="font-display font-black text-blue-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2F80D0] text-white text-xs flex items-center justify-center font-black">
                3
              </span>
              <span>Quy trình 3 bước ở mỗi câu hỏi (Luyện tập &amp; Thử thách)</span>
            </h4>
            <div className="pl-8 text-slate-700 space-y-1.5">
              <p>• <strong>① Cả lớp trả lời:</strong> Cả lớp suy nghĩ, ghi bảng con hoặc giơ thẻ trong lúc đồng hồ đếm ngược (các nút bấm trên màn hình tạm khóa).</p>
              <p>• <strong>② Đại diện lên bấm:</strong> Bấm nút <em>&quot;🎲 Chọn bạn lên bấm&quot;</em> để gọi ngẫu nhiên một bạn (không trùng lặp) lên chọn đáp án.</p>
              <p>• <strong>③ Xem kết quả:</strong> Màn hình hiện lời giải, giáo viên ghi nhận nhanh số bạn dưới lớp đúng vào ô <em>&quot;Số bạn trả lời đúng&quot;</em>.</p>
            </div>
          </div>

          {/* Bước 4 */}
          <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200 space-y-2">
            <h4 className="font-display font-black text-purple-950 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-black">
                4
              </span>
              <span>Tổng kết &amp; Củng cố</span>
            </h4>
            <p className="pl-8 text-slate-700 leading-relaxed">
              Xem vinh danh nhóm cao điểm nhất, theo dõi bảng thống kê <strong>tỉ lệ cả lớp đúng từng câu</strong>. Những câu hỏi dưới 50% được cảnh báo để thầy cô củng cố ngay tại lớp!
            </p>
          </div>

          {/* Mẹo cho giáo viên */}
          <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 flex items-start gap-2.5 text-sky-950">
            <Lightbulb className="w-5 h-5 text-[#2F80D0] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p>
                <strong>Mẹo hay:</strong> Thầy cô có thể in sẵn các thẻ &quot;✔ CHIA HẾT&quot; và &quot;◐ CÓ DƯ&quot; cho học sinh bằng nút <strong>In thẻ trả lời</strong> bên dưới!
              </p>
            </div>
          </div>
        </div>

        {/* Chân modal */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          {onOpenPrintCards ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenPrintCards();
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-display font-bold text-xs sm:text-sm border border-amber-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#F07B12]" />
              <span>🖨 In thẻ trả lời</span>
            </button>
          ) : (
            <div />
          )}

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
