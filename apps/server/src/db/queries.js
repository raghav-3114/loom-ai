/**
 * @file queries.js
 * @description Prepared SQL query executions and helper functions for database CRUD operations
 * on projects and session records.
 */

const { getDb } = require('./init');

/**
 * Creates a new project record.
 * 
 * @param {Object} projectData
 * @param {string} projectData.id - Unique ID
 * @param {string} projectData.name - Project Name
 * @param {string} projectData.stack - Stack Identifier ("vanilla" | "react-tailwind")
 * @returns {Object} Created project object
 */
function createProject({ id, name, stack }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO projects (id, name, stack)
    VALUES (?, ?, ?)
  `);
  stmt.run(id, name, stack);
  return { id, name, stack };
}

/**
 * Finds a project by ID.
 * 
 * @param {string} id 
 * @returns {Object|null} Project record or null
 */
function getProjectById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  const project = stmt.get(id);
  return project || null;
}

/**
 * Creates or updates a session.
 * 
 * @param {Object} sessionData 
 * @param {string} sessionData.id - Session/Project ID
 * @param {string} sessionData.projectId - Project ID link
 * @param {string} sessionData.state - Serialized state string (messages and files)
 * @returns {Object} Session record
 */
function saveSession({ id, projectId, state }) {
  const db = getDb();
  
  // Check if session exists
  const existing = db.prepare('SELECT id FROM sessions WHERE id = ?').get(id);
  
  if (existing) {
    const stmt = db.prepare(`
      UPDATE sessions
      SET state = ?
      WHERE id = ?
    `);
    stmt.run(state, id);
  } else {
    const stmt = db.prepare(`
      INSERT INTO sessions (id, project_id, state)
      VALUES (?, ?, ?)
    `);
    stmt.run(id, projectId, state);
  }
  
  return { id, projectId, state };
}

/**
 * Retrieves a session by ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getSessionById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
  const session = stmt.get(id);
  return session || null;
}

module.exports = {
  createProject,
  getProjectById,
  saveSession,
  getSessionById,
};
