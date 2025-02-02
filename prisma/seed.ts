import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create some initial users
  await prisma.user.createMany({
    data: [
      {
        email: 'user1@example.com',
        name: 'User One',
      },
      {
        email: 'user2@example.com',
        name: 'User Two',
      },
      {
        email: 'user3@example.com',
        name: 'User Three',
      },
    ],
  });

  console.log('Seeded the database with initial users.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });