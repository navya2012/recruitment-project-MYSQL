const workingExperienceModel = require('../models/experienceModel');
const { checkEmployeeIdExists } = require('../models/userModel');

const updateOrCreateWorkingExperience = async (employee_id, updateFields) => {
    try {
        const employeeExists = await checkEmployeeIdExists(employee_id);
        if (!employeeExists) {
            return { message: "Employee ID  not found" };
        }
 
        let workingExperienceData = await workingExperienceModel.checkEmployeeIdExperienceData(employee_id);

        if (workingExperienceData) {
            const updateResult = await workingExperienceModel.updateWorkingExperience(employee_id, updateFields);

            workingExperienceData = { ...updateResult };
        } else {
            const createResult = await workingExperienceModel.createWorkingExperience({ ...updateFields, employee_id });
            workingExperienceData = createResult;
        }

        return workingExperienceData;
    } catch (err) {
        return { error: err.message };
    }
};


module.exports = {
    updateOrCreateWorkingExperience
};
