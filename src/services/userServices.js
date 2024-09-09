
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateOtp, sendOtpForPasswordReset, sendOtpEmail } = require('../utilities/generateOtp');


const createUserService = async (role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp) => {
    try {
        const isEmailExists = await userModel.checkEmailExist(email);
        if (isEmailExists) {
           return { message:"Email already registered"};
        }

        const newUser = await userModel.createUserModel(role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp);

        return newUser;
    } catch (err) {
        return err.message;
    }
};


const verifyOtpService = async (email, otp) => {
    try {
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return { status: 400, message: "Email not found!" };
        }

        if (user.otp === otp) {
            await userModel.updateUserVerification(email);

            return { status: 200, message: "OTP verified successfully!" };
        } else {
            return { status: 400, message: "Invalid OTP!" };
        }
    } catch (error) {
        return error.message;
    }
};

//resend otp
const resendOtpService = async (email) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return {  message: "Email not found!" };
        }

        const resentOtp = generateOtp();

        const result = await userModel.generateOtpModel(email, resentOtp);

        await sendOtpEmail(email, resentOtp);

        return { message: "OTP has been resent to your email." };
    } catch (error) {
        return error.message;
    }
};


const loginUserService = async (email, password) => {
    try {
        const user = await userModel.checkEmailExist(email);
        if (!user) {
          return { message: "Invalid email ."}
        }

        if (!user.isVerified) {
            return { message:"Email not verified. Please verify your email before logging in." }
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return { message: "Incorrect password."}
        }

        return {
            success: true,
            message: "Successfully Logged In",
            user
        };
    } catch (error) {
        return error.message;
    }
};


const sendResetPasswordOtpService = async (email) => {
    try {
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return { status: 400, message: "Email not found!" };
        }

        const otp = await generateOtp();

        await userModel.generateOtpModel(email, otp);

        await sendOtpForPasswordReset(email, otp);

        return { status: 200, message: "OTP sent to email for password reset." };
    } catch (error) {
        return error.message;
    }
};

//update password
const updatePasswordService = async (email, newPassword) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return {  message: "Email not found!" };
        }

        if (!user.isVerified) {
            return { message: "Email not verified. Please verify your email before resetting the password." };
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        await userModel.updateUserPassword(email, hashPassword);

        return { message: "Password updated successfully!" };
    } catch (error) {
        return error.message;
    }
};


const resetPasswordService = async (email, oldPassword, newPassword) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return { message: "Email not found!" };
        }

        if (!user.isVerified) {
            return {  message: "Email not verified. Please verify your email before resetting the password." };
        }

        const match = await userModel.checkPasswordMatch(oldPassword, user.password);
        if (!match) {
            return {  message: "Old password is incorrect!" };
        }

        if (oldPassword === newPassword) {
            return { message: "New password cannot be the same as the old password!" };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.updateUserPassword(email, hashedPassword);

        return { status: 200, message: "Password updated successfully!" };
    } catch (error) {
        return error.message;
    }
};



module.exports = {
    createUserService,
    verifyOtpService,
    loginUserService,
    sendResetPasswordOtpService,
    updatePasswordService,
    resetPasswordService,
    resendOtpService
};
