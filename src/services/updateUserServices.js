const updateUserModel = require('../models/updateUserModel');

const updateUserDetailsService = async (role, id, updateFields) => {
  try {
    let updated;
    if (role === 'employee') {
      updated = await updateUserModel.updateEmployeeDetails(id, updateFields);
      if (!updated) {
        throw new Error("Employee User not found");
      }

    } else if (role === 'employer') {
      updated = await updateUserModel.updateEmployerDetails(id, updateFields);
      if (!updated) {
        throw new Error("Employer User not found");
      }

    } else {
      throw new Error('Invalid role');
    }
    return {
      message: 'Updated successfully'
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  updateUserDetailsService
};
