import * as dom from "../util/dom";
import { achievements, checkAchievements, resetAchievementsToCheck } from "../control/achievements";
import * as activities from "../activities/activities";
import * as crafting from "../activities/crafting";
import * as experience from "../control/experience";
import * as equipment from "../control/equipment";
import { itemsByName } from "../data/items";
import * as main from "../main";
import player, { stopSaveInterval, saveData, resetData, getDefaultData, restoreData, startSaveInterval, Player } from "../control/player";
import * as store from "../activities/store";
import { EquipmentName } from "../data/items/equipment";
import { ToolName } from "../data/items/tools";
import { PotionName } from "../data/items/potions";
import { ResourceName } from "../data/items/resources";
import { getInventoryCount, InventoryItemName } from "../control/inventory";

let data = getDefaultData();

export default function runTests(keepTestDataAfterwards?: boolean) {
    stopSaveInterval();
    saveData();
    resetData();
    resetAchievementsToCheck();
    equipment.loadOptionsFromOwnedEquipment();
    
    try {
        runScenario();
        console.log("Tests OK!")
    } finally {
        if (!keepTestDataAfterwards) {
            restoreData();
            startSaveInterval();
            main.checkAndRenderEverything();
        }
    }
}

function runScenario() {
    data = getDefaultData();
    runWoodcuttingScenario()
    runFishingScenario();
    runCraftingScenario();
    runEquipmentScenario();
}

function runWoodcuttingScenario() {
    buyAxe();
    boughtItem("Axe");
    verify();

    cutLogs(19);
    didCutLogs(19);
    verify();

    cutLogs(1);
    didCutLogs(1);
    toolBroke("Axe");
    levelled(2, 200);
    verify();
    
    cutLogs(1);
    nothingHappened("No Axe");
    verify();
    
    buyAxe();
    boughtItem("Axe");
    verify();

    cutLogs(4);
    didCutLogs(4);
    verify();

    cutLogs(1);
    nothingHappened("Inventory full");
    verify();

    sell("Wood");
    soldItem("Wood", 24);
    verify();

    cutLogs(1);
    didCutLogs(1);
    gotAchievement("cut_down_trees", 1);
    verify();

    sell("Wood");
    soldItem("Wood", 1);
    verify();
}

function runFishingScenario() {
    buyFishingPole();
    boughtItem("Fishing Pole");
    verify();

    catchFish(9);
    caughtFish(9);
    verify();

    catchFish(1);
    caughtFish(1);
    toolBroke("Fishing Pole");
    verify();
    
    catchFish(1);
    nothingHappened("No fishing Pole");
    verify();
    
    buyFishingPole();
    boughtItem("Fishing Pole");
    verify();
    
    catchFish(10);
    caughtFish(10);
    toolBroke("Fishing Pole");
    verify();
    
    buyFishingPole();
    boughtItem("Fishing Pole");
    verify();
    
    catchFish(3);
    caughtFish(3);
    verify();
    
    catchFish(1);
    nothingHappened("Inventory full");
    verify();

    sell("Fish");
    soldItem("Fish", 23);
    gotAchievement("earned_gold", 1);
    verify();
    
    catchFish(2);
    caughtFish(2);
    gotAchievement("catch_fish", 1);
    verify();
}

function runCraftingScenario() {
    cutLogs(15);
    didCutLogs(15);
    toolBroke("Axe");
    verify();
    
    craft("Wooden Helmet");
    craftedItem("Wooden Helmet");
    verify();
    
    craft("Wooden Chestplate");
    craftedItem("Wooden Chestplate");
    verify();
    
    craft("Wooden Leggings");
    nothingHappened("Not enough wood");

    buyAxe();
    boughtItem("Axe");
    verify();

    cutLogs(3);
    didCutLogs(3);
    levelled(3, 300);
    gotAchievement("earned_gold", 2);
    verify();
    
    cutLogs(9);
    didCutLogs(9);
    gotAchievement("cut_down_trees", 2);
    verify();
    
    cutLogs(6);
    didCutLogs(6);
    verify();

    craft("Wooden Leggings");
    craftedItem("Wooden Leggings");
    verify();
    
    craft("Wooden Boots");
    craftedItem("Wooden Boots");
    verify();
    
    craft("Wooden Sword");
    craftedItem("Wooden Sword");
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
    store.buyAxe();
}

function cutLogs(amount: number) {
    times(amount, activities.tree);
}

function buyFishingPole() {
    store.buyFishingPole();
}

function catchFish(amount: number) {
    times(amount, activities.goFishing);
}

function sell(itemName: store.SellType) {
    store.sell(itemName);
}

function craft(itemName: EquipmentName | PotionName) {
    dom.setValue("craftingSelect", itemName);
    crafting.displayCraftingNeededMaterials();
    crafting.doCrafting();
}

function equip(itemName: EquipmentName) {
    const slot = itemsByName[itemName].equipment.slot;
    dom.setValue(`${slot}Select`, itemName);
    dom.getElement(`${slot}Select`).dispatchEvent(new Event('change'));
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

function toolBroke(itemName: ToolName) {
    data.inventory_dictionary[itemName] = 0;
    data.toolHealth[itemName] = itemsByName[itemName].health;
}

function levelled(level: number, expectedGold: number) {
    data.level = level;
    data.xp = 0;
    data.gold += expectedGold;
}

function soldItem(itemName: ResourceName, amount: number) {
    data.gold += amount * itemsByName[itemName].price;
    data.inventory_dictionary[itemName] = 0;
}

function caughtFish(amount: number) {
    data.inventory_dictionary["Fish"] ||= 0;
    data.inventory_dictionary["Fish"] += amount;
    data.toolHealth["Fishing Pole"] -= amount;
    data.xp += itemsByName["Fish"].fishing.xp * amount;
}

function gotAchievement(id: string, amount: number) {
    data.completedAchievements[id] = amount;
    const achievement = achievements.find(x => x.id === id);
    const level = amount - 1;
    const levelValue = achievement.levels[level];
    data.gold += achievement.reward(amount -1, levelValue);
}

function craftedItem(itemName: EquipmentName) {
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

    verifyProperty("gold");
    verifyProperty("level");
    verifyProperty("xp");

    verifyInventory("Wood");
    verifyInventory("Fish");
    verifyInventory("Axe");
    verifyInventory("Fishing Pole");

    verifyToolHealth("Axe");
    verifyToolHealth("Fishing Pole");

    verifyArray("ownedEquipment");
    verifyObject("equipment");
    verifyObject("completedAchievements");
}

const verifyProperty = (property: keyof Player) => expectAreEqual(player[property], data[property], property);
const verifyInventory = (item: InventoryItemName) => expectAreEqual(getInventoryCount(item), data.inventory_dictionary[item], `inventory ${item}`);
const verifyToolHealth = (item: ToolName) => expectAreEqual(player.toolHealth[item], data.toolHealth[item], `toolHealth ${item}`);
const verifyArray = (property: keyof Player) => expectArraysAreEqual(player[property] as any[], data[property] as any[], property);
const verifyObject = (property: keyof Player) => expectObjectsAreEqual(player[property], data[property], property);

function expectAreEqual(actual: any, expected: any, info: string) {
    if (actual !== expected)
        throw `${info} is ${actual} but expected ${expected}`;
}

function expectArraysAreEqual(actual: any[], expected: any[], info: string) {
    expectAreEqual(actual.length, expected.length,`${info}.length`);
    for (let i = 0; i < actual.length; i++) {
        expectAreEqual(actual[i], expected[i], `${info}[${i}]`);
    }
}

function expectObjectsAreEqual(actual: any, expected: any, info: string) {
    for (let key in actual) {
        expectAreEqual(actual[key], expected[key], `${info}[${key}]`);
    }
}

function times(amount: number, action: (i?: number) => void) {
    for (let i = 0; i < amount; i++)
        action(i);
}