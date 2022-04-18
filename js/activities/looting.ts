import { addToOwnedEquipment } from "../control/equipment";
import { addToInventory, addToolToInventory } from "../control/inventory";
import player from "../control/player";
import { Rarity } from "../data/items";
import equipment, { Equipment } from "../data/items/equipment";
import potions, { Potion } from "../data/items/potions";
import { Tool } from "../data/items/tools";
import { getEntries, getKeys, getRandomInt, PartialRecord, sum } from "../util";
import { getRandomItem } from "../util";

export function randomLootDrop(): Loot {
    const loot = [...potions, ...equipment];
    const randomRarity = getRandomRarity();
    const lootOfRarity = loot.filter(x => x.rarity === randomRarity);
    return getRandomItem(lootOfRarity);
}

function getRandomRarity(): Rarity {
    const rarity = getRandomInt(1, 15) + player.luck * 2; // without luck: 1 to 15, so no legendary, with amulet of luck (3 luck): 7 to 22, so no common and a good chance on legendary
    if (rarity < 5) return "common";
    if (rarity < 10) return "uncommon";
    if (rarity < 15) return "rare";
    return "legendary";
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

export type OptionChance<T> = {
    name: T;
    chance: number
}

export const getItemChances = <T extends string>(lootTable: LootTable<T>, dropModifiers?: PartialRecord<T, number>): OptionChance<T>[] => {
    if (typeof lootTable === "string")
        return [{ name: lootTable as T, chance: 1 }];

    const chances = Array<OptionChance<T>>();
    for (const [key, value] of getEntries(lootTable as PartialRecord<T, number | LootData>)) {
        chances.push({ name: key, chance: typeof value === "number" ? value as number : (value as LootData).chance });
    }

    return getModifiedChanceList(chances, dropModifiers);
}

export function getModifiedChanceList<T extends string | number | symbol>(chanceList: OptionChance<T>[], chanceModifiers?: PartialRecord<T, number>) {
    return chanceList.map(optionChance => {
        const dropModifier = chanceModifiers ? chanceModifiers[optionChance.name] ?? 1 : 1;
        return { name: optionChance.name, chance: optionChance.chance * dropModifier };
    }).sort((a, b) => b.chance - a.chance);
}

export function getRandomItemFromChanceList<T extends string | number | symbol>(chanceList: OptionChance<T>[]) {
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