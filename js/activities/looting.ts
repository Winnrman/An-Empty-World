import { addToOwnedEquipment } from "../control/equipment";
import { addToInventory, addToolToInventory } from "../control/inventory";
import equipment, { Equipment } from "../data/items/equipment";
import potions, { Potion } from "../data/items/potions";
import { Tool } from "../data/items/tools";
import { getEntries, getKeys, getRandomInt, PartialRecord, sum } from "../util";
import { EquipmentSlot } from "../data/items";
import { getRandomItem } from "../util";

export function randomLootDrop(): Loot {
    const itemType = getRandomItemType();
    const itemsOfType = (itemType == "Potion") 
        ? potions.filter(x => x.type === "Potion").map(x => x as Potion) 
        : equipment.filter(x => x.equipment?.slot === itemType).map(x => x as Equipment);
    
    return itemsOfType[Math.floor(Math.random() * itemsOfType.length)];
}

(window as any).randomLootDrop = randomLootDrop;

// function getRandomRarity(): Rarity {
//     const rarity = Math.floor(Math.random() * 16) + 1;
//     if (rarity < 5) return "common";
//     if (rarity < 10) return "uncommon";
//     if (rarity < 15) return "rare";
//     return "legendary";
// }

const itemTypes: (EquipmentSlot | "Potion")[] = ["Helmet", "Chestplate", "Leggings", "Boots", "Offhand", "Potion", "Shield"];

function getRandomItemType() {
    return getRandomItem(itemTypes);
}

export type Loot = Potion | Equipment;

export function addLoot(item: Potion | Equipment | Tool) {
    if (item.type === "Equipment") {
        addToOwnedEquipment(item as Equipment);
    } else if (item.type == "Tool") {
        addToolToInventory(item as Tool);
    } else {
        addToInventory((item as Potion).name, 1);
    }
}

export type ItemChance = { chance: number, min: number, max: number };
export type LootTable<T extends string> = T | PartialRecord<T, number | ItemChance>;

export function getAllPossibleItems<T extends string>(lootTable: LootTable<T>) {
    const items: T[] = [];
    if (typeof lootTable === "string") {
        items.push(lootTable);
        return items;
    }

    for (const key of getKeys(lootTable as PartialRecord<T, number | ItemChance>)) {
        items.push(key);
    }

    return items;
}

export const getItemChances = <T extends string>(lootTable: LootTable<T>, dropModifiers?: PartialRecord<T, number>) => {
    const chances: PartialRecord<T, number> = {};
    if (typeof lootTable === "string") {
        chances[lootTable as T] = 1;
        return chances;
    }

    for (const [key, value] of getEntries(lootTable as PartialRecord<T, number | ItemChance>)) {
        const chance = typeof value === "number" ? value as number : (value as ItemChance).chance;
        const dropModifier = dropModifiers ? dropModifiers[key] ?? 1 : 1;
        chances[key] = chance * dropModifier
    }
    return chances;
}

export function getRandomItemFromChanceList<T extends string | number | symbol>(items: PartialRecord<T, number>) {
    const totalChance = sum(Object.values(items));
    let randomChance = getRandomInt(1, totalChance);
    for (const [key, value] of getEntries(items)) {
        randomChance -= value;
        if (randomChance <= 0)
            return key;
    }
    throw "reached end of chancelist";
}

const getItemAmount = <T extends string>(lootTable: LootTable<T>, itemName: T) => {
    if (typeof lootTable === "string")
        return 1;

    const itemChance = (lootTable as PartialRecord<T, number | ItemChance>)[itemName];
    if (typeof itemChance === "number")
        return 1;

    const minMax = itemChance as ItemChance;
    return getRandomInt(minMax.min, minMax.max);
}

export const getRandomLootFromTable = <T extends string>(lootTable: LootTable<T>, dropModifiers?: PartialRecord<T, number>): [T, number] => {
    const itemChances = getItemChances(lootTable, dropModifiers);
    const itemName = getRandomItemFromChanceList(itemChances);
    const amount = getItemAmount(lootTable, itemName);
    return [itemName, amount]
}