import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import { connectDB } from './config/database';

dotenv.config();

const updateAdminPassword = async () => {
  try {
    await connectDB();

    console.log('🔐 Updating admin password...');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@xetot.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin user...');
      // Create with plain password, pre-save hook will hash it
      await User.create({
        email: 'admin@xetot.com',
        password: 'Admin123@', // Plain password, will be hashed by pre-save hook
        ten: 'Quản Trị Viên',
        sdt: '0901234567',
        diaChi: 'Hà Nội',
        vaiTro: 'admin',
      });
      console.log('✅ Admin user created successfully!');
    } else {
      // Update password - set plain password, pre-save hook will hash it
      admin.password = 'Admin123@'; // Plain password, will be hashed by pre-save hook
      await admin.save();
      console.log('✅ Admin password updated successfully!');
    }

    console.log('\n📝 Admin credentials:');
    console.log('   Email: admin@xetot.com');
    console.log('   Password: Admin123@');
    console.log('\n✅ You can now login with the new password!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin password:', error);
    process.exit(1);
  }
};

updateAdminPassword();

