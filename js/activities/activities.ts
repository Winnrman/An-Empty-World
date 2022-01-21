import player, { addStatistic, saveData } from "../control/player";
import { addMessage } from "../control/messages";
import { addXp, levelUnlocks } from "../control/experience";
import { itemsByName } from "../data/items";
import { getRandomItem } from "../util";
import { addToInventory, decreaseToolHealth, hasInInventory, InventoryItem, isInventoryFull, removeFromInventory } from "../control/inventory";
import resources from "../data/items/resources";
import * as dom from "../util/dom";

import iconAxe from "../../img/assets/tools/stone_axe.png";
import iconFish from "../../img/assets/materials/Fish.png";
import iconMeat from "../../img/assets/materials/Meat.png";

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
    saveData();
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
    saveData();
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
    saveData();
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
    saveData();
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


export function renderActivities() {
    const renderButton = (requiredLevel: number, action: string, text: string, image?: string) => {
        if (player.level < requiredLevel)
            return "";
        
        const imagePart = image ? `<img src='${image}' />` : "";
        return `<button class="button" onclick="${action}">${imagePart}${text}</button> `;
    }

    let html = "";

    html += renderButton(levelUnlocks.treeCutting, "activities.tree()",         "Cut Down Tree", iconAxe);
    html += renderButton(levelUnlocks.fishing,     "activities.goFishing()",    "Go Fishing",    iconFish);
    html += renderButton(levelUnlocks.hunting,     "activities.goHunting()",    "Go Hunting",    iconMeat);
    html += renderButton(levelUnlocks.mining,      "activities.goMining()",     "Go Mining");
    html += renderButton(levelUnlocks.mining,      "activities.goIronMining()", "Go Iron Mining");
    html += renderButton(levelUnlocks.questing,    "questing.doQuest()",        "Go Questing");        
    html += renderButton(levelUnlocks.crafting,    "activities.goCrafting()",   "Go Crafting");
    html += renderButton(levelUnlocks.fighting,    "activities.goFighting()",   "Go Fighting");
    html += renderButton(levelUnlocks.store,       "activities.goToStore()",    "Go to Store");

    dom.setHtml('activities', html);
}