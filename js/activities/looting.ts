import { addToOwnedEquipment } from "../control/equipment";
import { addToInventory } from "../control/inventory";
import { Equipment } from "../data/items/equipment";
import { Potion } from "../data/items/potions";

export type Loot = Potion | Equipment;

export function addLoot(item: Potion | Equipment) {
    if (item.type === "Equipment") {
        addToOwnedEquipment(item as Equipment);
    } else {
        addToInventory((item as Potion).name, 1);
    }
}