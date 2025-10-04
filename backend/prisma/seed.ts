import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();

  // Create sample tasks
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'Complete the todo application',
        description:
          'Build a full-stack todo app with React, Node.js, and MySQL',
        completed: false,
      },
      {
        title: 'Write unit tests',
        description:
          'Add comprehensive test coverage for both frontend and backend',
        completed: false,
      },
      {
        title: 'Setup Docker deployment',
        description: 'Configure Docker containers for easy deployment',
        completed: true,
      },
      {
        title: 'Design the user interface',
        description:
          'Create a clean and intuitive UI following the provided mockup',
        completed: true,
      },
      {
        title: 'Implement API endpoints',
        description: 'Build REST API for CRUD operations on tasks',
        completed: false,
      },
    ],
  });

  console.log(`Created ${tasks.count} sample tasks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
