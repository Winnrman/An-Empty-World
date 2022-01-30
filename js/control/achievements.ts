import * as dom from "../util/dom";
import player, { addGold } from "./player";
import { hasEquiped } from "./equipment";
import { addMessage } from './messages';
import { levelUnlocks } from "./experience";
import { EquipmentName } from "../data/items/equipment";
import { displayNumber } from "../util";

const getEquipCount = (type: EquipmentName) => hasEquiped(type) ? 1 : 0;

export const achievements = [
    {
        id: "cut_down_trees",
        name: (progress) => `Cut Down ${progress} Trees`,
        reward: (level, levelValue) => levelValue * 5,
        getProgress: () => player.statistics.cutWood,
        levels: [25, 50, 100, 250, 500, 1000, 2500, 5000],
    },
    {
        id: "earned_gold",
        name: (progress) => `Earned ${progress} Gold`,
        reward: (level, levelValue) => levelValue / 5,
        getProgress: () => player.statistics.earnedGold,
        levels: [500, 1000, 2500, 5000, 10000, 25000, 50000],
    },
    {
        id: "wooden_armor",
        name: () => "Wear full Wooden Armor",
        reward: () => 50,
        getProgress: () => getEquipCount("Wooden Helmet") + getEquipCount("Wooden Chestplate") + getEquipCount("Wooden Leggings") + getEquipCount("Wooden Boots"),
        levels: [4]
    },
    {
        id: "catch_fish",
        name: (progress) => `Caught ${progress} Fish`,
        reward: (level, levelValue) => levelValue * 5,
        getProgress: () => player.statistics.caughtFish,
        levels: [25, 50, 100, 250, 500, 1000, 2500, 5000],
    },
    {
        id: "hunted_meat",
        requirements: { level: levelUnlocks.hunting },
        name: (progress) => `Hunted ${progress} Meat`,
        reward: (level, levelValue) => levelValue * 5,
        getProgress: () => player.statistics.huntedMeat,
        levels: [25, 50, 100, 250, 500, 1000, 2500, 5000],
    },
    {
        id: "killed_enemies",
        name: (progress) => `Killed ${progress} Enemies`,
        reward: (level, levelValue) => levelValue * 50,
        getProgress: () => player.statistics.killedEnemies,
        levels: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
    },
    {
        id: "mined_rock",
        requirements: { level: levelUnlocks.mining },
        name: (progress) => `Mined ${progress} Rocks`,
        reward: (level, levelValue) => levelValue * 5,
        getProgress: () => player.statistics.minedRocks,
        levels: [25, 50, 100, 250, 500, 1000, 2500, 5000],
    },
    {
        id: "iron_armor",
        requirements: { achievements: { "wood_armor": 1 }, level: 5 },
        name: () => "Wear full Iron Armor",
        reward: () => 250,
        getProgress: () => getEquipCount("Iron Helmet") + getEquipCount("Iron Chestplate") + getEquipCount("Iron Leggings") + getEquipCount("Iron Boots"),
        levels: [4]
    },
    {
        id: "completed_quests",
        requirements: { level: levelUnlocks.questing },
        name: (progress) => `Completed ${progress} Quests`,
        reward: (level, levelValue) => levelValue * 50,
        getProgress: () => player.statistics.completedQuests,
        levels: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
    }
];

let achievementsToCheck = getAchievementsToCheck();
function getAchievementsToCheck() {
    return achievements.map(achievement => ({
        ...achievement,
        progress: 0,
        currentLevel: 0,
        currentValue: 0
    }));
}

export function resetAchievementsToCheck() {
    achievementsToCheck = getAchievementsToCheck()
}

function checkRequirements(achievement) {
    const requirements = achievement.requirements;
    if (!requirements)
        return true;

    if (player.level < requirements.level)
        return false;

    if (requirements.achievements) {
        for (let requiredAchievement in requirements.achievements) {
            if (player.completedAchievements[requiredAchievement] < requirements.achievements[requiredAchievement])
                return false;
        }
    }

    return true;
}

function checkAchievement(achievement) {
    const levels = achievement.levels || [0];
    const levelsCompleted = player.completedAchievements[achievement.id] || 0;
    if (levelsCompleted >= levels.length)
        return true;

    if (!checkRequirements(achievement))
        return false;

    for (let level = levelsCompleted; level < levels.length; level++) {
        const levelValue = levels[level];
        const progress = achievement.getProgress(level, levelValue);
        if (progress < levelValue) {
            achievement.progress = progress;
            achievement.currentLevel = level;
            return false;
        }

        addMessage(`You have completed the ${achievement.name(levelValue)} achievement! You feel like you earned a reward, but you don't know what.`);
        player.completedAchievements[achievement.id] = level + 1;
    }

    return (player.completedAchievements[achievement.id] || 0) >= levels.length;
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

    html += `<div class="row">`
    
    html += `<div class="auto-column">`
    html += "<h3>In progress:</h3>";
    if (achievementsInProgress.length > 0) {
        html += "<ul>";
        for (let achievement of achievementsInProgress) {
            const value = achievement.progress - achievement.previousLevelValue;
            const max = achievement.levelValue - achievement.previousLevelValue;
            const width = value / max * 100;
            html += `<li><div class="progress-bar"><span style="width: ${width}%;"></span></div> ${achievement.name}</li>`;
        }
        html += "</ul>";
    } else {
        html += "None!";
    }
    html += "</div>"

    html += `<div class="auto-column">`

    html += "<h3>Completed:</h3>";
    if (completedAchievements.length > 0) {
        html += "<ul>";
        for (let achievement of completedAchievements) {
            html += `<li>${achievement}</li>`;
        }
        html += "</ul>";
    } else {
        html += "None!";
    }
    html += "</div>"

    html += "</div>"
    dom.setHtml("achievements", html);
}

function getAchievementsInProgress() {
    return achievementsToCheck.filter(x => checkRequirements(x) && x.progress > 0).map(achievement => {
        const levelValue = achievement.levels[achievement.currentLevel];
        return {
            name: achievement.name(`${displayNumber(achievement.progress)}/${levelValue}`),
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
        const levelValue = achievement.levels[amountCompleted - 1];
        const hasLevels = achievement.levels?.length > 1;
        completedAchievements.push(`${achievement.name(levelValue)}${hasLevels ? ` <i>(${amountCompleted} / ${achievement.levels.length})</i>` : ''}`);
    }
    return completedAchievements;
}