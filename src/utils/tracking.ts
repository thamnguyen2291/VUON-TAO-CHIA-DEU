/**
 * Quản lý theo dõi kết quả học tập & Tích hợp chuẩn SCORM 1.2
 * Tự động tìm API SCORM trên LMS (Moodle, Canvas, Blackboard, vnEdu...)
 * Nếu chạy web thông thường, không phát sinh lỗi.
 */

// Định nghĩa interface cho đối tượng SCORM 1.2 API
interface ScormAPI {
  LMSInitialize(param: string): string;
  LMSFinish(param: string): string;
  LMSGetValue(element: string): string;
  LMSSetValue(element: string, value: string): string;
  LMSCommit(param: string): string;
  LMSGetLastError(): string;
  LMSGetErrorString(errorCode: string): string;
  LMSGetDiagnostic(errorCode: string): string;
}

declare global {
  interface Window {
    API?: ScormAPI;
  }
}

/**
 * Tìm API SCORM 1.2 ở window hiện tại hoặc các window cha
 */
function findScormAPI(win: Window): ScormAPI | null {
  try {
    let currentWin = win;
    let attempts = 0;
    while (!currentWin.API && currentWin.parent && currentWin.parent !== currentWin && attempts < 10) {
      attempts++;
      currentWin = currentWin.parent;
    }
    if (currentWin.API) {
      return currentWin.API;
    }
    if (win.opener && win.opener.API) {
      return win.opener.API;
    }
  } catch {
    // Tránh lỗi cross-origin
  }
  return null;
}

let scormInitialized = false;

/**
 * Khởi động phiên học SCORM khi mở bài
 */
export function batDau(): void {
  try {
    const api = findScormAPI(window);
    if (api && !scormInitialized) {
      const result = api.LMSInitialize('');
      if (result === 'true' || result === '1') {
        scormInitialized = true;
        api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
        api.LMSCommit('');
      }
    }
  } catch {
    // Chạy bình thường nếu không có SCORM
  }
}

/**
 * Ghi nhận tiến độ chặng học hiện tại
 * @param buoc Tên hoặc mã chặng học (ví dụ: 'kham-pha', 'luyen-tap'...)
 */
export function ghiTienDo(buoc: string): void {
  try {
    const api = findScormAPI(window);
    if (api && scormInitialized) {
      api.LMSSetValue('cmi.core.lesson_location', buoc);
      api.LMSCommit('');
    }
  } catch {
    // Bỏ qua lỗi
  }
}

/**
 * Ghi nhận điểm số bài kiểm tra
 * @param diem Điểm số học sinh đạt được
 * @param toiDa Điểm tối đa (thường là 10)
 */
export function ghiDiem(diem: number, toiDa: number = 10): void {
  try {
    const api = findScormAPI(window);
    if (api && scormInitialized) {
      api.LMSSetValue('cmi.core.score.raw', diem.toString());
      api.LMSSetValue('cmi.core.score.max', toiDa.toString());
      api.LMSSetValue('cmi.core.score.min', '0');
      api.LMSCommit('');
    }
  } catch {
    // Bỏ qua lỗi
  }
}

/**
 * Đánh dấu hoàn thành bài học
 * @param dat true nếu đạt (>= 5/10), false nếu chưa đạt
 */
export function hoanThanh(dat: boolean): void {
  try {
    const api = findScormAPI(window);
    if (api && scormInitialized) {
      const status = dat ? 'passed' : 'failed';
      api.LMSSetValue('cmi.core.lesson_status', status);
      api.LMSCommit('');
      api.LMSFinish('');
      scormInitialized = false;
    }
  } catch {
    // Bỏ qua lỗi
  }
}
