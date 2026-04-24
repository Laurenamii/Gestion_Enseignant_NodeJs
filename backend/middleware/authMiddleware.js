// middleware/authMiddleware.js
// Middleware de vérification du token JWT pour protéger les routes

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Récupérer le token depuis le header Authorization
  // Format attendu : "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Si aucun token n'est fourni
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Token manquant. Veuillez vous connecter.'
    });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attacher les infos de l'utilisateur à la requête
    req.user = decoded;

    // Passer au middleware/contrôleur suivant
    next();
  } catch (error) {
    // Token invalide ou expiré
    return res.status(403).json({
      success: false,
      message: 'Token invalide ou expiré. Veuillez vous reconnecter.'
    });
  }
};

module.exports = authMiddleware;
