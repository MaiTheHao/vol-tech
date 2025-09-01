# Dự án Hỗ trợ Thi Khoa học Kỹ thuật - Lớp 11 THPT Huỳnh Văn Nghệ

## Giới thiệu

Dự án này nhằm hỗ trợ các bạn học sinh lớp 11 trường THPT Huỳnh Văn Nghệ (Phường Tân Uyên, TP.HCM) trong kỳ thi Khoa học Kỹ thuật. Đây là dự án đơn giản với kinh phí thấp, tập trung vào tốc độ phát triển nên sử dụng các công nghệ đơn giản và hiệu quả.

## Kiến trúc dự án

-   **Backend**: Vercel Serverless Functions - giải pháp miễn phí, deploy nhanh
-   **Frontend**: Vite + React - công cụ build nhanh, thư viện phổ biến, dễ học
-   **Database**: MongoDB với mock data - cơ sở dữ liệu NoSQL đơn giản

### Cấu trúc Database

Dự án sử dụng 5 collections chính:

-   **users**: Thông tin người dùng (học sinh, giáo viên)
-   **activities**: Danh sách các hoạt động thi đấu
-   **user_activities**: Liên kết giữa người dùng và hoạt động tham gia
-   **provinces**: Danh sách tỉnh thành
-   **communes**: Danh sách xã phường theo tỉnh

## Hướng dẫn cài đặt và chạy dự án

### Backend

1. Cài đặt Vercel CLI:
    ```bash
    npm install -g vercel
    ```
2. Mở thư mục `backend` và chạy:
    ```bash
    cd backend
    vercel dev
    ```

### Frontend

1. Mở thư mục `frontend` và cài đặt dependencies:
    ```bash
    cd frontend
    npm install
    ```
2. Chạy development server:
    ```bash
    npm run dev
    ```

## Lưu ý quan trọng

-   Phần backend đã được triển khai sẵn
-   Các bạn tự xây dựng frontend, kết nối với API backend đã cung cấp
-   Đảm bảo backend chạy trước khi test frontend
-   Dự án tối ưu cho tốc độ phát triển và chi phí thấp
-   Mock data có sẵn trong thư mục `/backend/mock_data` để test

## Đóng góp

Mọi ý kiến đóng góp hoặc thắc mắc vui lòng liên hệ trực tiếp.

---

**Chúc các bạn thành công trong kỳ thi Khoa học Kỹ thuật!**
