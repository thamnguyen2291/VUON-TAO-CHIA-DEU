/**
 * Trình phát thuyết minh thông minh cho chế độ E-learning:
 * 1. Ưu tiên kiểm tra và phát file mp3 của giáo viên: /audio/<step-id>.mp3
 * 2. Nếu không có file mp3, tự động đọc bằng Web Speech API tiếng Việt (lang="vi-VN", rate=0.9)
 * 3. Nếu trình duyệt không hỗ trợ Web Speech tiếng Việt: im lặng hiển thị phụ đề, không gây lỗi console
 */

class NarrationManager {
  private currentAudio: HTMLAudioElement | null = null;
  public enabled: boolean = true;
  private isSpeakingSpeech: boolean = false;

  /**
   * Dừng toàn bộ âm thanh thuyết minh đang phát
   */
  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Bỏ qua
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Bỏ qua
      }
    }
    this.isSpeakingSpeech = false;
  }

  /**
   * Phát thuyết minh cho một bước học cụ thể
   * @param stepId Mã bước (ví dụ: 'bia', 'khoi-dong', 'kham-pha-1'...)
   * @param textTranscript Nội dung phụ đề / kịch bản tiếng Việt
   * @param onEnd Callback khi phát xong
   */
  public async speak(
    stepId: string,
    textTranscript: string,
    onEnd?: () => void
  ): Promise<void> {
    if (!this.enabled) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    // Thử tải file mp3 từ thư mục public/audio/<stepId>.mp3
    const audioPath = `./audio/${stepId}.mp3`;
    const audio = new Audio(audioPath);

    const tryWebSpeech = () => {
      if (!this.enabled) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(textTranscript);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        utterance.pitch = 1.05;

        // Tìm voice tiếng Việt nếu có
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(
          (v) => v.lang === 'vi-VN' || v.lang === 'vi_VN' || v.lang.startsWith('vi')
        );
        if (viVoice) {
          utterance.voice = viVoice;
        }

        utterance.onend = () => {
          this.isSpeakingSpeech = false;
          if (onEnd) onEnd();
        };

        utterance.onerror = () => {
          this.isSpeakingSpeech = false;
          if (onEnd) onEnd();
        };

        this.isSpeakingSpeech = true;
        window.speechSynthesis.speak(utterance);
      } catch {
        if (onEnd) onEnd();
      }
    };

    audio.oncanplaythrough = () => {
      this.currentAudio = audio;
      audio.play().catch(() => {
        // Nếu không phát được mp3 thì thử Web Speech
        tryWebSpeech();
      });
    };

    audio.onended = () => {
      this.currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      // Không có file MP3 -> Fallback sang Web Speech API
      this.currentAudio = null;
      tryWebSpeech();
    };
  }
}

export const narrator = new NarrationManager();
