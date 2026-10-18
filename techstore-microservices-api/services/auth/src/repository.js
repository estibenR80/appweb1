'use strict';

/** Repositorio de usuarios: acceso a datos de la tabla `users`. */
const { getDb } = require('../../../shared/db');

function createUser({ email, passwordHash, name, role }) {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(email, passwordHash, name, role);
  return findById(info.lastInsertRowid);
}

function findByEmail(email) {
  return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function findById(id) {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
}

module.exports = { createUser, findByEmail, findById };
