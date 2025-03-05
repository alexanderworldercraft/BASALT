// middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

export const authMiddleware = async (request, reply, next) => {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return reply.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Vérification du token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.error('Token expired at:', err.expiredAt);
          return reply.status(401).send({ error: 'Token expired', expiredAt: err.expiredAt });
        }
        console.error('Invalid token:', err.message);
        return reply.status(401).send({ error: 'Invalid token' });
      }

      // Ajoute les informations du token à la requête
      request.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Authentication error:', err);
    reply.status(500).send({ error: 'Internal server error' });
  }
};