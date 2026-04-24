-- ============================================
-- Script SQL - Création de la base de données
-- SUJET 26 : Gestion des Enseignants
-- ============================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS db_enseignants
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE db_enseignants;

-- ============================================
-- TABLE : enseignants
-- ============================================
CREATE TABLE IF NOT EXISTS enseignants (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  numEns      VARCHAR(20)    NOT NULL UNIQUE,   -- Numéro de l'enseignant
  nom         VARCHAR(100)   NOT NULL,           -- Nom de l'enseignant
  nbHeures    DECIMAL(10,2)  NOT NULL DEFAULT 0, -- Nombre d'heures
  tauxHoraire DECIMAL(10,2)  NOT NULL DEFAULT 0, -- Taux horaire (Ar/heure)
  salaire     DECIMAL(15,2)  GENERATED ALWAYS AS (nbHeures * tauxHoraire) STORED,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE : users (pour l'authentification)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,             -- Mot de passe hashé avec bcrypt
  role       ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Données de test : enseignants
-- ============================================
INSERT INTO enseignants (numEns, nom, nbHeures, tauxHoraire) VALUES
  ('ENS001', 'Jean Dupont',      40, 5000),
  ('ENS002', 'Marie Martin',     35, 6000),
  ('ENS003', 'Pierre Durand',    45, 4500),
  ('ENS004', 'Sophie Bernard',   30, 7000),
  ('ENS005', 'Lucas Petit',      50, 4000);

-- ============================================
-- Données de test : utilisateur admin
-- Mot de passe : admin123  (hashé avec bcrypt)
-- ============================================
INSERT INTO users (username, password, role) VALUES
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');

-- Vérification
SELECT 'Base de données créée avec succès !' AS message;
SELECT * FROM enseignants;
