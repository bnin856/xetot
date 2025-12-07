import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, Heart, MessageCircle, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold text-primary-600 tracking-tight group-hover:text-accent-500 transition-colors">
              Xe Tốt
            </div>
          </Link>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/tin-nhan"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Tin nhắn"
                >
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                </Link>

                <Link
                  to="/lich-xem-xe"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Lịch xem xe"
                >
                  <Calendar className="w-6 h-6 text-gray-600" />
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-6 h-6 text-gray-600" />
                    <span className="hidden md:block text-sm font-medium">{user.ten}</span>
                  </button>
                  
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
                    >
                      <Link
                        to={user.vaiTro === 'admin' ? '/admin' : '/customer/tai-khoan'}
                        className="block px-4 py-2 hover:bg-primary-50 transition-colors flex items-center space-x-2"
                      >
                        <User className="w-4 h-4 text-gray-600" />
                        <span>Tài khoản</span>
                      </Link>
                      
                      {user.vaiTro === 'customer' && (
                        <>
                          <Link
                            to="/customer/vi"
                            className="block px-4 py-2 hover:bg-primary-50 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span>Quản lý ví</span>
                          </Link>
                          
                          <Link
                            to="/customer/don-hang"
                            className="block px-4 py-2 hover:bg-primary-50 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span>Lịch sử đơn hàng</span>
                          </Link>
                          
                          <Link
                            to="/customer/lich-su-giao-dich"
                            className="block px-4 py-2 hover:bg-primary-50 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Lịch sử giao dịch</span>
                          </Link>
                          
                          <Link
                            to="/lich-dat-dich-vu"
                            className="block px-4 py-2 hover:bg-primary-50 transition-colors flex items-center space-x-2"
                          >
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span>Lịch đặt dịch vụ</span>
                          </Link>
                          
                          <Link
                            to="/customer/xe-yeu-thich"
                            className="block px-4 py-2 hover:bg-primary-50 transition-colors flex items-center space-x-2"
                          >
                            <Heart className="w-4 h-4 text-gray-600" />
                            <span>Xe yêu thích</span>
                          </Link>
                          
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          {user.vaiTroPhu?.includes('nguoiBan') && (
                            <Link
                              to="/seller"
                              className="block px-4 py-2 hover:bg-blue-50 transition-colors flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <span className="text-blue-700 font-medium">Dashboard Bán Xe</span>
                            </Link>
                          )}
                          
                          {user.vaiTroPhu?.includes('nguoiChoThue') && (
                            <Link
                              to="/rental"
                              className="block px-4 py-2 hover:bg-green-50 transition-colors flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-green-700 font-medium">Dashboard Cho Thuê</span>
                            </Link>
                          )}
                          
                          {user.vaiTroPhu?.includes('nhaProviderDichVu') && (
                            <Link
                              to="/service"
                              className="block px-4 py-2 hover:bg-orange-50 transition-colors flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-orange-700 font-medium">Dashboard Dịch Vụ</span>
                            </Link>
                          )}
                        </>
                      )}
                      
                      {user.vaiTro === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-primary-50 transition-colors flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Quản trị</span>
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors flex items-center space-x-2 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/dang-nhap"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  className="btn-primary"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

