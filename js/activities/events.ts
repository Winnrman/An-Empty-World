import items, { EquipmentSlot } from "../data/items";
import { Equipment } from "../data/items/equipment";
import { Potion } from "../data/items/potions";
import { getRandomItem } from "../util";
import { Loot } from "./looting";

export function randomLootDrop(): Loot {
    const itemType = getRandomItemType();
    let itemsOfType = (itemType == "Potion") 
        ? items.filter(x => x.type === "Potion").map(x => x as Potion) 
        : items.filter(x => x.equipment?.slot === itemType).map(x => x as Equipment);
    
    return itemsOfType[Math.floor(Math.random() * itemsOfType.length)];
}

(window as any).randomLootDrop = randomLootDrop;

function getRandomRarity() {
    var rarity = Math.floor(Math.random() * 16) + 1;
    if (rarity < 5) return "common";
    if (rarity < 10) return "uncommon";
    if (rarity < 15) return "rare";
    if (rarity == 16) return "legendary";
}

const itemTypes: (EquipmentSlot | "Potion")[] = ["Helmet", "Chestplate", "Leggings", "Boots", "Offhand", "Potion", "Shield"];

function getRandomItemType() {
    return getRandomItem(itemTypes);
}