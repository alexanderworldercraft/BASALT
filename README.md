# BASALT
*Base d’Applications Sécurisée, Avancée, Légère et Transversale.*

Ce nom reflète la nature du projet en tant que fondation solide ("basalt" étant une roche volcanique très dure) pour le développement d’applications modernes. Il met en avant la sécurité (SSL, utilisateurs, administrateurs), la légèreté et la polyvalence (backend et frontend séparés, modularité).
# Installation Instructions
## Sommaire :
- [**Préparation de l'environnement**](#préparation-de-lenvironnement)
- [**Configuration du projet**](#configuration-du-projet)
    - [1. Cloner le référentiel](#1-cloner-le-référentiel)
    - [2. Configuration du Backend](#2-configuration-du-backend)
    - [3. Configuration du Frontend](#3-configuration-du-frontend)
- [**Notes de développement**](#notes-de-développement)
- [**Commandes utiles**](#commandes-utiles)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Mise à jour des dépendances](#mise-à-jour-des-dépendances)
- [**FAQ**](#faq)
- [**🥇 Contribution**](#contribution)
  - [Contributeur](#contributeur)
- [**Licence**](#licence)
## Préparation de l'environnement
- **NodeJS**: Installer la dernière version [ici](https://nodejs.org/fr/download/package-manager)
- **Database**: Assurez-vous qu'une base de données PostgreSQL ou MySQL disponible (ajustez les paramètres dans le fichier `.env`).
- **OpenSSL**: 
---
## Configuration du projet
### 1. ***Cloner le référentiel***
    ```bash
    git clone <repository-url>
    cd BaseStructureFastifyPrismaAuthReact
    ```
### 2. ***Configuration du Backend***
1. Naviguez jusqu'au dossier backend :
    ```bash
    cd backend
    ```
2. Installer les dépendances :
    ```bash
    npm install
    ```
3. Configurer les variables d'environnement dans le fichier `.env`.
    ```bash
    # Pour MySQL
    DATABASE_URL="mysql://user:password@localhost:3306/databases?schema=public"
    
    # Pour PostgreSQL
    # DATABASE_URL"postgresql://user:password@localhost:5432/database"
    
    JWT_SECRET="Token secret"
    
    HTTPS="https://adresse de l'App"
    
    PORTS="port utilisé pour l'App"
    
    SURNOMSUPERADMIN="Nom du super administrateur"
    EMAILSUPERADMIN="Email du super administrateur"
    PASSWORDSUPERADMIN="mot de passe pour le compte super administrateur"
    
    SURNOMADMIN="Nom de l'administrateur"
    EMAILADMIN="Email de l'administrateur"
    PASSWORDADMIN="mot de passe pour le compte administrateur"
    ```
4. Générer le client Prisma et migrer la base de données :
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```
5. Alimente la base de données avec le fichier `seed.js` :
    ```bash
    npm run seed
    ```
6. Générer un certificat SSL auto-signé pour `HTTPS` via **OpenSSL** :
    1. Installer OpenSSL (si non installé)

        - Pour Linux installe-le avec :
            ```bash
            sudo apt update
            sudo apt install openssl
            ```
        - Pour macOS installe-le avec :
            ```bash
            brew install openssl
            ```
        - Pour Windows télécharger le [ici](https://www.tbs-certificats.com/FAQ/fr/openssl-windows.html)
    2. Créer un certificat SSL auto-signé
        - Étape 1 : Générer une clé privée
            Exécute cette commande pour créer une clé privée RSA de 2048 bits (ou plus si nécessaire) :
            ```bash
            openssl genrsa -out ssl/private.key 2048
            ```
        - Étape 2 : Générer une CSR (Certificate Signing Request)
            Crée une CSR qui contient les informations nécessaires pour le certificat. OpenSSL te posera des questions :
            ```bash
            openssl req -new -key ssl/private.key -out ssl/certificate.csr
            ```
            Les champs demandés incluent :

            - `Country Name` : Code pays (ex. : FR pour France).
            - `State or Province` : Région ou province.
            - `Locality Name` : Ville.
            - `Organization Name` : Nom de l'organisation.
            - `Common Name` : Nom de domaine (ou IP).

            ⚠️ Pour un certificat local, utilise localhost ou l'adresse IP.
        - Étape 3 : Créer le certificat auto-signé
            Utilise la clé privée et la CSR pour générer un certificat auto-signé valide pour 1 an (365 jours) :
            ```bash
            openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt
            ```
7. Démarrer le serveur :
    ```bash
    npm run start
    ```
    Le serveur backend devrait maintenant fonctionner.
### 3. ***Configuration du Frontend***
1. Naviguez jusqu'au dossier backend :
    ```bash
    cd ../frontend
    ```
2. Installer les dépendances :
    ```bash
    npm install
    ```
3. Configurer les variables d'environnement dans le fichier `.env`.
    ```bash
    REACT_APP_URL_LOCAL="https://adresse:ports du backend"
    ```
4. Installer le build :
    ```bash
    npm run build
    ```
    L'application React devrait maintenant être en cours d'exécution via le serveur **Backend**.
---
## Notes de développement
- Le backend fonctionne sur Fastify et écoute sur `https://localhost:le ports choisi` par défaut.
- Le frontend fonctionne sur React et écoute sur `l'adresse du backend` par défaut.
- Mettez à jour les configurations si nécessaire pour la production.
- Les Routes du Backend sont référencer sur l'adresse `https://localhost:le ports choisi/documentation` par défaut
---
## Commandes utiles
### Backend
- **Lancer le serveur** : `npm run start`
- **Lancer les testes unitaires** : `npm run test`
- **Réinitialiser la Base de données** : `npx prisma migrate reset`
- **Génère le client Prisma** : `npx prisma generate`
- **Synchronise le schéma Prisma avec la base de données** : `npx prisma db push`
- **Utilisez Prisma Studio pour explorer facilement les données** : `npx prisma studio`
### Frontend
- **Lancer le serveur** : `npm run start`
- **Construction pour la production** : `npm run build`
- **Mise à jours de TailwindCSS** : `npm run build:css`
### Mise à jour des dépendances
Pour vérifier les dépendances obsolètes et les mettre à jour :
- Backend :
    ```bash
    cd backend
    npm outdated
    npm update
    ```
- Frontend :
    ```bash 
    cd frontend
    npm outdated
    npm update
    ```
---
## FAQ
### Pourquoi `npm run start` échoue sur le backend ?
- Vérifiez que la variable `DATABASE_URL` est correcte et que la base de données est accessible.
- Assurez-vous d’avoir appliqué les migrations avec `npx prisma migrate dev`.
### Quel est l'adresse et le port par défaut ?
- L'adresse : `https://localhost`
- Le port : `1234`
### Comment modifier l'adresse et le port par défaut ?
- Backend : Mettez à jour la variable `HTTPS` et `PORTS` dans le fichier `backend/.env`.
- Frontend : Mettez à jour la variable `REACT_APP_URL_LOCAL` de `frontend/.env` avec les valeurs de `HTTPS` et `PORTS` de `backend/.env`.
### Comment voir les données de la base de données ?
- Utilisez Prisma Studio pour explorer facilement les données :
    ```bash
    npx prisma studio
    ```
---
## Contribution
Les contributions à ce repository sont les bienvenues ! Si vous souhaitez corriger une erreur ou améliorer le contenu existant, n'hésitez pas à m'en faire part.
### Contributeur
- [**👨‍💻🥇 Alexander worldercraft**](https://github.com/alexanderworldercraft)
---
## Licence
Ce contenu est sous licence [GNU GPLv3](LICENSE.txt). Vous êtes libre de l'utiliser, le modifier et le distribuer selon les termes de cette licence.

---
Bon développement !