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

const wrapAction = (action: ((...args: any[]) => Promise<void>)) => {
    return async (...args: any[]) => {
        try {
            await action(...args);
            saveData();
        } catch(e) {
            messages.addMessage(e);
        }
    }
}

const activitiesActions = {
    showActivity: wrapAction(activities.showActivity),
}

const combatActions = {
    selectEnemy: wrapAction(combat.selectEnemy),
    startCombat: wrapAction(combat.startCombat),
    doFlee: wrapAction(combat.doFlee),
}

const craftingActions = {
    selectItemToCraft: wrapAction(crafting.selectItemToCraft),
    doCrafting: wrapAction(crafting.doCrafting),
    stopCrafting: wrapAction(crafting.stopCrafting),
}

const equipmentActions = {
    showEquipmentChooser: wrapAction(equipment.showEquipmentChooser),
    selectEquipment: wrapAction(equipment.selectEquipment),
    equip: wrapAction(equipment.equip),
    unequipSlot: wrapAction(equipment.unequipSlot),
}

const gatheringActions = {
    showGatheringCategory: wrapAction(gathering.showGatheringCategory),
    showGatheringActivity: wrapAction(gathering.showGatheringActivity),
    toggleItem: wrapAction(gathering.toggleItem),
    startGatheringActivity: wrapAction(gathering.startGatheringActivity),
    clearGatheringActivity: wrapAction(gathering.clearGatheringActivity),
}

const inventoryActions = {
    showItemDetails: wrapAction(inventory.showItemDetails),
    removeFromInventory: wrapAction(inventory.removeFromInventory),
    removeAllFromInventory: wrapAction(inventory.removeAllFromInventory),
    drinkPotion: wrapAction(inventory.drinkPotion),
}

const storeActions = {
    buyTool: wrapAction(store.buyTool),
    buyInventoryUpgrade: wrapAction(store.buyInventoryUpgrade),
    buySpecialDeal: wrapAction(store.buySpecialDeal),
    sell: wrapAction(store.sell),
}

const questingActions = {
    doQuest: wrapAction(questing.doQuest),
}


declare global {
    interface Window {
        player: Player;
        activities: typeof activitiesActions;
        combat: typeof combatActions;
        crafting: typeof craftingActions;
        equipment: typeof equipmentActions;
        gathering: typeof gatheringActions;
        inventory: typeof inventoryActions;
        store: typeof storeActions;
        settings: typeof settings;
        questing: typeof questingActions;
        saveData: () => void;
        resetData: () => void;
        runTests: (x: boolean) => void;
    }
}
window.player = player;
window.activities = activitiesActions;
window.combat = combatActions;
window.crafting = craftingActions;
window.equipment = equipmentActions;
window.gathering = gatheringActions;
window.inventory = inventoryActions;
window.store = storeActions;
window.settings = settings;
window.questing = questingActions;
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