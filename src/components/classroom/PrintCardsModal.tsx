import React from 'react';
import { X, Printer } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface PrintCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintCardsModal: React.FC<PrintCardsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-3 border-[#F0DCC0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Header ẩn khi in */}
        <div className="bg-amber-100/90 px-6 py-4 border-b-2 border-amber-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-2 rounded-xl text-amber-800 shadow-xs">
              <Printer className="w-5 h-5 text-[#F07B12]" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 leading-tight">
                In Thẻ Trả Lời Cho Học Sinh (Khổ A4)
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                Gồm 4 cặp thẻ (8 thẻ): &quot;✔ CHIA HẾT&quot; (Xanh) &amp; &quot;◐ CÓ DƯ&quot; (Đỏ) có đường viền cắt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer btn-press"
            >
              <Printer className="w-4 h-4" />
              <span>In ngay</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl hover:bg-amber-200/60 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nội dung trang in A4 */}
        <div className="p-4 sm:p-6 overflow-y-auto print:p-0 print:overflow-visible">
          {/* Lời khuyên cho giáo viên ẩn khi in */}
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-bold flex items-center justify-between print:hidden">
            <span>💡 Mẹo: Giáo viên in ra giấy A4 dày, cắt theo đường nét đứt rồi phát cho mỗi học sinh 1 cặp thẻ để giơ khi cả lớp cùng trả lời!</span>
          </div>

          {/* Khung khổ giấy A4 chứa 4 cặp thẻ */}
          <div className="bg-white border-2 border-dashed border-slate-300 p-4 rounded-2xl print:border-none print:p-2 space-y-4">
            <div className="text-center font-display font-extrabold text-sm text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-200">
              Vườn Táo Chia Đều · Thẻ Trả Lời Toán 3 Bài 25
            </div>

            {/* Lưới 4 cặp thẻ (mỗi cặp gồm 1 thẻ xanh & 1 thẻ đỏ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
              {[1, 2, 3, 4].map((pairIndex) => (
                <div
                  key={pairIndex}
                  className="border-2 border-dashed border-slate-400 p-2.5 rounded-xl flex flex-col gap-2.5 bg-slate-50/50"
                >
                  <div className="text-[10px] text-slate-400 font-bold text-center -mb-1">
                    ✂ Cắt theo đường viền (Cặp {pairIndex})
                  </div>

                  {/* Thẻ Chia Hết (Xanh lá) */}
                  <div className="h-28 rounded-2xl bg-[#3F9B4A] text-white flex flex-col items-center justify-center p-3 border-4 border-[#2C7535] shadow-xs select-none">
                    <span className="font-display font-black text-2xl sm:text-3xl tracking-wider flex items-center gap-2">
                      <span>✔</span>
                      <span>CHIA HẾT</span>
                    </span>
                    <span className="text-xs font-bold opacity-90 mt-0.5">
                      (Số dư bằng 0)
                    </span>
                  </div>

                  {/* Thẻ Có Dư (Đỏ) */}
                  <div className="h-28 rounded-2xl bg-[#E2463B] text-white flex flex-col items-center justify-center p-3 border-4 border-[#A81D14] shadow-xs select-none">
                    <span className="font-display font-black text-2xl sm:text-3xl tracking-wider flex items-center gap-2">
                      <span>◐</span>
                      <span>CÓ DƯ</span>
                    </span>
                    <span className="text-xs font-bold opacity-90 mt-0.5">
                      (Số dư khác 0)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
