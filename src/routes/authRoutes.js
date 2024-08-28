
const express = require("express")
const router = express.Router()


const { userSignupDetails, signupValidation, verifyOtp, userLoginDetails, forgotPassword, resetPasswordValidation, resetPassword } = require("../controllers/userController")
const { authUserMiddleware } = require("../middlewares/UserMiddleware")


router.post('/signup', signupValidation , userSignupDetails)
router.post('/verify-otp', authUserMiddleware, verifyOtp)
router.post('/login', userLoginDetails)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', authUserMiddleware, resetPasswordValidation, resetPassword)


module.exports = router