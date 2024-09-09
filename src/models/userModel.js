const pool = require('../db/connection');
const bcrypt = require('bcrypt');

const checkUserIdExist = async (userId, role) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM userDetails WHERE id = ? AND role = ?',
      [userId, role]
    );

    if (rows.length === 0) {
      return null;
    }
    return rows[0];

  } catch (error) {
    return error;
  }
}

const checkEmployeeIdExists = async (employee_id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userDetails WHERE id = ?', [employee_id]);
    if (rows.length === 0) {
      return { message :"Employee ID not found" } 
    }
    return rows[0]; 
  } catch (error) {
    return error 
  }
};


const checkEmployerIdExists = async (employer_id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userDetails WHERE id = ?', [employer_id]);
    if (rows.length === 0) {
      return { message :"Employer ID not found" } 
    }
    return rows[0]; 
  } catch (error) {
    return error.message 
  }
};

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

    const [result] = await pool.query(query, [role, email, hashedPassword, mobileNumber, companyName, companyType, address, firstName, lastName, otp]);

    return { id: result.insertId, role, email, password: hashedPassword, mobileNumber, companyName, companyType, address, firstName, lastName, otp };
  } catch (err) {
    return err;
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
    return err;
  }
};

// checking email in db
const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userDetails WHERE email = ?', [email]);
    return rows[0];
  } catch (err) {
    return err;
  }
};

//update verify otp
const updateUserVerification = async (email) => {
  try {
    await pool.query('UPDATE userDetails SET isVerified = true, otp = NULL WHERE email = ?', [email]);
  } catch (err) {
    return err;
  }
};

//otp for reset password
const generateOtpModel = async (email, otp) => {
  try {
    const result = await pool.query('UPDATE userDetails SET otp = ?, isVerified = false WHERE email = ?', [otp, email]);
    return result

  } catch (err) {
    return err;
  }
};


//reset password
const updateUserPassword = async (email, hashedPassword) => {
  try {
    await pool.query('UPDATE userDetails SET password = ? WHERE email = ?', [hashedPassword, email]);
  } catch (err) {
    return err;
  }
};

//checking password match
const checkPasswordMatch = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    return err;
  }
};



module.exports = {
  createUserModel,
  checkEmailExist,
  findUserByEmail,
  updateUserVerification,
  generateOtpModel,
  updateUserPassword,
  checkPasswordMatch,
  checkUserIdExist,
  checkEmployeeIdExists,
  checkEmployerIdExists
};
