
const express = require("express")
const router = express.Router()

const {  signupValidation } = require("../controllers/userController")
const { roleBasedAuthMiddleware } = require("../middlewares/UserMiddleware")
const { updateUserDetails } = require("../controllers/updateUserController")
const { workingExperienceController } = require("../controllers/experienceController")
const { createJobPostsController, getJobPostsController, deleteJobPostController, updateJobPostController, getJobPostsControllerByEmployee, updateJobAppliedStatusController,  getJobAppliedPostsController, JobPostAppliedStatus, getJobAppliedPostsByEmployer } = require("../controllers/jobPostsController")


//update users
router.patch('/employee/update-details', roleBasedAuthMiddleware('employee'), signupValidation, updateUserDetails )
router.patch('/employer/update-details', roleBasedAuthMiddleware('employer'), signupValidation, updateUserDetails )

//working experience
router.post('/employee/working-experience', roleBasedAuthMiddleware('employee'), workingExperienceController);

//job posts
router.post('/employer/create-recruitment-posts', roleBasedAuthMiddleware('employer'), createJobPostsController);
router.get('/employer/get-recruitment-posts', roleBasedAuthMiddleware('employer'), getJobPostsController )
router.patch('/employer/update-recruitment-posts/:id', roleBasedAuthMiddleware('employer'), updateJobPostController )
router.delete('/employer/delete-recruitment-posts/:id', roleBasedAuthMiddleware('employer'), deleteJobPostController )
router.get('/employer/applied-job-posts', roleBasedAuthMiddleware('employer'), getJobAppliedPostsByEmployer)

router.get('/employee/get-recruitment-posts', getJobPostsControllerByEmployee);
router.post('/employee/update-job-applied-status/:id', roleBasedAuthMiddleware('employee'), JobPostAppliedStatus )

module.exports = router;