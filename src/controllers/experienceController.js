
const workingExperienceService = require('../services/experienceServices');

const workingExperienceController = async (req, res) => {
    const { technologies, experience, location, graduation, languages, noticePeriod } = req.body;
    const employee_id = req.user.id;

    try {
        const fieldsUpdate = { technologies, experience, location, graduation, languages, noticePeriod };
        const result = await workingExperienceService.updateOrCreateWorkingExperience(employee_id, fieldsUpdate);

        res.status(200).json({ workingExperience: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    workingExperienceController
};
