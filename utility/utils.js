class utils {
    static farmCalculateLevel(currentLevel, currentExperience, levelUps = 0) {
        const experienceNeeded = this.farmCalculateExperienceNeeded(currentLevel, currentExperience);

        if (experienceNeeded < 0) {
            return this.farmCalculateLevel(currentLevel + 1, currentExperience, levelUps + 1);
        }

        return levelUps;
    }

    static farmCalculateExperienceNeeded(currentLevel, currentExperience) {
        return parseInt((currentLevel * 100 + Math.pow(currentLevel - 1, 2) * 100) - currentExperience);
    }
}

module.exports = utils;