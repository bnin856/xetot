import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Xe from './models/Xe';
import { connectDB } from './config/database';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Xe.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    const admin = await User.create({
      email: 'admin@xetot.com',
      password: adminPassword,
      ten: 'Quản Trị Viên',
      sdt: '0901234567',
      diaChi: 'Hà Nội',
      vaiTro: 'admin',
    });

    const customer = await User.create({
      email: 'customer@example.com',
      password: customerPassword,
      ten: 'Nguyễn Văn A',
      sdt: '0987654321',
      diaChi: 'TP. Hồ Chí Minh',
      vaiTro: 'customer',
    });

    console.log('✅ Users created:');
    console.log('   Admin: admin@xetot.com / admin123');
    console.log('   Customer: customer@example.com / customer123');

    // Create sample cars
    console.log('🚗 Creating sample cars...');
    
    const cars = [
      {
        tenXe: 'Toyota Vios 2023',
        hangXe: 'Toyota',
        namSanXuat: 2023,
        mauSac: 'Trắng',
        soKm: 15000,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 550000000,
        trangThai: 'dangBan',
        moTa: 'Xe sedan hạng B bán chạy nhất Việt Nam. Động cơ 1.5L VVT-i, công suất 107 HP, hộp số CVT. Tiết kiệm nhiên liệu, phù hợp gia đình.',
        hinhAnh: [],
      },
      {
        tenXe: 'Honda City 2023',
        hangXe: 'Honda',
        namSanXuat: 2023,
        mauSac: 'Đỏ',
        soKm: 8000,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 580000000,
        trangThai: 'dangBan',
        moTa: 'Sedan hạng B với thiết kế thể thao, nội thất rộng rãi. Động cơ 1.5L VTEC Turbo 120 HP, hộp số CVT. Công nghệ Honda Sensing tiên tiến.',
        hinhAnh: [],
      },
      {
        tenXe: 'Hyundai Accent 2023',
        hangXe: 'Hyundai',
        namSanXuat: 2023,
        mauSac: 'Xanh',
        soKm: 12000,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 520000000,
        trangThai: 'dangBan',
        moTa: 'Sedan hạng B với thiết kế hiện đại, trang bị an toàn đầy đủ. Động cơ 1.5L MPi 115 HP. Giá cả phải chăng.',
        hinhAnh: [],
      },
      {
        tenXe: 'Toyota Camry 2022',
        hangXe: 'Toyota',
        namSanXuat: 2022,
        mauSac: 'Đen',
        soKm: 25000,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 1150000000,
        trangThai: 'dangBan',
        moTa: 'Sedan hạng D cao cấp, sang trọng. Động cơ 2.5L Hybrid 218 HP, hộp số CVT. Êm ái và tiết kiệm nhiên liệu.',
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
        tenXe: 'Mazda CX-5 2023',
        hangXe: 'Mazda',
        namSanXuat: 2023,
        mauSac: 'Đỏ Soul',
        soKm: 5000,
        soCho: 5,
        loaiXe: 'SUV',
        gia: 950000000,
        trangThai: 'dangBan',
        moTa: 'SUV hạng C với thiết kế KODO đẹp mắt. Động cơ 2.0L SKYACTIV-G 154 HP. Vận hành thể thao, nội thất cao cấp.',
        hinhAnh: [],
      },
      {
        tenXe: 'Ford Ranger Raptor 2023',
        hangXe: 'Ford',
        namSanXuat: 2023,
        mauSac: 'Cam',
        soKm: 8000,
        soCho: 5,
        loaiXe: 'Bán tải',
        gia: 1450000000,
        trangThai: 'dangBan',
        moTa: 'Bán tải off-road mạnh mẽ nhất phân khúc. Động cơ 3.0L V6 Bi-Turbo 397 HP, hộp số tự động 10 cấp. Hệ thống treo FOX Racing.',
        hinhAnh: [],
      },
      {
        tenXe: 'Mitsubishi Xpander 2023',
        hangXe: 'Mitsubishi',
        namSanXuat: 2023,
        mauSac: 'Trắng',
        soKm: 18000,
        soCho: 7,
        loaiXe: 'MPV',
        gia: 650000000,
        trangThai: 'dangBan',
        moTa: 'MPV 7 chỗ đa dụng, phù hợp gia đình. Động cơ 1.5L MIVEC 105 HP. Giá cả hợp lý, chi phí vận hành thấp.',
        hinhAnh: [],
      },
      {
        tenXe: 'Kia Seltos 2023',
        hangXe: 'Kia',
        namSanXuat: 2023,
        mauSac: 'Xanh',
        soKm: 6000,
        soCho: 5,
        loaiXe: 'SUV',
        gia: 720000000,
        trangThai: 'dangBan',
        moTa: 'SUV hạng B với thiết kế trẻ trung, năng động. Động cơ 1.5L Turbo 160 HP, hộp số tự động 7 cấp. Trang bị công nghệ hiện đại.',
        hinhAnh: [],
      },
      {
        tenXe: 'VinFast VF 8 2023',
        hangXe: 'VinFast',
        namSanXuat: 2023,
        mauSac: 'Xanh Navy',
        soKm: 3000,
        soCho: 5,
        loaiXe: 'SUV Điện',
        gia: 1200000000,
        trangThai: 'dangBan',
        moTa: 'SUV điện cao cấp của VinFast. Động cơ điện 402 HP, pin 87.7 kWh, quãng đường 420km. Tự lái Level 2+.',
        hinhAnh: [],
      },
      {
        tenXe: 'Mercedes-Benz C200 2022',
        hangXe: 'Mercedes-Benz',
        namSanXuat: 2022,
        mauSac: 'Bạc',
        soKm: 15000,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 1750000000,
        trangThai: 'dangBan',
        moTa: 'Sedan hạng sang C-Class thế hệ mới. Động cơ 1.5L Turbo + EQ Boost 204 HP, hộp số tự động 9 cấp. Thiết kế sang trọng, công nghệ MBUX tiên tiến.',
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
        tenXe: 'Suzuki Swift 2023',
        hangXe: 'Suzuki',
        namSanXuat: 2023,
        mauSac: 'Vàng',
        soKm: 9000,
        soCho: 5,
        loaiXe: 'Hatchback',
        gia: 550000000,
        trangThai: 'dangBan',
        moTa: 'Hatchback cỡ nhỏ năng động. Động cơ 1.2L Dualjet 90 HP, hộp số CVT. Tiết kiệm nhiên liệu, dễ lái trong phố.',
        hinhAnh: [],
      },
      {
        tenXe: 'Lexus RX350 2022',
        hangXe: 'Lexus',
        namSanXuat: 2022,
        mauSac: 'Đen',
        soKm: 20000,
        soCho: 5,
        loaiXe: 'SUV',
        gia: 3200000000,
        trangThai: 'dangBan',
        moTa: 'SUV hạng sang cao cấp. Động cơ 3.5L V6 300 HP, hộp số tự động 8 cấp. Nội thất sang trọng, êm ái tuyệt đối.',
        hinhAnh: [],
      },
      {
        tenXe: 'Audi A4 2022',
        hangXe: 'Audi',
        namSanXuat: 2022,
        mauSac: 'Trắng',
        soKm: 14000,
        soCho: 5,
        loaiXe: 'Sedan',
        gia: 1900000000,
        trangThai: 'dangBan',
        moTa: 'Sedan hạng sang Đức với công nghệ Quattro. Động cơ 2.0L TFSI 190 HP, hộp số tự động 7 cấp. Thiết kế thanh lịch, công nghệ hiện đại.',
        hinhAnh: [],
      },
    ];

    await Xe.insertMany(cars);

    console.log(`✅ Created ${cars.length} sample cars`);
    console.log('\n🎉 Seed data completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Admin user: admin@xetot.com / admin123`);
    console.log(`   - Customer user: customer@example.com / customer123`);
    console.log(`   - Cars: ${cars.length} vehicles`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

