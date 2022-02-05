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
import "../css/dark.css";
import "../css/footer.css";
import "../css/layout.css";
import "../css/progress.css";
import "../css/progress-bar.css";

declare global {
    interface Window {
        player: Player;
        activities: typeof activities.actions;
        combat: typeof combat.actions;
        crafting: typeof crafting.actions;
        equipment: typeof equipment.actions;
        gathering: typeof gathering.actions;
        inventory: typeof inventory.actions;
        store: typeof store.actions;
        settings: typeof settings;
        questing: typeof questing.actions;
        saveData: (reason: string) => void;
        resetData: () => void;
        runTests: (keepDataAfterwards?: boolean, levelUp?: boolean) => void;
    }
}

window.player = player;
window.activities = activities.actions;
window.combat = combat.actions;
window.crafting = crafting.actions;
window.equipment = equipment.actions;
window.gathering = gathering.actions;
window.inventory = inventory.actions;
window.store = store.actions;
window.settings = settings;
window.questing = questing.actions;
window.saveData = saveData;
window.runTests = runTests;

window.resetData = function () {
    resetData()
    saveData("Reset");
    window.location.reload();
};

function startIntervals() {
    settings.startDarkmodeInterval();
    messages.startClearInterval();
    questing.startStaminaInterval();
    resumeSaving();
}

export function checkAndRenderEverything() {
    experience.checkLevelUnlocks();
    activities.showCurrentActivity();
    equipment.updateArmour();
    effects.registerEffectExpiries();
    settings.loadTheme();
    achievements.checkAchievements();

    experience.renderLevel();
    equipment.renderEquipment();
    equipment.renderEquipmentChooser();
    equipment.renderSelectedEquipment();
    crafting.renderCraftables();
    questing.renderStamina();
    inventory.renderInventory();
    void gathering.resumeGatheringActivity();
}

startIntervals();
checkAndRenderEverything();

if (player.dev?.runTestsOnLoad)
    setTimeout(() => {
        void window.runTests(player.dev?.keepTestData);
    }, 50);