const updateUserModel = require('../models/updateUserModel');


const updateUserDetailsService = async (role, id, updateFields) => {
  try {

    const user = await updateUserModel.checkUserIdAndRoleExist(id, role);
    if (!user) {
      return { message: "user Id  not found" };
    }

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
    return updated

  } catch (err) {
    throw err.message;
  }
};

module.exports = {
  updateUserDetailsService
};
