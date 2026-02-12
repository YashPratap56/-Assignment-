// Database seed script for Prime Trade API
// Run with: npm run seed
// This is optional - users can self-register through the frontend

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Database seed is optional for this API.');
  console.log('📝 Users can self-register through the frontend at /register');
  console.log('🎉 No demo users created by default.');
  
  // Uncomment below lines if you want to create demo users:
  /*
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@primetrade.com' },
    update: {},
    create: {
      email: 'admin@primetrade.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  });
  console.log('✅ Demo admin user created: admin@primetrade.com / Admin123!');
  */
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
