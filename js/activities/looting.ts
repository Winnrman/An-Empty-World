import { addToOwnedEquipment } from "../control/equipment";
import { addToInventory, addToolToInventory } from "../control/inventory";
import { Equipment } from "../data/items/equipment";
import { Potion } from "../data/items/potions";
import { Tool } from "../data/items/tools";

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