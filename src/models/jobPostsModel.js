const pool = require('../db/connection');

//create job posts
const createJobPostsModel = async (jobPostFields) => {
    try {
        const {
            companyName, role, technologies, experience, location, graduation, languages, noticePeriod, employer_id
        } = jobPostFields;

        const query = `
            INSERT INTO job_posts (
                companyName, role, technologies, experience, location, graduation, languages, noticePeriod, employer_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [companyName, role, technologies, experience, location, graduation, languages, noticePeriod, employer_id, 'Denied']);
        
        return { id: result.insertId, ...jobPostFields };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

//checking employer id
const getJobPostsByEmployerIdModel = async (employer_id) => {
    try {
        const query = `SELECT * FROM job_posts WHERE employer_id = ?`;
        const [results] = await pool.query(query, [employer_id]);
        return results;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Get a job post by ID
const getJobPostByIdModel = async (job_id) => {
    try {
        const query = `SELECT * FROM job_posts WHERE id = ?`;
        const [results] = await pool.query(query, [job_id]);
        return results[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

//job posts update employer
const updateJobPostModel = async (job_id, updateFields) => {
    try {
        const {
            companyName, role, technologies, experience, location, graduation, languages, noticePeriod
        } = updateFields;

        const query = `
            UPDATE job_posts
            SET companyName = ?, role = ?, technologies = ?, experience = ?, location = ?, graduation = ?, languages = ?, noticePeriod = ?
            WHERE id = ?
        `;
        
        const [result] = await pool.query(query, [companyName, role, technologies, experience, location, graduation, languages, noticePeriod, job_id]);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// Delete a job post by ID
const deleteJobPostModel = async (job_id, employer_id) => {
    try {
        const query = `DELETE FROM job_posts WHERE id = ? AND employer_id = ?`;
        const [result] = await pool.query(query, [job_id, employer_id]);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

//applied job posts by employees lists - employer
const getJobAppliedPostsModel = async (employer_id) => {

    try {
        const query = `SELECT 
                id AS jobId,
                employer_id,
                companyName,
                role,
                status,
                 employee_id,
            employee_email,
            employee_mobileNumber,
            employee_firstName,
            employee_lastName, 
            employee_job_applied_date
        FROM 
        job_posts 
        WHERE 
       status = 'Applied' AND employer_id = ? `;

       const [results] = await pool.query(query, [employer_id]);
       return results;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

//employee
//all job posts
const getAllJobPostsModel = async () => {
    try {
        const query = `SELECT * FROM job_posts`;
        const [results] = await pool.query(query);
        return results;
    } catch (err) {
        throw err;
    }
}

// Update job post application status - applied by employee
const updateJobAppliedStatusModel = async (jobId, employeeDetails) => {

    try {
        const {
            id: employee_id,
            email: employee_email,
            mobileNumber: employee_mobileNumber,
            firstName: employee_firstName,
            lastName: employee_lastName
        } = employeeDetails;

        const query = `
            UPDATE job_posts
            SET status = 'Applied',
                employee_id = ?, 
                employee_email = ?, 
                employee_mobileNumber = ?, 
                employee_firstName = ?, 
                employee_lastName = ?, 
                employee_job_applied_date = ?
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [
            employee_id,
            employee_email,
            employee_mobileNumber,
            employee_firstName,
            employee_lastName,
            new Date(),
            jobId
        ]);

        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
};



module.exports = {
    createJobPostsModel,
    getJobPostsByEmployerIdModel,
    updateJobPostModel,
    deleteJobPostModel,
    getJobPostByIdModel,
    getAllJobPostsModel,
    updateJobAppliedStatusModel,
    getJobAppliedPostsModel
};
