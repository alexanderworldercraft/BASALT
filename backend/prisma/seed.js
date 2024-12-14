import { PrismaClient } from '@prisma/client'; // Import pour Prisma
import bcrypt from 'bcrypt'; // Import pour bcrypt

const prisma = new PrismaClient();

async function main() {
  // Générer un mot de passe sécurisé
  const saltSuperAdmin = await bcrypt.genSalt(10);
  const saltAdmin = await bcrypt.genSalt(10);
  const hashedPasswordSuperAdmin = await bcrypt.hash(`${process.env.PASSWORDSUPERADMIN}`, saltSuperAdmin); // B@ttleF0r@zer0th+45
  const hashedPasswordAdmin = await bcrypt.hash(`${process.env.PASSWORDADMIN}`, saltAdmin); // B@ttleF0r@zer0th+45

  // Ajouter des grades par défaut
  await prisma.grade.createMany({
    data: [
      { Nom: "SuperAdmin" },
      { Nom: "Admin" },
      { Nom: "Utilisateur" },
    ],
    skipDuplicates: true, // Évite les erreurs si les grades existent déjà
  });

  console.log("Grades par défaut ajoutés !");

  // Ajouter des Etat par défaut
  await prisma.etat.createMany({
    data: [
      { Nom: "Actif" },
      { Nom: "Supprimer" },
      { Nom: "Bloquer" },
      { Nom: "Vendu" },
    ],
    skipDuplicates: true, // Évite les erreurs si les grades existent déjà
  });

  console.log("Etat par défaut ajoutés !");

  // Créer un utilisateur par défaut
  await prisma.utilisateur.createMany({
    data: [
      {
        Surnom: `${process.env.USERNAMESUPERADMIN}`, // Remplacez par le surnom souhaité
        Email: `${process.env.EMAILSUPERADMIN}`, // Remplacez par un email valide
        Salt: saltSuperAdmin,
        MotDePasse: hashedPasswordSuperAdmin,
        GradeID: 1,
        EtatID: 1,
      },
      {
        Surnom: `${process.env.USERNAMEADMIN}`, // Remplacez par le surnom souhaité
        Email: `${process.env.EMAILADMIN}`, // Remplacez par un email valide
        Salt: saltAdmin,
        MotDePasse: hashedPasswordAdmin,
        GradeID: 2,
        EtatID: 1,
      },
    ]
  });

  console.log("Utilisateur par défaut ajouté !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });