const pool = require('../db/connection');



const checkEmployeeIdExperienceData = async (employee_id) => {
    const [rows] = await pool.query('SELECT * FROM working_experience WHERE employee_id = ?', [employee_id]);
    return rows[0];
};

const createWorkingExperience = async (data) => {
    try {
        const [result] = await pool.query('INSERT INTO working_experience SET ?', [data]);
        return {
            message: "Working experience created successfully",
            id: result.insertId, ...data
        };

    }
    catch (err) {
        throw err.message;
    }
};

const updateWorkingExperience = async (employee_id, data) => {
    try {

        const [result] = await pool.query('UPDATE working_experience SET ? WHERE employee_id = ?', [data, employee_id]);

        if (result.affectedRows > 0) {
            return { message: "Working experience updated successfully" };
        }
    } catch (err) {
        throw err.message;
    }
}


module.exports = {
    createWorkingExperience,
    updateWorkingExperience,
    checkEmployeeIdExperienceData
};
