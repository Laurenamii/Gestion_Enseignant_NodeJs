// config/database.js
// Configuration et connexion à la base de données MySQL

const mysql = require('mysql2');
require('dotenv').config();

// Création du pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_enseignants',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Version promise du pool pour utiliser async/await
const promisePool = pool.promise();

// Test de la connexion au démarrage
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.message);
    return;
  }
  console.log('Connexion à la base de données MySQL réussie !');
  connection.release();
});

module.exports = promisePool;






