const pool = require('../db/connection');

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

  return result.affectedRows > 0;
};


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
    updateFields.address ? JSON.stringify(updateFields.address) : null,
    updateFields.employeesCount || null,
    updateFields.headQuarters || null,
    id
  ]);

  return result.affectedRows > 0;
};


module.exports = {
  updateEmployeeDetails,
  updateEmployerDetails
};
