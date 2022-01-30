import * as dom from "../util/dom";
import { achievements, checkAchievements, resetAchievementsToCheck } from "../control/achievements";
import * as activities from "../activities/activities";
import * as crafting from "../activities/crafting";
import * as experience from "../control/experience";
import * as equipment from "../control/equipment";
import { itemsByName } from "../data/items";
import * as main from "../main";
import player, { pauseSaving, saveData, resetData, getDefaultData, restoreData, resumeSaving, Player } from "../control/player";
import * as store from "../activities/store";
import { EquipmentName } from "../data/items/equipment";
import { ToolName } from "../data/items/tools";
import { ResourceName } from "../data/items/resources";
import * as inventory from "../control/inventory";

let data = getDefaultData();

export default function runTests(keepTestDataAfterwards?: boolean) {
    pauseSaving();
    saveData();
    resetData();
    resetAchievementsToCheck();
    equipment.updateArmour();
    
    try {
        runScenario();
        console.log("Tests OK!")
    } finally {
        if (!keepTestDataAfterwards) {
            restoreData();
            resumeSaving();
            main.checkAndRenderEverything();
        }
    }
}

function runScenario() {
    data = getDefaultData();
    data.inventory_dictionary["Axe"] = 0;
    data.inventory_dictionary["Wood"] = 0;
    data.inventory_dictionary["Wooden Harpoon"] = 0;
    data.inventory_dictionary["Fish"] = 0;
    runWoodcuttingScenario()
    runFishingScenario();
    runCraftingScenario();
    runEquipmentScenario();
}

function runWoodcuttingScenario() {
    sell("Wood");
    nothingHappened("To make sure we don't run into problems when we sell something we don't have");
    verify();

    collectBranches(4 * 5);
    didCollectBranches(4);
    verify();

    collectStones(10 * 5);
    didCollectStones(10);
    verify();

    craft("Axe");
    craftedTool("Axe");
    verify();

    craft("Pickaxe");
    craftedTool("Pickaxe");
    verify();

    cutLogs(10);
    didCutLogs(10);
    verify();
    
    cutLogs(1);
    didCutLogs(1);
    levelled(2);
    verify();
    
    cutLogs(8);
    didCutLogs(8);
    verify();
    
    cutLogs(1);
    didCutLogs(1);
    toolBroke("Axe");
    verify();
    
    cutLogs(1);
    nothingHappened("No Axe");
    verify();

    craft("Axe");
    nothingHappened("No stone");
    verify();

    drop("Wood", 1);
    droppedItem("Wood", 1);

    collectStones(5 * 5);
    didCollectStones(5);
    verify();

    craft("Axe");
    craftedTool("Axe");
    verify();

    cutLogs(1);
    didCutLogs(1);
    gotAchievement("cut_down_trees", 1);
    verify();

    cutLogs(5);
    didCutLogs(5);
    verify();

    cutLogs(1);
    nothingHappened("Inventory full");
    verify();

    drop("Wood", 8);
    droppedItem("Wood", 8);
}

function runFishingScenario() {
    craft("Wooden Harpoon");
    craftedTool("Wooden Harpoon");
    verify();

    catchFish(10);
    caughtFish(10);
    toolBroke("Wooden Harpoon");
    verify();
    
    catchFish(1);
    nothingHappened("No harpoon");
    verify();
    
    craft("Wooden Harpoon");
    craftedTool("Wooden Harpoon");
    verify();
    
    catchFish(8);
    caughtFish(7); // Inventory full
    verify();

    drop("Fish", 17);
    droppedItem("Fish", 17);
    verify();
    
    catchFish(3);
    caughtFish(3);
    toolBroke("Wooden Harpoon");
    verify();
    
    craft("Wooden Harpoon");
    craftedTool("Wooden Harpoon");
    verify();
    
    catchFish(5);
    caughtFish(5);
    gotAchievement("catch_fish", 1);
    verify();

    drop("Fish", 8);
    droppedItem("Fish", 8);
    verify();
}

function runCraftingScenario() {
    cutLogs(5);
    didCutLogs(5);
    levelled(3);
    verify(); 

    cutLogs(9);
    didCutLogs(9);
    toolBroke("Axe");
    verify(); 

    mineStones(5);
    didMineStones(5);
    verify();

    craft("Axe");
    craftedTool("Axe");
    verify();

    craft("Wooden Helmet");
    craftedEquipment("Wooden Helmet");
    verify();
    
    craft("Wooden Chestplate");
    craftedEquipment("Wooden Chestplate");
    verify();
    
    craft("Wooden Leggings");
    nothingHappened("Not enough wood");

    cutLogs(6);
    didCutLogs(6);
    gotAchievement("cut_down_trees", 2);
    verify();
    
    cutLogs(14);
    didCutLogs(14);
    toolBroke("Axe");
    verify();

    craft("Wooden Leggings");
    craftedEquipment("Wooden Leggings");
    verify();
    
    craft("Wooden Boots");
    craftedEquipment("Wooden Boots");
    verify();
    
    craft("Wooden Sword");
    craftedEquipment("Wooden Sword");
    verify();
}

function runEquipmentScenario() {
    equip("Wooden Helmet");
    equippedItem("Wooden Helmet");
    verify();

    equip("Wooden Chestplate");
    equippedItem("Wooden Chestplate");
    verify();

    equip("Wooden Leggings");
    equippedItem("Wooden Leggings");
    verify();

    equip("Wooden Boots");
    equippedItem("Wooden Boots");
    gotAchievement("wooden_armor", 1);
    verify();

    equip("Wooden Sword");
    equippedItem("Wooden Sword");
    verify();
}

function buyAxe() {
    store.buyTool("Axe");
}

function collectBranches(amount: number) {
    times(amount, activities.collectBranches);
}

function collectStones(amount: number) {
    times(amount, activities.collectStones);
}

function mineStones(amount: number) {
    times(amount, activities.goStoneMining);
}

function cutLogs(amount: number) {
    times(amount, activities.tree);
}

function catchFish(amount: number) {
    times(amount, activities.goFishing);
}

function sell(itemName: store.SellType) {
    store.sell(itemName);
}

function drop(itemName: inventory.InventoryItemName, amount: number) {
    inventory.removeFromInventory(itemName, amount);
}

function craft(itemName: crafting.CraftableName) {
    crafting.selectItemToCraft(itemName)
    crafting.doCrafting();
}

function equip(itemName: EquipmentName) {
    equipment.equip(itemName);
}

function boughtItem(itemName: ToolName) {
    data.gold -= itemsByName[itemName].price;
    data.inventory_dictionary[itemName] = 1;
}

function didCutLogs(amount: number) {
    data.inventory_dictionary["Wood"] ||= 0;
    data.inventory_dictionary["Wood"] += amount;
    data.toolHealth["Axe"] -= amount;
    data.xp += itemsByName["Wood"].treeCutting.xp * amount;
}

function didCollectBranches(amount: number) {
    data.inventory_dictionary["Wood"] ||= 0;
    data.inventory_dictionary["Wood"] += amount;
    data.xp += itemsByName["Wood"].treeCutting.xp * amount;
}

function didCollectStones(amount: number) {
    data.inventory_dictionary["Stone"] ||= 0;
    data.inventory_dictionary["Stone"] += amount;
    data.xp += itemsByName["Stone"].mining.xp * amount;
}

function didMineStones(amount: number) {
    data.inventory_dictionary["Stone"] ||= 0;
    data.inventory_dictionary["Stone"] += amount;
    data.xp += itemsByName["Stone"].mining.xp * amount;
}

function toolBroke(itemName: ToolName) {
    data.inventory_dictionary[itemName] = 0;
}

function levelled(level: number) {
    data.level = level;
    data.xp = 0;
}

function soldItem(itemName: ResourceName, amount: number) {
    data.gold += amount * itemsByName[itemName].price;
    data.inventory_dictionary[itemName] = amount === 0 ? 0 : data.inventory_dictionary[itemName] - amount;
}

function droppedItem(itemName: ResourceName, amount: number) {
    data.inventory_dictionary[itemName] = amount === 0 ? 0 : data.inventory_dictionary[itemName] - amount;
}

function caughtFish(amount: number) {
    data.inventory_dictionary["Fish"] ||= 0;
    data.inventory_dictionary["Fish"] += amount;
    data.toolHealth["Wooden Harpoon"] -= amount;
    data.xp += itemsByName["Fish"].fishing.xp * amount;
}

function gotAchievement(id: string, amount: number) {
    data.completedAchievements[id] = amount;
}

function craftedTool(itemName: ToolName) {
    data.inventory_dictionary[itemName] = 1;
    const craftable = itemsByName[itemName];
    data.toolHealth[itemName] = craftable.health;
    for (var key in craftable.crafting.ingredients) {
        data.inventory_dictionary[key] -= craftable.crafting.ingredients[key];
    }
}

function craftedEquipment(itemName: EquipmentName) {
    data.ownedEquipment.push(itemName);
    const craftable = itemsByName[itemName];
    for (var key in craftable.crafting.ingredients) {
        data.inventory_dictionary[key] -= craftable.crafting.ingredients[key];
    }
}

function equippedItem(itemName: EquipmentName) {
    const item = itemsByName[itemName];
    if (data.equipment[item.equipment.slot]) {
        const oldItem = itemsByName[data.equipment[item.equipment.slot]];
        player.playerDefense -= oldItem.armor || 0;
        player.playerAttack -= oldItem.attack || 0;
    }

    data.equipment[item.equipment.slot] = itemName;
    player.playerDefense += item.armor || 0;
    player.playerAttack += item.attack || 0;
}

function nothingHappened(reason: string) {

}

function verify() {
    checkAchievements();
    experience.checkLevelUnlocks();

    const errors = Array<string>();
    verifyProperty(errors, "gold");
    verifyProperty(errors, "level");
    verifyProperty(errors, "xp");

    verifyInventory(errors, "Wood");
    verifyInventory(errors, "Fish");
    verifyInventory(errors, "Axe");
    verifyInventory(errors, "Wooden Harpoon");

    verifyToolHealth(errors, "Axe");
    verifyToolHealth(errors, "Wooden Harpoon");

    verifyArray(errors, "ownedEquipment");
    verifyObject(errors, "equipment");
    verifyObject(errors, "completedAchievements");

    if (errors.length > 0) {
        throw errors.join(",");
    }
}

const verifyProperty = (errors: string[], property: keyof Player) => expectAreEqual(errors, player[property], data[property], property);
const verifyInventory = (errors: string[], item: inventory.InventoryItemName) => expectAreEqual(errors, inventory.getInventoryCount(item), data.inventory_dictionary[item], `inventory ${item}`);
const verifyToolHealth = (errors: string[], item: ToolName) => expectAreEqual(errors, player.toolHealth[item], data.toolHealth[item], `toolHealth ${item}`);
const verifyArray = (errors: string[], property: keyof Player) => expectArraysAreEqual(errors, player[property] as any[], data[property] as any[], property);
const verifyObject = (errors: string[], property: keyof Player) => expectObjectsAreEqual(errors, player[property], data[property], property);

function expectAreEqual(errors: string[], actual: any, expected: any, info: string) {
    if (actual !== expected)
        errors.push(`${info} is ${actual} but expected ${expected}`);
}

function expectArraysAreEqual(errors: string[], actual: any[], expected: any[], info: string) {
    expectAreEqual(errors, actual.length, expected.length,`${info}.length`);
    for (let i = 0; i < actual.length; i++) {
        expectAreEqual(errors, actual[i], expected[i], `${info}[${i}]`);
    }
}

function expectObjectsAreEqual(errors: string[], actual: any, expected: any, info: string) {
    for (let key in actual) {
        expectAreEqual(errors, actual[key], expected[key], `${info}[${key}]`);
    }
    for (let key in expected) {
        expectAreEqual(errors, actual[key], expected[key], `${info}[${key}]`);
    }
}

function times(amount: number, action: (i?: number) => void) {
    for (let i = 0; i < amount; i++)
        action(i);
}