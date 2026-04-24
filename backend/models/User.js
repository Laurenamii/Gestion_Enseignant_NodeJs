// models/User.js
// Modèle pour les opérations sur la table users (authentification)

const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {

  // ─────────────────────────────────────────
  // Trouver un utilisateur par son username
  // ─────────────────────────────────────────
  static async findByUsername(username) {
    const sql = `SELECT * FROM users WHERE username = ?`;
    const [rows] = await db.query(sql, [username]);
    return rows[0] || null;
  }

  // ─────────────────────────────────────────
  // Trouver un utilisateur par son ID
  // ─────────────────────────────────────────
  static async findById(id) {
    const sql = `SELECT id, username, role, created_at FROM users WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }

  // ─────────────────────────────────────────
  // Créer un nouvel utilisateur
  // ─────────────────────────────────────────
  static async create({ username, password, role = 'user' }) {
    // Hasher le mot de passe avant de le stocker
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [username, hashedPassword, role]);

    return await User.findById(result.insertId);
  }

  // ─────────────────────────────────────────
  // Vérifier le mot de passe lors de la connexion
  // ─────────────────────────────────────────
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
