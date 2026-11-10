import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppleSvg } from './AppleSvg.tsx';
import { BasketSvg } from './BasketSvg.tsx';
import { sound } from '../utils/audio.ts';
import { Plus, Minus, RotateCcw, ArrowRight, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudentCaller } from './classroom/StudentCaller.tsx';

export interface DivisionHistory {
  id: string;
  totalApples: number;
  basketCount: number;
  quotient: number;
  remainder: number;
  formula: string;
}

interface ExploreTabProps {
  classSize?: number;
  calledStudents?: number[];
  onCallStudent?: (num: number) => void;
  onSkipStudent?: (num: number) => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  classSize = 35,
  calledStudents = [],
  onCallStudent = () => {},
  onSkipStudent = () => {},
}) => {
  // Bảng điều khiển: số táo và số giỏ
  const [totalApples, setTotalApples] = useState<number>(17);
  const [basketCount, setBasketCount] = useState<number>(5);

  // Trạng thái chia trong vườn
  const [remainingApples, setRemainingApples] = useState<number>(17);
  const [baskets, setBaskets] = useState<number[]>([0, 0, 0, 0, 0]);
  const [roundsDone, setRoundsDone] = useState<number>(0);
  const [activeBasketIndex, setActiveBasketIndex] = useState<number | null>(null);
  const [isDistributing, setIsDistributing] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showConclusion, setShowConclusion] = useState<boolean>(false);

  // Bảng ghi nhớ các lần thử
  const [history, setHistory] = useState<DivisionHistory[]>([
    {
      id: 'demo-1',
      totalApples: 15,
      basketCount: 5,
      quotient: 3,
      remainder: 0,
      formula: '15 : 5 = 3',
    },
  ]);

  const cancelRef = useRef<boolean>(false);

  // Đổi số táo hoặc số giỏ thì vườn tự làm mới
  const resetGarden = useCallback((newTotal: number, newBaskets: number) => {
    cancelRef.current = true;
    setIsDistributing(false);
    setActiveBasketIndex(null);
    setRemainingApples(newTotal);
    setBaskets(new Array(newBaskets).fill(0));
    setRoundsDone(0);
    setIsFinished(false);
  }, []);

  useEffect(() => {
    resetGarden(totalApples, basketCount);
  }, [totalApples, basketCount, resetGarden]);

  // Thêm vào bảng lịch sử sau khi kết thúc lượt chia
  const recordResult = useCallback(
    (apples: number, basketCnt: number, q: number, r: number) => {
      const formula = r === 0 ? `${apples} : ${basketCnt} = ${q}` : `${apples} : ${basketCnt} = ${q} (dư ${r})`;
      setHistory((prev) => {
        // Tránh trùng lặp kết quả vừa ghi
        if (prev.length > 0 && prev[0].totalApples === apples && prev[0].basketCount === basketCnt) {
          return prev;
        }
        const item: DivisionHistory = {
          id: `${Date.now()}-${Math.random()}`,
          totalApples: apples,
          basketCount: basketCnt,
          quotient: q,
          remainder: r,
          formula,
        };
        return [item, ...prev].slice(0, 6);
      });
    },
    []
  );

  // Chia mỗi giỏ 1 quả (1 lượt)
  const handleDivideOneRound = async () => {
    if (isDistributing || isFinished || remainingApples < basketCount) return;

    setIsDistributing(true);
    cancelRef.current = false;

    const currentBaskets = [...baskets];
    let currRemaining = remainingApples;

    for (let i = 0; i < basketCount; i++) {
      if (cancelRef.current) break;
      setActiveBasketIndex(i);
      sound.playPop();
      currRemaining -= 1;
      currentBaskets[i] += 1;
      setRemainingApples(currRemaining);
      setBaskets([...currentBaskets]);

      await new Promise((resolve) => setTimeout(resolve, 160));
    }

    setActiveBasketIndex(null);
    const newRounds = roundsDone + 1;
    setRoundsDone(newRounds);
    setIsDistributing(false);

    // Kiểm tra xem còn đủ chia tiếp cho tất cả các giỏ không
    if (currRemaining < basketCount) {
      setIsFinished(true);
      recordResult(totalApples, basketCount, newRounds, currRemaining);
      if (currRemaining === 0) {
        sound.playCorrect();
      }
    }
  };

  // Chia đến hết lượt (tự động chia liên tục cho đến khi số táo < số giỏ)
  const handleDivideAll = async () => {
    if (isDistributing || isFinished || remainingApples < basketCount) return;

    setIsDistributing(true);
    cancelRef.current = false;

    let currRemaining = remainingApples;
    const currentBaskets = [...baskets];
    let currentRounds = roundsDone;

    while (currRemaining >= basketCount && !cancelRef.current) {
      for (let i = 0; i < basketCount; i++) {
        if (cancelRef.current) break;
        setActiveBasketIndex(i);
        sound.playPop();
        currRemaining -= 1;
        currentBaskets[i] += 1;
        setRemainingApples(currRemaining);
        setBaskets([...currentBaskets]);
        await new Promise((resolve) => setTimeout(resolve, 140));
      }
      currentRounds += 1;
      setRoundsDone(currentRounds);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setActiveBasketIndex(null);
    setIsDistributing(false);
    setIsFinished(true);
    recordResult(totalApples, basketCount, currentRounds, currRemaining);
    if (currRemaining === 0) {
      sound.playCorrect();
    }
  };

  // Thông số tính toán sư phạm
  const quotient = Math.floor(totalApples / basketCount);
  const remainder = totalApples % basketCount;
  const isDivideExact = remainder === 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-3">
      {/* Dải nhiệm vụ phụ cho cả lớp */}
      <div className="bg-emerald-50 border-2 border-emerald-300 p-3 sm:p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🌿</span>
          <p className="text-xs sm:text-sm font-bold text-emerald-950">
            <strong>Nhiệm vụ cả lớp:</strong> Các bạn dưới lớp cùng chia bằng que tính hoặc hạt, rồi so sánh với kết quả trên màn hình.
          </p>
        </div>

        <StudentCaller
          classSize={classSize}
          calledStudents={calledStudents}
          onCallStudent={onCallStudent}
          onSkipStudent={onSkipStudent}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* CỘT TRÁI (4 cols): BẢNG ĐIỀU KHIỂN */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#F0DCC0] shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
            <h2 className="font-display font-extrabold text-xl text-[#2C7535] flex items-center gap-2">
              <span>Bảng Điều Khiển</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                resetGarden(totalApples, basketCount);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
              title="Đặt lại đống táo ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          </div>

          {/* Chọn số quả táo (Số bị chia) */}
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <AppleSvg size="xs" />
                <span>Số quả táo (số bị chia):</span>
              </label>
              <span className="font-display font-black text-2xl text-[#E2463B]">
                {totalApples}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={totalApples <= 5 || isDistributing}
                onClick={() => {
                  sound.playClick();
                  setTotalApples((prev) => Math.max(5, prev - 1));
                }}
                className="w-11 h-11 rounded-xl bg-white border-2 border-amber-300 text-amber-900 font-black text-xl flex items-center justify-center hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs btn-press"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="range"
                min="5"
                max="40"
                value={totalApples}
                disabled={isDistributing}
                onChange={(e) => setTotalApples(Number(e.target.value))}
                className="flex-1 accent-[#E2463B] h-2 bg-amber-200 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                disabled={totalApples >= 40 || isDistributing}
                onClick={() => {
                  sound.playClick();
                  setTotalApples((prev) => Math.min(40, prev + 1));
                }}
                className="w-11 h-11 rounded-xl bg-white border-2 border-amber-300 text-amber-900 font-black text-xl flex items-center justify-center hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs btn-press"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {/* Gợi ý nhanh các số thú vị */}
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-amber-200/60">
              <span className="text-[11px] font-bold text-amber-800">Ví dụ nhanh:</span>
              {[15, 17, 20, 23, 29].map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={isDistributing}
                  onClick={() => {
                    sound.playClick();
                    setTotalApples(num);
                  }}
                  className={`text-xs px-2 py-0.5 rounded-md font-bold transition-colors ${
                    totalApples === num
                      ? 'bg-[#E2463B] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-amber-200/70 border border-amber-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Chọn số giỏ (Số chia) */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="text-base">🧺</span>
                <span>Số giỏ (số chia):</span>
              </label>
              <span className="font-display font-black text-2xl text-[#2C7535]">
                {basketCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={basketCount <= 2 || isDistributing}
                onClick={() => {
                  sound.playClick();
                  setBasketCount((prev) => Math.max(2, prev - 1));
                }}
                className="w-11 h-11 rounded-xl bg-white border-2 border-emerald-300 text-emerald-900 font-black text-xl flex items-center justify-center hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs btn-press"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="range"
                min="2"
                max="9"
                value={basketCount}
                disabled={isDistributing}
                onChange={(e) => setBasketCount(Number(e.target.value))}
                className="flex-1 accent-[#3F9B4A] h-2 bg-emerald-200 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                disabled={basketCount >= 9 || isDistributing}
                onClick={() => {
                  sound.playClick();
                  setBasketCount((prev) => Math.min(9, prev + 1));
                }}
                className="w-11 h-11 rounded-xl bg-white border-2 border-emerald-300 text-emerald-900 font-black text-xl flex items-center justify-center hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs btn-press"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {/* Gợi ý nhanh số giỏ */}
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-emerald-200/60">
              <span className="text-[11px] font-bold text-emerald-800">Số giỏ:</span>
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={isDistributing}
                  onClick={() => {
                    sound.playClick();
                    setBasketCount(num);
                  }}
                  className={`text-xs px-2.5 py-0.5 rounded-md font-bold transition-colors ${
                    basketCount === num
                      ? 'bg-[#3F9B4A] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-emerald-200/70 border border-emerald-300'
                  }`}
                >
                  {num} giỏ
                </button>
              ))}
            </div>
          </div>

          {/* Các nút hành động chia táo */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              disabled={isDistributing || isFinished || remainingApples < basketCount}
              onClick={handleDivideOneRound}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2F80D0] hover:bg-[#2069b2] text-white font-display font-bold text-base shadow-[0_4px_0_#1c538e] active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer btn-press"
            >
              <span>Chia mỗi giỏ 1 quả</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={isDistributing || isFinished || remainingApples < basketCount}
              onClick={handleDivideAll}
              className="w-full py-3.5 px-4 rounded-xl bg-[#F07B12] hover:bg-[#d46709] text-white font-display font-bold text-base shadow-[0_4px_0_#aa4f03] active:translate-y-1 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer btn-press"
            >
              <span>Chia đến hết lượt</span>
              <span>⚡</span>
            </button>

            <button
              type="button"
              disabled={isDistributing}
              onClick={() => {
                sound.playClick();
                resetGarden(totalApples, basketCount);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-display font-bold text-sm border-2 border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại với {totalApples} quả, {basketCount} giỏ</span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI (8 cols): KHU VƯỜN TÁO & KẾT QUẢ */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* KHU VƯỜN TƯƠNG TÁC */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#F0DCC0] shadow-sm flex flex-col gap-4">
            {/* HÀNG TRÊN: ĐỐNG TÁO CHƯA CHIA / CÒN THỪA */}
            <div className="bg-[#FFF9F2] p-4 rounded-xl border border-amber-200/90">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧺</span>
                  <span className="font-display font-extrabold text-lg text-slate-800">
                    {isFinished
                      ? remainingApples > 0
                        ? 'Còn thừa không đủ chia:'
                        : 'Không còn thừa (chia vừa hết):'
                      : 'Số táo chưa chia:'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-display font-black text-2xl ${
                      isFinished && remainingApples > 0
                        ? 'text-[#E2463B] animate-pulse'
                        : 'text-slate-700'
                    }`}
                  >
                    {remainingApples}{' '}
                    <span className="text-sm font-semibold">quả</span>
                  </span>
                </div>
              </div>

              {/* Danh sách các quả táo hiển thị trực quan */}
              <div className="min-h-16 flex flex-wrap items-center gap-1.5 p-2 bg-white/80 rounded-xl border border-amber-100 max-h-36 overflow-y-auto">
                {remainingApples === 0 ? (
                  <div className="w-full py-3 text-center text-sm font-bold text-emerald-700 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#3F9B4A]" />
                    <span>Tất cả quả táo đã được chia đều vào các giỏ!</span>
                  </div>
                ) : (
                  Array.from({ length: remainingApples }).map((_, i) => (
                    <AppleSvg
                      key={i}
                      size="sm"
                      isRemainder={isFinished && remainingApples > 0}
                    />
                  ))
                )}
              </div>
            </div>

            {/* HÀNG GIỮA: CÁC GIỎ TÁO */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Các giỏ táo ({basketCount} giỏ)
                </span>
                <span className="text-xs text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Mỗi giỏ hiện có: {roundsDone} quả
                </span>
              </div>

              <div className="flex items-stretch justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 pt-1">
                {baskets.map((count, idx) => (
                  <BasketSvg
                    key={idx}
                    index={idx + 1}
                    appleCount={count}
                    isReceiving={activeBasketIndex === idx}
                  />
                ))}
              </div>
            </div>

            {/* CÂU GỢI MỞ SƯ PHẠM TRONG KHI CHIA */}
            {!isFinished && roundsDone > 0 && (
              <div className="bg-amber-100/70 border border-amber-300 p-3 rounded-xl flex items-center gap-2.5">
                <span className="text-xl">💡</span>
                <p className="text-xs sm:text-sm text-amber-950 font-bold">
                  Đã chia {roundsDone} lượt: mỗi giỏ {roundsDone} quả, còn {remainingApples} quả. Còn đủ chia cho {basketCount} giỏ không?{' '}
                  {remainingApples >= basketCount ? (
                    <span className="text-emerald-800 underline">
                      Còn đủ! (vì {remainingApples} &ge; {basketCount})
                    </span>
                  ) : (
                    <span className="text-red-700 font-extrabold">
                      Không đủ chia tiếp! (vì {remainingApples} &lt; {basketCount})
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* HỘP KẾT QUẢ KHI CHIA XONG */}
            {isFinished && (
              <div
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                  isDivideExact
                    ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-red-50/70 border-red-300 ring-2 ring-red-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  {/* Phép tính to ≥ 40px với màu chuẩn */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-black text-3xl sm:text-4xl text-slate-800 tracking-tight">
                      {totalApples} : {basketCount} ={' '}
                      <span className="text-[#2F80D0] underline decoration-blue-300">
                        {quotient}
                      </span>
                    </span>
                    {!isDivideExact && (
                      <span className="font-display font-black text-2xl sm:text-3xl text-[#E2463B]">
                        (dư {remainder})
                      </span>
                    )}
                  </div>

                  {/* Huy hiệu to */}
                  <div
                    className={`font-display font-extrabold text-sm sm:text-base px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs ${
                      isDivideExact
                        ? 'bg-[#3F9B4A] text-white'
                        : 'bg-[#E2463B] text-white'
                    }`}
                  >
                    {isDivideExact ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Phép chia hết</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Phép chia có dư</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Dòng giải thích sư phạm */}
                <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-700 border-t border-slate-200/60 pt-3">
                  <p>
                    • Mỗi giỏ được{' '}
                    <span className="font-bold text-[#2F80D0]">{quotient} quả</span>
                    {isDivideExact ? (
                      ', không còn thừa quả nào.'
                    ) : (
                      <>
                        , còn thừa{' '}
                        <span className="font-bold text-[#E2463B]">
                          {remainder} quả
                        </span>
                        .
                      </>
                    )}
                  </p>
                  <p className="text-slate-800">
                    • <span className="font-bold text-[#2C7535]">Thử lại:</span>{' '}
                    <span className="font-display font-bold text-base text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {quotient} × {basketCount}
                      {remainder > 0 ? ` + ${remainder}` : ''} = {totalApples}
                    </span>
                  </p>
                  {!isDivideExact && (
                    <p className="text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200">
                      • Còn {remainder} quả, ít hơn {basketCount} giỏ nên không thể chia đều tiếp được.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* BẢNG GHI LỊCH SỬ CÁC LẦN THỬ */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#F0DCC0] shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 flex items-center gap-1.5">
                <span>📋 Bảng ghi các lần thử</span>
                <span className="text-xs font-normal text-slate-500">
                  (tối đa 6 lần gần nhất)
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-amber-100/70 font-display font-bold text-slate-800 border-b border-amber-200">
                  <tr>
                    <th className="py-2 px-3">Số táo</th>
                    <th className="py-2 px-3">Số giỏ</th>
                    <th className="py-2 px-3 text-[#2F80D0]">Mỗi giỏ (thương)</th>
                    <th className="py-2 px-3 text-[#E2463B]">Còn thừa (số dư)</th>
                    <th className="py-2 px-3">Phép chia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={idx === 0 ? 'bg-amber-50/40 font-bold' : 'hover:bg-slate-50'}
                    >
                      <td className="py-2 px-3">{row.totalApples} quả</td>
                      <td className="py-2 px-3">{row.basketCount} giỏ</td>
                      <td className="py-2 px-3 font-display font-bold text-[#2F80D0] text-base">
                        {row.quotient}
                      </td>
                      <td className="py-2 px-3 font-display font-bold text-[#E2463B] text-base">
                        {row.remainder}
                      </td>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-700">
                        {row.formula}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ô KHÁM PHÁ SƯ PHẠM MÀU XANH NHẠT */}
            <div className="mt-4 bg-sky-50 border-2 border-sky-200 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="bg-sky-100 p-2 rounded-xl text-sky-800 shrink-0">
                    <Lightbulb className="w-5 h-5 text-[#2F80D0]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-sky-950">
                      🔎 Nhìn bảng: số quả còn thừa so với số giỏ thế nào?
                    </h4>
                    <p className="text-xs sm:text-sm text-sky-800 font-semibold">
                      Có khi nào còn thừa 5 quả mà có 5 giỏ không?
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowConclusion(!showConclusion);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2F80D0] hover:bg-[#2069b2] text-white font-display font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-center"
                >
                  {showConclusion ? 'Ẩn kết luận ▲' : 'Xem kết luận ▼'}
                </button>
              </div>

              {showConclusion && (
                <div className="mt-3 pt-3 border-t border-sky-200 text-xs sm:text-sm text-sky-950 font-bold space-y-1.5 animate-fadeIn">
                  <p className="text-[#2C7535] text-sm sm:text-base font-extrabold flex items-center gap-1.5">
                    <span>✨</span>
                    <span>KẾT LUẬN QUAN TRỌNG:</span>
                  </p>
                  <p>
                    • Số quả còn thừa luôn ít hơn số giỏ – nếu còn đủ thì ta chia tiếp được.
                  </p>
                  <p className="bg-white/90 p-2.5 rounded-xl border border-sky-300 text-slate-900 font-display text-sm sm:text-base">
                    👉 Vậy:{' '}
                    <span className="text-[#E2463B] font-extrabold underline">
                      SỐ DƯ BAO GIỜ CŨNG BÉ HƠN SỐ CHIA
                    </span>
                    .
                  </p>
                  <p className="text-emerald-800">
                    • Số dư bằng 0 thì đó là <span className="underline">phép chia hết</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
