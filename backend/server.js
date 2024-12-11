import Fastify from "fastify";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from '@fastify/static';
import userRoutes from './routes/userRoutes.js';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import { prisma as db } from "./services/db.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

// Créer l'équivalent de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les fichiers de certificat SSL
let privateKey, certificate;
try {
    console.log('Reading SSL certificate files...');
    privateKey = fs.readFileSync(path.join('ssl/private.key'));
    certificate = fs.readFileSync(path.join('ssl/certificate.crt'));
    console.log('SSL certificate files read successfully.');
} catch (err) {
    console.error('Error reading SSL certificate files:', err);
    process.exit(1);
}

// Création d'une instance de Fastify avec le logger activé pour un suivi des requêtes et erreurs
const fastify = Fastify({
    https: {
        key: privateKey,
        cert: certificate
    },
    logger: true, // Activation du logger pour journaliser les requêtes et les erreurs

    // Configuration de l'instance AJV (JSON Schema Validator) intégrée de Fastify
    ajv: {
        customOptions: { 
            removeAdditional: true // Supprime les propriétés non définies dans le schéma
        }
    }
});
// Enregistrement de la documentation Swagger avec Swagger-UI
fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'BaseStructureFastifyPrismaAuthReact API',
            description: 'Base API pour les applications, mise en place des bases de l\'authentificateur et la gestion des utilisateurs.',
            version: '1.0.0'
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        },
        host: `${process.env.HTTPS}:${process.env.PORTS}`,
        schemes: ['https'], // Utiliser https au lieu de http
        consumes: ['application/json'],
        produces: ['application/json'],
        components: {
            securitySchemes: {
                token: {
                    type: "https",
                    scheme: "bearer",
                    bearerFormat: "jwt",
                }
            }
        },
    },
});

fastify.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'list'
    }
});

// Configurer CORS
fastify.register(fastifyCors, {
    origin: `${process.env.HTTPS}:${process.env.PORTS}`, // Autoriser les requêtes depuis cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

// Enregistrement du plugin multipart
fastify.register(fastifyMultipart, {
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo
});

// Enregistrer les routes
fastify.register(userRoutes, { prefix: '/api/users' });

// Enregistrer les fichiers statiques pour le frontend
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../frontend/build'),
    prefix: '/', // Frontend accessible depuis la racine
    wildcard: true, // Permet de gérer React Router
    decorateReply: false, // Désactive l'ajout du décorateur "sendFile"
});

// Enregistrer les fichiers statiques pour les uploads
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'uploads'),
    prefix: '/uploads/', // Fichiers utilisateurs accessibles depuis /uploads/
});

// Gérer toutes les autres routes non définies (React Router support)
fastify.setNotFoundHandler((request, reply) => {
    reply.sendFile('index.html', path.join(__dirname, '../frontend/build'));
});

// Fonction pour garder la connexion à la base de données active
function keepDatabaseAlive() {
    db.$queryRaw`SELECT 1` // Utilise la syntaxe de requête brute de Prisma
        .then(() => {
            console.log("Ping à la base de données réussi");
        })
        .catch((err) => {
            console.error("Erreur lors du ping de la base de données :", err.message);
        });
}

// Configurer l'intervalle de ping (toutes les 7 heures)
setInterval(keepDatabaseAlive, 25200000);

// Démarrer le serveur
const start = async () => {
    try {
        console.log(`Starting server on port ${process.env.PORTS}...`);
        await fastify.listen({ port: process.env.PORTS, host: '0.0.0.0' });
        console.log(`Server listening on ${process.env.HTTPS}:${process.env.PORTS}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};
start();
