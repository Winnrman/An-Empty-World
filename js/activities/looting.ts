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

export type LootData = { chance: number, min: number, max: number };
export type LootTable<T extends string> = T | PartialRecord<T, number | LootData>;

export function getAllPossibleItems<T extends string>(lootTable: LootTable<T>) {
    const items: T[] = [];
    if (typeof lootTable === "string") {
        items.push(lootTable);
        return items;
    }

    for (const key of getKeys(lootTable as PartialRecord<T, number | LootData>)) {
        items.push(key);
    }

    return items;
}

type ItemChance<T> = {
    name: T;
    chance: number
}

export const getItemChances = <T extends string>(lootTable: LootTable<T>, dropModifiers?: PartialRecord<T, number>): ItemChance<T>[] => {
    if (typeof lootTable === "string")
        return [{ name: lootTable as T, chance: 1 }];

    const chances = Array<ItemChance<T>>();
    for (const [key, value] of getEntries(lootTable as PartialRecord<T, number | LootData>)) {
        const chance = typeof value === "number" ? value as number : (value as LootData).chance;
        const dropModifier = dropModifiers ? dropModifiers[key] ?? 1 : 1;
        chances.push({ name: key, chance: chance * dropModifier });
    }
    return chances.sort((a, b) => b.chance - a.chance);
}

export function getRandomItemFromChanceList<T extends string | number | symbol>(chanceList: ItemChance<T>[]) {
    if (chanceList.length === 1)
        return chanceList[0].name;
    
    const totalChance = sum(chanceList.map(x => x.chance));
    let randomChance = getRandomInt(1, totalChance);
    for (const chance of chanceList) {
        randomChance -= chance.chance;
        if (randomChance <= 0) 
            return chance.name;
    }
    throw "reached end of chancelist";
}

const getItemAmount = <T extends string>(lootTable: LootTable<T>, itemName: T) => {
    if (typeof lootTable === "string")
        return 1;

    const itemChance = (lootTable as PartialRecord<T, number | LootData>)[itemName];
    if (typeof itemChance === "number")
        return 1;

    const minMax = itemChance as LootData;
    return getRandomInt(minMax.min, minMax.max);
}

export const getRandomLootFromTable = <T extends string>(lootTable: LootTable<T>, dropModifiers?: PartialRecord<T, number>): [T, number] => {
    const itemChances = getItemChances(lootTable, dropModifiers);
    const itemName = getRandomItemFromChanceList(itemChances);
    const amount = getItemAmount(lootTable, itemName);
    return [itemName, amount]
}