const pool = require('../db/connection');

const findWorkingExperienceByEmployeeId = async (employee_id) => {
    const [rows] = await pool.query('SELECT * FROM working_experience WHERE employee_id = ?', [employee_id]);
    return rows[0];
};

const createWorkingExperience = async (data) => {
    const [result] = await pool.query('INSERT INTO working_experience SET ?', [data]);

    if (result.insertId) {
        // Fetch and return the newly created record
        const [newRecord] = await pool.query('SELECT * FROM working_experience WHERE id = ?', [result.insertId]);
        return newRecord[0];
    }
    return null;
};

const updateWorkingExperience = async (employee_id, data) => {
    const [result] = await pool.query('UPDATE working_experience SET ? WHERE employee_id = ?', [data, employee_id]);

    if (result.affectedRows > 0) {
        // Fetch and return the updated record
        const [updatedRecord] = await pool.query('SELECT * FROM working_experience WHERE employee_id = ?', [employee_id]);
        return updatedRecord[0];
    }
    return null;
};


module.exports = {
    findWorkingExperienceByEmployeeId,
    createWorkingExperience,
    updateWorkingExperience,
};
