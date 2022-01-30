import { EquipmentSlot, Rarity } from "../data/items";
import equipment, { Equipment } from "../data/items/equipment";
import potions, { Potion } from "../data/items/potions";
import { getRandomItem } from "../util";
import { Loot } from "./looting";

export function randomLootDrop(): Loot {
    const itemType = getRandomItemType();
    const itemsOfType = (itemType == "Potion") 
        ? potions.filter(x => x.type === "Potion").map(x => x as Potion) 
        : equipment.filter(x => x.equipment?.slot === itemType).map(x => x as Equipment);
    
    return itemsOfType[Math.floor(Math.random() * itemsOfType.length)];
}

(window as any).randomLootDrop = randomLootDrop;

function getRandomRarity(): Rarity {
    const rarity = Math.floor(Math.random() * 16) + 1;
    if (rarity < 5) return "common";
    if (rarity < 10) return "uncommon";
    if (rarity < 15) return "rare";
    return "legendary";
}

const itemTypes: (EquipmentSlot | "Potion")[] = ["Helmet", "Chestplate", "Leggings", "Boots", "Offhand", "Potion", "Shield"];

function getRandomItemType() {
    return getRandomItem(itemTypes);
}