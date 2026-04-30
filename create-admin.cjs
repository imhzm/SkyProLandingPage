const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const EMAIL = 'admin@skywaveads.com';
const PASSWORD = 'Admin@2026';
const NAME = 'Admin';

async function main() {
  try {
    const passwordHash = bcrypt.hashSync(PASSWORD, 10);
    
    const existing = await prisma.user.findUnique({ where: { email: EMAIL } });
    if (existing) {
      console.log('Admin user already exists:', existing.id, existing.email, existing.role);
      await prisma.user.update({
        where: { email: EMAIL },
        data: { passwordHash, role: 'admin', status: 'active', emailVerifiedAt: new Date() }
      });
      console.log('Admin user updated to admin role');
    } else {
      const user = await prisma.user.create({
        data: {
          email: EMAIL,
          name: NAME,
          passwordHash,
          role: 'admin',
          status: 'active',
          emailVerifiedAt: new Date()
        }
      });
      console.log('Admin user created:', user.id, user.email, user.role);
    }

    // Create a test regular user
    const testHash = bcrypt.hashSync('Test@2026', 10);
    const testExisting = await prisma.user.findUnique({ where: { email: 'test@skywaveads.com' } });
    if (!testExisting) {
      await prisma.user.create({
        data: {
          email: 'test@skywaveads.com',
          name: 'Test User',
          passwordHash: testHash,
          role: 'user',
          status: 'active',
          emailVerifiedAt: new Date()
        }
      });
      console.log('Test user created: test@skywaveads.com / Test@2026');
    }

    // List all users
    const users = await prisma.user.findMany();
    console.log('\nAll users:');
    users.forEach(u => console.log(`  ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Status: ${u.status}`));

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
