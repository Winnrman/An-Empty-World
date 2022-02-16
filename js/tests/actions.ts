import * as gathering from "../activities/gathering";
import { Player } from "../control/player";
import { ChangeSet, execute, StepAction } from "./engine";
import { skipSleeps } from "../control/timing";
import { caughtFish, collectedBranches, collectedStones, craftedEquipment, craftedPotion, craftedTool, cutWood, drankPotion, droppedItem, equippedItem, gatheredHerb, huntedMeat, killedEnemy, lostStamina, minedIron, minedStone, nothingHappened, soldItem } from "./results";
import * as crafting from "../activities/crafting";
import * as equipment from "../control/equipment";
import * as store from "../activities/store";
import * as inventory from "../control/inventory";
import { EquipmentName } from "../data/items/equipment";
import { ToolName } from "../data/items/tools";
import { HerbResourceName, ResourceName } from "../data/items/resources";
import { getEntries, setNextRandomResults } from "../util";
import { PotionName, potionsByName } from "../data/items/potions";
import { EnemyName } from "../data/enemies";
import { selectEnemy, startCombat } from "../activities/combat";
import { startQuest, stopQuest } from "../activities/questing";

function gather(activityName: gathering.GatheringActivityName, amount: number, successChange: (data: Player) => void, changes: ChangeSet) {
    return execute(async () => {
        skipSleeps(amount, gathering.clearGatheringActivity);
        await gathering.showGatheringActivity(activityName);
    }, successChange, changes);
}

function gatherWithItems(activityName: gathering.GatheringActivityName, items: ResourceName[], amount: number, successChange: (data: Player) => void, changes: ChangeSet) {
    return execute(async () => {
        skipSleeps(amount, gathering.clearGatheringActivity);
        await gathering.showGatheringActivity(activityName);
        for (const item of items) {
            await gathering.toggleItem(item);
        }
        await gathering.startGatheringActivity();
    }, successChange, changes);
}

export function collectBranches(amount: number, ...changes: ChangeSet) {
    return gather("Collect Branches", amount, collectedBranches(amount), changes);
}

export function collectStones(amount: number, ...changes: ChangeSet) {
    return gather("Collect Stones", amount, collectedStones(amount), changes);
}

export function cutDownTree(amount: number, ...changes: ChangeSet) {
    return gather("Cut down Tree", amount, cutWood(amount), changes);
}

export function mineStone(amount: number, ...changes: ChangeSet) {
    return gather("Mine Stone", amount, minedStone(amount), changes);
}

export function catchFish(amount: number, ...changes: ChangeSet) {
    return gather("Catch Fish", amount, caughtFish(amount), changes);
}

export function huntMeat(amount: number, ...changes: ChangeSet) {
    return gather("Hunt Meat", amount, huntedMeat(amount), changes);
}

export function takeNearestHerbs(randomNumbers: number[], ...changes: ChangeSet) {
    setNextRandomResults(...randomNumbers);
    return gather("Take nearest herbs", randomNumbers.length * 2, nothingHappened("cannot predict herbs"), changes);
}

export function searchSpecificHerbs(items: HerbResourceName[], randomNumbers: number[], amountOfMatches: number, ...changes: ChangeSet) {
    setNextRandomResults(...randomNumbers);
    return gatherWithItems("Search specific herbs", items, randomNumbers.length + amountOfMatches, nothingHappened("cannot predict herbs"), changes);
}

export function getHerb(name: HerbResourceName, amount: number, ...changes: ChangeSet) {
    const chance = gathering.getItemChanceValueRanges("Take nearest herbs").find(x => x.name == name)!;
    const randomNumbers = Array(amount).fill(chance.min + 0.001);
    setNextRandomResults(...randomNumbers);
    return gather("Take nearest herbs", randomNumbers.length * 2, gatheredHerb(name, amount), changes);
}

export function mineIron(amount: number, ...changes: ChangeSet) {
    return gather("Mine Iron", amount, minedIron(amount), changes);
}

export function sell(itemName: ResourceName, amount: number, ...changes: ChangeSet) {
    return execute(async () => store.sell(itemName, amount), soldItem(itemName, amount), changes);
}

export function drop(itemName: inventory.InventoryItemName, amount: number, ...changes: ChangeSet) {
    return execute(async () => inventory.removeFromInventory(itemName, amount), droppedItem(itemName, amount), changes);
}

export function craftTool(toolName: ToolName, ...changes: ChangeSet) {
    return execute(async () => {
        await doCraft(toolName);
    }, craftedTool(toolName), changes);
}

export function craftEquipment(equipmentName: EquipmentName, ...changes: ChangeSet) {
    return execute(async () => {
        await doCraft(equipmentName);
    }, craftedEquipment(equipmentName), changes);
}

export function craftPotion(potionName: PotionName, ...changes: ChangeSet) {
    return execute(async () => {
        await doCraft(potionName);
    }, craftedPotion(potionName), changes);
}

export function drinkPotion(itemName: PotionName, ...changes: ChangeSet) {
    return execute(async () => inventory.drinkPotion(itemName), drankPotion(itemName), changes);
}

export function gatherAndCraftPotion(potionName: PotionName) {
    const potion = potionsByName[potionName];
    const actions = Array<StepAction>();
    for (const [resourceName, amount] of getEntries(potion.crafting.ingredients)) {
        actions.push(getHerb(resourceName as HerbResourceName, amount));
    }
    actions.push(craftPotion(potionName));
    return actions;
}

export async function doCraft(craftableName: crafting.CraftableName) {
    skipSleeps(1);
    await crafting.selectItemToCraft(craftableName)
    await crafting.doCrafting();
}

export function equip(itemName: EquipmentName, ...changes: ChangeSet) {
    return execute(async () => equipment.equip(itemName), equippedItem(itemName), changes);
}

export function attack(enemyName: EnemyName, amountOfAttacks: number, ...changes: ChangeSet) {
    return execute(async () => {
        await selectEnemy(enemyName);
        skipSleeps(amountOfAttacks);
        setNextRandomResults(0, 0.26);
        await startCombat();
    }, killedEnemy(enemyName), changes);
}

export function startQuesting(randoms: number[], amountOfSleeps: number, staminaCost: number, ...changes: ChangeSet) {
    return execute(async () => {
        skipSleeps(amountOfSleeps, stopQuest);
        setNextRandomResults(...randoms);
        await startQuest();
    }, lostStamina(staminaCost), changes);
}