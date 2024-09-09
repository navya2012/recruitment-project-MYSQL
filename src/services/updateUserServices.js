const updateUserModel = require('../models/updateUserModel');


const updateUserDetailsService = async (role, id,email, updateFields) => {
  try {

    const user = await updateUserModel.checkUserDetailsExist(id, role, email);
    if (!user) {
      return { message: "user Id  not found" };
    }

    let updated;
    if (role === 'employee') {

      updated = await updateUserModel.updateEmployeeDetails(id, updateFields);

      if (!updated) {
       return { message:"Employee User not found"};
      }

    } else if (role === 'employer') {
      
      updated = await updateUserModel.updateEmployerDetails(id, updateFields);

      if (!updated) {
      return { message:"Employer User not found"};
      }

    } else {
      return { message:'Invalid role'}
    }
    return updated

  } catch (err) {
    return err.message;
  }
};

module.exports = {
  updateUserDetailsService
};
