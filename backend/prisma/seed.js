import { PrismaClient } from '@prisma/client'; // Import pour Prisma
import bcrypt from 'bcrypt'; // Import pour bcrypt

const prisma = new PrismaClient();

async function main() {
  // Générer un mot de passe sécurisé
  const salt = await bcrypt.genSalt(10);
  const hashedPasswordSuperAdmin = await bcrypt.hash(`${process.env.PASSWORDSUPERADMIN}`, salt);
  const hashedPasswordAdmin = await bcrypt.hash(`${process.env.PASSWORDADMIN}`, salt);

  const SurnomSuperAdmin = `${process.env.SURNOMSUPERADMIN}`;
  const SurnomAdmin = `${process.env.SURNOMADMIN}`;

  const EmailSuperAdmin = `${process.env.EMAILSUPERADMIN}`;
  const EmailAdmin = `${process.env.EMAILADMIN}`;

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
        Surnom: SurnomSuperAdmin, // Remplacez par le surnom souhaité
        Email: EmailSuperAdmin, // Remplacez par un email valide
        Salt: salt,
        MotDePasse: hashedPasswordSuperAdmin,
        GradeID: 1,
        EtatID: 1,
      },
      {
        Surnom: SurnomAdmin, // Remplacez par le surnom souhaité
        Email: EmailAdmin, // Remplacez par un email valide
        Salt: salt,
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