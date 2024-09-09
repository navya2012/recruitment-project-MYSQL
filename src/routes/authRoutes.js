
const express = require("express")
const router = express.Router()


const { userSignupDetails, signupValidation, verifyOtp, userLoginDetails, forgotPassword, passwordValidation, resetPassword, updatePassword, resendOtp } = require("../controllers/userController")
const { authUserMiddleware } = require("../middlewares/UserMiddleware")


router.post('/signup', signupValidation , userSignupDetails)
router.post('/verify-otp', authUserMiddleware, verifyOtp)
router.post('/resend-otp', authUserMiddleware, resendOtp)
router.post('/login', userLoginDetails)
router.post('/forgot-password',  forgotPassword)
router.post('/update-password', authUserMiddleware, passwordValidation, updatePassword)
router.post('/change-password', authUserMiddleware, passwordValidation, resetPassword)


module.exports = router
