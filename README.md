# 🛍️ Hệ Thống Nhận Diện Sản Phẩm Bằng AI

Hệ thống sử dụng trí tuệ nhân tạo để phân tích hình ảnh, nhận diện, phân loại các mặt hàng bán lẻ và tính tổng giá trị các sản phẩm đã mua. Được xây dựng bằng Python, OpenCV cùng các công nghệ web hiện đại, hệ thống mang lại khả năng phát hiện và phân loại sản phẩm chính xác, hiệu quả và mượt mà.

## 👥 Thành Viên

- Lê Hồng Anh (Nhóm Trưởng)
- Vũ Bảo Chinh 
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
- **Mô tả**: Nhận diện sản phẩm từ hình ảnh
- **Tiền điều kiện**: Hệ thống hoạt động bình thường
- **Luồng sự kiện chính**:
  1. Người dùng chọn mục "Thêm ảnh nhận diện"
  1. Người dùng tải lên hình ảnh sản phẩm
  2. Hệ thống xử lý và nhận diện xử lí ảnh, phát hiện và nhận diện sản phẩm
  3. Hệ thống kiểm tra giá sản phẩm trong CSDL
  4. Hiển thị thông tin sản phẩm được nhận diện và tổng giá đơn hàng
- **Luồng rẽ nhánh**:
  Nếu ảnh không hợp lệ hoặc không nhận diện được sản phẩm, hệ thống hiển thị lỗi cho người dùng.
- **Ngoại lệ**:
  Nếu có lỗi (VD: không kết nối được CSDL) hệ thống hiển thị thông báo cho người dùng
- **Hậu điều kiện**:
  Hiển thị danh sách sản phẩm được nhận diện và tổng giá cho người dùng


#### UC2: Thêm sản phẩm vào CSDL
- **Tác nhân**: Người dùng/Quản trị viên
- **Mô tả**: Cho phép người dùng thêm một sản phẩm mới vào hệ thống.
- **Tiền điều kiện**: Hệ thống hoạt động bình thường
- **Luồng sự kiện chính**:
  1. Người dùng chọn mục "Thêm sản phẩm"
  2. Hệ thống hiển thị form nhập thông tin sản phẩm (tên, giá, loại hàng, hãng, hình ảnh)
  3. Người dùng nhập đầy đủ thông tin và nhấn nút "Thêm"
  4. Người dùng nhấn nút "Thêm"
  5. Hệ thống kiểm tra và lưu sản phẩm mới vào CSDL
  6. Hiển thị thông báo lưu thành công
- **Luồng rẽ nhánh**:
  1. Nếu dữ liệu nhập thiếu, hệ thống hiển thị lỗi, yêu cầu nhập lại
  2. Nếu hệ thống kiểm tra đã tồn tại sản phẩm trong CSDL, hiển thị thông báo lỗi
- **Ngoại lệ**: Nếu có lỗi (VD: không kết nối được CSDL) hệ thống hiển thị thông báo cho người dùng
- **Hậu điều kiện**:
  Hệ thống hiển thị "Thêm sản phẩm thành công"

#### UC3: Xóa sản phẩm khỏi CSDL
- **Tác nhân**: Người dùng/Quản trị viên
- **Mô tả**: Quản trị viên có thể xóa một sản phẩm khỏi hệ thống
- **Tiền điều kiện**:
  - Sản phẩm cần xóa có trong hệ thống
  - Hệ thống hoạt động bình thường
- **Luồng sự kiện chính**:
  1. Quản trị viên truy cập trang quản lý sản phẩm.
  2. Hệ thống hiển thị danh sách các sản phẩm hiện có.
  3. Quản trị viên chọn sản phẩm muốn xóa và nhấn nút "Xóa".
  4. Hệ thống hiển thị hộp thoại xác nhận việc xóa sản phẩm.
  5. Quản trị viên xác nhận xóa.
  6. Hiển thị thông báo lưu thành công
  7. Hệ thống xóa sản phẩm khỏi CSDL
  8. Thông báo cho quản trị viên biết sản phẩm đã được xóa thành công.
- **Luồng rẽ nhánh**:
  1. Nếu quản trị viên hủy xác nhận xóa, hệ thống không thực hiện thao tác xóa.
  2. Nếu backend trả về lỗi (ví dụ: không tìm thấy sản phẩm, lỗi kết nối), hệ thống hiển thị thông báo lỗi cho quản trị viên.
- **Ngoại lệ**: Nếu có lỗi (VD: không kết nối được CSDL) hệ thống hiển thị thông báo cho người dùng
- **Hậu điều kiện**:
  Sản phẩm bị xóa sẽ không còn xuất hiện trong danh sách sản phẩm.


#### UC4: Xem lịch sử nhận diện
- **Tác nhân**: Người dùng/Thu ngân/Quản trị viên
- **Mô tả**: Người dùng có thể xem lại lịch sử các lần nhận diện hàng hóa đã thực hiện trên hệ thống.
- **Tiền điều kiện**: Hệ thống đã lưu lại các lần nhận diện trước đó.
- **Luồng sự kiện chính**:
  1. Người dùng truy cập vào trang "Lịch sử nhận diện" (nhấn vào menu "Lịch sử").
  2. Hệ thống truy vấn cơ sở dữ liệu
  3. Hệ thống hiển thị danh sách các lần nhận diện (bao gồm: thời gian, hình ảnh, kết quả nhận diện, tổng giá).
- **Luồng rẽ nhánh**:
   Nếu không có dữ liệu lịch sử, hệ thống hiển thị thông báo "Chưa có lịch sử nhận diện".
- **Ngoại lệ**: Nếu có lỗi (VD: không kết nối được CSDL) hệ thống hiển thị thông báo cho người dùng
- **Hậu điều kiện**:
  Người dùng xem được danh sách các lần nhận diện đã thực hiện.
  
## 🚀 Liên kết

- **Product Detection**: Tự động phát hiện sản phẩm trong hình ảnh bằng công nghệ thị giác máy tính.
- **Image Classification**: Phân loại sản phẩm vào các danh mục được xác định trước.
- **Web Interface**: Giao diện web thân thiện với người dùng để tải lên và xử lý hình ảnh.
- **Database Integration**: Lưu trữ thông tin sản phẩm và kết quả phát hiện.
- **API Endpoints**: API RESTful để tích hợp với các hệ thống khác.

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

2. Pull Images từ Docker Hub
   ```bash
   docker pull lha151105/thuchanh_tnnt-frontend:latest
   docker pull lha151105/thuchanh_tnnt-backend:latest
   ```

3. Khởi tạo hệ thống
   ```bash
   docker-compose up -d
   ```
4. Truy cập hệ thống
   - Web Interface: http://localhost:3200

   

## 📂 Cấu trúc thư mục

```
.
├── backend/               # Backend application
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   ├── products.db       # SQLite database
│   ├── images/           # Uploaded product images
│   ├── uploads/          # File uploads directory
│   └── requirements.txt  # Python dependencies
├── frontend/             # Frontend application
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Static images
│   ├── uploads/          # Uploaded files
│   ├── *.html            # HTML templates
│   └── Dockerfile        # Frontend Docker configuration
├── backend/              # Backend Docker context
│   └── Dockerfile        # Backend Docker configuration
├── data/                 # Persistent data
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # Project documentation
```

## 🛠️ Development

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn




## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (HTML/JS)     │◄──►│   (Node.js)     │◄──►│   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▲
                                │
                                ▼
                       ┌─────────────────┐
                       │   File Upload   │
                       │   (Images)      │
                       └─────────────────┘
```

### Mô tả các thành phần:
- **Frontend**: Giao diện người dùng được xây dựng bằng HTML, CSS và JavaScript
- **Backend**: Xử lý logic nghiệp vụ, API endpoints (Node.js)
- **Database**: Lưu trữ dữ liệu sản phẩm (SQLite)
- **File Upload**: Xử lý tải lên và lưu trữ hình ảnh sản phẩm

## 🙏 Acknowledgments

- Thanks to all contributors who have helped with this project
- Special thanks to our mentors and instructors for their guidance

---

