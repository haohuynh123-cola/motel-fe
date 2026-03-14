# 🏠 Tro-Go Frontend (Quản lý Nhà Trọ)

Hệ thống quản lý nhà trọ và cổng tìm kiếm phòng trọ chuyên nghiệp được xây dựng trên nền tảng **Vue 3** hiện đại.

## 🚀 Công nghệ sử dụng

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Ngôn ngữ:** TypeScript (Strict mode)
- **UI Library:** Ant Design Vue v4
- **State Management:** Pinia (Store-based)
- **CSS Framework:** Tailwind CSS (Utility-first)
- **Build Tool:** Vite
- **Routing:** Vue Router v5
- **API Client:** Axios (Centralized Services)

## 🏗️ Kiến trúc dự án

Dự án được tổ chức theo cấu trúc phân lớp để đảm bảo khả năng mở rộng:

- `src/api/`: Định nghĩa các dịch vụ gọi API và kiểu dữ liệu (Interfaces).
- `src/composables/`: Chứa các Logic nghiệp vụ có thể tái sử dụng, giúp các Component trở nên mỏng nhẹ.
- `src/stores/`: Quản lý trạng thái toàn cục bằng Pinia (Auth, Config, v.v.).
- `src/layouts/`: Các khung giao diện chính (AdminLayout cho quản lý, CustomerLayout cho khách hàng).
- `src/views/`: Các trang giao diện chi tiết.
- `src/utils/`: Các hàm tiện ích (Format tiền tệ, ngày tháng).

## 🛠️ Hướng dẫn phát triển

### Cài đặt
```bash
npm install
```

### Chạy môi trường Development
```bash
npm run dev
```

### Kiểm tra lỗi TypeScript & Build Production
```bash
npm run build
```

## 📝 Quy ước viết code

1. **TypeScript:** Luôn sử dụng `interface` cho dữ liệu trả về từ API.
2. **Logic:** Tuyệt đối không để logic call API trực tiếp trong file `.vue`. Hãy tạo/sử dụng **Composables**.
3. **UI:** Ưu tiên sử dụng component của Ant Design. Sử dụng Tailwind cho các khoảng cách (margin/padding) và layout nhanh.
4. **State:** Sử dụng Pinia Store cho các dữ liệu cần dùng ở nhiều trang khác nhau (ví dụ: Thông tin User, Cài đặt Sidebar).

---
© 2026 Tro-Go Team
