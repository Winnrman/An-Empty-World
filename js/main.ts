import * as achievements from "./control/achievements";
import * as settings from "./control/settings";
import * as activities from "./activities/activities";
import * as combat from "./activities/combat";
import * as crafting from "./activities/crafting";
import * as effects from "./control/effects";
import * as experience from "./control/experience";
import * as gathering from "./activities/gathering";
import * as inventory from "./control/inventory";
import * as equipment from "./control/equipment";
import * as messages from "./control/messages";
import player, { saveData, resetData, resumeSaving, Player } from "./control/player";
import * as store from "./activities/store";
import * as questing from "./activities/questing";
import runTests from "./tests";

import "../css/style.css";
import "../css/achievements.css";
import "../css/combat.css";
import "../css/dark.css";
import "../css/footer.css";
import "../css/layout.css";
import "../css/messages.css";
import "../css/progress.css";
import "../css/progress-bar.css";
import "../css/store.css";

declare global {
    interface Window {
        player: Player;
        store: typeof store;
        activities: typeof activities;
        combat: typeof combat;
        crafting: typeof crafting;
        equipment: typeof equipment;
        gathering: typeof gathering;
        inventory: typeof inventory;
        settings: typeof settings;
        questing: typeof questing;
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
window.equipment = equipment;
window.gathering = gathering;
window.inventory = inventory;
window.settings = settings;
window.questing = questing;
window.saveData = saveData;
window.runTests = runTests;
console.log("runTests is set");

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
    resumeSaving();
}

export function checkAndRenderEverything() {
    experience.checkLevelUnlocks();
    equipment.updateArmour();
    effects.registerEffectExpiries();
    activities.showCurrentActivity();
    settings.loadTheme();

    experience.renderLevel();
    equipment.renderEquipment();
    equipment.renderEquipmentChooser();
    equipment.renderSelectedEquipment();
    crafting.renderCraftables();
    questing.renderStamina();
    inventory.renderInventory();
    combat.renderPreCombatInfo();
    gathering.resumeGatheringActivity();
}

startIntervals();
checkAndRenderEverything();