import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-primary-400 mb-4">Xe Tốt</div>
            <p className="text-gray-400 text-sm">
              Nền tảng mua bán xe ô tô uy tín, chất lượng hàng đầu Việt Nam
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/gioi-thieu" className="hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link to="/quy-che" className="hover:text-white transition-colors">Quy chế hoạt động</Link></li>
              <li><Link to="/an-toan" className="hover:text-white transition-colors">An toàn khi giao dịch</Link></li>
              <li><Link to="/dieu-khoan" className="hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/huong-dan" className="hover:text-white transition-colors">Hướng dẫn</Link></li>
              <li><Link to="/ho-tro" className="hover:text-white transition-colors">Hỗ trợ khách hàng</Link></li>
              <li><Link to="/lien-he" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Kết nối</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Hotline: 028 7300 1234</p>
              <p>Email: trogiup@xetot.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Xe Tốt. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

