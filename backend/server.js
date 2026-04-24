// server.js
// Point d'entrée principal du serveur Express - SUJET 26

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ── Import des routes ──
const authRoutes        = require('./routes/authRoutes');
const enseignantRoutes  = require('./routes/enseignantRoutes');

// ── Initialisation de l'application Express ──
const app = express();
const PORT = process.env.PORT || 3000;

// ════════════════════════════════════════════
//           MIDDLEWARES GLOBAUX
// ════════════════════════════════════════════

// Autoriser les requêtes cross-origin (frontend Vue/React/Angular)
app.use(cors({
  origin: '*',             // En production, mettre l'URL du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser les requêtes JSON
app.use(express.json());

// Parser les données de formulaires URL-encodées
app.use(express.urlencoded({ extended: true }));

// ════════════════════════════════════════════
//               ROUTES
// ════════════════════════════════════════════

// Route racine : vérification que le serveur tourne
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎓 API Gestion des Enseignants - SUJET 26',
    version: '1.0.0',
    endpoints: {
      auth:        '/api/auth',
      enseignants: '/api/enseignants'
    }
  });
});

// ── Menu 1 : Authentification (Login / Register) ──
app.use('/api/auth', authRoutes);

// ── Menu 2 & 3 : Gestion des enseignants (CRUD + Bilan) ──
app.use('/api/enseignants', enseignantRoutes);

// ════════════════════════════════════════════
//       GESTION DES ROUTES INEXISTANTES
// ════════════════════════════════════════════
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route "${req.originalUrl}" non trouvée.`
  });
});

// ════════════════════════════════════════════
//         MIDDLEWARE DE GESTION D'ERREURS
// ════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur.',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue.'
  });
});

// ════════════════════════════════════════════
//           DÉMARRAGE DU SERVEUR
// ════════════════════════════════════════════
app.listen(PORT, () => {
  console.log('════════════════════════════════════════');
  console.log('   API Gestion des Enseignants - SUJET 26');
  console.log('════════════════════════════════════════');
  console.log(`  Serveur démarré sur le port ${PORT}`);
  console.log(`  URL : http://localhost:${PORT}`);
  console.log('────────────────────────────────────────');
  console.log('   Endpoints disponibles :');
  console.log(`  POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`  POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`  GET    http://localhost:${PORT}/api/auth/me`);
  console.log('  ────────────────────────────────────');
  console.log(`  GET    http://localhost:${PORT}/api/enseignants`);
  console.log(`  GET    http://localhost:${PORT}/api/enseignants/bilan`);
  console.log(`  GET    http://localhost:${PORT}/api/enseignants/:id`);
  console.log(`  POST   http://localhost:${PORT}/api/enseignants`);
  console.log(`  PUT    http://localhost:${PORT}/api/enseignants/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/enseignants/:id`);
  console.log('════════════════════════════════════════');
});

module.exports = app;
