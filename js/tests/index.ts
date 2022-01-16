import * as dom from "../util/dom";
import { achievements, checkAchievements, resetAchievementsToCheck } from "../control/achievements";
import * as activities from "../activities/activities";
import * as crafting from "../activities/crafting";
import * as experience from "../control/experience";
import * as equipment from "../control/equipment";
import { itemsByName } from "../data/items/items";
import * as main from "../main";
import player, { stopSaveInterval, saveData, resetData, getDefaultData, restoreData, startSaveInterval } from "../control/player";
import * as store from "../activities/store";

let data = getDefaultData();

export default function runTests(keepTestDataAfterwards) {
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

function cutLogs(amount) {
    times(amount, activities.tree);
}

function buyFishingPole() {
    store.buyFishingPole();
}

function catchFish(amount) {
    times(amount, activities.goFishing);
}

function sell(item) {
    store.sell(item);
}

function craft(item) {
    dom.setValue("craftingSelect", item);
    crafting.displayCraftingNeededMaterials();
    crafting.doCrafting();
}

function equip(item) {
    const type = itemsByName[item].type;
    dom.setValue(`${type}Select`, item);
    document.getElementById(`${type}Select`).dispatchEvent(new Event('change'));
}

function boughtItem(item) {
    data.gold -= itemsByName[item].price;
    data.inventory_dictionary[item] = 1;
}

function didCutLogs(amount) {
    data.inventory_dictionary["Wood"] += amount;
    data.toolHealth["Axe"] -= amount;
    data.xp += itemsByName["Wood"].treeCutting.xp * amount;
}

function toolBroke(item) {
    data.inventory_dictionary[item] = 0;
    data.toolHealth[item] = itemsByName[item].health;
}

function levelled(level, expectedGold) {
    data.level = level;
    data.xp = 0;
    data.gold += expectedGold;
}

function soldItem(item, amount) {
    data.gold += amount * itemsByName[item].price;
    data.inventory_dictionary[item] = 0;
}

function caughtFish(amount) {
    data.inventory_dictionary["Fish"] += amount;
    data.toolHealth["Fishing Pole"] -= amount;
    data.xp += itemsByName["Fish"].fishing.xp * amount;
}

function gotAchievement(id, amount) {
    data.completedAchievements[id] = amount;
    const achievement = achievements.find(x => x.id === id);
    const level = amount - 1;
    const levelValue = achievement.levels[level];
    data.gold += achievement.reward(amount -1, levelValue);
}

function craftedItem(item) {
    data.ownedEquipment.push(item);
    const craftable = itemsByName[item];
    for (var key in craftable.crafting.ingredients) {
        data.inventory_dictionary[key] -= craftable.crafting.ingredients[key];
    }
}

function equippedItem(itemName) {
    const item = itemsByName[itemName];
    if (data.equipment[item.type]) {
        const oldItem = itemsByName[data.equipment[item.type]];
        player.playerDefense -= oldItem.armor || 0;
        player.playerAttack -= oldItem.attack || 0;
    }

    data.equipment[item.type] = itemName;
    player.playerDefense += item.armor || 0;
    player.playerAttack += item.attack || 0;
}

function nothingHappened(reason) {

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

const verifyProperty = (property) => expectAreEqual(player[property], data[property], property);
const verifyInventory = (item) => expectAreEqual(player.inventory_dictionary[item], data.inventory_dictionary[item], `inventory ${item}`);
const verifyToolHealth = (item) => expectAreEqual(player.toolHealth[item], data.toolHealth[item], `toolHealth ${item}`);
const verifyArray = (property) => expectArraysAreEqual(player[property], data[property], property);
const verifyObject = (property) => expectObjectsAreEqual(player[property], data[property], property);

function expectAreEqual(actual, expected, info) {
    if (actual !== expected)
        throw `${info} is ${actual} but expected ${expected}`;
}

function expectArraysAreEqual(actual, expected, info) {
    expectAreEqual(actual.length, expected.length,`${info}.length`);
    for (let i = 0; i < actual.length; i++) {
        expectAreEqual(actual[i], expected[i], `${info}[${i}]`);
    }
}

function expectObjectsAreEqual(actual, expected, info) {
    for (let key in actual) {
        expectAreEqual(actual[key], expected[key], `${info}[${key}]`);
    }
}

function times(amount, action) {
    for (let i = 0; i < amount; i++)
        action(i);
}