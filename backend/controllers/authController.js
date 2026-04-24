// controllers/authController.js
// Contrôleur pour l'authentification (login / register)

const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// ─────────────────────────────────────────────────────────
// POST /api/auth/login
// Connexion d'un utilisateur existant
// ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérification des champs obligatoires
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un nom d'utilisateur et un mot de passe."
      });
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect."
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect."
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Réponse avec succès
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/auth/register
// Enregistrement d'un nouvel utilisateur
// ─────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Vérification des champs obligatoires
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un nom d'utilisateur et un mot de passe."
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Ce nom d'utilisateur est déjà pris."
      });
    }

    // Créer le nouvel utilisateur
    const newUser = await User.create({ username, password, role });

    return res.status(201).json({
      success: true,
      message: 'Inscription réussie !',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Erreur register:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/auth/me
// Récupérer les infos de l'utilisateur connecté
// ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur getMe:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur.',
      error: error.message
    });
  }
};

module.exports = { login, register, getMe };
