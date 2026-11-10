import React, { useState, useEffect } from 'react';
import { RotateCcw, Award, CheckCircle2, AlertCircle, BookmarkCheck, Users, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { GroupInfo } from '../types/classroom.ts';

export interface AnswerRecord {
  stage: string;
  questionText: string;
  isCorrect: boolean;
  classCorrect?: number;
  classSize?: number;
}

interface SummaryTabProps {
  groups: GroupInfo[];
  answerRecords: AnswerRecord[];
  classSize?: number;
  calledCount?: number;
  onResetAll: () => void;
  onTriggerConfetti: () => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  groups,
  answerRecords,
  classSize = 35,
  calledCount = 0,
  onResetAll,
  onTriggerConfetti,
}) => {
  const [selfEval, setSelfEval] = useState<string | null>(null);

  useEffect(() => {
    // Kích hoạt pháo giấy và âm thanh vui vẻ khi vào màn hình tổng kết
    onTriggerConfetti();
    sound.playCorrect();
  }, [onTriggerConfetti]);

  // Xếp hạng các nhóm từ điểm cao đến thấp
  const sortedGroups = [...groups].sort((a, b) => b.score - a.score);
  const highestScore = sortedGroups[0]?.score ?? 0;
  const topGroups = sortedGroups.filter((g) => g.score === highestScore);
  const isTie = topGroups.length === sortedGroups.length && sortedGroups.length > 1;

  // Tính trung bình tỉ lệ cả lớp trả lời đúng
  const recordsWithClassCount = answerRecords.filter((r) => r.classCorrect !== undefined);
  const totalClassPercent =
    recordsWithClassCount.length > 0
      ? Math.round(
          recordsWithClassCount.reduce((sum, r) => {
            const sz = r.classSize || classSize;
            return sum + (r.classCorrect || 0) / sz;
          }, 0) /
            recordsWithClassCount.length *
            100
        )
      : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-6 items-center">
      {/* BANNER VINH DANH CHIẾN THẮNG */}
      <div className="w-full bg-linear-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-md text-center flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-sm animate-bounce">
          🏆
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-amber-950">
          {isTie
            ? 'Các nhóm hòa nhau – Cả lớp đều quá xuất sắc!'
            : `Chúc mừng ${topGroups.map((g) => g.name).join(' & ')} cao điểm nhất!`}
        </h2>
        <p className="text-sm sm:text-base font-bold text-amber-900 max-w-xl">
          Các em đã cùng nhau khám phá, thực hành và giải quyết các bài toán chia có dư rất tự tin và sôi nổi!
        </p>
      </div>

      {/* THẺ ĐIỂM SỐ CÁC NHÓM XẾP HẠNG TỪ CAO ĐẾN THẤP */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-display font-black text-lg text-slate-800 flex items-center gap-2">
            <span>🏅 Bảng xếp hạng các nhóm thi đua ({sortedGroups.length} nhóm)</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Xếp hạng theo điểm số
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedGroups.map((group, rankIdx) => {
            const isWinner = topGroups.some((g) => g.id === group.id);
            const rankMedal = rankIdx === 0 ? '🥇' : rankIdx === 1 ? '🥈' : rankIdx === 2 ? '🥉' : `#${rankIdx + 1}`;

            return (
              <div
                key={group.id}
                className={`rounded-3xl p-5 border-3 transition-all flex flex-col items-center justify-between gap-3 ${
                  isWinner
                    ? 'bg-amber-50/80 border-amber-400 shadow-md ring-4 ring-amber-200 scale-102'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-bold">{rankMedal}</span>
                  <div className="flex items-center gap-1.5 font-display font-black text-lg text-slate-800">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: group.colorHex }}
                    />
                    <span>{group.name}</span>
                  </div>
                  {isWinner ? <Award className="w-5 h-5 text-amber-600" /> : <div className="w-5" />}
                </div>

                <div
                  className="font-display font-black text-5xl sm:text-6xl tracking-tight"
                  style={{ color: group.colorHex }}
                >
                  {group.score}
                  <span className="text-lg font-bold text-slate-500 ml-1">đ</span>
                </div>

                {/* Dãy sao ⭐ */}
                <div className="flex items-center gap-1 flex-wrap justify-center min-h-7">
                  {group.score > 0 ? (
                    Array.from({ length: Math.min(group.score, 7) }).map((_, i) => (
                      <span key={i} className="text-xl drop-shadow-xs animate-pulse">
                        ⭐
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-bold">
                      Cố gắng ở lượt sau nhé!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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

      {/* BẢNG THỐNG KÊ CHO GIÁO VIÊN (KÈM CỘT TỈ LỆ CẢ LỚP ĐÚNG) */}
      <div className="w-full bg-white rounded-3xl p-6 border-2 border-[#F0DCC0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
              <span>📊 Bảng thống kê kết quả học tập của cả lớp</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Chi tiết câu hỏi và tỉ lệ học sinh trả lời đúng
            </p>
          </div>

          {/* DÒNG TÓM TẮT: TRUNG BÌNH CẢ LỚP & ĐÃ GỌI BẠN LÊN BẤM */}
          <div className="flex flex-wrap items-center gap-2">
            {totalClassPercent !== null && (
              <span className="text-xs font-display font-extrabold bg-blue-50 text-blue-900 px-3 py-1 rounded-xl border border-blue-200">
                Trung bình cả lớp đúng: <strong>{totalClassPercent}%</strong>
              </span>
            )}
            <span className="text-xs font-display font-extrabold bg-amber-50 text-amber-900 px-3 py-1 rounded-xl border border-amber-200">
              Đã gọi: <strong>{calledCount} / {classSize} bạn</strong>
            </span>
          </div>
        </div>

        {answerRecords.length === 0 ? (
          <p className="text-center text-xs text-slate-400 italic py-4">
            Chưa có câu hỏi nào được hoàn thành ở chặng Luyện tập và Thử thách.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-amber-50 font-display font-bold text-slate-800 border-b border-amber-200">
                <tr>
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">Chặng học</th>
                  <th className="py-2.5 px-3">Phép tính / Câu hỏi</th>
                  <th className="py-2.5 px-3">Đại diện</th>
                  <th className="py-2.5 px-3">Tỉ lệ cả lớp đúng</th>
                  <th className="py-2.5 px-3">Đánh giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {answerRecords.map((r, idx) => {
                  const size = r.classSize || classSize;
                  const count = r.classCorrect ?? (r.isCorrect ? size : 0);
                  const pct = Math.round((count / size) * 100);
                  const isLow = pct < 50;

                  return (
                    <tr
                      key={idx}
                      className={isLow ? 'bg-red-50/60 font-semibold' : 'hover:bg-slate-50 font-medium'}
                    >
                      <td className="py-2.5 px-3 text-slate-500 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{r.stage}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.questionText}</td>
                      <td className="py-2.5 px-3">
                        {r.isCorrect ? (
                          <span className="text-[#3F9B4A] font-bold">✔ Đúng</span>
                        ) : (
                          <span className="text-[#E2463B] font-bold">✗ Sai</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-display font-black text-sm">
                        {count} / {size} bạn ({pct}%)
                      </td>
                      <td className="py-2.5 px-3">
                        {isLow ? (
                          <span className="text-[11px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-300">
                            Cần củng cố
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                            Đạt chuẩn
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
