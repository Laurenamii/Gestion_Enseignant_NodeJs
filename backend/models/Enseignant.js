// models/Enseignant.js
// Modèle pour les opérations CRUD sur la table enseignants

const db = require('../config/database');

class Enseignant {

  // ─────────────────────────────────────────
  // Récupérer tous les enseignants
  // ─────────────────────────────────────────
  static async findAll() {
    const sql = `
      SELECT
        id,
        numEns,
        nom,
        nbHeures,
        tauxHoraire,
        salaire,
        created_at,
        updated_at
      FROM enseignants
      ORDER BY id ASC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  // ─────────────────────────────────────────
  // Récupérer un enseignant par son ID
  // ─────────────────────────────────────────
  static async findById(id) {
    const sql = `
      SELECT id, numEns, nom, nbHeures, tauxHoraire, salaire, created_at, updated_at
      FROM enseignants
      WHERE id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }

  // ─────────────────────────────────────────
  // Récupérer un enseignant par son numéro
  // ─────────────────────────────────────────
  static async findByNumEns(numEns) {
    const sql = `SELECT * FROM enseignants WHERE numEns = ?`;
    const [rows] = await db.query(sql, [numEns]);
    return rows[0] || null;
  }

  // ─────────────────────────────────────────
  // Créer un nouvel enseignant
  // ─────────────────────────────────────────
  static async create({ numEns, nom, nbHeures, tauxHoraire }) {
    const sql = `
      INSERT INTO enseignants (numEns, nom, nbHeures, tauxHoraire)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [numEns, nom, nbHeures, tauxHoraire]);

    // Retourner l'enseignant nouvellement créé
    return await Enseignant.findById(result.insertId);
  }

  // ─────────────────────────────────────────
  // Modifier un enseignant existant
  // ─────────────────────────────────────────
  static async update(id, { numEns, nom, nbHeures, tauxHoraire }) {
    const sql = `
      UPDATE enseignants
      SET numEns = ?, nom = ?, nbHeures = ?, tauxHoraire = ?
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [numEns, nom, nbHeures, tauxHoraire, id]);

    if (result.affectedRows === 0) return null;

    // Retourner l'enseignant mis à jour
    return await Enseignant.findById(id);
  }

  // ─────────────────────────────────────────
  // Supprimer un enseignant
  // ─────────────────────────────────────────
  static async delete(id) {
    const sql = `DELETE FROM enseignants WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  // ─────────────────────────────────────────
  // Statistiques pour le bilan (histogramme / camembert)
  // ─────────────────────────────────────────
  static async getBilan() {
    // Salaire total de tous les enseignants
    const [totalRow] = await db.query(`
      SELECT
        COUNT(*)                AS totalEnseignants,
        SUM(salaire)            AS salaireTotalGlobal,
        MIN(salaire)            AS salaireMinimal,
        MAX(salaire)            AS salaireMaximal,
        AVG(salaire)            AS salaireMoyen,
        SUM(nbHeures)           AS totalHeures,
        AVG(nbHeures)           AS moyenneHeures,
        AVG(tauxHoraire)        AS moyenneTauxHoraire
      FROM enseignants
    `);

    // Liste détaillée de chaque enseignant avec son salaire (pour les graphiques)
    const [details] = await db.query(`
      SELECT numEns, nom, nbHeures, tauxHoraire, salaire
      FROM enseignants
      ORDER BY salaire DESC
    `);

    return {
      statistiques: totalRow[0],
      details: details
    };
  }
}

module.exports = Enseignant;
