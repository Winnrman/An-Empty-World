import * as achievements from "./achievements";
import * as settings from "./settings";
import * as activities from "./activities";
import * as combat from "./combat";
import * as crafting from "./crafting";
import * as experience from "./experience";
import * as inventory from "./inventory";
import * as equipment from "./equipment";
import * as messages from "./messages";
import player, { saveData, resetData, renderGold, startSaveInterval } from "./player";
import * as store from "./store";
import * as questing from "./questing";
import runTests from "./tests";

import "../css/style.css";
import "../css/achievements.css";
import "../css/combat.css";
import "../css/dark.css";
import "../css/footer.css";
import "../css/messages.css";
import "../css/progress.css";
import "../css/progress-bar.css";
import "../css/store.css";

declare global {
    interface Window {
        player: any;
        store: any;
        activities: any;
        combat: any;
        crafting: any;
        questing: any;
        saveData: () => void;
        resetData: () => void;
        runTests: (x: boolean) => void;
    }
}
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