import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Xe from './models/Xe';
import XeChoThue from './models/XeChoThue';
import DichVu from './models/DichVu';
import { connectDB } from './config/database';

dotenv.config();

const seedFullData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Xe.deleteMany({});
    await XeChoThue.deleteMany({});
    await DichVu.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    
    const adminPassword = await bcrypt.hash('Admin123@', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    await User.create([
      {
        ten: 'Admin Xe Tốt',
        email: 'admin@xetot.com',
        password: adminPassword,
        sdt: '0987654321',
        diaChi: 'Hà Nội',
        vaiTro: 'admin',
      },
      {
        ten: 'Nguyễn Văn A',
        email: 'customer@example.com',
        password: customerPassword,
        sdt: '0123456789',
        diaChi: 'TP.HCM',
        vaiTro: 'customer',
      },
    ]);
    console.log('✅ Users created');

    // Create xe ban (cars for sale)
    console.log('🚗 Creating cars for sale...');
    
    const xeBan = [
      {
        tenXe: 'Toyota Camry 2024',
        hangXe: 'Toyota',
        namSanXuat: 2024,
        mauSac: 'Trắng',
        soKm: 0,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 1250000000,
        trangThai: 'dangBan',
        moTa: 'Sedan hạng D cao cấp, động cơ 2.5L,  hộp số tự động 8 cấp. Tiện nghi đầy đủ, an toàn 5 sao.',
        hinhAnh: [],
      },
      {
        tenXe: 'Honda CR-V 2023',
        hangXe: 'Honda',
        namSanXuat: 2023,
        mauSac: 'Bạc',
        soKm: 10000,
        soCho: 5,
        loaiXe: 'SUV',
        gia: 1100000000,
        trangThai: 'dangBan',
        moTa: 'SUV 5 chỗ rộng rãi, vận hành êm ái. Động cơ 1.5L VTEC Turbo 188 HP. Trang bị Honda Sensing và nhiều tiện nghi hiện đại.',
        hinhAnh: [],
      },
      {
        tenXe: 'BMW 320i 2022',
        hangXe: 'BMW',
        namSanXuat: 2022,
        mauSac: 'Xanh',
        soKm: 12000,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 1850000000,
        trangThai: 'dangBan',
        moTa: 'Sedan thể thao hạng sang. Động cơ 2.0L TwinPower Turbo 184 HP, hộp số tự động 8 cấp. Vận hành mạnh mẽ, cảm giác lái BMW đích thực.',
        hinhAnh: [],
      },
      {
        tenXe: 'Mazda CX-8 2023',
        hangXe: 'Mazda',
        namSanXuat: 2023,
        mauSac: 'Đỏ',
        soKm: 5000,
        soCho: 7,
        loaiXe: 'SUV',
        gia: 1180000000,
        trangThai: 'dangBan',
        moTa: 'SUV 7 chỗ cao cấp với thiết kế KODO. Động cơ 2.5L Skyactiv-G 188 HP. Nội thất sang trọng, công nghệ hiện đại.',
        hinhAnh: [],
      },
    ];

    await Xe.insertMany(xeBan);
    console.log(`✅ Created ${xeBan.length} cars for sale`);

    // Create xe cho thue (cars for rent)
    console.log('🚕 Creating cars for rent...');
    
    const xeChoThue = [
      {
        tenXe: 'Toyota Vios',
        hangXe: 'Toyota',
        dongXe: 'Vios G CVT',
        namSanXuat: 2023,
        bienSoXe: '30A-123.45',
        mauSac: 'Trắng Ngọc Trai',
        soKm: 5000,
        soCho: 5,
        loaiXe: 'Sedan',
        giaThueTheoNgay: 800000,
        giaThueTheoThang: 18000000,
        trangThai: 'sanSang',
        moTa: 'Xe sedan tiết kiệm nhiên liệu, phù hợp di chuyển trong thành phố và đi xa. Xe mới, sạch sẽ.',
        hinhAnh: ['https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800'],
        tienNghi: ['Điều hòa tự động', 'GPS', 'Camera lùi', 'Bluetooth', 'Cửa sổ trời'],
        dieuKhoanThue: 'Yêu cầu GPLX hợp lệ. Đặt cọc 30% giá trị thuê. Không hút thuốc trong xe.',
      },
      {
        tenXe: 'Honda City',
        hangXe: 'Honda',
        dongXe: 'City RS CVT',
        namSanXuat: 2023,
        bienSoXe: '30A-678.90',
        mauSac: 'Đỏ Rallye',
        soKm: 3000,
        soCho: 5,
        loaiXe: 'Sedan',
        giaThueTheoNgay: 850000,
        giaThueTheoThang: 19000000,
        trangThai: 'sanSang',
        moTa: 'Sedan thể thao, tiện nghi hiện đại. Phù hợp cho các chuyến đi dài. Honda Sensing đầy đủ.',
        hinhAnh: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'],
        tienNghi: ['Điều hòa tự động', 'GPS', 'Camera 360', 'Cảm biến lùi', 'Bluetooth', 'Cruise Control', 'Honda Sensing'],
        dieuKhoanThue: 'Yêu cầu GPLX hợp lệ. Đặt cọc 30% giá trị thuê. Không hút thuốc trong xe.',
      },
      {
        tenXe: 'Ford Everest',
        hangXe: 'Ford',
        dongXe: 'Everest Titanium 4x4',
        namSanXuat: 2023,
        bienSoXe: '51F-111.11',
        mauSac: 'Đen Mica',
        soKm: 8000,
        soCho: 7,
        loaiXe: 'SUV',
        giaThueTheoNgay: 1500000,
        giaThueTheoThang: 35000000,
        trangThai: 'sanSang',
        moTa: 'SUV 7 chỗ sang trọng, mạnh mẽ. Phù hợp cho gia đình đi du lịch. Động cơ diesel tiết kiệm.',
        hinhAnh: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
        tienNghi: ['Điều hòa 3 vùng tự động', 'GPS', 'Camera 360', 'Cảm biến toàn xe', 'Bluetooth', 'Cruise Control', 'Ghế da cao cấp', '4x4'],
        dieuKhoanThue: 'Yêu cầu GPLX hợp lệ từ 2 năm. Đặt cọc 30% giá trị thuê.',
      },
      {
        tenXe: 'Mercedes-Benz E-Class',
        hangXe: 'Mercedes-Benz',
        dongXe: 'E200 Exclusive 2022',
        namSanXuat: 2022,
        bienSoXe: '30H-888.88',
        mauSac: 'Bạc Iridium',
        soKm: 12000,
        soCho: 5,
        loaiXe: 'Sedan',
        giaThueTheoNgay: 3000000,
        giaThueTheoThang: 65000000,
        trangThai: 'sanSang',
        moTa: 'Sedan hạng sang, sang trọng và đẳng cấp. Phù hợp cho các sự kiện quan trọng, đám cưới.',
        hinhAnh: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
        tienNghi: ['Điều hòa 4 vùng tự động', 'GPS', 'Camera 360', 'Cảm biến toàn xe', 'Hệ thống âm thanh Burmester', 'Massage ghế', 'Màn hình giải trí', 'Ambient Light'],
        dieuKhoanThue: 'Yêu cầu GPLX hợp lệ từ 5 năm. Đặt cọc 40% giá trị thuê. Chỉ cho khách hàng VIP.',
      },
      {
        tenXe: 'Mazda CX-5',
        hangXe: 'Mazda',
        dongXe: 'CX-5 2.5 Signature Premium AWD',
        namSanXuat: 2023,
        bienSoXe: '51G-222.22',
        mauSac: 'Đỏ Soul Crystal',
        soKm: 6000,
        soCho: 5,
        loaiXe: 'SUV',
        giaThueTheoNgay: 1200000,
        giaThueTheoThang: 28000000,
        trangThai: 'sanSang',
        moTa: 'SUV 5 chỗ với thiết kế KODO đẹp mắt. Vận hành êm ái, tiết kiệm nhiên liệu. Công nghệ i-Activsense.',
        hinhAnh: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'],
        tienNghi: ['Điều hòa tự động 2 vùng', 'GPS', 'Camera 360', 'Cảm biến lùi', 'Bluetooth', 'Cruise Control', 'HUD màu', 'Bose 10 loa', 'AWD'],
        dieuKhoanThue: 'Yêu cầu GPLX hợp lệ. Đặt cọc 30% giá trị thuê.',
      },
    ];

    await XeChoThue.insertMany(xeChoThue);
    console.log(`✅ Created ${xeChoThue.length} cars for rent`);

    // Create dich vu (services)
    console.log('🔧 Creating services...');
    
    const dichVu = [
      {
        tenDichVu: 'Thay dầu máy',
        loaiDichVu: 'baoTri',
        moTa: 'Thay dầu động cơ tổng hợp hoặc bán tổng hợp, lọc dầu chính hãng. Kiểm tra và bổ sung các loại dầu khác (phanh, trợ lực lái).',
        giaThamKhao: 500000,
        thoiGianThucHien: '30-45 phút',
        hinhAnh: ['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800'],
      },
      {
        tenDichVu: 'Bảo dưỡng định kỳ',
        loaiDichVu: 'baoTri',
        moTa: 'Bảo dưỡng định kỳ 10.000km bao gồm: thay dầu, lọc dầu, kiểm tra toàn bộ hệ thống xe, vệ sinh xe, hút bụi nội thất.',
        giaThamKhao: 1200000,
        thoiGianThucHien: '1-2 giờ',
        hinhAnh: ['https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800'],
      },
      {
        tenDichVu: 'Thay lốp xe',
        loaiDichVu: 'suaChua',
        moTa: 'Thay lốp xe mới chính hãng. Tư vấn lựa chọn lốp phù hợp. Bao gồm cân bằng động và kiểm tra áp suất.',
        giaThamKhao: 2500000,
        thoiGianThucHien: '1 giờ',
        hinhAnh: ['https://images.unsplash.com/photo-1623427818682-8f65a88b0abe?w=800'],
      },
      {
        tenDichVu: 'Sửa chữa động cơ',
        loaiDichVu: 'suaChua',
        moTa: 'Chẩn đoán và sửa chữa các hư hỏng động cơ. Sử dụng phụ tùng chính hãng. Bảo hành theo quy định.',
        giaThamKhao: 5000000,
        thoiGianThucHien: '1-3 ngày',
        hinhAnh: ['https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800'],
      },
      {
        tenDichVu: 'Vệ sinh nội thất cao cấp',
        loaiDichVu: 'chamSoc',
        moTa: 'Vệ sinh sâu toàn bộ nội thất: ghế da/nỉ, thảm, trần xe. Khử mùi, diệt khuẩn. Đánh bóng bảng taplo.',
        giaThamKhao: 800000,
        thoiGianThucHien: '2-3 giờ',
        hinhAnh: ['https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800'],
      },
      {
        tenDichVu: 'Đánh bóng phục hồi sơn',
        loaiDichVu: 'chamSoc',
        moTa: 'Đánh bóng phục hồi lớp sơn xe bị phai màu, xước nhẹ. Phủ Nano bảo vệ sơn 6 tháng.',
        giaThamKhao: 2000000,
        thoiGianThucHien: '4-6 giờ',
        hinhAnh: ['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800'],
      },
      {
        tenDichVu: 'Thay phanh',
        loaiDichVu: 'suaChua',
        moTa: 'Thay má phanh và đĩa phanh (nếu cần). Kiểm tra hệ thống phanh toàn diện. Sử dụng phụ tùng chính hãng.',
        giaThamKhao: 3000000,
        thoiGianThucHien: '2 giờ',
        hinhAnh: ['https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800'],
      },
      {
        tenDichVu: 'Kiểm tra tổng quát',
        loaiDichVu: 'baoTri',
        moTa: 'Kiểm tra toàn bộ 40 hạng mục xe theo chuẩn quốc tế. Tư vấn chi tiết tình trạng xe. Miễn phí cho khách hàng thân thiết.',
        giaThamKhao: 300000,
        thoiGianThucHien: '1 giờ',
        hinhAnh: ['https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800'],
      },
      {
        tenDichVu: 'Phủ Ceramic toàn xe',
        loaiDichVu: 'chamSoc',
        moTa: 'Phủ Ceramic cao cấp bảo vệ sơn xe 2-3 năm. Chống trầy xước, nước, hóa chất. Độ bóng cao sang trọng.',
        giaThamKhao: 8000000,
        thoiGianThucHien: '2 ngày',
        hinhAnh: ['https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800'],
      },
      {
        tenDichVu: 'Nâng cấp âm thanh',
        loaiDichVu: 'phuKien',
        moTa: 'Nâng cấp hệ thống âm thanh chuyên nghiệp. Lắp loa, ampli, sub cao cấp. Cách âm cabin.',
        giaThamKhao: 15000000,
        thoiGianThucHien: '3-5 ngày',
        hinhAnh: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      },
    ];

    await DichVu.insertMany(dichVu);
    console.log(`✅ Created ${dichVu.length} services`);

    console.log('\n🎉 Full seed data completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - Users: 2 (admin + customer)`);
    console.log(`   - Cars for sale: ${xeBan.length}`);
    console.log(`   - Cars for rent: ${xeChoThue.length}`);
    console.log(`   - Services: ${dichVu.length}\n`);
    console.log('🔐 Login credentials:');
    console.log('   Admin: admin@xetot.com / Admin123@');
    console.log('   Customer: customer@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedFullData();
