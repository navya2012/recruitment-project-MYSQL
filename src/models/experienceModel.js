
const pool = require('../db/connection');

//check employee id exists in experience data
const checkEmployeeIdExperienceData = async (employee_id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM working_experience WHERE employee_id = ?', [employee_id]);

        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        return  err.message
    }
};

// new working exp
const createWorkingExperience = async (data) => {
    try {
        const [result] = await pool.query('INSERT INTO working_experience SET ?', [data]);
        return {
            message: "Working experience created successfully",
            id: result.insertId, ...data
        };
        
    }
    catch (err) {
        return err.message;
    }
};

//update working exp
const updateWorkingExperience = async (employee_id, data) => {
    try {
        const [result] = await pool.query(
            `UPDATE working_experience
             SET technologies = ?, experience = ?, location = ?, graduation = ?, languages = ?, noticePeriod = ?
             WHERE employee_id = ?`,
            [
                data.technologies,
                data.experience,
                data.location,
                data.graduation,
                data.languages,
                data.noticePeriod,
                employee_id
            ]
        );

        if (result.affectedRows > 0) {
            return { message: "Working experience updated successfully" };
        }
    } catch (err) {
        return err.message;
    }
}


module.exports = {
    createWorkingExperience,
    updateWorkingExperience,
    checkEmployeeIdExperienceData
};
