import player, { addStatistic, saveData } from "../control/player";
import { addMessage } from "../control/messages";
import { addXp, levelUnlocks } from "../control/experience";
import { itemsByName } from "../data/items";
import { getRandomItem } from "../util";
import { addToInventory, decreaseToolHealth, hasInInventory, InventoryItem, isInventoryFull, removeFromInventory } from "../control/inventory";
import resources, { ResourceName } from "../data/items/resources";
import * as dom from "../util/dom";
import { ToolName } from "../data/items/tools";

import iconWood from "../../img/assets/materials/Wood.png";
import iconStone from "../../img/assets/materials/Stone.png";
import iconPickaxe from "../../img/assets/tools/Pickaxe.png";
import iconFish from "../../img/assets/materials/Fish.png";
import iconMeat from "../../img/assets/materials/Meat.png";
import iconIron from "../../img/assets/materials/Iron.png";
import iconCoins from "../../img/assets/materials/Coins.png";
import iconSword from "../../img/assets/equipment/Iron/Iron Sword.png";
import iconAmulet from "../../img/assets/equipment/Amulet of Luck.png";
import iconSpyGlass from "../../img/assets/tools/Spyglass.png";

function getTool(toolNames: ToolName[], action: string) {
    const tool = toolNames.filter(x => hasInInventory(x))[0];
    if (tool)
        return tool;

    addMessage(`You need one of these items to ${action}: ${toolNames.join(' ')}!`);
    return undefined;
}

function hasNoSpace() {
    if (!isInventoryFull())
        return false;

    addMessage("Your inventory is full. You can't carry any more items.");
    return true;
}

export function collectBranches() {
    if (hasNoSpace())
        return;
    
    addToInventory("Wood", 1 / 5);
    addStatistic("cutWood", 1 / 5);
    addXp(itemsByName["Wood"].treeCutting.xp / 5);
    saveData();
}

export function collectStones() {
    if (hasNoSpace())
        return;
    
    addToInventory("Stone", 1 / 5);
    addXp(itemsByName["Stone"].mining.xp / 5);
    saveData();
}

export function tree() {
    const tool = getTool(["Axe"], "cut down trees");
    if (!tool || hasNoSpace())
        return;


    addToInventory("Wood", 1);
    addStatistic("cutWood", 1);
    addXp(itemsByName["Wood"].treeCutting.xp);

    decreaseToolHealth(tool);
    saveData();
}

export function goFishing() {
    const tool = getTool(["Wooden Harpoon", "Fishing Pole"], "fish");
    if (!tool || hasNoSpace())
        return;

    addToInventory("Fish", 1);
    addStatistic("caughtFish", 1);
    addXp(itemsByName["Fish"].fishing.xp);
    
    decreaseToolHealth(tool);
    saveData();
}

export function goHunting() {
    const tool = getTool(["Stone Spear", "Hunting Rifle"], "hunt");
    if (!tool || hasNoSpace())
        return;

    addToInventory("Meat", 1);
    addStatistic("huntedMeat", 1);
    addXp(itemsByName["Meat"].hunting.xp);
    
    decreaseToolHealth(tool);
    saveData();
}

const ores = resources.filter(x => x.mining);

function mineOre(ore: InventoryItem) {
    const tool = getTool(["Pickaxe"], "mine");
    if (!tool || hasNoSpace())
        return;

    addMessage(`You mined some ${ore.name}!`);
    addToInventory(ore.name, 1);
    addStatistic("minedRocks", 1);
    addXp(ore.mining.xp);
    
    decreaseToolHealth(tool);
    saveData();
}

export function goMining() {
    mineOre(getRandomItem(ores));
}

export function goIronMining() {
    mineOre(ores.find(x => x.name === "Iron"));
}

export function goStoneMining() {
    mineOre(ores.find(x => x.name === "Stone"));
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
    renderActivities();
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

    if (hasInInventory("Axe"))
        html += renderButton(levelUnlocks.treeCutting,      "activities.tree()",            "Cut Down Tree",    iconWood);
    else
        html += renderButton(levelUnlocks.branchCollecting, "activities.collectBranches()", "Collect Branches", iconWood);
    
    if (hasInInventory("Pickaxe"))
        html += renderButton(levelUnlocks.stoneMining,      "activities.goStoneMining()",   "Go Stone Mining",  iconStone);
    else
        html += renderButton(levelUnlocks.stoneCollecting,  "activities.collectStones()",   "Collect Stones",   iconStone);
    
    html += renderButton(levelUnlocks.fishing,              "activities.goFishing()",       "Go Fishing",       iconFish);
    html += renderButton(levelUnlocks.hunting,              "activities.goHunting()",       "Go Hunting",       iconMeat);
    html += renderButton(levelUnlocks.ironMining,           "activities.goIronMining()",    "Go Iron Mining",   iconIron);
    html += renderButton(levelUnlocks.mining,               "activities.goMining()",        "Go Mining",        iconPickaxe);
    html += renderButton(levelUnlocks.questing,             "questing.doQuest()",           "Go Questing",      iconSpyGlass);
    
    if (player.currentActivity != "Crafting")
        html += renderButton(levelUnlocks.crafting,         "activities.goCrafting()",      "Go Crafting",      iconAmulet);
        
    if (player.currentActivity != "Fighting")
        html += renderButton(levelUnlocks.fighting,         "activities.goFighting()",      "Go Fighting",      iconSword);
        
    if (player.currentActivity != "Store")
        html += renderButton(levelUnlocks.store,            "activities.goToStore()",       "Go to Store",      iconCoins);

    dom.setHtml('activities', html);
}