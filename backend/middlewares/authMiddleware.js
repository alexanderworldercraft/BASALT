// middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authMiddleware = async (request, reply, next) => {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);

    request.user = decoded; // Ajoute les infos du token à la requête
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    reply.status(401).send({ error: 'Unauthorized' });
  }
};