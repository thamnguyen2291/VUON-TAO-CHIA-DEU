import React, { useState, useRef } from 'react';
import { AppleSvg } from '../AppleSvg.tsx';
import { BasketSvg } from '../BasketSvg.tsx';
import { sound } from '../../utils/audio.ts';
import { ArrowRight, Check, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

interface Step2KhamPhaProps {
  onComplete: () => void;
  onTriggerConfetti: () => void;
  onAddScore: (points: number) => void;
  onChangeTranscript: (text: string, stepCode: string) => void;
}

export const Step2KhamPha: React.FC<Step2KhamPhaProps> = ({
  onComplete,
  onTriggerConfetti,
  onAddScore,
  onChangeTranscript,
}) => {
  // 3 giai đoạn nhỏ: 1 (15 táo/5 giỏ), 2 (17 táo/5 giỏ), 3 (tự do 4 giỏ + câu hỏi trắc nghiệm)
  const [subStage, setSubStage] = useState<1 | 2 | 3>(1);

  // Trạng thái cho Tình huống 1 & 2
  const [applesLeft, setApplesLeft] = useState<number>(15);
  const [baskets, setBaskets] = useState<number[]>([0, 0, 0, 0, 0]);
  const [activeBasket, setActiveBasket] = useState<number | null>(null);
  const [isDistributing, setIsDistributing] = useState<boolean>(false);
  const [hasFinishedDivision, setHasFinishedDivision] = useState<boolean>(false);

  // Câu hỏi kiểm tra học sinh sau khi chia
  const [inputQ, setInputQ] = useState<string>('');
  const [inputR, setInputR] = useState<string>('');
  const [isAnsweredCheck, setIsAnsweredCheck] = useState<boolean>(false);
  const [isCheckCorrect, setIsCheckCorrect] = useState<boolean>(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Trạng thái cho Tình huống 3: tự do với 4 giỏ
  const [freeApples, setFreeApples] = useState<number>(14);
  const [freeBaskets, setFreeBaskets] = useState<number[]>([0, 0, 0, 0]);
  const [freeHistory, setFreeHistory] = useState<
    { apples: number; quotient: number; remainder: number }[]
  >([]);
  const [multiSelected, setMultiSelected] = useState<number[]>([]);
  const [isMultiAnswered, setIsMultiAnswered] = useState<boolean>(false);
  const [isMultiCorrect, setIsMultiCorrect] = useState<boolean>(false);

  // Khởi tạo trạng thái cho từng giai đoạn
  const setupSubStage = (stage: 1 | 2 | 3) => {
    setSubStage(stage);
    setIsDistributing(false);
    setActiveBasket(null);
    setInputQ('');
    setInputR('');
    setIsAnsweredCheck(false);
    setIsCheckCorrect(false);
    setCheckError(null);

    if (stage === 1) {
      setApplesLeft(15);
      setBaskets([0, 0, 0, 0, 0]);
      setHasFinishedDivision(false);
      onChangeTranscript(
        'Bác nông dân có 15 quả táo, chia đều vào 5 giỏ. Em hãy bấm nút để chia, mỗi lượt mỗi giỏ một quả nhé!',
        'kham-pha-1'
      );
    } else if (stage === 2) {
      setApplesLeft(17);
      setBaskets([0, 0, 0, 0, 0]);
      setHasFinishedDivision(false);
      onChangeTranscript(
        'Bây giờ có 17 quả táo, vẫn chia vào 5 giỏ. Em hãy bấm chia xem lần này có chia hết không nhé!',
        'kham-pha-2'
      );
    } else {
      setFreeApples(14);
      setFreeBaskets([0, 0, 0, 0]);
      onChangeTranscript(
        'Bây giờ em hãy tự chọn số quả táo để chia vào 4 giỏ nhé! Thử ít nhất 3 lần để xem số quả còn thừa có gì đặc biệt nha.',
        'kham-pha-3'
      );
    }
  };

  // Chia mỗi giỏ 1 quả cho Tình huống 1 & 2 (5 giỏ)
  const handleDivideOneRound = async () => {
    const totalBaskets = 5;
    if (isDistributing || applesLeft < totalBaskets) return;

    setIsDistributing(true);
    let currentLeft = applesLeft;
    const currentBaskets = [...baskets];

    for (let i = 0; i < totalBaskets; i++) {
      setActiveBasket(i);
      sound.playPop();
      currentLeft -= 1;
      currentBaskets[i] += 1;
      setApplesLeft(currentLeft);
      setBaskets([...currentBaskets]);
      await new Promise((r) => setTimeout(r, 140));
    }

    setActiveBasket(null);
    setIsDistributing(false);

    if (currentLeft < totalBaskets) {
      setHasFinishedDivision(true);
      if (currentLeft === 0) {
        sound.playCorrect();
      }
    }
  };

  // Nộp câu hỏi kiểm tra: Mỗi giỏ được mấy quả? Còn thừa mấy quả?
  const handleSubmitCheck = () => {
    if (isAnsweredCheck) return;
    setCheckError(null);

    if (inputQ.trim() === '' || inputR.trim() === '') {
      setCheckError('Em điền đủ cả 2 ô nhé (nếu không thừa thì ghi 0).');
      sound.playIncorrect();
      return;
    }

    const q = parseInt(inputQ, 10);
    const r = parseInt(inputR, 10);

    const targetQ = 3;
    const targetR = subStage === 1 ? 0 : 2;

    const correct = q === targetQ && r === targetR;
    setIsAnsweredCheck(true);
    setIsCheckCorrect(correct);

    if (correct) {
      sound.playCorrect();
      onTriggerConfetti();
      onAddScore(1);
    } else {
      sound.playIncorrect();
    }
  };

  // Tình huống 3: Chia thử với 4 giỏ
  const handleDivideFree = () => {
    sound.playPop();
    const q = Math.floor(freeApples / 4);
    const r = freeApples % 4;
    setFreeBaskets([q, q, q, q]);

    // Thêm vào bảng ghi
    setFreeHistory((prev) => [
      { apples: freeApples, quotient: q, remainder: r },
      ...prev.filter((item) => item.apples !== freeApples),
    ]);
  };

  // Xử lý chọn nhiều đáp án ở Tình huống 3 (0, 1, 2, 3, 4, 5)
  const toggleOption = (val: number) => {
    if (isMultiAnswered) return;
    sound.playClick();
    if (multiSelected.includes(val)) {
      setMultiSelected(multiSelected.filter((v) => v !== val));
    } else {
      setMultiSelected([...multiSelected, val]);
    }
  };

  const handleSubmitMulti = () => {
    if (isMultiAnswered || multiSelected.length === 0) return;
    // Đúng là {0, 1, 2, 3}
    const correctVals = [0, 1, 2, 3];
    const isCorrect =
      multiSelected.length === 4 &&
      correctVals.every((v) => multiSelected.includes(v));

    setIsMultiAnswered(true);
    setIsMultiCorrect(isCorrect);

    if (isCorrect) {
      sound.playCorrect();
      onTriggerConfetti();
      onAddScore(2);
    } else {
      sound.playIncorrect();
    }
    onComplete(); // Đã hoàn thành toàn bộ bước Khám phá
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 animate-fadeIn">
      {/* Tab nhỏ chuyển giữa 3 tình huống khám phá */}
      <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-2xl border-2 border-amber-200 shadow-sm">
        <button
          type="button"
          onClick={() => setupSubStage(1)}
          className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subStage === 1
              ? 'bg-[#3F9B4A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. 15 quả / 5 giỏ
        </button>
        <button
          type="button"
          onClick={() => setupSubStage(2)}
          className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subStage === 2
              ? 'bg-[#F07B12] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. 17 quả / 5 giỏ
        </button>
        <button
          type="button"
          onClick={() => setupSubStage(3)}
          className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subStage === 3
              ? 'bg-[#2F80D0] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Thử nghiệm với 4 giỏ
        </button>
      </div>

      {/* TÌNH HUỐNG 1 & 2: 15 HOẶC 17 QUẢ TÁO VÀO 5 GIỎ */}
      {(subStage === 1 || subStage === 2) && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#F0DCC0] shadow-md flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-800">
              {subStage === 1 ? 'Tình huống 1: 15 quả táo chia vào 5 giỏ' : 'Tình huống 2: 17 quả táo chia vào 5 giỏ'}
            </h3>
            <span className="text-xs font-bold text-[#E2463B] bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              {subStage === 1 ? '15 quả ban đầu' : '17 quả ban đầu'}
            </span>
          </div>

          {/* Đống táo chưa chia */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-sm text-amber-950">
                {hasFinishedDivision
                  ? applesLeft > 0
                    ? `Còn thừa không đủ chia tiếp: ${applesLeft} quả`
                    : 'Không còn thừa (chia vừa hết)!'
                  : `Số táo chưa chia: ${applesLeft} quả`}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-12 items-center">
              {applesLeft === 0 ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã chia hết vào các giỏ!
                </span>
              ) : (
                Array.from({ length: applesLeft }).map((_, i) => (
                  <AppleSvg key={i} size="sm" isRemainder={hasFinishedDivision && applesLeft > 0} />
                ))
              )}
            </div>
          </div>

          {/* 5 giỏ táo */}
          <div className="flex justify-center items-center gap-2 sm:gap-3 overflow-x-auto pb-2">
            {baskets.map((cnt, idx) => (
              <BasketSvg key={idx} index={idx + 1} appleCount={cnt} isReceiving={activeBasket === idx} />
            ))}
          </div>

          {/* Nút bấm chia táo */}
          {!hasFinishedDivision && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDistributing || applesLeft < 5}
                onClick={handleDivideOneRound}
                className="py-3 px-6 rounded-2xl bg-[#2F80D0] hover:bg-[#2069b2] text-white font-display font-black text-base shadow-[0_4px_0_#1c538e] active:translate-y-1 active:shadow-none transition-all cursor-pointer btn-press disabled:opacity-50"
              >
                Chia mỗi giỏ 1 quả (5 quả)
              </button>
            </div>
          )}

          {/* Câu hỏi sau khi chia xong */}
          {hasFinishedDivision && !isAnsweredCheck && (
            <div className="bg-amber-100/80 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 flex flex-col gap-3 animate-fadeIn">
              <p className="font-display font-black text-amber-950 text-base">
                🤔 Em quan sát xem: Mỗi giỏ được mấy quả? Còn thừa mấy quả?
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
                <div className="flex items-center gap-1.5">
                  <span>Mỗi giỏ:</span>
                  <input
                    type="number"
                    value={inputQ}
                    onChange={(e) => setInputQ(e.target.value)}
                    placeholder="?"
                    className="w-14 h-11 text-center font-display font-black text-xl rounded-xl bg-white border-2 border-[#2F80D0] text-[#2F80D0]"
                  />
                  <span>quả</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Còn thừa:</span>
                  <input
                    type="number"
                    value={inputR}
                    onChange={(e) => setInputR(e.target.value)}
                    placeholder="?"
                    className="w-14 h-11 text-center font-display font-black text-xl rounded-xl bg-white border-2 border-[#E2463B] text-[#E2463B]"
                  />
                  <span>quả</span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitCheck}
                  className="py-2.5 px-5 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm shadow-xs cursor-pointer btn-press"
                >
                  Kiểm tra
                </button>
              </div>

              {checkError && (
                <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> {checkError}
                </p>
              )}
            </div>
          )}

          {/* Giải thích sư phạm chi tiết sau khi trả lời */}
          {isAnsweredCheck && (
            <div
              className={`p-5 rounded-2xl border-2 space-y-3 animate-fadeIn ${
                isCheckCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl text-white font-bold shrink-0 ${
                    isCheckCorrect ? 'bg-[#3F9B4A]' : 'bg-[#F07B12]'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="space-y-2 text-xs sm:text-sm font-bold flex-1">
                  <p className="text-base font-extrabold text-slate-800">
                    {subStage === 1
                      ? '15 chia 5 được 3, không còn thừa. Đây là phép chia hết!'
                      : '17 chia 5 được 3, còn thừa 2 quả. 2 quả không đủ chia cho 5 giỏ nữa!'}
                  </p>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    {subStage === 1 ? (
                      <div className="space-y-1">
                        <p className="font-display font-black text-2xl sm:text-3xl text-slate-800">
                          15 : 5 = <span className="text-[#2F80D0]">3</span>
                        </p>
                        <p className="text-emerald-800">
                          👉 Phép chia có số dư bằng 0 là <strong>phép chia hết</strong>.
                        </p>
                        <p className="text-slate-600">Thử lại: 3 × 5 = 15</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-display font-black text-2xl sm:text-3xl text-slate-800">
                          17 : 5 = <span className="text-[#2F80D0]">3</span>{' '}
                          <span className="text-[#E2463B]">(dư 2)</span>
                        </p>
                        <p className="text-slate-700">
                          Đọc là: <em>mười bảy chia năm được ba, dư hai</em>.
                        </p>
                        <p className="text-red-700">
                          👉 Đây là <strong>phép chia có dư</strong>, 2 là số dư.
                        </p>
                        <p className="text-slate-800 font-bold bg-amber-50 p-1.5 rounded border border-amber-200">
                          Thử lại: 3 × 5 + 2 = 17
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Nút sang tình huống tiếp */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setupSubStage(subStage === 1 ? 2 : 3)}
                  className="py-2.5 px-6 rounded-xl bg-[#F07B12] hover:bg-[#d86b0c] text-white font-display font-bold text-sm shadow-xs flex items-center gap-1.5 cursor-pointer btn-press"
                >
                  <span>{subStage === 1 ? 'Sang Tình huống 2 →' : 'Sang Tình huống 3 (Thử nghiệm) →'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TÌNH HUỐNG 3: TỰ DO VỚI 4 GIỎ + PHÁT HIỆN SỐ DƯ */}
      {subStage === 3 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-[#F0DCC0] shadow-md flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-800">
              Tình huống 3: Tự thử nghiệm chia cho 4 giỏ
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Đã thử: {freeHistory.length} lần
            </span>
          </div>

          <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-sky-950">Chọn số táo (10–30):</span>
              <input
                type="range"
                min="10"
                max="30"
                value={freeApples}
                onChange={(e) => setFreeApples(Number(e.target.value))}
                className="accent-[#2F80D0] cursor-pointer"
              />
              <span className="font-display font-black text-2xl text-[#2F80D0]">
                {freeApples} quả
              </span>
            </div>

            <button
              type="button"
              onClick={handleDivideFree}
              className="py-2.5 px-5 rounded-xl bg-[#2F80D0] hover:bg-[#2069b2] text-white font-display font-bold text-sm shadow-xs cursor-pointer btn-press"
            >
              Chia vào 4 giỏ
            </button>
          </div>

          {/* Bảng ghi các lần thử */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-amber-100 font-display font-bold text-slate-800">
                <tr>
                  <th className="py-2 px-3">Số quả táo</th>
                  <th className="py-2 px-3">Số giỏ</th>
                  <th className="py-2 px-3 text-[#2F80D0]">Mỗi giỏ (thương)</th>
                  <th className="py-2 px-3 text-[#E2463B]">Còn thừa (số dư)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {freeHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-3 px-3 text-center text-slate-400 italic">
                      Em hãy chọn số táo và bấm nút &quot;Chia vào 4 giỏ&quot; ở trên nhé (ít nhất 3 lần).
                    </td>
                  </tr>
                ) : (
                  freeHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 font-bold">
                      <td className="py-2 px-3">{item.apples} quả</td>
                      <td className="py-2 px-3">4 giỏ</td>
                      <td className="py-2 px-3 text-[#2F80D0] font-display text-base">
                        {item.quotient} quả
                      </td>
                      <td className="py-2 px-3 text-[#E2463B] font-display text-base">
                        {item.remainder} quả
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Câu hỏi sau khi thử ít nhất 3 lần */}
          {freeHistory.length >= 3 && (
            <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300 space-y-3 animate-fadeIn">
              <h4 className="font-display font-black text-amber-950 text-base sm:text-lg">
                🤔 Câu hỏi khám phá: Khi chia cho 4 giỏ, số quả còn thừa có thể là những số nào?
              </h4>
              <p className="text-xs text-slate-600 font-semibold">
                (Em có thể chọn nhiều đáp án bằng cách bấm vào các ô số dưới đây)
              </p>

              {/* Lựa chọn 0, 1, 2, 3, 4, 5 */}
              <div className="flex flex-wrap gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((val) => {
                  const isSel = multiSelected.includes(val);
                  return (
                    <button
                      key={val}
                      type="button"
                      disabled={isMultiAnswered}
                      onClick={() => toggleOption(val)}
                      className={`w-13 h-13 rounded-2xl font-display font-black text-xl transition-all cursor-pointer border-2 ${
                        isSel
                          ? 'bg-[#F07B12] text-white border-orange-600 shadow-sm scale-105'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-100'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              {!isMultiAnswered && (
                <button
                  type="button"
                  onClick={handleSubmitMulti}
                  className="py-2.5 px-6 rounded-xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-bold text-sm shadow-xs cursor-pointer btn-press"
                >
                  Xác nhận câu trả lời
                </button>
              )}

              {/* Giải thích kết luận */}
              {isMultiAnswered && (
                <div
                  className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                    isMultiCorrect ? 'bg-emerald-100/80 border-emerald-300' : 'bg-red-100/80 border-red-300'
                  }`}
                >
                  <p className="font-display font-black text-base text-slate-900">
                    {isMultiCorrect ? '🎉 Rất chính xác! Các số dư có thể là: 0, 1, 2, 3.' : 'Chưa đúng rồi!'}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-800 font-bold">
                    💡 <strong>Giải thích:</strong> Nếu còn thừa 4 quả thì ta vẫn chia tiếp được mỗi giỏ 1 quả nữa.
                    Do đó, số quả còn thừa <strong>bao giờ cũng bé hơn 4</strong> (chỉ có thể là 0, 1, 2, hoặc 3).
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-300 text-xs sm:text-sm font-black text-[#2C7535]">
                    👉 QUY TẮC VÀNG: SỐ DƯ BAO GIỜ CŨNG BÉ HƠN SỐ CHIA!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
