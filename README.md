# 🛍️ Hệ Thống Nhận Diện Sản Phẩm Bằng AI

Hệ thống sử dụng trí tuệ nhân tạo để phân tích hình ảnh, nhận diện, phân loại các mặt hàng bán lẻ và tính tổng giá trị các sản phẩm đã mua. Được xây dựng bằng Python, OpenCV cùng các công nghệ web hiện đại, hệ thống mang lại khả năng phát hiện và phân loại sản phẩm chính xác, hiệu quả và mượt mà.

## 👥 Thành Viên

- Vũ Bảo Chinh (Nhóm Trưởng)
- Lê Hồng Anh
- Đỗ Việt Dũng

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


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped with this project
- Special thanks to our mentors and instructors for their guidance

---

Developed with ❤️ by the Bing Chilling Team