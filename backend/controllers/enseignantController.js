// controllers/enseignantController.js
// Contrôleur CRUD complet pour la gestion des enseignants

const Enseignant = require('../models/Enseignant');

// ─────────────────────────────────────────────────────────
// GET /api/enseignants
// Récupérer la liste de tous les enseignants
// ─────────────────────────────────────────────────────────
const getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await Enseignant.findAll();

    return res.status(200).json({
      success: true,
      count: enseignants.length,
      data: enseignants
    });

  } catch (error) {
    console.error('Erreur getAllEnseignants:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des enseignants.',
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/enseignants/:id
// Récupérer un enseignant par son ID
// ─────────────────────────────────────────────────────────
const getEnseignantById = async (req, res) => {
  try {
    const { id } = req.params;

    const enseignant = await Enseignant.findById(id);

    if (!enseignant) {
      return res.status(404).json({
        success: false,
        message: `Enseignant avec l'ID ${id} non trouvé.`
      });
    }

    return res.status(200).json({
      success: true,
      data: enseignant
    });

  } catch (error) {
    console.error('Erreur getEnseignantById:', error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'enseignant.",
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/enseignants
// Ajouter un nouvel enseignant
// Body attendu : { numEns, nom, nbHeures, tauxHoraire }
// ─────────────────────────────────────────────────────────
const createEnseignant = async (req, res) => {
  try {
    const { numEns, nom, nbHeures, tauxHoraire } = req.body;

    // ── Validation des champs obligatoires ──
    if (!numEns || !nom || nbHeures === undefined || tauxHoraire === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires : numEns, nom, nbHeures, tauxHoraire.'
      });
    }

    // ── Validation des types numériques ──
    if (isNaN(nbHeures) || isNaN(tauxHoraire)) {
      return res.status(400).json({
        success: false,
        message: 'nbHeures et tauxHoraire doivent être des nombres valides.'
      });
    }

    // ── Validation des valeurs positives ──
    if (Number(nbHeures) < 0 || Number(tauxHoraire) < 0) {
      return res.status(400).json({
        success: false,
        message: 'nbHeures et tauxHoraire doivent être des valeurs positives.'
      });
    }

    // ── Vérifier si le numéro d'enseignant existe déjà ──
    const existing = await Enseignant.findByNumEns(numEns);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Le numéro d'enseignant "${numEns}" existe déjà.`
      });
    }

    // ── Créer l'enseignant ──
    const newEnseignant = await Enseignant.create({
      numEns,
      nom,
      nbHeures: Number(nbHeures),
      tauxHoraire: Number(tauxHoraire)
    });

    // Réponse avec le message demandé par le sujet
    return res.status(201).json({
      success: true,
      message: 'Insertion/modification réussie',   // Message du sujet
      data: newEnseignant
    });

  } catch (error) {
    console.error('Erreur createEnseignant:', error);

    // Gérer l'erreur de doublon MySQL (code 1062)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Ce numéro d\'enseignant existe déjà en base de données.'
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'enseignant.",
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────
// PUT /api/enseignants/:id
// Modifier un enseignant existant
// Body attendu : { numEns, nom, nbHeures, tauxHoraire }
// ─────────────────────────────────────────────────────────
const updateEnseignant = async (req, res) => {
  try {
    const { id } = req.params;
    const { numEns, nom, nbHeures, tauxHoraire } = req.body;

    // ── Vérifier que l'enseignant existe ──
    const existing = await Enseignant.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Enseignant avec l'ID ${id} non trouvé.`
      });
    }

    // ── Validation des champs obligatoires ──
    if (!numEns || !nom || nbHeures === undefined || tauxHoraire === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires : numEns, nom, nbHeures, tauxHoraire.'
      });
    }

    // ── Validation des valeurs ──
    if (isNaN(nbHeures) || isNaN(tauxHoraire)) {
      return res.status(400).json({
        success: false,
        message: 'nbHeures et tauxHoraire doivent être des nombres valides.'
      });
    }

    if (Number(nbHeures) < 0 || Number(tauxHoraire) < 0) {
      return res.status(400).json({
        success: false,
        message: 'nbHeures et tauxHoraire doivent être des valeurs positives.'
      });
    }

    // ── Mettre à jour l'enseignant ──
    const updated = await Enseignant.update(id, {
      numEns,
      nom,
      nbHeures: Number(nbHeures),
      tauxHoraire: Number(tauxHoraire)
    });

    return res.status(200).json({
      success: true,
      message: 'Insertion/modification réussie',   // Message du sujet
      data: updated
    });

  } catch (error) {
    console.error('Erreur updateEnseignant:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Ce numéro d\'enseignant est déjà utilisé par un autre enregistrement.'
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'enseignant.",
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────
// DELETE /api/enseignants/:id
// Supprimer un enseignant
// ─────────────────────────────────────────────────────────
const deleteEnseignant = async (req, res) => {
  try {
    const { id } = req.params;

    // ── Vérifier que l'enseignant existe ──
    const existing = await Enseignant.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Enseignant avec l'ID ${id} non trouvé.`
      });
    }

    // ── Supprimer l'enseignant ──
    await Enseignant.delete(id);

    return res.status(200).json({
      success: true,
      message: `Enseignant "${existing.nom}" supprimé avec succès.`
    });

  } catch (error) {
    console.error('Erreur deleteEnseignant:', error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'enseignant.",
      error: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/enseignants/bilan
// Récupérer le bilan (statistiques pour histogramme/camembert)
// Salaire minimal, maximal, total de tous les enseignants
// ─────────────────────────────────────────────────────────
const getBilan = async (req, res) => {
  try {
    const bilan = await Enseignant.getBilan();

    return res.status(200).json({
      success: true,
      data: {
        statistiques: {
          totalEnseignants:    bilan.statistiques.totalEnseignants,
          salaireMinimal:      bilan.statistiques.salaireMinimal,       // Salaire min
          salaireMaximal:      bilan.statistiques.salaireMaximal,       // Salaire max
          salaireMoyen:        bilan.statistiques.salaireMoyen,
          salaireTotalGlobal:  bilan.statistiques.salaireTotalGlobal,   // Montant total
          totalHeures:         bilan.statistiques.totalHeures,
          moyenneHeures:       bilan.statistiques.moyenneHeures,
          moyenneTauxHoraire:  bilan.statistiques.moyenneTauxHoraire
        },
        // Données détaillées pour les graphiques (histogramme / camembert)
        enseignants: bilan.details
      }
    });

  } catch (error) {
    console.error('Erreur getBilan:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul du bilan.',
      error: error.message
    });
  }
};

module.exports = {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
  getBilan
};
