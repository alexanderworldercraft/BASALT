// models/user.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const userRepository = {
  async createUser(userData) {
    return prisma.utilisateur.create({
      data: userData,
    });
  },

  async getUserBySurnom(surnom) {
    return prisma.utilisateur.findUnique({
      where: { Surnom: surnom },
    });
  },

  async updateUserPassword(surnom, hashedPassword) {
    return prisma.utilisateur.update({
      where: { surnom },
      data: { motDePasse: hashedPassword },
    });
  },

  async deleteUserBySurnom(surnom) {
    return prisma.utilisateur.delete({
      where: { surnom },
    });
  },

  async updateUserSurnom(surnom, newSurnom) {
    return prisma.utilisateur.update({
      where: { surnom },
      data: { surnom: newSurnom },
    });
  },

  async updateUserEmail(surnom, newEmail) {
    return prisma.utilisateur.update({
      where: { surnom },
      data: { email: newEmail },
    });
  },

  async updateUserProfileImage(surnom, cheminImage) {
    return prisma.utilisateur.update({
      where: { surnom },
      data: { cheminImage },
    });
  },

  async deleteUserProfileImage(surnom) {
    return prisma.utilisateur.update({
      where: { surnom },
      data: { cheminImage: null },
    });
  },
  async getUserById(userId) {
    return await prisma.utilisateur.findUnique({
      where: { UtilisateurID: userId },
      select: {
        UtilisateurID: true,
        Surnom: true,
        Email: true,
        MotDePasse: true,
        Salt: true,
        CheminImage: true,
        EtatID: true,
        GradeID: true,
      },
    });
  },
  async getUserBySurnomOrEmail(surnom, email) {
    return prisma.utilisateur.findFirst({
      where: {
        OR: [
          { Surnom: surnom },
          { Email: email },
        ],
      },
    });
  },
  async updateUserByField(where, data) {
    return prisma.utilisateur.update({
      where,
      data,
    });
  },
  async updateUserById(userId, updateData) {
    return prisma.utilisateur.update({
      where: { UtilisateurID: userId },
      data: updateData,
    });
  },
  async getAdmins() {
    return (await prisma.utilisateur.findMany({
      where: {
        GradeID: {
          in: [1, 2], // Superadmin et admin
        },
      },
      select: {
        UtilisateurID: true,
        Surnom: true,
        Email: true,
        Grade: {
          select: {
            Nom: true, // Nom du grade
          },
        },
        GradeID: true,
        EtatID: true,
      },
    })) || []; // Renvoie un tableau vide par défaut
  },
  async getUsersByCriteria(gradeId, etatId) {
    return prisma.utilisateur.findMany({
        where: {
            GradeID: gradeId,
            EtatID: etatId,
        },
        select: {
            UtilisateurID: true,
            Surnom: true,
            Email: true,
            CheminImage: true,
            EtatID: true,
        },
    });
}

};