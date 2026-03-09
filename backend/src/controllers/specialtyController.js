const pool = require('../config/db');
const { success, error } = require('../utils/response');

// GET all specialties
async function getSpecialties(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT specialty_id, specialty_name, description
       FROM specialties
       ORDER BY specialty_name ASC`
    );

    return success(res, { specialties: rows });
  } catch (err) {
    next(err);
  }
}

// CREATE specialty
async function createSpecialty(req, res, next) {
  try {
    const { specialty_name, description } = req.body;

    if (!specialty_name) {
      return error(res, 'Specialty name is required', 400);
    }

    const { rows } = await pool.query(
      `INSERT INTO specialties (specialty_name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [specialty_name, description || null]
    );

    return success(res, { specialty: rows[0] }, 'Specialty created', 201);
  } catch (err) {
    if (err.code === '23505') {
      return error(res, 'Specialty already exists', 409);
    }
    next(err);
  }
}

// UPDATE specialty
async function updateSpecialty(req, res, next) {
  try {
    const { id } = req.params;
    const { specialty_name, description } = req.body;

    const { rows } = await pool.query(
      `UPDATE specialties
       SET specialty_name = $1,
           description = $2
       WHERE specialty_id = $3
       RETURNING *`,
      [specialty_name, description, id]
    );

    if (!rows.length) {
      return error(res, 'Specialty not found', 404);
    }

    return success(res, { specialty: rows[0] }, 'Specialty updated');
  } catch (err) {
    next(err);
  }
}

// DELETE specialty
async function deleteSpecialty(req, res, next) {
  try {
    const { id } = req.params;

    const check = await pool.query(
      `SELECT doctor_id FROM doctor_profiles
       WHERE specialty_id = $1
       LIMIT 1`,
      [id]
    );

    if (check.rows.length) {
      return error(res, 'Cannot delete specialty. Doctors are using it.', 400);
    }

    const result = await pool.query(
      `DELETE FROM specialties
       WHERE specialty_id = $1`,
      [id]
    );

    if (!result.rowCount) {
      return error(res, 'Specialty not found', 404);
    }

    return success(res, {}, 'Specialty deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
};
