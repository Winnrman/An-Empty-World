import { AchievementName, checkAchievements, resetAchievementsToCheck } from "../control/achievements";
import * as crafting from "../activities/crafting";
import * as gathering from "../activities/gathering";
import * as experience from "../control/experience";
import * as equipment from "../control/equipment";
import * as main from "../main";
import player, { pauseSaving, saveData, resetData, getDefaultData, restoreData, resumeSaving, Player } from "../control/player";
import * as store from "../activities/store";
import { equipmentByName, EquipmentName } from "../data/items/equipment";
import { ToolName, toolsByName } from "../data/items/tools";
import { ResourceName, resourcesByName } from "../data/items/resources";
import * as inventory from "../control/inventory";
import { getEntries } from "../util";
import { skipSleeps } from "../control/timing";

const data = getDefaultData();

export default async function runTests(keepTestDataAfterwards?: boolean) {
    const start = new Date();
    pauseSaving();
    saveData();
    resetData();
    resetAchievementsToCheck();
    equipment.updateArmour();

    try {
        await runScenario();
        const end = new Date();
        const diff = end.getTime() - start.getTime();
        console.log(`Tests OK! Took ${diff / 1000}s`)
    } finally {

        if (!keepTestDataAfterwards)
            restoreData();
        
        main.checkAndRenderEverything();
        resumeSaving();
    
        saveData();
    }
}

async function runScenario() {
    Object.assign(data, getDefaultData());
    data.inventory["Axe"] = 0;
    data.inventory["Wood"] = 0;
    data.inventory["Wooden Harpoon"] = 0;
    data.inventory["Fish"] = 0;
    await runWoodcuttingScenario()
    await runFishingScenario();
    await runCraftingScenario();
    await runEquipmentScenario();
}

async function runWoodcuttingScenario() {
    await step("1.01", sell("Wood", 1,        nothingHappened("Nothing to sell")));
    await step("1.02", drop("Wood", 1,        nothingHappened("Nothing to drop")));
    await step("1.03", collectBranches(4));   
    await step("1.04", collectStones(10));    
    await step("1.05", craftTool("Axe"));     
    await step("1.06", craftTool("Pickaxe")); 
    await step("1.07", cutDownTree(11,        true, levelled(2)));
    await step("1.08", cutDownTree(9,         true, toolBroke("Axe")));
    await step("1.13", cutDownTree(1,         nothingHappened("no harpoon"))); 
    await step("1.09", craftTool("Axe",       nothingHappened("no stone")));           
    await step("1.10", drop("Wood", 1));      
    await step("1.11", mineStone(5));         
    await step("1.12", craftTool("Axe"));     
    await step("1.13", cutDownTree(6,         true, gotAchievement("cut_down_trees", 1))); 
    await step("1.13", cutDownTree(1,         nothingHappened("Inventory full"))); 
    await step("1.14", drop("Wood", 8));
}

async function runFishingScenario() {
    await step("2.01", craftTool("Wooden Harpoon"));
    await step("2.02", catchFish(10,                 true, toolBroke("Wooden Harpoon")));
    await step("1.13", catchFish(1,                  nothingHappened("no harpoon"))); 
    await step("2.03", craftTool("Wooden Harpoon")); 
    await step("2.04", catchFish(7));       
    await step("1.13", catchFish(1,                  nothingHappened("Inventory full"))); 
    await step("2.05", drop("Fish", 17));       
    await step("2.06", catchFish(3,                  true, toolBroke("Wooden Harpoon")));
    await step("2.07", craftTool("Wooden Harpoon")); 
    await step("2.08", catchFish(5,                  true, gotAchievement("catch_fish", 1)));
    await step("2.09", drop("Fish", 8));
}

async function runCraftingScenario() {
    await step("3.01", cutDownTree(5,                        true, levelled(3)));
    await step("3.02", cutDownTree(9,                        true, toolBroke("Axe")));
    await step("3.03", mineStone(5));
    await step("3.04", craftTool("Axe"));
    await step("3.05", craftEquipment("Wooden Helmet"));
    await step("3.06", craftEquipment("Wooden Chestplate"));
    await step("3.07", craftEquipment("Wooden Leggings",     nothingHappened("Not enough wood")));
    await step("3.08", cutDownTree(20,                       true, gotAchievement("cut_down_trees", 2), toolBroke("Axe")));
    await step("3.09", craftEquipment("Wooden Leggings"));
    await step("3.10", craftEquipment("Wooden Boots"));
    await step("3.11", craftEquipment("Wooden Sword"));
}

async function runEquipmentScenario() {
    await step("4.01", equip("Wooden Helmet"));
    await step("4.01", equip("Wooden Chestplate"));
    await step("4.01", equip("Wooden Leggings"));
    await step("4.01", equip("Wooden Boots",        true, gotAchievement("wooden_armor", 1)));
    await step("4.01", equip("Wooden Sword"));
}

function sell(itemName: ResourceName, amount: number, ...changes: ChangeSet) {
    return execute(async () => store.sell(itemName, amount), soldItem(itemName, amount), changes);
}

function drop(itemName: inventory.InventoryItemName, amount: number, ...changes: ChangeSet) {
    return execute(async () => inventory.removeFromInventory(itemName, amount), droppedItem(itemName, amount), changes);
}

function collectBranches(amount: number, ...changes: ChangeSet) {
    return gather("Collect Branches", amount, collectedBranches(amount), changes);
}

function collectStones(amount: number, ...changes: ChangeSet) {
    return gather("Collect Stones", amount, collectedStones(amount), changes);
}

function cutDownTree(amount: number, ...changes: ChangeSet) {
    return gather("Cut down Tree", amount, cutWood(amount), changes);
}

function mineStone(amount: number, ...changes: ChangeSet) {
    return gather("Mine Stone", amount, minedStone(amount), changes);
}

function catchFish(amount: number, ...changes: ChangeSet) {
    return gather("Catch Fish", amount, caughtFish(amount), changes);
}

function gather(activityName: gathering.GatheringActivityName, amount: number, successChange: () => void, changes: ChangeSet) {
    return execute(async () => {
        skipSleeps(amount, gathering.clearGatheringActivity);
        await gathering.startGatheringActivity(activityName);
    }, successChange, changes);
}

function craftTool(toolName: ToolName, ...changes: ChangeSet) {
    return execute(async () => {
        doCraft(toolName);
    }, craftedTool(toolName), changes);
}

function craftEquipment(equipmentName: EquipmentName, ...changes: ChangeSet) {
    return execute(async () => {
        doCraft(equipmentName);
    }, craftedEquipment(equipmentName), changes);
}

function doCraft(craftableName: crafting.CraftableName) {
    skipSleeps(1);
    crafting.selectItemToCraft(craftableName)
    crafting.doCrafting();
}

function equip(itemName: EquipmentName, ...changes: ChangeSet) {
    return execute(async () => equipment.equip(itemName), equippedItem(itemName), changes);
}

type ChangeSet = (true | (() => void))[];
function execute(action: () => Promise<void>, successChange: () => void, changes: ChangeSet) {
    return async () => {
        await action();
        applyChanges(successChange, changes);
    };
}

type XpName = "treeCuttingXp" | "miningXp" | "fishingXp"

function gathered(resourceName: ResourceName, amount: number, toolname: ToolName | undefined, xpName: XpName) {
    return () => {
        data.inventory[resourceName] = (data.inventory[resourceName] ?? 0) + amount;
        if (toolname)
            data.toolHealth[toolname] -= amount;
        data.xp += resourcesByName[resourceName].gathering[xpName]! * amount;
    }
}

function soldItem(itemName: ResourceName, amount: number) {
    return () => {
        data.gold += amount * resourcesByName[itemName].price;
        data.inventory[itemName] = amount === 0 ? 0 : data.inventory[itemName]! - amount;
    };
}

function cutWood(amount: number) {
    return gathered("Wood", amount, "Axe", "treeCuttingXp");
}

function collectedBranches(amount: number) {
    return gathered("Wood", amount, undefined, "treeCuttingXp");
}

function collectedStones(amount: number) {
    return gathered("Stone", amount, undefined, "miningXp");
}

function minedStone(amount: number) {
    return gathered("Stone", amount, "Pickaxe", "miningXp");
}

function caughtFish(amount: number) {
    return gathered("Fish", amount, "Wooden Harpoon", "fishingXp");
}

function toolBroke(itemName: ToolName) {
    return () => {
        data.inventory[itemName] = 0;
    }
}

function levelled(level: number) {
    return () => {
        data.level = level;
        data.xp = 0;
    }
}

function droppedItem(itemName: inventory.InventoryItemName, amount: number) {
    return () => {
        data.inventory[itemName] = amount === 0 ? 0 : data.inventory[itemName]! - amount;
    }
}

function gotAchievement(id: AchievementName, amount: number) {
    return () => {
        data.completedAchievements[id] = amount;
    }
}

function craftedTool(itemName: ToolName) {
    return () => {
        data.inventory[itemName] = 1;
        const craftable = toolsByName[itemName];
        data.toolHealth[itemName] = craftable.tool.health;
        for (const [key, requiredAmount] of getEntries(craftable.crafting!.ingredients)) {
            data.inventory[key]! -= requiredAmount;
        }
    }
}

function craftedEquipment(itemName: EquipmentName) {
    return () => {
        data.ownedEquipment.push(itemName);
        const craftable = equipmentByName[itemName];
        for (const [key, requiredAmount] of getEntries(craftable.crafting!.ingredients)) {
            data.inventory[key]! -= requiredAmount;
        }
    }
}

function equippedItem(itemName: EquipmentName) {
    return () => {
        const item = equipmentByName[itemName];
        if (data.equipment[item.equipment!.slot]) {
            const oldItem = equipmentByName[data.equipment![item.equipment!.slot]!];
            player.playerDefense -= oldItem.equipment.armor ?? 0;
            player.playerAttack -= oldItem.equipment.attack ?? 0;
        }

        data.equipment[item.equipment!.slot] = itemName;
        player.playerDefense += item.equipment.armor ?? 0;
        player.playerAttack += item.equipment.attack ?? 0;
    }
}

function nothingHappened(reason: string) {
    return () => {}
}

async function step(name: string, action:() => Promise<void>) {
    await (action());
    verify(name);
}

function applyChanges(successChange: () => void, changes: (true | (() => void))[]) {
    if (!changes.length)
        successChange();
    
    for (var applyChange of changes) {
        if (applyChange === true)
            successChange();
        else
            applyChange();
    }
}

function verify(name?: string) {
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
        throw `error in ${name}: ${errors.join(",")}`;
    }
}

const verifyProperty = (errors: string[], property: keyof Player) => expectAreEqual(errors, player[property], data[property], property);
const verifyInventory = (errors: string[], item: inventory.InventoryItemName) => expectAreEqual(errors, inventory.getInventoryCount(item), data.inventory[item], `inventory ${item}`);
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
    for (const key in actual) {
        expectAreEqual(errors, actual[key], expected[key], `${info}[${key}]`);
    }
    for (const key in expected) {
        expectAreEqual(errors, actual[key], expected[key], `${info}[${key}]`);
    }
}