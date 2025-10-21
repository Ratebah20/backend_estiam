import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer un utilisateur admin
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@btp.com' },
    update: {},
    create: {
      email: 'admin@btp.com',
      password: hashedPassword,
      nom: 'Admin',
      prenom: 'BTP',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Créer un utilisateur standard
  const user = await prisma.user.upsert({
    where: { email: 'user@btp.com' },
    update: {},
    create: {
      email: 'user@btp.com',
      password: hashedPassword,
      nom: 'Utilisateur',
      prenom: 'Test',
      role: 'USER',
    },
  });

  console.log('✅ Standard user created:', user.email);

  // Créer des clients
  const client1 = await prisma.client.create({
    data: {
      adresse: '123 Avenue des Champs-Élysées, Paris 75008',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      adresse: '456 Rue de la République, Lyon 69002',
    },
  });

  console.log('✅ 2 clients created');

  // Créer des projets
  const projet1 = await prisma.projet.create({
    data: {
      nom: 'Rénovation Appartement Haussmannien',
      clientId: client1.id,
    },
  });

  const projet2 = await prisma.projet.create({
    data: {
      nom: 'Construction Villa Moderne',
      clientId: client2.id,
    },
  });

  console.log('✅ 2 projects created');

  // Créer des salariés
  const salarie1 = await prisma.salarie.create({
    data: {
      nom: 'Dupont',
      prenom: 'Jean',
    },
  });

  const salarie2 = await prisma.salarie.create({
    data: {
      nom: 'Martin',
      prenom: 'Marie',
    },
  });

  const salarie3 = await prisma.salarie.create({
    data: {
      nom: 'Bernard',
      prenom: 'Pierre',
    },
  });

  console.log('✅ 3 employees created');

  // Créer du matériel
  const materiel1 = await prisma.materiel.create({
    data: {
      designation: 'Échafaudage mobile 2m',
    },
  });

  const materiel2 = await prisma.materiel.create({
    data: {
      designation: 'Perceuse électrique Bosch',
    },
  });

  const materiel3 = await prisma.materiel.create({
    data: {
      designation: 'Bétonnière 120L',
    },
  });

  console.log('✅ 3 equipment items created');

  // Créer des interventions
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.intervention.create({
    data: {
      date: tomorrow,
      duree: 8,
      projetId: projet1.id,
      salaries: {
        connect: [{ id: salarie1.id }, { id: salarie2.id }],
      },
      materiels: {
        connect: [{ id: materiel1.id }, { id: materiel2.id }],
      },
    },
  });

  await prisma.intervention.create({
    data: {
      date: nextWeek,
      duree: 6,
      projetId: projet2.id,
      salaries: {
        connect: [{ id: salarie2.id }, { id: salarie3.id }],
      },
      materiels: {
        connect: [{ id: materiel3.id }],
      },
    },
  });

  console.log('✅ 2 interventions created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
