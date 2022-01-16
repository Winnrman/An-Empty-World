import * as achievements from "./control/achievements";
import * as settings from "./control/settings";
import * as activities from "./activities/activities";
import * as combat from "./activities/combat";
import * as crafting from "./activities/crafting";
import * as experience from "./control/experience";
import * as inventory from "./control/inventory";
import * as equipment from "./control/equipment";
import * as messages from "./control/messages";
import player, { saveData, resetData, renderGold, startSaveInterval } from "./control/player";
import * as store from "./activities/store";
import * as questing from "./activities/questing";
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