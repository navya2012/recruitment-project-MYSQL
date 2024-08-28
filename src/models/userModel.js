const pool = require('../db/connection');
const bcrypt = require('bcrypt');

const createUserModel = async (role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp) => {
  try {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const query = `
      INSERT INTO userDetails 
      (role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp)
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [role, email, hashedPassword, mobileNumber, companyName, companyType, JSON.stringify(address), firstName, lastName, otp]);

    return { id: result.insertId, role, email, password: hashedPassword, mobileNumber, companyName, companyType, address, firstName, lastName, otp };
  } catch (err) {
    throw err;
  }
};

const checkEmailExist = async (email) => {
  try {
    const query = "SELECT * FROM userDetails WHERE email = ?";
    const [result] = await pool.query(query, [email]);

    if (result.length > 0) {
      // Get the first matching row
      const user = result[0];

      // Remove fields with null values
      const filteredUser = Object.fromEntries(
        Object.entries(user).filter(([_, value]) => value !== null)
      );

      return filteredUser;
    }

    return null;
  } catch (err) {
    throw err;
  }
};

// checking email in db
const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userDetails WHERE email = ?', [email]);
    return rows[0];
  } catch (err) {
    throw err;
  }
};

//update verify otp
const updateUserVerification = async (email) => {
  try {
    await pool.query('UPDATE userDetails SET isVerified = true, otp = NULL WHERE email = ?', [email]);
  } catch (err) {
    throw err;
  }
};

//otp for reset password
const otpForPasswordReset = async (email, otp) => {

  try {
    await pool.query('UPDATE userDetails SET otp = ?, isVerified= false WHERE email = ?', [otp, email]);
  } catch (err) {
    throw err;
  }
};

//reset password
const updateUserPassword = async (email, hashedPassword) => {
  try {
    await pool.query('UPDATE userDetails SET password = ? WHERE email = ?', [hashedPassword, email]);
  } catch (err) {
    throw err;
  }
};

//checking password match
const checkPasswordMatch = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    throw err;
  }
};


module.exports = {
  createUserModel,
  checkEmailExist,
  findUserByEmail,
  updateUserVerification,
  otpForPasswordReset,
  updateUserPassword,
  checkPasswordMatch
};
