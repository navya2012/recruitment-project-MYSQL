const userService = require("../services/userServices");
const { check, validationResult } = require('express-validator');
const { generateOtp, sendOtpEmail } = require("../utilities/generateOtp");
const createToken = require("../utilities/token");

const signupValidation = [
    check('email').optional().trim()
        .customSanitizer(value => value.toLowerCase())
        .isEmail().withMessage('Invalid email address'),
    check('mobileNumber').optional().isNumeric()
        .isLength({ min: 10, max: 10 })
        .withMessage('Invalid Number! Number must contain only 10 digits'),
    check('password').optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
];


// Validation reset password
const passwordValidation = [
    check('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('New password must contain a lowercase letter')
];

const userSignupDetails = async (req, res) => {
    const { role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName } = req.body;

    try {
        const error = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const otp = await generateOtp();

        const signUpDetails = await userService.createUserService(role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp);

        await sendOtpEmail(email, otp);

        const token = createToken({ id: signUpDetails.id, role: signUpDetails.role, email: signUpDetails.email });

        res.status(200).json({
            message: 'Signup successful, OTP sent to email.',
            signUpDetails: {
                id: signUpDetails.id,
                role: signUpDetails.role,
                email: signUpDetails.email
            },
            token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//profile image
const userProfileImageUpload = async (req, res) => {
    const { id, role, email } = req.userDetails;  
    const filePath = req.file.path;  
    
    try {
        const result = await userService.uploadOrUpdateProfileImageService(id,role,email, filePath);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

//verify otp
const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    const { email } = req.userDetails;

    try {
        const result = await userService.verifyOtpService(email, otp);

        res.status(result.status).json({ message: result.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//resend otp
const resendOtp = async (req, res) => {
    const { email } = req.userDetails;

    try {
        const result = await userService.resendOtpService(email);
        res.status(200).json({ message: result.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//login
const userLoginDetails = async (req, res) => {
    const { email, password } = req.body;
    try {
        const loginDetails = await userService.loginUserService(email, password)

        if (!loginDetails.success) {
            return res.status(400).json({ message: loginDetails.message });
        }

        const token = createToken({ id: loginDetails.user.id, role: loginDetails.user.role, email: loginDetails.user.email });

        res.status(200).json({
            loginDetails,
            token
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const response = await userService.sendResetPasswordOtpService(email);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//update password
const updatePassword = async (req, res) => {
    const {  newPassword } = req.body;
    const { email } = req.userDetails;
    try {
        const errors = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const response = await userService.updatePasswordService(email, newPassword);

        res.status(response.status).json({ message: response.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Reset password controller
const resetPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.userDetails;

    try {
        const errors = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const response = await userService.resetPasswordService(email, oldPassword, newPassword);

        res.status(200).json({ message: response.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signupValidation,
    userSignupDetails,
    verifyOtp,
    userLoginDetails,
    forgotPassword,
    resetPassword,
    passwordValidation,
    resendOtp,
    updatePassword,
    userProfileImageUpload
};
