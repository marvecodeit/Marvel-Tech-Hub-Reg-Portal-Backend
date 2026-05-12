import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';

dotenv.config();

const ADMIN = {
  fullname: 'Marvel Admin',
  email: 'admin@marveltechhub.com',
  password: 'Admin@1234',
  phone: '+1000000000',
  role: 'admin',
};

const seed = async () => {
  await connectDB();

  // Drop stale unique index on username if it exists
  try {
    await mongoose.connection.collection('users').dropIndex('username_1');
  } catch (_) {
    // Index doesn't exist — that's fine
  }

  const existing = await User.findOne({ email: ADMIN.email });

  if (existing) {
    console.log(`\n✅ Admin already exists:`);
    console.log(`   Email    : ${ADMIN.email}`);
    console.log(`   Password : ${ADMIN.password}`);
    console.log(`   Role     : ${existing.role}\n`);
    await mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN.password, salt);

  await User.create({
    fullname: ADMIN.fullname,
    email: ADMIN.email,
    password: hashedPassword,
    phone: ADMIN.phone,
    role: ADMIN.role,
  });

  console.log('\n🌱 Admin seeded successfully!');
  console.log(`   Email    : ${ADMIN.email}`);
  console.log(`   Password : ${ADMIN.password}`);
  console.log(`   Role     : admin\n`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seeder failed:', err.message);
  process.exit(1);
});
