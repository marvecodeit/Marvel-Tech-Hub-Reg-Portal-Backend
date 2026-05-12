import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Job from '../models/jobModel.js';
import User from '../models/userModel.js';

dotenv.config();

const jobs = [
  { title: 'Senior Frontend Engineer', description: 'Build and maintain high-quality React applications.', category: 'Frontend', location: 'Remote', salary: '$120k - $160k', experience: '5+ years', jobType: 'Full-time', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'] },
  { title: 'Backend Engineer (Node.js)', description: 'Design and build scalable backend services.', category: 'Backend', location: 'Hybrid', salary: '$110k - $150k', experience: '4+ years', jobType: 'Full-time', skills: ['Node.js', 'PostgreSQL', 'Redis', 'AWS'] },
  { title: 'Fullstack Developer', description: 'Own the full product stack from frontend to backend.', category: 'Fullstack', location: 'Remote', salary: '$100k - $140k', experience: '3+ years', jobType: 'Full-time', skills: ['React', 'Node.js', 'MongoDB', 'Docker'] },
  { title: 'React Native Developer', description: 'Build cross-platform mobile applications.', category: 'Mobile Development', location: 'Remote', salary: '$95k - $130k', experience: '3+ years', jobType: 'Full-time', skills: ['React Native', 'Expo', 'TypeScript', 'Firebase'] },
  { title: 'UI/UX Designer', description: 'Craft beautiful and usable product interfaces.', category: 'UI/UX', location: 'Onsite', salary: '$85k - $120k', experience: '2+ years', jobType: 'Full-time', skills: ['Figma', 'Prototyping', 'Design Systems', 'CSS'] },
  { title: 'DevOps Engineer', description: 'Manage cloud infrastructure and CI/CD pipelines.', category: 'DevOps', location: 'Remote', salary: '$115k - $155k', experience: '4+ years', jobType: 'Full-time', skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'] },
  { title: 'Frontend Intern', description: 'Learn and contribute to frontend development.', category: 'Internship', location: 'Remote', salary: '$25/hr', experience: '0-1 years', jobType: 'Internship', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { title: 'Python Backend Developer', description: 'Build fast and reliable Python backend services.', category: 'Backend', location: 'Remote', salary: '$105k - $145k', experience: '3+ years', jobType: 'Full-time', skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'] },
  { title: 'Cloud Infrastructure Engineer', description: 'Design and manage cloud infrastructure at scale.', category: 'DevOps', location: 'Remote', salary: '$125k - $165k', experience: '5+ years', jobType: 'Full-time', skills: ['AWS', 'GCP', 'Terraform', 'Ansible'] },
];

const seed = async () => {
  await connectDB();

  // Drop stale unique index on username if it exists
  try {
    await mongoose.connection.collection('users').dropIndex('username_1');
  } catch (_) {}

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.log('❌ No admin found. Run seed:admin first.\n');
    await mongoose.disconnect();
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const job of jobs) {
    const exists = await Job.findOne({ title: { $regex: new RegExp(`^${job.title}$`, 'i') } });
    if (exists) {
      skipped++;
      continue;
    }
    await Job.create({ ...job, createdBy: admin._id });
    created++;
  }

  console.log(`\n🌱 Jobs seeded: ${created} created, ${skipped} already existed.\n`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seeder failed:', err.message);
  process.exit(1);
});
