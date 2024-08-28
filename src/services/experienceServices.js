const workingExperienceModel = require('../models/experienceModel');

const updateOrCreateWorkingExperience = async (employee_id, updateFields) => {
    try {
        let workingExperienceData = await workingExperienceModel.findWorkingExperienceByEmployeeId(employee_id);

        if (workingExperienceData) {
            workingExperienceData = await workingExperienceModel.updateWorkingExperience(employee_id, updateFields);
            if (!workingExperienceData) {
                throw new Error("Working experience update failed");
            }
        } else {
            workingExperienceData = await workingExperienceModel.createWorkingExperience({ ...updateFields, employee_id });
            if (!workingExperienceData) {
                throw new Error("Working experience creation failed");
            }
        }

        return workingExperienceData;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    updateOrCreateWorkingExperience
};
