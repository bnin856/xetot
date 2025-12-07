import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import DichVu from './models/DichVu';
import { connectDB } from './config/database';

dotenv.config();

const seedDichVuData = async () => {
  try {
    await connectDB();

    console.log('📦 Seeding test data for dịch vụ xe...');

    // Clear existing test service providers and their services
    console.log('🗑️  Clearing existing test service providers and their services...');
    const testProviderEmails = [
      'provider1@test.com',
      'provider2@test.com',
      'provider3@test.com',
      'provider4@test.com',
    ];
    const existingProviders = await User.find({ email: { $in: testProviderEmails } });
    const existingProviderIds = existingProviders.map(p => p._id);

    if (existingProviderIds.length > 0) {
      await DichVu.deleteMany({ idNguoiCungCap: { $in: existingProviderIds } });
      await User.deleteMany({ _id: { $in: existingProviderIds } });
      console.log(`🗑️  Deleted ${existingProviderIds.length} existing test providers and their services.`);
    } else {
      console.log('No existing test providers found to delete.');
    }

    console.log('\n👥 Creating service providers...');

    const providersData = [
      {
        email: 'provider1@test.com',
        password: 'provider123', // Will be hashed by pre-save hook
        ten: 'Nguyễn Văn Sửa Xe',
        sdt: '0911111111',
        diaChi: '123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
        vaiTro: 'customer' as const,
        vaiTroPhu: ['nhaProviderDichVu' as const],
        xacThuc: {
          daXacThuc: true,
          ngayXacThuc: new Date(),
          loaiXacThuc: ['cmnd', 'cccd', 'giayToXe'] as const,
        },
      },
      {
        email: 'provider2@test.com',
        password: 'provider123',
        ten: 'Trần Thị Bảo Dưỡng',
        sdt: '0922222222',
        diaChi: '456 Đường Lê Lợi, Quận 1, TP.HCM',
        vaiTro: 'customer' as const,
        vaiTroPhu: ['nhaProviderDichVu' as const],
        xacThuc: {
          daXacThuc: true,
          ngayXacThuc: new Date(),
          loaiXacThuc: ['cccd', 'giayToXe'] as const,
        },
      },
      {
        email: 'provider3@test.com',
        password: 'provider123',
        ten: 'Lê Văn Chăm Sóc Xe',
        sdt: '0933333333',
        diaChi: '789 Đường Võ Văn Tần, Quận 3, TP.HCM',
        vaiTro: 'customer' as const,
        vaiTroPhu: ['nhaProviderDichVu' as const],
        xacThuc: {
          daXacThuc: true,
          ngayXacThuc: new Date(),
          loaiXacThuc: ['cmnd', 'cccd'] as const,
        },
      },
      {
        email: 'provider4@test.com',
        password: 'provider123',
        ten: 'Phạm Thị Phụ Kiện',
        sdt: '0944444444',
        diaChi: '321 Đường Nguyễn Trãi, Quận 1, TP.HCM',
        vaiTro: 'customer' as const,
        vaiTroPhu: ['nhaProviderDichVu' as const],
        xacThuc: {
          daXacThuc: true,
          ngayXacThuc: new Date(),
          loaiXacThuc: ['cmnd', 'cccd', 'giayToXe'] as const,
        },
      },
    ];

    const createdProviders = [];
    for (const providerData of providersData) {
      const created = await User.create(providerData as any); // Use create to trigger pre-save hook
      createdProviders.push(created);
    }
    console.log(`✅ Created ${createdProviders.length} service providers`);

    const allProviders = await User.find({
      email: { $in: providersData.map(p => p.email) }
    });

    console.log('\n🔧 Creating services...');

    if (allProviders.length > 0) {
      const servicesData = [
        // Provider 1 - Sửa chữa
        {
          tenDichVu: 'Sửa chữa động cơ chuyên nghiệp',
          loaiDichVu: 'suaChua' as const,
          moTa: 'Dịch vụ sửa chữa động cơ chuyên nghiệp, thay thế phụ tùng chính hãng. Đội ngũ kỹ thuật viên giàu kinh nghiệm, cam kết chất lượng.',
          giaThamKhao: 2000000,
          thoiGianThucHien: '2-4 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.8,
          soLuotDung: 150,
          idNguoiCungCap: allProviders[0]._id,
          diaChi: '123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
          soDienThoai: '0911111111',
        },
        {
          tenDichVu: 'Sửa chữa hệ thống phanh',
          loaiDichVu: 'suaChua' as const,
          moTa: 'Kiểm tra và sửa chữa hệ thống phanh, thay thế má phanh, dầu phanh. Đảm bảo an toàn tuyệt đối cho xe của bạn.',
          giaThamKhao: 1500000,
          thoiGianThucHien: '1-2 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.9,
          soLuotDung: 200,
          idNguoiCungCap: allProviders[0]._id,
          diaChi: '123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
          soDienThoai: '0911111111',
        },
        {
          tenDichVu: 'Sửa chữa điều hòa xe hơi',
          loaiDichVu: 'suaChua' as const,
          moTa: 'Bảo dưỡng, sửa chữa và nạp gas điều hòa. Làm sạch hệ thống, thay thế lọc gió. Mát lạnh ngay tức thì.',
          giaThamKhao: 800000,
          thoiGianThucHien: '1-2 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.7,
          soLuotDung: 180,
          idNguoiCungCap: allProviders[0]._id,
          diaChi: '123 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
          soDienThoai: '0911111111',
        },
        // Provider 2 - Bảo trì
        {
          tenDichVu: 'Bảo dưỡng định kỳ xe hơi',
          loaiDichVu: 'baoTri' as const,
          moTa: 'Bảo dưỡng định kỳ toàn diện: thay nhớt, lọc nhớt, lọc gió, kiểm tra hệ thống điện, phanh, lốp. Bảo hành chính hãng.',
          giaThamKhao: 1200000,
          thoiGianThucHien: '2-3 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.9,
          soLuotDung: 300,
          idNguoiCungCap: allProviders[1]._id,
          diaChi: '456 Đường Lê Lợi, Quận 1, TP.HCM',
          soDienThoai: '0922222222',
        },
        {
          tenDichVu: 'Thay nhớt động cơ cao cấp',
          loaiDichVu: 'baoTri' as const,
          moTa: 'Thay nhớt động cơ chính hãng, phù hợp với từng loại xe. Kèm theo kiểm tra miễn phí các bộ phận khác.',
          giaThamKhao: 500000,
          thoiGianThucHien: '30-45 phút',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.8,
          soLuotDung: 500,
          idNguoiCungCap: allProviders[1]._id,
          diaChi: '456 Đường Lê Lợi, Quận 1, TP.HCM',
          soDienThoai: '0922222222',
        },
        {
          tenDichVu: 'Cân chỉnh bánh xe chuyên nghiệp',
          loaiDichVu: 'baoTri' as const,
          moTa: 'Cân chỉnh bánh xe bằng máy hiện đại, đảm bảo độ chính xác cao. Giảm mòn lốp, tiết kiệm nhiên liệu.',
          giaThamKhao: 300000,
          thoiGianThucHien: '1 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.6,
          soLuotDung: 250,
          idNguoiCungCap: allProviders[1]._id,
          diaChi: '456 Đường Lê Lợi, Quận 1, TP.HCM',
          soDienThoai: '0922222222',
        },
        // Provider 3 - Chăm sóc
        {
          tenDichVu: 'Rửa xe và đánh bóng ngoại thất',
          loaiDichVu: 'chamSoc' as const,
          moTa: 'Rửa xe chuyên nghiệp, đánh bóng sơn, bảo vệ lớp sơn. Sử dụng hóa chất cao cấp, không làm hại sơn xe.',
          giaThamKhao: 400000,
          thoiGianThucHien: '1-2 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.7,
          soLuotDung: 400,
          idNguoiCungCap: allProviders[2]._id,
          diaChi: '789 Đường Võ Văn Tần, Quận 3, TP.HCM',
          soDienThoai: '0933333333',
        },
        {
          tenDichVu: 'Vệ sinh nội thất xe hơi',
          loaiDichVu: 'chamSoc' as const,
          moTa: 'Vệ sinh toàn bộ nội thất: ghế, sàn, trần, cửa. Hút bụi, làm sạch vết bẩn, khử mùi. Xe sạch như mới.',
          giaThamKhao: 600000,
          thoiGianThucHien: '2-3 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.8,
          soLuotDung: 350,
          idNguoiCungCap: allProviders[2]._id,
          diaChi: '789 Đường Võ Văn Tần, Quận 3, TP.HCM',
          soDienThoai: '0933333333',
        },
        {
          tenDichVu: 'Dán phim cách nhiệt cao cấp',
          loaiDichVu: 'chamSoc' as const,
          moTa: 'Dán phim cách nhiệt chính hãng, chống tia UV, giảm nhiệt độ trong xe. Bảo hành 5 năm, không bong tróc.',
          giaThamKhao: 3000000,
          thoiGianThucHien: '3-4 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.9,
          soLuotDung: 180,
          idNguoiCungCap: allProviders[2]._id,
          diaChi: '789 Đường Võ Văn Tần, Quận 3, TP.HCM',
          soDienThoai: '0933333333',
        },
        // Provider 4 - Phụ kiện
        {
          tenDichVu: 'Lắp đặt camera hành trình',
          loaiDichVu: 'phuKien' as const,
          moTa: 'Lắp đặt camera hành trình HD, quay đêm, cảm biến va chạm. Bảo hành 2 năm, lắp đặt chuyên nghiệp.',
          giaThamKhao: 2500000,
          thoiGianThucHien: '1-2 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.8,
          soLuotDung: 220,
          idNguoiCungCap: allProviders[3]._id,
          diaChi: '321 Đường Nguyễn Trãi, Quận 1, TP.HCM',
          soDienThoai: '0944444444',
        },
        {
          tenDichVu: 'Lắp đặt hệ thống âm thanh',
          loaiDichVu: 'phuKien' as const,
          moTa: 'Lắp đặt loa, ampli, subwoofer chuyên nghiệp. Chất lượng âm thanh cao cấp, tư vấn miễn phí.',
          giaThamKhao: 5000000,
          thoiGianThucHien: '3-4 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.9,
          soLuotDung: 150,
          idNguoiCungCap: allProviders[3]._id,
          diaChi: '321 Đường Nguyễn Trãi, Quận 1, TP.HCM',
          soDienThoai: '0944444444',
        },
        {
          tenDichVu: 'Lắp đặt cảm biến áp suất lốp',
          loaiDichVu: 'phuKien' as const,
          moTa: 'Lắp đặt cảm biến áp suất lốp TPMS, cảnh báo khi lốp non. Tăng an toàn, tiết kiệm nhiên liệu.',
          giaThamKhao: 1800000,
          thoiGianThucHien: '1-2 giờ',
          hinhAnh: [],
          trangThai: 'hoatDong' as const,
          danhGiaTrungBinh: 4.7,
          soLuotDung: 190,
          idNguoiCungCap: allProviders[3]._id,
          diaChi: '321 Đường Nguyễn Trãi, Quận 1, TP.HCM',
          soDienThoai: '0944444444',
        },
      ];

      await DichVu.insertMany(servicesData);
      console.log(`✅ Created ${servicesData.length} services`);
    } else {
      console.log('⚠️  No providers found, cannot create services');
    }

    console.log('\n✅ Test data seeding completed!\n');
    console.log('📝 Test Accounts (Service Providers):');
    console.log('   Provider 1: provider1@test.com / provider123');
    console.log('   Provider 2: provider2@test.com / provider123');
    console.log('   Provider 3: provider3@test.com / provider123');
    console.log('   Provider 4: provider4@test.com / provider123');
    console.log('\n📝 All providers are verified and can provide services');
    console.log('📝 All services have idNguoiCungCap linked to providers');
    console.log('\n🎉 You can now test appointment scheduling features!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
};

seedDichVuData();

