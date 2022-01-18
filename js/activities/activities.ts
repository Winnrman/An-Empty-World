import player, { addStatistic } from "../control/player";
import { addMessage } from "../control/messages";
import { addXp } from "../control/experience";
import { itemsByName } from "../data/items";
import { getRandomItem } from "../util";
import { addToInventory, decreaseToolHealth, hasInInventory, InventoryItem, isInventoryFull, removeFromInventory } from "../control/inventory";
import resources from "../data/items/resources";
import * as dom from "../util/dom";

export function tree() {
    if (!hasInInventory("Axe")) {
        addMessage("You need an axe to cut down trees!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addToInventory("Wood", 1);
    addStatistic("cutWood", 1);
    addXp(itemsByName["Wood"].treeCutting.xp);

    decreaseToolHealth("Axe");
}

export function goFishing() {
    if (!hasInInventory("Fishing Pole")) {
        addMessage("You need a fishing pole to fish!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addToInventory("Fish", 1);
    addStatistic("caughtFish", 1);
    addXp(itemsByName["Fish"].fishing.xp);
    
    decreaseToolHealth("Fishing Pole");
}

export function goHunting() {
    if (!hasInInventory("Hunting Rifle")) {
        addMessage("You need a hunting rifle to hunt!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addToInventory("Meat", 1);
    addStatistic("huntedMeat", 1);
    addXp(itemsByName["Meat"].hunting.xp);
    
    decreaseToolHealth("Hunting Rifle");
}

const ores = resources.filter(x => x.mining);

function mineOre(ore: InventoryItem) {
    if (!hasInInventory("Pickaxe")) {
        addMessage("You need a pickaxe to mine!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addMessage(`You mined some ${ore.name}!`);
    addToInventory(ore.name, 1);
    addStatistic("minedRocks", 1);
    addXp(ore.mining.xp);
    
    decreaseToolHealth("Pickaxe");
}

export function goMining() {
    mineOre(getRandomItem(ores));
}

export function goIronMining() {
    mineOre(ores.find(x => x.name === "Iron"));
}

export type Activity = "Crafting" | "Fighting" | "Store";

export function goCrafting() {
    showActivity("Crafting");
}

export function goFighting() {
    showActivity("Fighting");
}

export function goToStore() {
    showActivity("Store");
}

function showActivity(activity: Activity) {
    player.currentActivity = activity;
    showCurrentActivity();
}

export function showCurrentActivity() {
    dom.setIsDisplayed("craftingContainer", player.currentActivity === "Crafting");
    dom.setIsDisplayed("combatContainer", player.currentActivity === "Fighting");
    dom.setIsDisplayed("storeContainer", player.currentActivity === "Store");
}