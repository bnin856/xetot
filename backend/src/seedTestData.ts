import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Xe from './models/Xe';
import { connectDB } from './config/database';

dotenv.config();

const seedTestData = async () => {
  try {
    await connectDB();

    console.log('📦 Seeding test data for chat and appointment features...\n');

    // Tạo người bán
    console.log('👥 Creating sellers...');
    
    // Không cần hash password vì User model đã có pre-save hook
    const sellers = [
      {
        email: 'seller1@test.com',
        password: 'seller123',
        ten: 'Trần Văn Bán Xe',
        sdt: '0912345678',
        diaChi: '123 Đường ABC, Quận 1, TP.HCM',
        vaiTro: 'customer' as const,
        vaiTroPhu: ['nguoiBan' as const],
        xacThuc: {
          daXacThuc: true,
          ngayXacThuc: new Date(),
          loaiXacThuc: ['cmnd', 'cccd', 'giayToXe'] as const,
        },
      },
      {
        email: 'seller2@test.com',
        password: 'seller123',
        ten: 'Nguyễn Thị Bán Xe',
        sdt: '0923456789',
        diaChi: '456 Đường XYZ, Quận 2, TP.HCM',
        vaiTro: 'customer' as const,
        vaiTroPhu: ['nguoiBan' as const],
        xacThuc: {
          daXacThuc: true,
          ngayXacThuc: new Date(),
          loaiXacThuc: ['cccd', 'giayToXe'] as const,
        },
      },
      {
        email: 'seller3@test.com',
        password: 'seller123',
        ten: 'Lê Văn Bán Xe',
        sdt: '0934567890',
        diaChi: '789 Đường DEF, Quận 3, TP.HCM',
        vaiTro: 'customer' as const,
        vaiTroPhu: ['nguoiBan' as const],
        xacThuc: {
          daXacThuc: true,
          ngayXacThuc: new Date(),
          loaiXacThuc: ['cmnd', 'cccd', 'giayToXe'] as const,
        },
      },
    ];

    // Xóa sellers cũ nếu đã tồn tại (để tạo lại với password đúng)
    const existingSellers = await User.find({
      email: { $in: sellers.map(s => s.email) }
    });

    if (existingSellers.length > 0) {
      console.log(`⚠️  Found ${existingSellers.length} existing sellers, deleting to recreate...`);
      await User.deleteMany({
        email: { $in: sellers.map(s => s.email) }
      });
    }

    // Dùng create() thay vì insertMany để pre-save hook hash password
    const createdSellers = [];
    for (const seller of sellers) {
      const created = await User.create(seller as any);
      createdSellers.push(created);
    }
    console.log(`✅ Created ${createdSellers.length} sellers`);

    // Lấy danh sách người bán (cả mới tạo và đã có)
    const allSellers = await User.find({
      email: { $in: sellers.map(s => s.email) }
    });

    console.log('\n🚗 Creating cars with sellers...');

    // Tạo xe với idChuXe
    const carsWithSellers = [
      {
        tenXe: 'Toyota Camry 2024',
        hangXe: 'Toyota',
        namSanXuat: 2024,
        mauSac: 'Trắng',
        soKm: 5000,
        soCho: 5,
        loaiXe: 'Sedan',
        tinhTrangXe: 'xeMoi' as const,
        gia: 1200000000,
        trangThai: 'dangBan' as const,
        moTa: 'Toyota Camry 2024 mới 100%, chỉ chạy 5000km. Xe còn bảo hành chính hãng, nội thất cao cấp, đầy đủ tiện nghi. Phù hợp cho gia đình hoặc doanh nghiệp.',
        hinhAnh: [],
        ngayDang: new Date(),
        idChuXe: allSellers[0]?._id,
      },
      {
        tenXe: 'Honda CR-V 2023',
        hangXe: 'Honda',
        namSanXuat: 2023,
        mauSac: 'Đỏ',
        soKm: 15000,
        soCho: 5,
        loaiXe: 'SUV',
        tinhTrangXe: 'xeMoi' as const,
        gia: 1100000000,
        trangThai: 'dangBan' as const,
        moTa: 'Honda CR-V 2023, xe nhập khẩu nguyên chiếc. Động cơ 1.5L Turbo, hộp số CVT. Trang bị đầy đủ tính năng an toàn Honda Sensing.',
        hinhAnh: [],
        ngayDang: new Date(),
        idChuXe: allSellers[0]?._id,
      },
      {
        tenXe: 'Mazda CX-5 2022',
        hangXe: 'Mazda',
        namSanXuat: 2022,
        mauSac: 'Xanh',
        soKm: 25000,
        soCho: 5,
        loaiXe: 'SUV',
        tinhTrangXe: 'xeCu' as const,
        gia: 850000000,
        trangThai: 'dangBan' as const,
        moTa: 'Mazda CX-5 2022, xe đã qua sử dụng nhưng còn rất mới. Bảo dưỡng định kỳ đầy đủ, không tai nạn, không ngập nước. Thiết kế KODO đẹp mắt.',
        hinhAnh: [],
        ngayDang: new Date(),
        idChuXe: allSellers[1]?._id,
      },
      {
        tenXe: 'Ford Ranger Raptor 2023',
        hangXe: 'Ford',
        namSanXuat: 2023,
        mauSac: 'Cam',
        soKm: 8000,
        soCho: 5,
        loaiXe: 'Bán tải',
        tinhTrangXe: 'xeMoi' as const,
        gia: 1450000000,
        trangThai: 'dangBan' as const,
        moTa: 'Ford Ranger Raptor 2023, bán tải off-road mạnh mẽ. Động cơ 3.0L V6 Bi-Turbo, hệ thống treo FOX Racing. Xe mới, chưa đi nhiều.',
        hinhAnh: [],
        ngayDang: new Date(),
        idChuXe: allSellers[1]?._id,
      },
      {
        tenXe: 'VinFast VF 8 2023',
        hangXe: 'VinFast',
        namSanXuat: 2023,
        mauSac: 'Xanh Navy',
        soKm: 3000,
        soCho: 5,
        loaiXe: 'SUV Điện',
        tinhTrangXe: 'xeMoi' as const,
        gia: 1200000000,
        trangThai: 'dangBan' as const,
        moTa: 'VinFast VF 8 2023, SUV điện cao cấp. Pin 87.7 kWh, quãng đường 420km. Tự lái Level 2+, công nghệ hiện đại nhất.',
        hinhAnh: [],
        ngayDang: new Date(),
        idChuXe: allSellers[2]?._id,
      },
      {
        tenXe: 'Mercedes-Benz C200 2022',
        hangXe: 'Mercedes-Benz',
        namSanXuat: 2022,
        mauSac: 'Bạc',
        soKm: 20000,
        soCho: 5,
        loaiXe: 'Sedan',
        tinhTrangXe: 'xeCu' as const,
        gia: 1650000000,
        trangThai: 'dangBan' as const,
        moTa: 'Mercedes-Benz C200 2022, sedan hạng sang. Xe đã qua sử dụng nhưng còn rất mới, bảo dưỡng tại đại lý chính hãng. Nội thất sang trọng.',
        hinhAnh: [],
        ngayDang: new Date(),
        idChuXe: allSellers[2]?._id,
      },
    ];

    // Chỉ tạo xe nếu có người bán
    if (allSellers.length > 0) {
      // Xóa các xe test cũ (nếu có)
      await Xe.deleteMany({
        tenXe: { $in: carsWithSellers.map(c => c.tenXe) }
      });

      const createdCars = await Xe.insertMany(carsWithSellers);
      console.log(`✅ Created ${createdCars.length} cars with sellers`);
    } else {
      console.log('⚠️  No sellers found, cannot create cars');
    }

    console.log('\n✅ Test data seeding completed!\n');
    console.log('📝 Test Accounts:');
    console.log('   Seller 1: seller1@test.com / seller123');
    console.log('   Seller 2: seller2@test.com / seller123');
    console.log('   Seller 3: seller3@test.com / seller123');
    console.log('\n📝 All sellers are verified and can post cars');
    console.log('📝 All cars have idChuXe linked to sellers');
    console.log('\n🎉 You can now test chat and appointment features!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
};

seedTestData();

