import * as achievements from "./control/achievements";
import * as settings from "./control/settings";
import * as activities from "./activities/activities";
import * as combat from "./activities/combat";
import * as crafting from "./activities/crafting";
import * as effects from "./control/effects";
import * as experience from "./control/experience";
import * as inventory from "./control/inventory";
import * as equipment from "./control/equipment";
import * as messages from "./control/messages";
import player, { saveData, resetData, renderGold, startSaveInterval, Player } from "./control/player";
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

 import StoneAxeIcon from "../img/assets/tools/stone_axe.png";
 import FishIcon from "../img/assets/materials/fish.png";
 import MeatIcon from "../img/assets/materials/meat.png";
 const images = [StoneAxeIcon, FishIcon, MeatIcon];

declare global {
    interface Window {
        player: Player;
        store: typeof store;
        activities: typeof activities;
        combat: typeof combat;
        crafting: typeof crafting;
        inventory: typeof inventory;
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
window.inventory = inventory;
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
    effects.registerEffectExpiries();

    experience.renderLevel();
    store.renderInventoryUpgrade();
    crafting.renderCraftables();
    questing.renderStamina();
    inventory.renderInventory();
    combat.renderPreCombatInfo();
    renderGold();
}

startIntervals();
checkAndRenderEverything();