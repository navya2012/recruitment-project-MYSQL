const { validationResult } = require('express-validator');
const updateUserService = require('../services/updateUserServices')

const updateUserDetails = async (req, res) => {
  const { role, id, email } = req.user;
  try {
    const error = validationResult(req).formatWith(({ msg }) => {
      return { msg };
    });
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    let updateFields;
    if (role === 'employee') {
      const { firstName, lastName, mobileNumber, position, currentCompany, location } = req.body;
      updateFields = { firstName, lastName, mobileNumber, position, currentCompany, location };

    } else if (role === 'employer') {
      const { companyName, mobileNumber, companyType, address, employeesCount, headQuarters } = req.body;
      updateFields = { companyName, mobileNumber, companyType, address, employeesCount, headQuarters };

    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await updateUserService.updateUserDetailsService(role, id,email, updateFields);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  updateUserDetails
};
