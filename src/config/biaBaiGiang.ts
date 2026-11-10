/**
 * CẤU HÌNH THÔNG TIN TRANG BÌA BÀI GIẢNG E-LEARNING
 * Giáo viên có thể chỉnh sửa thông tin tại file này nhanh chóng.
 */

export interface BiaConfig {
  tenCuocThi: string;
  tieuDeBai: string;
  monHoc: string;
  baiHoc: string;
  boSach: string;
  giayPhep: string;
  giaoVien: string;
  email: string;
  donVi: string;
  thangNam: string;
  thongDiep: string;
}

export const THONG_TIN_BIA: BiaConfig = {
  tenCuocThi: 'Hội thi "Ứng dụng công nghệ số – Đổi mới hoạt động dạy học, phát huy năng lực học sinh tiểu học"',
  tieuDeBai: 'Phép chia hết, phép chia có dư',
  monHoc: 'Môn Toán – Lớp 3',
  baiHoc: 'Bài 25 (tiết 1) · Tuần 11',
  boSach: 'Bộ sách Kết nối tri thức với cuộc sống',
  giayPhep: 'Giấy phép học liệu mở: Creative Commons (CC BY 4.0)',
  giaoVien: 'Nguyễn Thị Hồng Thắm',
  email: 'thamnguyen2291@gmail.com',
  donVi: 'Trường Tiểu học Huỳnh Thúc Kháng, phường Bình Hưng Hòa, TP. Hồ Chí Minh',
  thangNam: 'Tháng 11/2026',
  thongDiep: 'Sáng tạo trong thiết kế – Tích cực trong học tập – Lan tỏa tri thức số',
};
