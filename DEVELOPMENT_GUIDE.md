# Hướng dẫn phát triển dự án "Kẹo Ngọt Nhỏ Xinh"

## Tổng quan dự án
Website dành cho học sinh tiểu học (lớp 1-5) với chủ đề "Kẹo Ngọt Nhỏ Xinh" - nơi các em chia sẻ cảm xúc, học hỏi và vui chơi.

## Cấu trúc dự án hiện tại

```
KeoNgot_NhoXinh/
├── index.html              # Trang chủ chính
├── assets/
│   ├── css/
│   │   └── style.css       # CSS chính với nhân vật Kẹo Ngọt
│   └── js/
│       └── main.js         # JavaScript tương tác
└── DEVELOPMENT_GUIDE.md    # File này
```

## Trạng thái hiện tại (Phase 1 - Hoàn thành)

### ✅ Đã hoàn thành:
1. **Trang chủ cơ bản** với:
   - Logo nhân vật Kẹo Ngọt (CSS animation)
   - Menu navigation: Trang chủ, Góc Tâm sự, Hành trình Khám phá, Thư giãn, Đăng nhập
   - Lời chào "Chào các bạn nhỏ!"
   - 2 mục nổi bật: "Viết tâm sự" và "Hành trình Khám phá"
   - Nhân vật chính với tay vẫy chào và speech bubble
   - Nút "Cần giúp đỡ ngay"
   - Footer với thông báo bảo mật

2. **Thiết kế thân thiện**:
   - Màu sắc: Hồng (#FF6B9D), Xanh (#4ECDC4), Vàng (#FFD93D)
   - Font: Fredoka (tiêu đề), Nunito (nội dung)
   - Responsive design cho mobile/tablet
   - Animation mượt mà

3. **Tính năng tương tác**:
   - Click nhân vật để đổi lời nói
   - Hiệu ứng sparkle bay lơ lửng
   - Hover effects
   - Mobile menu

## Các Phase tiếp theo cần phát triển

### Phase 2: Tích hợp Chatbot AI (1-2 tuần)
**Mục tiêu:** Tích hợp chatbot AI tư vấn tâm lý (text + voice)

**Công việc:**
1. Tạo trang `tam-su.html` (Góc Tâm sự)
2. Tích hợp API chatbot có sẵn
3. Giao diện chat thân thiện với trẻ em
4. Hỗ trợ text và voice input
5. Lưu trữ lịch sử chat cơ bản

**Files cần tạo:**
- `pages/tam-su.html`
- `assets/js/chatbot.js`
- `assets/css/chat.css`

### Phase 3: Hành trình Khám phá (1-2 tuần)
**Mục tiêu:** Quiz cảm xúc và thư viện nội dung

**Công việc:**
1. Tạo trang `kham-pha.html`
2. 5-10 bài trắc nghiệm cảm xúc đơn giản
3. Thư viện sách/video (sử dụng nội dung tặng kèm)
4. Hệ thống điểm thưởng cơ bản

**Files cần tạo:**
- `pages/kham-pha.html`
- `assets/js/quiz.js`
- `assets/css/quiz.css`
- `data/quiz-questions.json`

### Phase 4: Thư giãn (1-2 tuần)
**Mục tiêu:** Trò chơi và công cụ vẽ tranh

**Công việc:**
1. Tạo trang `thu-gian.html`
2. Công cụ vẽ tranh (Canvas HTML5)
3. 3-5 trò chơi mini đơn giản
4. Nhạc thư giãn

**Files cần tạo:**
- `pages/thu-gian.html`
- `assets/js/drawing.js`
- `assets/js/games.js`
- `assets/css/games.css`

### Phase 5: Backend và Database (1 tuần)
**Mục tiêu:** Lưu trữ dữ liệu và API

**Công việc:**
1. Setup Node.js backend
2. Kết nối database (JSON files hoặc SQLite)
3. API endpoints cơ bản
4. Admin panel đơn giản

**Files cần tạo:**
- `backend/app.js`
- `backend/routes/`
- `database/`

## Hướng dẫn kỹ thuật

### CSS Variables (đã định nghĩa)
```css
:root {
    --primary-pink: #FF6B9D;
    --secondary-pink: #FFB3D1;
    --light-pink: #FFE5F1;
    --primary-blue: #4ECDC4;
    --secondary-blue: #A8E6CF;
    --light-blue: #E8F8F5;
    --primary-yellow: #FFD93D;
    --secondary-yellow: #FFEAA7;
    --light-yellow: #FFF8DC;
    --primary-orange: #FF8C42;
    --text-dark: #2D3436;
    --text-light: #636E72;
    --white: #FFFFFF;
    --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    --border-radius: 20px;
    --transition: all 0.3s ease;
}
```

### Font chữ
- **Fredoka**: Cho tiêu đề, nhân vật (vui tươi)
- **Nunito**: Cho nội dung (dễ đọc)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Animation Guidelines
- Sử dụng `transform` và `opacity` cho performance tốt
- Duration: 0.3s cho hover, 2-3s cho animation liên tục
- Easing: `ease` hoặc `ease-in-out`

## Yêu cầu đặc biệt

### Bảo mật trẻ em
- Không thu thập thông tin cá nhân thực
- Mã hóa tất cả dữ liệu
- Kiểm duyệt nội dung tự động
- Nút "Cần giúp đỡ ngay" kết nối hotline

### Accessibility
- Font chữ lớn, dễ đọc
- Màu sắc thân thiện, không gây mỏi mắt
- Hỗ trợ đọc màn hình
- Keyboard navigation

### Performance
- Optimize images
- Lazy loading
- Minify CSS/JS
- CDN cho fonts

## Cách chạy dự án

1. Mở terminal trong folder dự án
2. Chạy: `python3 -m http.server 8000`
3. Truy cập: `http://localhost:8000`

## Lưu ý quan trọng

1. **Giữ nguyên thiết kế hiện tại** - đã được tối ưu cho trẻ em
2. **Sử dụng CSS variables** đã định nghĩa
3. **Test trên mobile** - đối tượng chính sử dụng mobile
4. **Giữ tính đơn giản** - trẻ em cần giao diện dễ hiểu
5. **Bảo mật cao** - dữ liệu trẻ em cần được bảo vệ

## Contact & Support

Nếu có thắc mắc về code hoặc thiết kế, hãy tham khảo:
- File `index.html` - cấu trúc HTML
- File `assets/css/style.css` - styling và animation
- File `assets/js/main.js` - tương tác JavaScript

**Lưu ý:** Dự án này dành cho học sinh tiểu học, cần đảm bảo tính an toàn và thân thiện trong mọi tính năng phát triển.
