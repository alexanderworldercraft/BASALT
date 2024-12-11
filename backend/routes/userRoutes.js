// routes/userRoutes.js
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userRepository } from '../models/user.js';

import {
  loginSchema,
  registerSchema,
  updateUserSchema,
  deleteProfileImageSchema,
  getUsersByCriteriaSchema,
  deleteAccountSchema,
  getAdminsSchema,
  changeUserEtatSchema,
  getMeSchema,
} from '../schemas/userSchemas.js';

// Ajout des schema pour la documentation des routes.
export default async function userRoutes(fastify, options) {
  fastify.post('/register', { schema: registerSchema }, userController.register);
  fastify.post('/login', { schema: loginSchema }, userController.login);
  fastify.put('/update', { schema: updateUserSchema, preHandler: fastify.auth }, userController.updateUser);
  fastify.delete('/delete-profile-image', { schema: deleteProfileImageSchema, preHandler: fastify.auth }, userController.deleteProfileImage);
  fastify.get('/get-users', { schema: getUsersByCriteriaSchema, preHandler: authMiddleware }, userController.getUsersByCriteria);
  fastify.put('/delete-account', { schema: deleteAccountSchema }, userController.deleteAccount);
  fastify.get('/admins', { schema: getAdminsSchema, preHandler: authMiddleware }, userController.getAdmins);
  fastify.put('/change-etat', { schema: changeUserEtatSchema }, userController.changeUserEtat);
  fastify.get('/me', { schema: getMeSchema, preHandler: authMiddleware }, async (request, reply) => {
    try {
      const { userId } = request.user;
      const user = await userRepository.getUserById(userId);
      reply.send(user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}