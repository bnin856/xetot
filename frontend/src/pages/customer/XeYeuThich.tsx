import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { xeService } from '../../services/xeService';
import { Xe } from '../../types';

const XeYeuThich: React.FC = () => {
  const { user } = useAuth();
  const [danhSachXe, setDanhSachXe] = useState<Xe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const favoriteIds = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
        
        if (favoriteIds.length === 0) {
          setDanhSachXe([]);
          setLoading(false);
          return;
        }

        // Fetch all favorites
        const promises = favoriteIds.map((id: string) => 
          xeService.getById(id).catch(() => null)
        );
        
        const results = await Promise.all(promises);
        const validXe = results
          .filter(result => result !== null && result.success)
          .map(result => result!.data.xe);
        
        setDanhSachXe(validXe);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = (xeId: string) => {
    if (!user) return;

    const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
    const newFavorites = favorites.filter((id: string) => id !== xeId);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    
    setDanhSachXe(danhSachXe.filter(xe => xe.id !== xeId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <MainLayout>
      <div className="page-container py-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-600 fill-current" />
              <h1 className="text-3xl font-bold">Xe yêu thích</h1>
            </div>
            <span className="text-gray-600">{danhSachXe.length} xe</span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : danhSachXe.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Bạn chưa có xe yêu thích nào</p>
              <Link to="/tim-kiem" className="btn-primary inline-block">
                Tìm kiếm xe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {danhSachXe.map((xe, index) => (
                <motion.div
                  key={xe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card overflow-hidden relative group"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {xe.hinhAnh && xe.hinhAnh.length > 0 ? (
                      <img
                        src={`http://localhost:5000/${xe.hinhAnh[0]}`}
                        alt={xe.tenXe}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Chưa có ảnh
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFavorite(xe.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {xe.trangThai === 'dangBan' ? 'Đang bán' : 'Đã bán'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{xe.tenXe}</h3>
                    <p className="text-primary-600 font-bold text-xl mb-2">{formatPrice(xe.gia)}</p>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p>Năm: {xe.namSanXuat}</p>
                      <p>Km: {new Intl.NumberFormat('vi-VN').format(xe.soKm)} km</p>
                      <p>{xe.hangXe}</p>
                    </div>
                    <Link
                      to={`/xe/${xe.id}`}
                      className="block w-full text-center btn-primary"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default XeYeuThich;

