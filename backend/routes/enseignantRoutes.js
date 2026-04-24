// routes/enseignantRoutes.js
// Définition des routes pour la gestion des enseignants

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
  getBilan
} = require('../controllers/enseignantController');

// IMPORTANT : La route /bilan doit être définie AVANT la route /:id
// pour éviter que "bilan" soit interprété comme un ID

// ──────────────────────────────────────────────────────────
// GET /api/enseignants/bilan
// Obtenir le bilan (stats : min, max, total des salaires)
// Route protégée par JWT
// ──────────────────────────────────────────────────────────
router.get('/bilan', authMiddleware, getBilan);

// ──────────────────────────────────────────────────────────
// GET /api/enseignants
// Lister tous les enseignants
// Route protégée par JWT
// ──────────────────────────────────────────────────────────
router.get('/', authMiddleware, getAllEnseignants);

// ──────────────────────────────────────────────────────────
// GET /api/enseignants/:id
// Récupérer un enseignant par son ID
// Route protégée par JWT
// ──────────────────────────────────────────────────────────
router.get('/:id', authMiddleware, getEnseignantById);

// ──────────────────────────────────────────────────────────
// POST /api/enseignants
// Ajouter un nouvel enseignant
// Body : { numEns, nom, nbHeures, tauxHoraire }
// Route protégée par JWT
// ──────────────────────────────────────────────────────────
router.post('/', authMiddleware, createEnseignant);

// ──────────────────────────────────────────────────────────
// PUT /api/enseignants/:id
// Modifier un enseignant existant
// Body : { numEns, nom, nbHeures, tauxHoraire }
// Route protégée par JWT
// ──────────────────────────────────────────────────────────
router.put('/:id', authMiddleware, updateEnseignant);

// ──────────────────────────────────────────────────────────
// DELETE /api/enseignants/:id
// Supprimer un enseignant
// Route protégée par JWT
// ──────────────────────────────────────────────────────────
router.delete('/:id', authMiddleware, deleteEnseignant);

module.exports = router;
