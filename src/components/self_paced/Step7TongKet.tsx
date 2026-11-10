import React, { useState } from 'react';
import { Award, Star, RotateCcw, BookOpen, CheckCircle2, BookmarkCheck, Heart } from 'lucide-react';
import { sound } from '../../utils/audio.ts';
import { AppleSvg } from '../AppleSvg.tsx';

interface Step7TongKetProps {
  score: number;
  stars: number;
  onRestart: () => void;
  onOpenTaiLieu: () => void;
}

export const Step7TongKet: React.FC<Step7TongKetProps> = ({
  score,
  stars,
  onRestart,
  onOpenTaiLieu,
}) => {
  const [studentName, setStudentName] = useState<string>('');
  const [selfRating, setSelfRating] = useState<string | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 animate-fadeIn">
      {/* GIẤY KHEN HOÀN THÀNH BÀI HỌC CÓ TÊN HỌC SINH */}
      <div className="w-full bg-linear-to-b from-[#FFFDF8] to-[#FFF7E8] rounded-3xl p-6 sm:p-10 border-4 border-double border-amber-400 shadow-xl relative overflow-hidden flex flex-col items-center text-center gap-4">
        {/* Dải nơ vinh danh */}
        <div className="bg-[#E2463B] text-white font-display font-black text-xs sm:text-sm uppercase tracking-widest px-6 py-1.5 rounded-full shadow-xs">
          Giấy Khen Hoàn Thành Khóa Học
        </div>

        <div className="flex items-center justify-center gap-2">
          <AppleSvg size="md" />
          <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-950">
            CHỨNG NHẬN HOÀN THÀNH
          </h2>
          <AppleSvg size="md" />
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md">
          Chúc mừng em đã hoàn thành xuất sắc bài giảng E-Learning:
          <br />
          <strong className="text-[#2C7535] text-sm sm:text-base">
            Bài 25: Phép chia hết, phép chia có dư (Toán 3)
          </strong>
        </p>

        {/* Ô nhập tên học sinh hiển thị lên giấy khen */}
        <div className="w-full max-w-sm bg-white/90 p-3 rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col items-center gap-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Họ và tên của em:
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Nhập tên của em vào đây..."
            className="w-full text-center font-display font-black text-xl text-[#2F80D0] bg-transparent outline-hidden border-b-2 border-dashed border-[#2F80D0]/50 pb-1 placeholder:text-slate-300"
          />
        </div>

        {/* Điểm số và Sao thưởng */}
        <div className="flex items-center gap-4 bg-amber-100/80 px-6 py-2.5 rounded-2xl border border-amber-300">
          <div className="font-display font-black text-xl text-amber-950">
            Điểm kiểm tra: <span className="text-[#E2463B]">{score} / 10</span>
          </div>
          <div className="flex items-center text-2xl">
            {Array.from({ length: Math.max(1, stars) }).map((_, i) => (
              <span key={i}>⭐</span>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          Trường Tiểu học Huỳnh Thúc Kháng · GV Nguyễn Thị Hồng Thắm · Năm học 2026–2027
        </p>
      </div>

      {/* KHUNG EM GHI NHỚ TRỌNG TÂM */}
      <div className="w-full bg-white rounded-3xl p-6 border-2 border-[#F0DCC0] shadow-sm space-y-3 text-xs sm:text-sm font-bold text-slate-700">
        <h3 className="font-display font-black text-lg text-[#2C7535] flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-[#3F9B4A]" />
          <span>Nhắc lại 4 ý ghi nhớ trọng tâm</span>
        </h3>
        <ul className="space-y-1.5 pl-2">
          <li>• Số dư bằng 0 là <strong>phép chia hết</strong> (15 : 5 = 3).</li>
          <li>• Số dư khác 0 là <strong>phép chia có dư</strong> (17 : 5 = 3 dư 2).</li>
          <li className="text-[#E2463B] font-black">• SỐ DƯ BAO GIỜ CŨNG BÉ HƠN SỐ CHIA.</li>
          <li>• Thử lại: <strong>thương × số chia + số dư = số bị chia</strong>.</li>
        </ul>
      </div>

      {/* EM TỰ ĐÁNH GIÁ (3 NÚT) */}
      <div className="w-full bg-white rounded-3xl p-6 border-2 border-[#F0DCC0] shadow-sm flex flex-col items-center gap-3">
        <h3 className="font-display font-black text-lg text-slate-800">
          Em Tự Đánh Giá Bài Học Hôm Nay
        </h3>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: '1', label: '😀 Em hiểu và làm đúng', note: 'Tuyệt vời! Em đã hoàn thành bài rất tốt!' },
            { id: '2', label: '🙂 Em còn nhầm một chút', note: 'Em nhớ kỹ quy tắc: số dư luôn bé hơn số chia nhé!' },
            { id: '3', label: '🤔 Em cần cô giúp thêm', note: 'Em hãy chia sẻ với cô giáo trong tiết học tới nhé!' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setSelfRating(item.id);
              }}
              className={`p-3 rounded-2xl border-2 font-display font-bold text-sm text-center transition-all cursor-pointer ${
                selfRating === item.id
                  ? 'border-[#3F9B4A] bg-emerald-50 text-emerald-950 ring-3 ring-emerald-200'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {selfRating && (
          <p className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fadeIn">
            {selfRating === '1' && '🎉 Tuyệt vời! Em đã nắm vững kiến thức rất tốt!'}
            {selfRating === '2' && '💪 Không sao cả, em chỉ cần chú ý số dư luôn bé hơn số chia nha!'}
            {selfRating === '3' && '❤️ Đừng lo lắng, cô giáo sẽ hướng dẫn thêm cho em trong giờ học tới nhé!'}
          </p>
        )}
      </div>

      {/* DẶN DÒ TẬP VỀ NHÀ */}
      <div className="w-full bg-amber-50 border-2 border-amber-300 p-4 rounded-3xl flex items-center gap-3 text-xs sm:text-sm font-bold text-amber-950">
        <span className="text-2xl">📝</span>
        <p>
          <strong>Dặn dò của cô:</strong> Em hãy hoàn thành các bài tập trong <strong>Vở bài tập Toán, Bài 25 – tiết 1</strong> nhé!
        </p>
      </div>

      {/* NÚT TÀI LIỆU THAM KHẢO & HỌC LẠI TỪ ĐẦU */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenTaiLieu();
          }}
          className="py-3 px-6 rounded-2xl bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-display font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#2F80D0]" />
          <span>Tài liệu tham khảo</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          className="py-3 px-8 rounded-2xl bg-[#3F9B4A] hover:bg-[#2C7535] text-white font-display font-black text-base shadow-[0_4px_0_#205a27] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer btn-press"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Học lại từ đầu 🔄</span>
        </button>
      </div>
    </div>
  );
};
