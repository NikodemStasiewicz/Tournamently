/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: 'admin',
      name: 'Admin',
      password: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN',
    },
  });

  // Regular player
  const userEmail = 'player1@example.com';
  const userPassword = 'User123!';

  const player = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      username: 'player1',
      name: 'Player One',
      password: await bcrypt.hash(userPassword, 10),
      role: 'PLAYER',
    },
  });

  // Demo team owned by admin
  const team = await prisma.team.upsert({
    where: { name: 'Demo Team' },
    update: {},
    create: {
      name: 'Demo Team',
      description: 'Przykładowa drużyna do testów',
      avatar: undefined,
      isPublic: true,
      requireApproval: false,
      maxMembers: 5,
      ownerId: admin.id,
    },
  });

  // Ensure owner is in members as OWNER
  await prisma.teamMember.upsert({
    where: {
      teamId_userId: {
        teamId: team.id,
        userId: admin.id,
      },
    },
    update: {},
    create: {
      teamId: team.id,
      userId: admin.id,
      teamRole: 'OWNER',
    },
  });

  // Demo tournament owned by admin
  const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const end = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  await prisma.tournament.create({
    data: {
      name: 'Demo Tournament',
      description: 'Turniej demonstracyjny',
      game: 'CS2',
      format: 'DOUBLE_ELIMINATION',
      participantLimit: 8,
      startDate: start,
      endDate: end,
      tournamentType: 'MIXED',
      ownerId: admin.id,
    },
  }).catch(() => {});

  console.log('Seed completed.');
  console.log('Admin credentials -> email: admin@example.com, password: Admin123!');
  console.log('Player credentials -> email: player1@example.com, password: User123!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
