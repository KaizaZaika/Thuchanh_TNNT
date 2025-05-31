# 🛍️ Hệ Thống Nhận Diện Sản Phẩm Bằng AI

Hệ thống sử dụng trí tuệ nhân tạo để phân tích hình ảnh, nhận diện, phân loại các mặt hàng bán lẻ và tính tổng giá trị các sản phẩm đã mua. Được xây dựng bằng Python, OpenCV cùng các công nghệ web hiện đại, hệ thống mang lại khả năng phát hiện và phân loại sản phẩm chính xác, hiệu quả và mượt mà.

## 👥 Thành Viên

- Vũ Bảo Chinh (Nhóm Trưởng)
- Lê Hồng Anh
- Đỗ Việt Dũng

## 📝 Mô Tả Dự Án

### Nhiệm Vụ Chính
1. **Nhận Diện Sản Phẩm Tự Động**
   - Phát hiện và nhận dạng các sản phẩm từ hình ảnh đầu vào
   - Phân loại sản phẩm vào các danh mục được định nghĩa trước
   - Tính toán tổng giá trị đơn hàng tự động

2. **Xử Lý Hình Ảnh**
   - Tiền xử lý hình ảnh để tối ưu hóa độ chính xác nhận dạng
   - Xử lý nhiều sản phẩm trong cùng một khung hình
   - Hỗ trợ nhiều định dạng ảnh đầu vào

3. **Giao Diện Người Dùng**
   - Thiết kế giao diện thân thiện, dễ sử dụng
   - Hiển thị kết quả nhận dạng trực quan
   - Hỗ trợ tải lên nhiều hình ảnh cùng lúc

### Các Trường Hợp Sử Dụng Chính

#### UC1: Quét Và Nhận Diện Sản Phẩm
- **Tác nhân**: Người dùng/Nhân viên bán hàng
- **Mục tiêu**: Nhận diện sản phẩm từ hình ảnh
- **Luồng thực hiện**:
  1. Người dùng tải lên hình ảnh sản phẩm
  2. Hệ thống xử lý và nhận diện sản phẩm
  3. Hiển thị thông tin sản phẩm và giá cả

#### UC2: Tính Toán Tổng Giá Trị Đơn Hàng
- **Tác nhân**: Người dùng/Thu ngân
- **Mục tiêu**: Tính tổng giá trị các sản phẩm đã quét
- **Luồng thực hiện**:
  1. Hệ thống nhận diện từng sản phẩm
  2. Tự động cộng dồn giá trị
  3. Hiển thị tổng tiền và chi tiết đơn hàng

#### UC3: Quản Lý Danh Mục Sản Phẩm
- **Tác nhân**: Quản trị viên
- **Mục tiêu**: Thêm/sửa/xóa thông tin sản phẩm
- **Luồng thực hiện**:
  1. Đăng nhập với quyền quản trị
  2. Thực hiện các thao tác quản lý
  3. Lưu thay đổi vào cơ sở dữ liệu

## 🚀 Liên kết

- **Product Detection**: Automatically detects products in images using computer vision
- **Image Classification**: Classifies products into predefined categories
- **Web Interface**: User-friendly web interface for uploading and processing images
- **Database Integration**: Stores product information and detection results
- **API Endpoints**: RESTful API for integration with other systems

## Công Nghệ Sử Dụng

### Backend
- **Python 3.9+**: Ngôn ngữ lập trình chính.
- **Flask**: Web framework
- **OpenCV**: Xử lý hình ảnh và thị giác máy tính.
- **SQLite**: Cơ sở dữ liệu để lưu trữ thông tin sản phẩm.
- **Docker**: Công nghệ container hóa

### Frontend
- **HTML5/CSS3**: Cấu trúc và định dạng giao diện.
- **JavaScript**: Tương tác phía khách hàng.

## 🐳 Docker Setup

### Prerequisites
- Docker
- Docker Compose
- Cổng 3200 phải trống

### Hướng dẫn cho người dùng chạy hệ thống

1. Clone repository:
   ```bash
   git clone https://github.com/KaizaZaika/Thuchanh_TNNT.git
   cd Thuchanh_TNNT
   ```

2. Pull Image từ Docker Hub
   ```bash
   docker pull lha151105/thuchanh_tnnt
   ```

3. Khởi tạo hệ thống
   ```bash
   docker-compose up -d
   ```
4. Truy cập hệ thống
   - Web Interface: http://localhost:3000

   

## 📂 Cấu trúc thư mục

```
.
├── backend/               # Backend application
│   ├── controllers/       # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   └── requirements.txt   # Python dependencies
├── frontend/              # Frontend application
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── index.html         # Main HTML file
├── docker-compose.yml     # Docker Compose configuration
└── Dockerfile            # Docker configuration
```

## 🛠️ Development

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn




## 🙏 Acknowledgments

- Thanks to all contributors who have helped with this project
- Special thanks to our mentors and instructors for their guidance

---

Developed with ❤️ by the Bing Chilling Team