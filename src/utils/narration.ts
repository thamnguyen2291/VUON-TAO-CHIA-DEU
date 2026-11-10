/**
 * Trình phát thuyết minh cho chế độ "Em tự học":
 * 1. Ưu tiên phát file mp3 giáo viên tự thu: ./audio/<ma-buoc>.mp3
 * 2. Nếu không có mp3: đọc bằng GIỌNG TIẾNG VIỆT của trình duyệt (Web Speech API).
 *    - Chờ trình duyệt tải xong danh sách giọng đọc rồi mới chọn giọng.
 *    - Ưu tiên giọng tự nhiên: Microsoft HoaiMy / NamMinh (Edge), Google Tiếng Việt, Linh (Apple)...
 *    - KHÔNG BAO GIỜ đọc bằng giọng nước ngoài: nếu máy không có giọng tiếng Việt thì
 *      chỉ hiện phụ đề và báo cho giao diện biết (hasVietnameseVoice = false).
 */

type VoiceListener = (hasVietnameseVoice: boolean) => void;

const PREFERRED_VOICE_KEYWORDS = ['hoaimy', 'namminh', 'google tiếng việt', 'google vietnamese', 'linh', 'an ', 'microsoft an'];

function isVietnamese(v: SpeechSynthesisVoice): boolean {
  const lang = (v.lang || '').toLowerCase().replace('_', '-');
  const name = (v.name || '').toLowerCase();
  return lang === 'vi-vn' || lang.startsWith('vi') || name.includes('vietnam') || name.includes('tiếng việt');
}

function pickBestVietnameseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const vi = voices.filter(isVietnamese);
  if (vi.length === 0) return null;
  const score = (v: SpeechSynthesisVoice) => {
    const name = v.name.toLowerCase();
    let s = 0;
    if (name.includes('natural') || name.includes('online')) s += 10;
    PREFERRED_VOICE_KEYWORDS.forEach((k, i) => { if (name.includes(k)) s += 20 - i; });
    if (v.localService === false) s += 2;
    return s;
  };
  return vi.sort((a, b) => score(b) - score(a))[0];
}

/** Chờ trình duyệt tải danh sách giọng đọc (Chrome/Edge tải không đồng bộ). */
function loadVoices(timeoutMs = 2500): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) { resolve([]); return; }
    const synth = window.speechSynthesis;
    const now = synth.getVoices();
    if (now.length > 0) { resolve(now); return; }
    let done = false;
    const finish = () => { if (done) return; done = true; resolve(synth.getVoices()); };
    try { synth.addEventListener('voiceschanged', finish, { once: true }); } catch { /* bỏ qua */ }
    // Một số trình duyệt không phát sự kiện voiceschanged: hỏi lại vài lần
    let tries = 0;
    const poll = setInterval(() => {
      tries++;
      if (synth.getVoices().length > 0 || tries * 250 >= timeoutMs) { clearInterval(poll); finish(); }
    }, 250);
  });
}

class NarrationManager {
  private currentAudio: HTMLAudioElement | null = null;
  public enabled = true;
  /** null = chưa kiểm tra; true/false = máy có/không có giọng tiếng Việt */
  public hasVietnameseVoice: boolean | null = null;
  public voiceName = '';
  private viVoice: SpeechSynthesisVoice | null = null;
  private listeners: VoiceListener[] = [];
  private voicesReady: Promise<void>;

  constructor() {
    this.voicesReady = this.detectVoice();
  }

  private async detectVoice(): Promise<void> {
    const voices = await loadVoices();
    this.viVoice = pickBestVietnameseVoice(voices);
    this.hasVietnameseVoice = !!this.viVoice;
    this.voiceName = this.viVoice ? this.viVoice.name : '';
    this.listeners.forEach((fn) => { try { fn(this.hasVietnameseVoice === true); } catch { /* bỏ qua */ } });
  }

  /** Giao diện đăng ký để biết máy có giọng tiếng Việt hay không (để hiện lời nhắc). */
  public onVoiceStatus(fn: VoiceListener): () => void {
    this.listeners.push(fn);
    if (this.hasVietnameseVoice !== null) fn(this.hasVietnameseVoice);
    return () => { this.listeners = this.listeners.filter((f) => f !== fn); };
  }

  public stop() {
    if (this.currentAudio) {
      try { this.currentAudio.pause(); this.currentAudio.currentTime = 0; } catch { /* bỏ qua */ }
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch { /* bỏ qua */ }
    }
  }

  /**
   * Phát thuyết minh cho một bước học.
   * @param stepId Mã bước (bia, khoi-dong, kham-pha-1...)
   * @param textTranscript Lời thoại tiếng Việt (cũng là phụ đề)
   * @param onEnd Gọi khi đọc xong (hoặc khi không đọc được)
   */
  public async speak(stepId: string, textTranscript: string, onEnd?: () => void): Promise<void> {
    if (!this.enabled) { onEnd?.(); return; }
    this.stop();

    const speakVietnamese = async () => {
      if (!this.enabled) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) { onEnd?.(); return; }
      await this.voicesReady;
      if (!this.viVoice) { onEnd?.(); return; } // Không có giọng tiếng Việt: chỉ hiện phụ đề
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(textTranscript);
        u.voice = this.viVoice;
        u.lang = this.viVoice.lang || 'vi-VN';
        u.rate = 0.9;
        u.pitch = 1.05;
        u.onend = () => onEnd?.();
        u.onerror = () => onEnd?.();
        synth.speak(u);
        // Chrome đôi khi tự dừng câu dài sau ~15 giây: giữ cho trình đọc chạy tiếp
        const keepAlive = setInterval(() => {
          if (!synth.speaking) { clearInterval(keepAlive); return; }
          synth.pause(); synth.resume();
        }, 10000);
      } catch {
        onEnd?.();
      }
    };

    // 1) Thử file mp3 của giáo viên
    const audio = new Audio(`./audio/${stepId}.mp3`);
    let fellBack = false;
    const fallback = () => { if (fellBack) return; fellBack = true; this.currentAudio = null; speakVietnamese(); };
    audio.oncanplaythrough = () => {
      if (fellBack) return;
      this.currentAudio = audio;
      audio.play().catch(fallback);
    };
    audio.onended = () => { this.currentAudio = null; onEnd?.(); };
    audio.onerror = fallback;
    // Trang web trả về lỗi hoặc tải quá lâu: chuyển sang giọng đọc của máy
    setTimeout(() => { if (!this.currentAudio) fallback(); }, 3000);
  }
}

export const narrator = new NarrationManager();
