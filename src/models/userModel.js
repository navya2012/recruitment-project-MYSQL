const pool = require('../db/connection');
const bcrypt = require('bcrypt');

//check user details with id, role return data
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
    return error.message;
  }
}

//check user details with id, role, email return data
const checkUserDetailsExist = async (userId, role, email) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM userDetails WHERE id = ? AND role = ? AND email = ?',
      [userId, role, email]
    );

    if (rows.length === 0) {
      return null;
    }
    return rows[0];

  } catch (error) {
    return error.message;
  }
};

//check employee is exists
const checkEmployeeIdExists = async (employee_id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userDetails WHERE id = ?', [employee_id]);
    if (rows.length === 0) {
      return { message: "Employee ID not found" }
    }
    return rows[0];
  } catch (error) {
    return error.message
  }
};

//check employer is exists
const checkEmployerIdExists = async (employer_id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userDetails WHERE id = ?', [employer_id]);
    if (rows.length === 0) {
      return { message: "Employer ID not found" }
    }
    return rows[0];
  } catch (error) {
    return error.message
  }
};

//profile image
const upsertProfileImage = async (userId, role, email, profileImageUrl) => {
  try {
    const query = `
          INSERT INTO profile_images (user_Id, role, email, profileImage)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE profileImage = VALUES(profileImage), role = VALUES(role), email = VALUES(email)
      `;
    const [result] = await pool.query(query, [userId, role, email, profileImageUrl]);
    return {
      message: 'Profile image uploaded successfully',
      userId: userId,
      role: role,
      email: email,
      profileImageUrl: profileImageUrl
    };
  } catch (error) {
    return error.message;
  }
};

//create new user
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
    return err.message;
  }
};

//check email exists 
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
    return err.message;
  }
};

// checking email in db and return data
const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userDetails WHERE email = ?', [email]);
    return rows[0];
  } catch (err) {
    return err.message;
  }
};

//update  otp in user details after otp success
const updateUserVerification = async (email) => {
  try {
    await pool.query('UPDATE userDetails SET isVerified = true, otp = NULL WHERE email = ?', [email]);
  } catch (err) {
    return err.message;
  }
};

//otp for reset password
const generateOtpModel = async (email, otp) => {
  try {
    const result = await pool.query('UPDATE userDetails SET otp = ?, isVerified = false WHERE email = ?', [otp, email]);
    return result

  } catch (err) {
    return err.message;
  }
};


//reset password 
const updateUserPassword = async (email, hashedPassword) => {
  try {
    await pool.query('UPDATE userDetails SET password = ? WHERE email = ?', [hashedPassword, email]);
  } catch (err) {
    return err.message;
  }
};

//checking password match
const checkPasswordMatch = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    return err.message;
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
  checkEmployerIdExists,
  checkUserDetailsExist,
  upsertProfileImage
};
