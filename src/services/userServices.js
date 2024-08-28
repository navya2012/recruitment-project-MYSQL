
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateOtp, sendOtpForPasswordReset } = require('../utilities/generateOtp');


const createUserService = async (role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp) => {
    try {
        const isEmailExists = await userModel.checkEmailExist(email);
        if (isEmailExists) {
            throw new Error("Email already registered");
        }

        const newUser = await userModel.createUserModel(role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp);
        return newUser;
    } catch (err) {
        throw err;
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
        throw error;
    }
};


const loginUserService = async (email, password) => {
    try {
        const user = await userModel.checkEmailExist(email);
        if (!user) {
            throw new Error("Invalid email .");
        }

        if (!user.isVerified) {
            throw new Error("Email not verified. Please verify your email before logging in.");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Incorrect password.");
        }

        return user;
    } catch (error) {
        throw error;
    }
};


const sendResetPasswordOtpService = async (email) => {
    try {
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return { status: 400, message: "Email not found!" };
        }

        const otp = await generateOtp();

        await userModel.otpForPasswordReset(email, otp);

        await sendOtpForPasswordReset(email, otp);

        return { status: 200, message: "OTP sent to email for password reset." };
    } catch (error) {
        throw error;
    }
};


const resetPasswordService = async (email, oldPassword, newPassword) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return { status: 400, message: "Email not found!" };
        }

        if (!user.isVerified) {
            return { status: 400, message: "Email not verified. Please verify your email before resetting the password." };
        }

        const match = await userModel.checkPasswordMatch(oldPassword, user.password);
        if (!match) {
            return { status: 400, message: "Old password is incorrect!" };
        }

        if (oldPassword === newPassword) {
            return { status: 400, message: "New password cannot be the same as the old password!" };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.updateUserPassword(email, hashedPassword);

        return { status: 200, message: "Password reset successfully!" };
    } catch (error) {
        throw error;
    }
};



module.exports = {
    createUserService,
    verifyOtpService,
    loginUserService,
    sendResetPasswordOtpService,
    resetPasswordService
};
