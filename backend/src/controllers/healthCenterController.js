const pool = require('../config/db');
const { success, error } = require('../utils/response');

// GET all health centers
async function getHealthCenters(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM health_centers
       ORDER BY name ASC`
    );

    return success(res, { health_centers: rows });
  } catch (err) {
    next(err);
  }
}

// CREATE
async function createHealthCenter(req, res, next) {
  try {
    const { name, address, phone, email } = req.body;

    if (!name) {
      return error(res, 'Health center name required', 400);
    }

    const { rows } = await pool.query(
      `INSERT INTO health_centers (name, address, phone, email)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [name, address || null, phone || null, email || null]
    );

    return success(res, { health_center: rows[0] }, 'Health center created', 201);
  } catch (err) {
    next(err);
  }
}

// UPDATE
async function updateHealthCenter(req, res, next) {
  try {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;

    const { rows } = await pool.query(
      `UPDATE health_centers
       SET name=$1,
           address=$2,
           phone=$3,
           email=$4
       WHERE health_center_id=$5
       RETURNING *`,
      [name, address, phone, email, id]
    );

    if (!rows.length) {
      return error(res, 'Health center not found', 404);
    }

    return success(res, { health_center: rows[0] }, 'Health center updated');
  } catch (err) {
    next(err);
  }
}

// DELETE
async function deleteHealthCenter(req, res, next) {
  try {
    const { id } = req.params;

    const check = await pool.query(
      `SELECT doctor_id FROM doctor_profiles
       WHERE health_center_id = $1
       LIMIT 1`,
      [id]
    );

    if (check.rows.length) {
      return error(res, 'Cannot delete. Doctors are assigned to this health center.', 400);
    }

    const result = await pool.query(
      `DELETE FROM health_centers
       WHERE health_center_id=$1`,
      [id]
    );

    if (!result.rowCount) {
      return error(res, 'Health center not found', 404);
    }

    return success(res, {}, 'Health center deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHealthCenters,
  createHealthCenter,
  updateHealthCenter,
  deleteHealthCenter
};