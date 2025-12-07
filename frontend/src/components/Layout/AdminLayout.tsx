import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, ShoppingCart, Users, CreditCard, 
  BarChart3, Bell, HelpCircle, Star, Tag, DollarSign, 
  FileText, LogOut, Menu, X, Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan', id: 'tongQuan' },
    { path: '/admin/xe', icon: Car, label: 'Quản lý xe', id: 'xe' },
    { path: '/admin/don-hang', icon: ShoppingCart, label: 'Quản lý đơn hàng', id: 'donHang' },
    { path: '/admin/tranh-chap', icon: CreditCard, label: 'Xử lý tranh chấp', id: 'tranhChap' },
    { path: '/admin/khach-hang', icon: Users, label: 'Quản lý khách hàng', id: 'khachHang' },
    { path: '/admin/xac-thuc', icon: Shield, label: 'Quản lý xác thực KYC', id: 'xacThuc' },
    { path: '/admin/thanh-toan', icon: CreditCard, label: 'Quản lý thanh toán', id: 'thanhToan' },
    { path: '/admin/bao-cao', icon: BarChart3, label: 'Báo cáo', id: 'baoCao' },
    { path: '/admin/thong-bao', icon: Bell, label: 'Quản lý thông báo', id: 'thongBao' },
    { path: '/admin/ho-tro', icon: HelpCircle, label: 'Quản lý hỗ trợ', id: 'hoTro' },
    { path: '/admin/danh-gia', icon: Star, label: 'Quản lý đánh giá', id: 'danhGia' },
    { path: '/admin/khuyen-mai', icon: Tag, label: 'Quản lý khuyến mãi', id: 'khuyenMai' },
    { path: '/admin/tai-chinh', icon: DollarSign, label: 'Quản lý tài chính', id: 'taiChinh' },
    { path: '/admin/dang-ban-xe-ho', icon: FileText, label: 'Đăng bán xe hộ', id: 'dangBanXeHo' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none lg:translate-x-0"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b lg:hidden">
          <div className="text-xl font-bold text-primary-600">Xe Tốt Admin</div>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)] lg:h-screen">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1"></div>
            <div className="text-sm text-gray-600">
              Quản trị hệ thống
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

