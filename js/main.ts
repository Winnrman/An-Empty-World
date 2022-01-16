import * as achievements from "./achievements.js";
import * as settings from "./settings.js";
import * as activities from "./activities.js";
import * as combat from "./combat.js";
import * as crafting from "./crafting.js";
import * as experience from "./experience.js";
import * as inventory from "./inventory.js";
import * as equipment from "./equipment.js";
import * as messages from "./messages.js";
import player, { saveData, resetData, renderGold, startSaveInterval } from "./player.js";
import * as store from "./store.js";
import * as questing from "./questing.js";
import runTests from "./tests.js";

window.player = player;
window.store = store;
window.activities = activities;
window.combat = combat;
window.crafting = crafting;
window.questing = questing;
window.saveData = saveData;
window.runTests = runTests;

window.resetData = function () {
    resetData()
    saveData();
    window.location.reload();
};

function startIntervals() {
    achievements.startCheckInterval();
    settings.startDarkmodeInterval();
    messages.startClearInterval();
    questing.startStaminaInterval();
    startSaveInterval();
}

export function checkAndRenderEverything() {
    
    experience.checkLevelUnlocks();
    equipment.loadOptionsFromOwnedEquipment();

    experience.renderLevel();
    store.renderInventoryUpgrade();
    crafting.renderCraftables();
    questing.renderStamina();
    inventory.renderInventory();
    renderGold();
}

startIntervals();
checkAndRenderEverything();