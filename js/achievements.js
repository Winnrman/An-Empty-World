import * as dom from "./dom.js";
import player, { addGold } from "./player.js";
import { hasEquiped } from "./equipment.js";
import { addMessage } from './messages.js';

const achievements = [
    {
        id: "iron_armor",
        name: () => "Iron Armor",
        reward: () => 250,
        getProgress: () => hasEquiped("Iron Helmet") + hasEquiped("Iron Chestplate")  + hasEquiped("Iron Leggings") + hasEquiped("Iron Boots"),
        levels: [4]
    },
    {
        id: "cut_down_trees",
        name: (level, levelValue) => `Cut Down ${levelValue} Trees`,
        reward: (level, levelValue) => levelValue,
        getProgress: () => player.obtainedWood,
        levels: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
    }
];

const achievementsToCheck = achievements.map(achievement => ({
    ...achievement,
    progress: 0,
    currentLevel: 0,
    currentValue: 0
}));

function checkAchievement(achievement) {
    const levels = achievement.levels || [0];
    const levelsCompleted = player.completedAchievements[achievement.id] || 0;
    if (levelsCompleted >= levels.length)
        return true;

    for (let level = levelsCompleted; level < levels.length; level++) {
        const levelValue = levels[level];
        const progress = achievement.getProgress(level, levelValue);
        if (progress < levelValue) {
            achievement.progress = progress;
            achievement.currentLevel = level;
            return false;
        }
        
        addMessage(`You have completed the ${achievement.name(level, levelValue)} achievement!`);
        addGold(achievement.reward(level, levelValue));
        player.completedAchievements[achievement.id] = level + 1;
    }

    return false;
}

export function startCheckInterval() {
    checkAchievements();
    
    const interval = setInterval(function () {
        checkAchievements();

        if (achievementsToCheck.length === 0) {
            clearInterval(interval);
        }
    }, 20000);
}

export function checkAchievements() {
    for (let achievement of achievementsToCheck.slice()) {
        if (checkAchievement(achievement))
            achievementsToCheck.splice(achievementsToCheck.indexOf(achievement), 1);
    }

    renderAchievements();
}

function renderAchievements() {
    const achievementsInProgress = getAchievementsInProgress();
    const completedAchievements = getCompletedAchievements();

    let html = "";

    html += "<h4>In progress:</h4>";
    if (achievementsInProgress.length > 0) {
        html += "<ul>";
        for (let achievement of achievementsInProgress) {
            const value = achievement.progress - achievement.previousLevelValue;
            const max = achievement.levelValue - achievement.previousLevelValue;
            html += `<li><progress value="${value}" max="${max}"></progress> ${achievement.name}: ${achievement.progress} / ${achievement.levelValue}</li>`;
        }
        html += "</ul>";
    } else {
        html += "None!";
    }
    
    html += "<br />"
    
    html += "<h4>Completed:</h4>";
    if (completedAchievements.length > 0) {
        html += "<ul>";
        for (let achievement of completedAchievements) {
            html += `<li>${achievement}</li>`;
        }
        html += "</ul>";
    } else {
        html += "None!";
    }

    dom.setHtml("achievements", html);
}

function getAchievementsInProgress() {
    return achievementsToCheck.map(achievement => {
        const levelValue = achievement.levels[achievement.currentLevel];
        return {
            name: achievement.name(achievement.currentLevel, levelValue),
            progress: achievement.progress,
            levelValue: levelValue,
            previousLevelValue: achievement.levels[achievement.currentLevel - 1] || 0
        }
    });
}

function getCompletedAchievements() {
    const completedAchievements = [];
    for (var achievementId in player.completedAchievements) {
        const amountCompleted = player.completedAchievements[achievementId];
        const achievement = achievements.find(x => x.id == achievementId);
        for (let level = 0; level < amountCompleted; level++) {
            const levelValue = achievement.levels[level];
            completedAchievements.push(achievement.name(level, levelValue))
        }
    }
    return completedAchievements;
}