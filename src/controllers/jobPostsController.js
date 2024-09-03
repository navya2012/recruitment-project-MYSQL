
const jobPostsService = require('../services/jobPostsServices');

//create job posts
const createJobPostsController = async (req, res) => {
    const { companyName, role, technologies, experience, location, graduation, languages, noticePeriod } = req.body
    const employer_id = req.user.id;

    try {
        const fieldsUpdate = { companyName, role, technologies, experience, location, graduation, languages, noticePeriod };
        const newJobPostsData = await jobPostsService.createJobPostsService(employer_id, fieldsUpdate);

        res.status(200).json(newJobPostsData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//get job posts by employer
const getJobPostsController = async (req, res) => {
    const employer_id = req.user.id;

    try {
        const jobPosts = await jobPostsService.getJobPostsByEmployerIdService(employer_id);
        res.status(200).json(jobPosts);
    } catch (err) {
        res.status(500).json(err.message);
    }
};



// Update Job Post by ID -employer
const updateJobPostController = async (req, res) => {
    const job_id = req.params.id;
    const employer_id = req.user.id;
    const { companyName, role, technologies, experience, location, graduation, languages, noticePeriod } = req.body;

    try {
        if (!job_id) {
            return res.status(404).json({ error: 'Job Post ID is not found' });
        }

        const updateFields = { companyName, role, technologies, experience, location, graduation, languages, noticePeriod };
        const result = await jobPostsService.updateJobPostService(job_id, employer_id, updateFields);

        res.status(200).json(result);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Job Post by ID -employer
const deleteJobPostController = async (req, res) => {
    const job_id = req.params.id;
    const employer_id = req.user.id;

    try {
        const result = await jobPostsService.deleteJobPostService(job_id, employer_id);

        res.status(200).json(result);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


//get job applied posts by employees - employer
const getJobAppliedPostsController = async (req, res) => {
    const employer_id = req.user.id;

    try {
        const jobPosts = await jobPostsService.getJobAppliedPostsService(employer_id);

        res.status(200).json(jobPosts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//employee
// Get all job posts by employees
const getJobPostsControllerByEmployee = async (req, res) => {
    try {
        const jobPosts = await jobPostsService.getAllJobPostsService();

        res.status(200).json(jobPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Job Post Application Status
const updateJobAppliedStatusController = async (req, res) => {
    const jobId = req.params.id;
    const employeeDetails = req.user;

    try {
        if (!jobId) {
            return res.status(404).json({ error: 'Job Post ID is not provided' });
        }

        const result = await jobPostsService.updateJobAppliedStatusService(jobId, employeeDetails);

        if (result.affectedRows > 0) {
            res.status(200).json({
                message: 'Applied for this Job',
                jobId,
                status: 'Applied',
                employeeDetails: {
                    employee_id: employeeDetails.id,
                    email: employeeDetails.email,
                    mobileNumber: employeeDetails.mobileNumber,
                    firstName: employeeDetails.firstName,
                    lastName: employeeDetails.lastName,
                    jobAppliedDate: new Date()
                }
            });
        } else {
            res.status(404).json({ error: 'Job post not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createJobPostsController,
    getJobPostsController,
    updateJobPostController,
    deleteJobPostController,
    updateJobAppliedStatusController,
    getJobPostsControllerByEmployee,
    getJobAppliedPostsController
};
