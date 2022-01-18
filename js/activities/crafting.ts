import * as dom from "../util/dom";
import { ItemName, itemsByName } from "../data/items";
import { addMessage } from '../control/messages';
import { ownsEquipment } from "../control/equipment";
import player from "../control/player";
import { getInventoryCount, removeFromInventory, renderInventory } from "../control/inventory";
import equipment, { Equipment, EquipmentName } from "../data/items/equipment";
import potions, { Potion, PotionName } from "../data/items/potions";
import { ResourceName } from "../data/items/resources";
import { getKeys } from "../util";
import { addLoot } from "./looting";

let currentCraftable: CraftableName = undefined;

type CraftableName = EquipmentName | PotionName;
type Craftable = Equipment | Potion;

function getSelectedCraftable() {
    return itemsByName[dom.getValue("craftingSelect") as ItemName] as Craftable;
}

export function displayCraftingNeededMaterials() {
    const craftable = getSelectedCraftable();
    if (!craftable || !craftable.crafting)
        return;

    currentCraftable = craftable.name;

    const parts = Object.keys(craftable.crafting.ingredients).map((key: ResourceName) => `${key}: ${getInventoryCount(key)}/${craftable.crafting.ingredients[key]}`).join(' ');
    dom.setHtml("neededMaterials", `Needed Materials: ${parts}`)
}

export function doCrafting() {
    const craftable = getSelectedCraftable();
    if (!craftable || !craftable.crafting)
        return;

    if (player.level < craftable.crafting.requiredLevel) {
        addMessage(`You need level ${craftable.crafting.requiredLevel} to craft ${craftable.name}!`);
        return;
    }
    
    for (var key in craftable.crafting.ingredients) {
        if (getInventoryCount(key as ResourceName) < craftable.crafting.ingredients[key]) {
            addMessage(`You don't have enough ${key} to craft a ${craftable.name}!`);
            return;
        }
    }
    
    for (const key of getKeys(craftable.crafting.ingredients)) {
        removeFromInventory(key, craftable.crafting.ingredients[key])
    }

    addMessage(`You crafted a ${craftable.name}!`);
    addLoot(craftable);
    renderCraftables();
    renderInventory();
    displayCraftingNeededMaterials();
}

export function renderCraftables() {
    const craftableEquipment = equipment.filter(x => x.crafting && x.crafting.requiredLevel <= player.level && !ownsEquipment(x.name));
    const craftablePotions = potions.filter(x => x.crafting && x.crafting.requiredLevel <= player.level);
    addCraftablesToContainer('craftingSelect', [...craftableEquipment, ...craftablePotions]);
}

function addCraftablesToContainer(elementId: string, craftables: Craftable[]) {
    dom.setHtml(elementId, "");
    const container = dom.getElement<HTMLSelectElement>(elementId);
    container.add(dom.createElement<HTMLOptionElement>("option", { text: "Select an item" }));
    
    for (const craftable of craftables) {
        const option = dom.createElement<HTMLOptionElement>("option", { value: craftable.name, text: craftable.name });
        if (currentCraftable === craftable.name)
            option.setAttribute("selected", "selected");
        container.add(option);
    }
}