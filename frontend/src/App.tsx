import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Customer Pages
import TrangChu from './pages/customer/TrangChu';
import DangKy from './pages/customer/DangKy';
import DangNhap from './pages/customer/DangNhap';
import TimKiemXe from './pages/customer/TimKiemXe';
import ChiTietXe from './pages/customer/ChiTietXe';
import DatMuaXe from './pages/customer/DatMuaXe';
import ChonPhuongThucThanhToan from './pages/customer/ChonPhuongThucThanhToan';
import ChiTietDonHang from './pages/customer/ChiTietDonHang';
import ChiTietDonThueXe from './pages/customer/ChiTietDonThueXe';
import QuanLyTraanhChap from './pages/admin/QuanLyTraanhChap';
import QuanLyVi from './pages/customer/QuanLyVi';
import LichSuGiaoDich from './pages/customer/LichSuGiaoDich';
import SellerDashboard from './pages/seller/SellerDashboard';
import RentalDashboard from './pages/rental/RentalDashboard';
import ServiceProviderDashboard from './pages/service/ServiceProviderDashboard';
import LichSuDonHang from './pages/customer/LichSuDonHang';
import TaiKhoan from './pages/customer/TaiKhoan';
import NhoDangBanXe from './pages/customer/NhoDangBanXe';
import XeYeuThich from './pages/customer/XeYeuThich';
import ThueXe from './pages/customer/ThueXe';
import ChiTietXeChoThue from './pages/customer/ChiTietXeChoThue';
import DatThueXe from './pages/customer/DatThueXe';
import DichVuPage from './pages/customer/DichVu';
import ChiTietDichVu from './pages/customer/ChiTietDichVu';
import QuenMatKhau from './pages/customer/QuenMatKhau';
import DangBanXe from './pages/customer/DangBanXe';
import DangChoThueXe from './pages/customer/DangChoThueXe';
import DangKyDichVu from './pages/customer/DangKyDichVu';
import UploadBienLai from './pages/customer/UploadBienLai';
import XacThucTaiKhoan from './pages/customer/XacThucTaiKhoan';
import TinNhan from './pages/customer/TinNhan';
import LichXemXePage from './pages/customer/LichXemXe';
import LichDatDichVuPage from './pages/customer/LichDatDichVu';

// Admin Pages
import TongQuan from './pages/admin/TongQuan';
import QuanLyXe from './pages/admin/QuanLyXe';
import QuanLyDonHang from './pages/admin/QuanLyDonHang';
import QuanLyKhachHang from './pages/admin/QuanLyKhachHang';
import QuanLyXacThuc from './pages/admin/QuanLyXacThuc';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<TrangChu />} />
          <Route path="/dang-ky" element={<DangKy />} />
          <Route path="/dang-nhap" element={<DangNhap />} />
          <Route path="/quen-mat-khau" element={<QuenMatKhau />} />
          <Route path="/tim-kiem" element={<TimKiemXe />} />
          <Route path="/xe/:id" element={<ChiTietXe />} />
          <Route path="/thue-xe" element={<ThueXe />} />
          <Route path="/thue-xe/:id" element={<ChiTietXeChoThue />} />
          <Route path="/dat-thue-xe/:id" element={<DatThueXe />} />
          <Route path="/dich-vu" element={<DichVuPage />} />
          <Route path="/dich-vu/:id" element={<ChiTietDichVu />} />

          {/* Customer Protected Routes */}
          <Route
            path="/dang-ban-xe"
            element={
              <ProtectedRoute>
                <DangBanXe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dang-cho-thue-xe"
            element={
              <ProtectedRoute>
                <DangChoThueXe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dang-ky-dich-vu"
            element={
              <ProtectedRoute>
                <DangKyDichVu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dat-mua/:id"
            element={
              <ProtectedRoute>
                <DatMuaXe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/don-hang"
            element={
              <ProtectedRoute>
                <LichSuDonHang />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/don-hang/:id"
            element={
              <ProtectedRoute>
                <ChiTietDonHang />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/don-thue-xe/:id"
            element={
              <ProtectedRoute>
                <ChiTietDonThueXe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/don-hang/:id/upload-bien-lai"
            element={
              <ProtectedRoute>
                <UploadBienLai />
              </ProtectedRoute>
            }
          />
          <Route
            path="/xac-thuc"
            element={
              <ProtectedRoute>
                <XacThucTaiKhoan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tin-nhan"
            element={
              <ProtectedRoute>
                <TinNhan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lich-xem-xe"
            element={
              <ProtectedRoute>
                <LichXemXePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lich-dat-dich-vu"
            element={
              <ProtectedRoute>
                <LichDatDichVuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/lich-su-giao-dich"
            element={
              <ProtectedRoute>
                <LichSuGiaoDich />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/vi"
            element={
              <ProtectedRoute>
                <QuanLyVi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/tai-khoan"
            element={
              <ProtectedRoute>
                <TaiKhoan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/nho-dang-ban-xe"
            element={
              <ProtectedRoute>
                <NhoDangBanXe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/xe-yeu-thich"
            element={
              <ProtectedRoute>
                <XeYeuThich />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <TongQuan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/xe"
            element={
              <ProtectedRoute requireAdmin>
                <QuanLyXe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/don-hang"
            element={
              <ProtectedRoute requireAdmin>
                <QuanLyDonHang />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tranh-chap"
            element={
              <ProtectedRoute requireAdmin>
                <QuanLyTraanhChap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/khach-hang"
            element={
              <ProtectedRoute requireAdmin>
                <QuanLyKhachHang />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/xac-thuc"
            element={
              <ProtectedRoute requireAdmin>
                <QuanLyXacThuc />
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes for other admin pages */}
          <Route
            path="/admin/thanh-toan"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Quản lý thanh toán - Đang phát triển</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bao-cao"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Báo cáo - Đang phát triển</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/thong-bao"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Quản lý thông báo - Đang phát triển</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ho-tro"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Quản lý hỗ trợ - Đang phát triển</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/danh-gia"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Quản lý đánh giá - Đang phát triển</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/khuyen-mai"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Quản lý khuyến mãi - Đang phát triển</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tai-chinh"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Quản lý tài chính - Đang phát triển</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dang-ban-xe-ho"
            element={
              <ProtectedRoute requireAdmin>
                <div className="p-8 text-center">Đăng bán xe hộ - Đang phát triển</div>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
