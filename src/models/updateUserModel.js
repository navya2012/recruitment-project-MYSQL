const pool = require('../db/connection');

const checkUserIdAndRoleExist = async (userId, role) => {
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
    throw error.message;
  }
};



// Update Employee Details
const updateEmployeeDetails = async (id, updateFields) => {
  const query = `
    UPDATE userDetails 
    SET 
      firstName = COALESCE(?, firstName), 
      lastName = COALESCE(?, lastName), 
      mobileNumber = COALESCE(?, mobileNumber), 
      position = COALESCE(?, position), 
      currentCompany = COALESCE(?, currentCompany), 
      location = COALESCE(?, location)
    WHERE id = ?
  `;
  const [result] = await pool.query(query, [
    updateFields.firstName || null,
    updateFields.lastName || null,
    updateFields.mobileNumber || null,
    updateFields.position || null,
    updateFields.currentCompany || null,
    updateFields.location || null,
    id
  ]);

  if (result.affectedRows > 0) {
    return { message: "user details updated successfully" };
  };
}

// Update Employer Details
const updateEmployerDetails = async (id, updateFields) => {


  const query = `
    UPDATE userDetails 
    SET 
      companyName = COALESCE(?, companyName), 
      mobileNumber = COALESCE(?, mobileNumber), 
      companyType = COALESCE(?, companyType), 
      address = COALESCE(?, address), 
      employeesCount = COALESCE(?, employeesCount), 
      headQuarters = COALESCE(?, headQuarters)
    WHERE id = ?
  `;
  const [result] = await pool.query(query, [
    updateFields.companyName || null,
    updateFields.mobileNumber || null,
    updateFields.companyType || null,
    updateFields.address || null,
    updateFields.employeesCount || null,
    updateFields.headQuarters || null,
    id
  ]);

  if (result.affectedRows > 0) {
    return { message: "user details updated successfully" };
  }

};


module.exports = {
  updateEmployeeDetails,
  updateEmployerDetails,
  checkUserIdAndRoleExist
};
