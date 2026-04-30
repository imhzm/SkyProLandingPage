const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@skywaveads.com' } });
  console.log('User:', user.email, user.role, user.status);
  console.log('Hash:', user.passwordHash);
  const isValid = bcrypt.compareSync('Admin@2026', user.passwordHash);
  console.log('Password valid:', isValid);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
