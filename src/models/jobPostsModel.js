const pool = require('../db/connection');

//create job posts
const createJobPostsModel = async (jobPostFields) => {
    try {
        const {
            companyName, role, technologies, experience, location, graduation, languages, noticePeriod, employer_id
        } = jobPostFields;

        const query = `
            INSERT INTO job_posts (
                companyName, role, technologies, experience, location, graduation, languages, noticePeriod, employer_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [companyName, role, technologies, experience, location, graduation, languages, noticePeriod, employer_id]);

        return {
            message: 'job posts created',
            id: result.insertId,
            ...jobPostFields
        };
    } catch (err) {
        return err.message;
    }
};

//checking employer id
const getJobPostsByEmployerIdModel = async (employer_id) => {
    try {
        const query = `SELECT * FROM job_posts WHERE employer_id = ?`;
        const [results] = await pool.query(query, [employer_id]);
        return results;
    } catch (err) {
        return err.message;
    }
};

// Get a job post by ID
const getJobPostByIdModel = async (job_id) => {
    try {
        const query = `SELECT * FROM job_posts WHERE id = ?`;
        const [results] = await pool.query(query, [job_id]);
        return results[0];
    } catch (err) {
        return err.message;
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

        if (result.affectedRows > 0) {
            return { message: "job posts updated successfully" };
        };
    } catch (err) {
        return err.message;
    }
};

// Delete a job post by ID
const deleteJobPostModel = async (job_id, employer_id) => {
    try {
        const query = `DELETE FROM job_posts WHERE id = ? AND employer_id = ?`;

        const [result] = await pool.query(query, [job_id, employer_id]);

        if (result.affectedRows > 0) {
            return { message: "job posts deleted successfully" };
        }
    } catch (err) {
        return err.message;
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
                hasApplied,
                employee_id,
                email AS employee_email,
                mobileNumber AS employee_mobileNumber,
                firstName AS employee_firstName,
                lastName AS employee_lastName, 
                jobAppliedDate AS employee_job_applied_date
            FROM 
                job_posts_applied 
            WHERE 
                hasApplied = true AND employer_id = ?`;

        const [results] = await pool.query(query, [employer_id]);
        return results;
    } catch (err) {
        return err.message;
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
        return err.message;
    }
}

// Check if the employee has already applied for the job
const getJobPostsAppliedModel = async (jobId, employeeId) => {
    try {
        const query = `SELECT * FROM job_posts_applied WHERE jobId = ? AND employee_id = ?`;
        const [rows] = await pool.query(query, [jobId, employeeId]);
        return rows[0];
    }
    catch (err) {
        return err.message
    }
};

//job applied posts by employee
const newJobPostsAppliedModel = async (applicationData) => {
    try {
        const query = `INSERT INTO job_posts_applied 
                   (jobId, employer_id, companyName, role, hasApplied, employee_id, email, mobileNumber, firstName, lastName, jobAppliedDate)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const { jobId, employer_id, companyName, role, hasApplied, employee_id, email, mobileNumber, firstName, lastName, jobAppliedDate } = applicationData;

        const [result] = await pool.query(query, [jobId, employer_id, companyName, role, hasApplied, employee_id, email, mobileNumber, firstName, lastName, jobAppliedDate]);

        return {
            message: 'Successfully applied for the job',
            id: result.insertId,
            ...applicationData
        };
    }
    catch (err) {
        return err.message
    }
};

module.exports = {
    getJobPostsAppliedModel,
    newJobPostsAppliedModel,
    createJobPostsModel,
    getJobPostsByEmployerIdModel,
    updateJobPostModel,
    deleteJobPostModel,
    getJobPostByIdModel,
    getAllJobPostsModel,
    getJobAppliedPostsModel
};
