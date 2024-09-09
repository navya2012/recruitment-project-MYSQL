
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
        return newJobPosts;
    } catch (err) {
        return err.message;
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
        return err.message;
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
            return { message:'Unauthorized: You cannot update this job post.'}
        }

        const result = await jobPostsModel.updateJobPostModel(job_id, updateFields);
        return result;
    } catch (err) {
        return err.message;
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
            return { message:'Unauthorized: You cannot delete this job post.'};
        }

        const result = await jobPostsModel.deleteJobPostModel(job_id, employer_id);
        return result;
    } catch (err) {
        return err.message;
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
             return { message:'No job posts found for this employer'};
        }

        return jobPosts;
    } catch (err) {
         return err.message;
    }
};

//employee
// all job posts
const getAllJobPostsService = async () => {
    try {
        return await jobPostsModel.getAllJobPostsModel();
    } catch (err) {
        return err.message;
    }
};

// Update Job Applied Status
const JobPostAppliedStatusService = async (jobId, employeeDetails) => {
    try{
    const jobPost = await jobPostsModel.getJobPostByIdModel(jobId);
    if (!jobPost) {
      return { message : 'Job post not found'};
    }

    const existingApplication = await jobPostsModel.getJobPostsAppliedModel(jobId, employeeDetails.id);
    if (existingApplication) {
        return { message:'You have already applied to this job.'};
    }

    const jobApplicationData = {
        jobId: jobPost.id,
        employer_id: jobPost.employer_id,
        companyName: jobPost.companyName,
        role: jobPost.role,
        hasApplied: true,
        employee_id: employeeDetails.id,
        email: employeeDetails.email,
        mobileNumber: employeeDetails.mobileNumber,
        firstName: employeeDetails.firstName,
        lastName: employeeDetails.lastName,
        jobAppliedDate: new Date()
    };

    const jobApplication = await jobPostsModel.newJobPostsAppliedModel(jobApplicationData);
    return jobApplication;
}
catch(err){
    return err.message
}
};

module.exports = {
    createJobPostsService,
    getJobPostsByEmployerIdService,
    updateJobPostService,
    deleteJobPostService,
    getAllJobPostsService,
    getJobAppliedPostsService,
    JobPostAppliedStatusService
};
