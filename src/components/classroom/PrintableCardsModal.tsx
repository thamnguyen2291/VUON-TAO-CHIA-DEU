import React from 'react';
import { X, Printer, Scissors } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface PrintableCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableCardsModal: React.FC<PrintableCardsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-3 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Header - Ẩn khi in */}
        <div className="bg-amber-100/90 px-6 py-4 border-b-2 border-amber-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl text-amber-900 shadow-xs">
              <Printer className="w-5 h-5 text-[#2C7535]" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-900">
                In Thẻ Trả Lời Cho Học Sinh (Khổ A4)
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                Mỗi trang A4 in được 4 cặp thẻ (cho 4 học sinh). Cắt theo đường nét đứt.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-xs btn-press"
            >
              <Printer className="w-4 h-4" />
              <span>In ngay (Print)</span>
            </button>

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
        </div>

        {/* Khu vực trang in A4 chuẩn: 4 cặp thẻ (8 thẻ) */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-50 print:bg-white print:p-2 print:overflow-visible">
          <div className="max-w-[210mm] mx-auto bg-white p-4 rounded-2xl shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
            {/* Header nhỏ trên giấy in */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300 mb-3">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Toán 3 · Bài 25: Phép chia hết, phép chia có dư · Bộ Thẻ Trả Lời Trực Quan
              </p>
              <p className="text-[10px] text-slate-400">
                (Thầy cô in ra giấy bìa hoặc giấy A4 rồi dùng kéo cắt theo đường nét đứt)
              </p>
            </div>

            {/* Lưới 4 cặp thẻ (mỗi cặp gồm 1 thẻ Xanh và 1 thẻ Đỏ) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 print:gap-3">
              {[1, 2, 3, 4].map((pairIndex) => (
                <React.Fragment key={pairIndex}>
                  {/* Thẻ CHIA HẾT (Xanh lá) */}
                  <div className="relative border-2 border-dashed border-slate-400 p-2 rounded-2xl flex flex-col justify-between min-h-[140px] sm:min-h-[160px] bg-white">
                    <div className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Scissors className="w-3 h-3" />
                      <span>Cặp {pairIndex}</span>
                    </div>

                    <div className="w-full flex-1 rounded-xl bg-[#3F9B4A] text-white flex flex-col items-center justify-center p-3 shadow-sm text-center">
                      <span className="font-display font-black text-2xl sm:text-4xl tracking-wider">
                        ✔ CHIA HẾT
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold opacity-90 mt-1">
                        (Số dư bằng 0)
                      </span>
                    </div>
                  </div>

                  {/* Thẻ CÓ DƯ (Đỏ) */}
                  <div className="relative border-2 border-dashed border-slate-400 p-2 rounded-2xl flex flex-col justify-between min-h-[140px] sm:min-h-[160px] bg-white">
                    <div className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Scissors className="w-3 h-3" />
                      <span>Cặp {pairIndex}</span>
                    </div>

                    <div className="w-full flex-1 rounded-xl bg-[#E2463B] text-white flex flex-col items-center justify-center p-3 shadow-sm text-center">
                      <span className="font-display font-black text-2xl sm:text-4xl tracking-wider">
                        ◐ CÓ DƯ
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold opacity-90 mt-1">
                        (Số dư lớn hơn 0)
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="text-center pt-3 text-[10px] text-slate-400 print:pt-2">
              Trường TH Huỳnh Thúc Kháng · GV Nguyễn Thị Hồng Thắm · Lớp 3/3
            </div>
          </div>
        </div>

        {/* Footer modal - Ẩn khi in */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500 font-semibold">
            Mẹo: In trên giấy dày (120–180gsm) hoặc ép plastic để học sinh dùng nhiều lần!
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-display font-bold text-xs sm:text-sm cursor-pointer"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
