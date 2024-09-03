
const jobPostsModel = require('../models/jobPostsModel');
const { checkEmployerIdExists, checkEmployeeIdExists } = require('../models/userModel');

//create job posts
const createJobPostsService = async (employer_id, updateFields) => {
    try {
        const employerExists = await checkEmployerIdExists(employer_id);
        if (!employerExists) {
            return { message: "Employer ID not found" };
        }

        const newJobPosts = await jobPostsModel.createJobPostsModel({ ...updateFields, employer_id });
        return { message: 'job posts created', newJobPosts };
    } catch (err) {
        throw err.message;
    }
};

//get job posts by employer 
const getJobPostsByEmployerIdService = async (employer_id) => {
    try {
        const employerExists = await checkEmployerIdExists(employer_id);
        if (!employerExists) {
            return { message: "Employer ID not found" };
        }

        const jobPosts = await jobPostsModel.getJobPostsByEmployerIdModel(employer_id);
        if (jobPosts.length > 0) {
            return jobPosts
        } else {
            return { message: 'No job posts found for this employer.' }
        }
    } catch (err) {
        throw err.message;
    }
};

// Update Job Post by ID
const updateJobPostService = async (job_id, employer_id, updateFields) => {

    try {
        const employerExists = await checkEmployerIdExists(employer_id);
        if (!employerExists) {
            return { message: "Employer ID not found" };
        }

        const jobPost = await jobPostsModel.getJobPostByIdModel(job_id);
        if (!jobPost) {
            return { message: "job post ID not found" };
        }

        if (jobPost.employer_id !== employer_id) {
            throw new Error('Unauthorized: You cannot update this job post.');
        }

        const result = await jobPostsModel.updateJobPostModel(job_id, updateFields);
        return result;
    } catch (err) {
        throw err;
    }
};


// Delete Job Post by ID
const deleteJobPostService = async (job_id, employer_id) => {

    try {
        const employerExists = await checkEmployerIdExists(employer_id);
        if (!employerExists) {
            return { message: "Employer ID not found" };
        }

        const jobPost = await jobPostsModel.getJobPostByIdModel(job_id);
        if (!jobPost) {
            return { message: "job post ID not found" };
        }

        if (jobPost.employer_id !== employer_id) {
            throw new Error('Unauthorized: You cannot delete this job post.');
        }

        const result = await jobPostsModel.deleteJobPostModel(job_id, employer_id);
        return result;
    } catch (err) {
        throw err.message;
    }
};

//get job applied posts by employees - employer
const getJobAppliedPostsService = async (employer_id) => {
    try {
        const employerExists = await checkEmployerIdExists(employer_id);
        if (!employerExists) {
            return { message: "Employer ID not found" };
        }

        const jobPosts = await jobPostsModel.getJobAppliedPostsModel(employer_id);

        if (jobPosts.length === 0) {
            throw new Error('No job posts found for this employer');
        }

        return jobPosts;
    } catch (err) {
        throw new Error(`Error fetching job posts: ${err.message}`);
    }
};

//employee
// all job posts
const getAllJobPostsService = async () => {
    try {
        return await jobPostsModel.getAllJobPostsModel();
    } catch (err) {
        throw err.message;
    }
};

// Update job post application status by employee
const updateJobAppliedStatusService = async (jobId, employeeDetails) => {
    try {
        const employeeExists = await checkEmployeeIdExists(employeeDetails.id);

        if (!employeeExists) {
            return { message: "Employee ID not found" };
        }

        const result = await jobPostsModel.updateJobAppliedStatusModel(jobId, employeeDetails);

        return result;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createJobPostsService,
    getJobPostsByEmployerIdService,
    updateJobPostService,
    deleteJobPostService,
    getAllJobPostsService,
    updateJobAppliedStatusService,
    getJobAppliedPostsService
};
