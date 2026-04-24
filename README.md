#  Backend - Gestion des Enseignants (SUJET 26)

Backend API REST développé avec **Node.js / Express.js** et **MySQL**.

---

##  Structure du projet

```
backend-enseignant/
├── server.js                      ← Point d'entrée du serveur
├── package.json                   ← Dépendances npm
├── .env                           ← Variables d'environnement
│
├── config/
│   ├── database.js                ← Connexion MySQL (pool)
│   └── database.sql               ← Script SQL (création BDD + tables)
│
├── models/
│   ├── Enseignant.js              ← Modèle CRUD enseignants
│   └── User.js                    ← Modèle utilisateurs (auth)
│
├── controllers/
│   ├── authController.js          ← Login / Register / GetMe
│   └── enseignantController.js    ← CRUD + Bilan
│
├── routes/
│   ├── authRoutes.js              ← Routes /api/auth
│   └── enseignantRoutes.js        ← Routes /api/enseignants
│
└── middleware/
    └── authMiddleware.js          ← Vérification JWT
```

---

##  Installation et démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer la base de données MySQL
```bash
# Exécuter le script SQL dans MySQL
mysql -u root -p < config/database.sql
```

### 3. Configurer le fichier `.env`
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=db_enseignants
JWT_SECRET=votre_secret_jwt_tres_securise_123456
JWT_EXPIRES_IN=24h
```

### 4. Démarrer le serveur
```bash
# Production
npm start

# Développement (avec rechargement automatique)
npm run dev
```

---

## Endpoints de l'API

###  Authentification
| Méthode | Route              | Description            | Auth requise |
|---------|--------------------|------------------------|:------------:|
| POST    | /api/auth/register | Inscription            | Non           |
| POST    | /api/auth/login    | Connexion → Token JWT  | Non           |
| GET     | /api/auth/me       | Profil connecté        | Oui        |

### Enseignants
| Méthode | Route                      | Description                    | Auth requise |
|---------|----------------------------|--------------------------------|:------------:|
| GET     | /api/enseignants           | Liste tous les enseignants     | Yes          |
| GET     | /api/enseignants/bilan     | Bilan / statistiques           | Yes           |
| GET     | /api/enseignants/:id       | Un enseignant par ID           | Yes           |
| POST    | /api/enseignants           | Ajouter un enseignant          | Yes           |
| PUT     | /api/enseignants/:id       | Modifier un enseignant         | Yes           |
| DELETE  | /api/enseignants/:id       | Supprimer un enseignant        | Yes           |

---

##  Authentification JWT

Après le login, inclure le token dans chaque requête protégée :
```
Authorization: Bearer <votre_token_jwt>
```

---

##  Exemples de requêtes

### Login
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### Ajouter un enseignant
```json
POST /api/enseignants
{
  "numEns": "ENS006",
  "nom": "Alice Randria",
  "nbHeures": 40,
  "tauxHoraire": 5000
}
```
**Réponse succès :**
```json
{
  "success": true,
  "message": "Insertion/modification réussie",
  "data": {
    "id": 6,
    "numEns": "ENS006",
    "nom": "Alice Randria",
    "nbHeures": 40,
    "tauxHoraire": 5000,
    "salaire": 200000
  }
}
```

### Bilan (pour histogramme / camembert)
```json
GET /api/enseignants/bilan

Réponse :
{
  "success": true,
  "data": {
    "statistiques": {
      "totalEnseignants": 5,
      "salaireMinimal": 150000,
      "salaireMaximal": 250000,
      "salaireMoyen": 195000,
      "salaireTotalGlobal": 975000,
      ...
    },
    "enseignants": [...]
  }
}
```

---

## Table MySQL : `enseignants`

| Colonne    | Type           | Description                         |
|------------|----------------|-------------------------------------|
| id         | INT (AI, PK)   | Identifiant unique auto-incrémenté  |
| numEns     | VARCHAR(20)    | Numéro enseignant (unique)          |
| nom        | VARCHAR(100)   | Nom complet                         |
| nbHeures   | DECIMAL(10,2)  | Nombre d'heures travaillées         |
| tauxHoraire| DECIMAL(10,2)  | Taux horaire (Ariary/heure)         |
| salaire    | DECIMAL(15,2)  | Calculé auto : nbHeures×tauxHoraire |
| created_at | TIMESTAMP      | Date de création                    |
| updated_at | TIMESTAMP      | Date de dernière mise à jour        |

---

## Dépendances

| Package    | Version | Rôle                              |
|------------|---------|-----------------------------------|
| express    | ^4.18   | Framework web HTTP                |
| mysql2     | ^3.3    | Driver MySQL avec support Promise |
| bcryptjs   | ^2.4    | Hashage sécurisé des mots de passe|
| jsonwebtoken| ^9.0   | Génération et vérification JWT    |
| cors       | ^2.8    | Gestion des requêtes Cross-Origin |
| dotenv     | ^16.0   | Variables d'environnement (.env)  |
| nodemon    | ^2.0    | Rechargement auto (développement) |

