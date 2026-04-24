// routes/authRoutes.js
// Définition des routes d'authentification

const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// ──────────────────────────────────────────
// POST /api/auth/register  →  Inscription
// ──────────────────────────────────────────
router.post('/register', register);

// ──────────────────────────────────────────
// POST /api/auth/login  →  Connexion
// ──────────────────────────────────────────
router.post('/login', login);

// ──────────────────────────────────────────
// GET /api/auth/me  →  Profil (protégé)
// ──────────────────────────────────────────
router.get('/me', authMiddleware, getMe);

module.exports = router;
