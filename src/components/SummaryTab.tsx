import React, { useState, useEffect } from 'react';
import { RotateCcw, Award, CheckCircle2, AlertCircle, BookmarkCheck } from 'lucide-react';
import { sound } from '../utils/audio.ts';

export interface AnswerRecord {
  stage: string;
  questionText: string;
  isCorrect: boolean;
}

interface SummaryTabProps {
  scoreBlue: number;
  scoreOrange: number;
  answerRecords: AnswerRecord[];
  onResetAll: () => void;
  onTriggerConfetti: () => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  scoreBlue,
  scoreOrange,
  answerRecords,
  onResetAll,
  onTriggerConfetti,
}) => {
  const [selfEval, setSelfEval] = useState<string | null>(null);

  useEffect(() => {
    // Kích hoạt pháo giấy và âm thanh vui vẻ khi vào màn hình tổng kết
    onTriggerConfetti();
    sound.playCorrect();
  }, [onTriggerConfetti]);

  // Xác định đội chiến thắng
  const isBlueWin = scoreBlue > scoreOrange;
  const isOrangeWin = scoreOrange > scoreBlue;
  const isTie = scoreBlue === scoreOrange;

  // Thống kê theo chặng cho giáo viên
  const stage2Records = answerRecords.filter((r) => r.stage.includes('Chặng 2'));
  const stage3Records = answerRecords.filter((r) => r.stage.includes('Chặng 3'));

  const stage2Correct = stage2Records.filter((r) => r.isCorrect).length;
  const stage3Correct = stage3Records.filter((r) => r.isCorrect).length;

  const missedQuestions = answerRecords.filter((r) => !r.isCorrect);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-6 items-center">
      {/* BANNER VINH DANH CHIẾN THẮNG */}
      <div className="w-full bg-linear-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-md text-center flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-sm animate-bounce">
          🏆
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-amber-950">
          {isBlueWin && 'Chúc Mừng Đội Xanh Thắng Cuộc!'}
          {isOrangeWin && 'Chúc Mừng Đội Cam Thắng Cuộc!'}
          {isTie && 'Hai Đội Hòa Nhau – Cả Lớp Đều Quá Xuất Sắc!'}
        </h2>
        <p className="text-sm sm:text-base font-bold text-amber-900 max-w-xl">
          Các em đã cùng nhau khám phá, thực hành và giải quyết các bài toán chia có dư rất tự tin và sôi nổi!
        </p>
      </div>

      {/* 2 THẺ ĐIỂM SỐ LỚN THEO MÀU ĐỘI */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Thẻ Đội Xanh */}
        <div
          className={`rounded-3xl p-6 border-3 transition-all flex flex-col items-center justify-between gap-4 ${
            isBlueWin
              ? 'bg-blue-50 border-[#2F80D0] shadow-lg ring-4 ring-blue-200'
              : 'bg-white border-blue-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#2F80D0]" />
            <h3 className="font-display font-black text-2xl text-blue-900">
              Đội Xanh
            </h3>
            {isBlueWin && <Award className="w-6 h-6 text-[#2F80D0]" />}
          </div>

          <div className="font-display font-black text-6xl sm:text-7xl text-[#2F80D0] tracking-tight">
            {scoreBlue}
            <span className="text-xl sm:text-2xl font-bold text-slate-500 ml-1.5">
              điểm
            </span>
          </div>

          {/* Dãy sao ⭐ */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center min-h-8">
            {scoreBlue > 0 ? (
              Array.from({ length: Math.min(scoreBlue, 7) }).map((_, i) => (
                <span key={i} className="text-2xl drop-shadow-sm animate-pulse">
                  ⭐
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-bold">
                Cùng cố gắng ở lượt sau nhé!
              </span>
            )}
          </div>
        </div>

        {/* Thẻ Đội Cam */}
        <div
          className={`rounded-3xl p-6 border-3 transition-all flex flex-col items-center justify-between gap-4 ${
            isOrangeWin
              ? 'bg-orange-50 border-[#F07B12] shadow-lg ring-4 ring-orange-200'
              : 'bg-white border-orange-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#F07B12]" />
            <h3 className="font-display font-black text-2xl text-orange-900">
              Đội Cam
            </h3>
            {isOrangeWin && <Award className="w-6 h-6 text-[#F07B12]" />}
          </div>

          <div className="font-display font-black text-6xl sm:text-7xl text-[#F07B12] tracking-tight">
            {scoreOrange}
            <span className="text-xl sm:text-2xl font-bold text-slate-500 ml-1.5">
              điểm
            </span>
          </div>

          {/* Dãy sao ⭐ */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center min-h-8">
            {scoreOrange > 0 ? (
              Array.from({ length: Math.min(scoreOrange, 7) }).map((_, i) => (
                <span key={i} className="text-2xl drop-shadow-sm animate-pulse">
                  ⭐
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-bold">
                Cùng cố gắng ở lượt sau nhé!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KHUNG "EM GHI NHỚ" (TRỌNG TÂM BÀI 25) */}
      <div className="w-full bg-[#FFFBF0] rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-amber-200/80 pb-3">
          <BookmarkCheck className="w-6 h-6 text-[#F39A1E]" />
          <h3 className="font-display font-black text-xl sm:text-2xl text-[#2C7535]">
            📌 Em Ghi Nhớ (Bài 25)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm sm:text-base font-bold text-slate-800">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <span className="text-emerald-700 text-lg">✔</span>
            <p>
              Phép chia có <span className="text-emerald-700 font-black">số dư bằng 0</span> là <strong>phép chia hết</strong>.
              <br />
              <span className="text-xs text-slate-500 font-semibold font-mono">Ví dụ: 15 : 5 = 3 (dư 0)</span>
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5">
            <span className="text-red-600 text-lg">◐</span>
            <p>
              Phép chia có <span className="text-[#E2463B] font-black">số dư khác 0</span> là <strong>phép chia có dư</strong>.
              <br />
              <span className="text-xs text-slate-500 font-semibold font-mono">Ví dụ: 17 : 5 = 3 (dư 2)</span>
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5 md:col-span-2">
            <span className="text-amber-600 text-lg">⭐</span>
            <p className="text-[#2C7535] text-base sm:text-lg font-black">
              QUY TẮC VÀNG: SỐ DƯ BAO GIỜ CŨNG BÉ HƠN SỐ CHIA.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5 md:col-span-2">
            <span className="text-blue-600 text-lg">🔍</span>
            <p>
              <strong>Thử lại:</strong> <span className="text-[#2F80D0] font-black">thương</span> × <strong>số chia</strong> + <span className="text-[#E2463B] font-black">số dư</span> = <strong>số bị chia</strong>.
              <br />
              <span className="text-xs text-slate-600 font-semibold font-mono">Ví dụ: 3 × 5 + 2 = 17</span>
            </p>
          </div>
        </div>
      </div>

      {/* BẢNG THỐNG KÊ CHO GIÁO VIÊN */}
      <div className="w-full bg-white rounded-3xl p-6 border-2 border-[#F0DCC0] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
            <span>📊 Bảng thống kê dành cho Giáo viên</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Theo dõi mức độ hoàn thành bài học
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-50 font-display font-bold text-slate-800 border-b border-amber-200">
              <tr>
                <th className="py-2.5 px-3">Chặng học tập</th>
                <th className="py-2.5 px-3">Số câu đã làm</th>
                <th className="py-2.5 px-3">Trả lời đúng</th>
                <th className="py-2.5 px-3">Tỉ lệ đúng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold">Chặng 2: Hết hay dư?</td>
                <td className="py-2.5 px-3">{stage2Records.length} / 8 câu</td>
                <td className="py-2.5 px-3 font-bold text-emerald-700">{stage2Correct} câu</td>
                <td className="py-2.5 px-3 font-bold">
                  {stage2Records.length > 0
                    ? `${Math.round((stage2Correct / stage2Records.length) * 100)}%`
                    : 'Chưa làm'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Chặng 3: Vận dụng thử thách</td>
                <td className="py-2.5 px-3">{stage3Records.length} / 6 câu</td>
                <td className="py-2.5 px-3 font-bold text-emerald-700">{stage3Correct} câu</td>
                <td className="py-2.5 px-3 font-bold">
                  {stage3Records.length > 0
                    ? `${Math.round((stage3Correct / stage3Records.length) * 100)}%`
                    : 'Chưa làm'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Các câu cần lưu ý / nhiều bạn trả lời sai */}
        {missedQuestions.length > 0 ? (
          <div className="bg-red-50/70 p-3.5 rounded-2xl border border-red-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-800">
              <AlertCircle className="w-4 h-4 text-[#E2463B]" />
              <span>Các câu hỏi học sinh cần được củng cố lại:</span>
            </div>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1 pl-1">
              {missedQuestions.map((q, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{q.stage}:</span>{' '}
                  <span className="italic">{q.questionText}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3F9B4A]" />
            <span>Xuất sắc! Tất cả các câu hỏi đã làm đều được trả lời chính xác!</span>
          </div>
        )}
      </div>

      {/* EM TỰ ĐÁNH GIÁ (3 NÚT CHỌN MỘT) */}
      <div className="w-full bg-white rounded-3xl p-6 border-2 border-[#F0DCC0] shadow-sm flex flex-col items-center gap-4">
        <h3 className="font-display font-black text-xl text-slate-800 text-center">
          Em Tự Đánh Giá Mức Độ Hiểu Bài Của Mình
        </h3>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'good',
              label: '😀 Em hiểu và làm đúng',
              note: 'Rất tuyệt vời! Em đã nắm vững phép chia có dư rồi đấy!',
              color: 'hover:border-emerald-400 bg-emerald-50/50',
            },
            {
              id: 'medium',
              label: '🙂 Em còn nhầm một chút',
              note: 'Không sao cả, em chỉ cần nhớ: số dư bao giờ cũng bé hơn số chia!',
              color: 'hover:border-amber-400 bg-amber-50/50',
            },
            {
              id: 'need-help',
              label: '🤔 Em cần cô giúp thêm',
              note: 'Đừng lo lắng nhé! Cô sẽ cùng em chia táo thêm vài lần là em sẽ hiểu ngay!',
              color: 'hover:border-sky-400 bg-sky-50/50',
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelfEval(item.id);
              }}
              className={`p-4 rounded-2xl border-2 text-center font-display font-bold text-sm sm:text-base transition-all cursor-pointer btn-press ${
                selfEval === item.id
                  ? 'border-[#2C7535] bg-[#3F9B4A]/15 ring-4 ring-emerald-300 shadow-md font-black'
                  : `border-slate-200 ${item.color} text-slate-800`
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {selfEval && (
          <div className="bg-amber-100/80 border border-amber-300 p-3 rounded-2xl text-center text-xs sm:text-sm font-bold text-amber-950 animate-fadeIn">
            {selfEval === 'good' && '🎉 Rất tuyệt vời! Em đã nắm vững phép chia có dư rồi đấy!'}
            {selfEval === 'medium' && '💪 Không sao cả, em nhớ kỹ quy tắc: số dư bao giờ cũng bé hơn số chia nhé!'}
            {selfEval === 'need-help' && '❤️ Đừng lo lắng nhé! Cô sẽ cùng em chia táo thêm vài lần là em sẽ hiểu ngay!'}
          </div>
        )}
      </div>

      {/* NÚT CHƠI LẠI TỪ ĐẦU */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onResetAll();
          }}
          className="py-4 px-8 rounded-2xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-black text-lg sm:text-xl shadow-[0_5px_0_#1e5324] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2.5 cursor-pointer btn-press"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>Chơi lại từ đầu 🔄</span>
        </button>
      </div>
    </div>
  );
};
