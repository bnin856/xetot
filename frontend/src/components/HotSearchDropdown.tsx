import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock } from 'lucide-react';
import { Xe } from '../types';
import { xeService } from '../services/xeService';

interface XeChoThue {
  id: string;
  tenXe: string;
  hangXe: string;
  giaThueTheoNgay: number;
  hinhAnh: string[];
}

interface HotSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'xe' | 'xeChoThue';
}

const HotSearchDropdown: React.FC<HotSearchDropdownProps> = ({ 
  isOpen, 
  onClose,
  type = 'xe' 
}) => {
  const [hotItems, setHotItems] = useState<Xe[] | XeChoThue[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHotItems();
    }
  }, [isOpen, type]);

  useEffect(() => {
    let handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchHotItems = async () => {
    setLoading(true);
    try {
      if (type === 'xe') {
        let response = await xeService.getAll({ 
          limit: 6, 
          trangThai: 'dangBan' 
        });
        if (response.success) {
          setHotItems(response.data.xe);
        }
      } else {
        // Fetch xe cho thuê
        let xeChoThueService = (await import('../services/xeChoThueService')).default;
        let xeChoThue = await xeChoThueService.getAll({ 
          limit: 6, 
          trangThai: 'sanSang' 
        });
        setHotItems(xeChoThue);
      }
    } catch (error) {
      console.error('Error fetching hot items:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-center gap-2 text-primary-700">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">
            {type === 'xe' ? 'Xe bán phổ biến' : 'Xe cho thuê phổ biến'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-500 text-sm mt-2">Đang tải...</p>
        </div>
      ) : hotItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Chưa có dữ liệu</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {hotItems.map((item) => {
            let isXe = 'gia' in item;
            let linkPath = isXe ? `/xe/${item.id}` : `/thue-xe/${item.id}`;
            let price = isXe 
              ? (item as Xe).gia 
              : (item as XeChoThue).giaThueTheoNgay;
            let priceLabel = isXe ? 'Giá bán' : 'Giá thuê/ngày';

            return (
              <Link
                key={item.id}
                to={linkPath}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.hinhAnh && item.hinhAnh.length > 0 ? (
                    <img
                      src={`http://localhost:5000/${item.hinhAnh[0]}`}
                      alt={item.tenXe}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate text-sm">
                    {item.tenXe}
                  </h4>
                  <p className="text-xs text-gray-500">{item.hangXe}</p>
                  <div className="mt-1">
                    <span className="text-xs text-gray-500 mr-1">{priceLabel}:</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {formatPrice(price)}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <Link
          to={type === 'xe' ? '/tim-kiem' : '/thue-xe'}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium block text-center"
          onClick={onClose}
        >
          Xem tất cả →
        </Link>
      </div>
    </div>
  );
};

export default HotSearchDropdown;

