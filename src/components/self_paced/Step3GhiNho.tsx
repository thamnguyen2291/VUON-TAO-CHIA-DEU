import React, { useState } from 'react';
import { BookmarkCheck, CheckCircle2, AlertCircle, Star, Sparkles, Check } from 'lucide-react';
import { sound } from '../../utils/audio.ts';

interface Step3GhiNhoProps {
  onComplete: () => void;
  onTriggerConfetti: () => void;
}

export const Step3GhiNho: React.FC<Step3GhiNhoProps> = ({
  onComplete,
  onTriggerConfetti,
}) => {
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

  const handleConfirm = () => {
    sound.playCorrect();
    onTriggerConfetti();
    setHasConfirmed(true);
    onComplete();
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-5 animate-fadeIn">
      <div className="w-full bg-[#FFFBF0] rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-md space-y-5">
        <div className="flex items-center gap-3 border-b-2 border-amber-200/80 pb-4">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-[#2C7535]">
            <BookmarkCheck className="w-7 h-7 text-[#3F9B4A]" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2C7535]">
              Kiến Thức Trọng Tâm Cần Ghi Nhớ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-bold">
              Bài 25: Phép chia hết, phép chia có dư (Toán 3)
            </p>
          </div>
        </div>

        {/* 4 Khung quy tắc vàng */}
        <div className="space-y-3.5">
          {/* Quy tắc 1 */}
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-xs flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-[#3F9B4A] shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-display font-black text-base sm:text-lg text-emerald-950">
                1. Phép chia có số dư bằng 0 là PHÉP CHIA HẾT.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-bold">
                Ví dụ: <span className="font-mono text-slate-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">15 : 5 = 3 (dư 0)</span>, ta viết gọn là <span className="text-[#2F80D0] font-black">15 : 5 = 3</span>.
              </p>
            </div>
          </div>

          {/* Quy tắc 2 */}
          <div className="bg-white p-4 rounded-2xl border-2 border-red-200 shadow-xs flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-red-100 text-[#E2463B] shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-display font-black text-base sm:text-lg text-red-950">
                2. Phép chia có số dư khác 0 là PHÉP CHIA CÓ DƯ.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-bold">
                Ví dụ: <span className="font-mono text-slate-900 bg-red-50 px-2 py-0.5 rounded border border-red-200">17 : 5 = 3 (dư 2)</span>. Trong đó: 17 là số bị chia, 5 là số chia, <span className="text-[#2F80D0] font-bold">3 là thương</span>, <span className="text-[#E2463B] font-bold">2 là số dư</span>.
              </p>
            </div>
          </div>

          {/* Quy tắc 3: QUY TẮC VÀNG */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 p-4.5 rounded-2xl border-3 border-amber-400 shadow-sm flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-200 text-amber-800 shrink-0 mt-0.5">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="space-y-1">
              <p className="font-display font-black text-lg sm:text-xl text-amber-950">
                3. QUY TẮC VÀNG: SỐ DƯ BAO GIỜ CŨNG BÉ HƠN SỐ CHIA.
              </p>
              <p className="text-xs sm:text-sm text-amber-900 font-bold">
                (Nếu số dư bằng hoặc lớn hơn số chia thì ta vẫn chia tiếp được, nghĩa là phép tính chưa xong).
              </p>
            </div>
          </div>

          {/* Quy tắc 4 */}
          <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-xs flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-blue-100 text-[#2F80D0] shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-display font-black text-base sm:text-lg text-blue-950">
                4. CÁCH THỬ LẠI PHÉP CHIA:
              </p>
              <p className="font-display font-black text-base sm:text-lg text-slate-900 bg-blue-50/80 p-2 rounded-xl border border-blue-200">
                <span className="text-[#2F80D0]">thương</span> × <strong>số chia</strong> + <span className="text-[#E2463B]">số dư</span> = <strong>số bị chia</strong>
              </p>
              <p className="text-xs text-slate-600 font-bold">
                Ví dụ: 3 × 5 + 2 = 15 + 2 = 17 (chính xác).
              </p>
            </div>
          </div>
        </div>

        {/* Nút xác nhận */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleConfirm}
            className={`py-3.5 px-8 rounded-2xl font-display font-black text-base sm:text-lg transition-all cursor-pointer flex items-center gap-2 btn-press ${
              hasConfirmed
                ? 'bg-[#3F9B4A] text-white shadow-xs'
                : 'bg-[#F07B12] hover:bg-[#d86b0c] text-white shadow-[0_4px_0_#aa4f03]'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>{hasConfirmed ? 'Em đã ghi nhớ bài học ✓' : 'Em đã nhớ kỹ kiến thức ✓'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
