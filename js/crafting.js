import items from "./items.js";
import { addMessage } from './messages.js';
import { addToOwnedEquipment } from "./maintenance.js";
import player from "./player.js";

function getSelectedCraftable() {
    var selectedName = document.getElementById("craftingSelect").value;
    return items.find(x => x.name === selectedName);
}

export function displayCraftingNeededMaterials() {
    const craftable = getSelectedCraftable();
    if (!craftable || !craftable.crafting)
        return;

    const parts = Object.keys(craftable.crafting.ingredients).map(key => `${key}: ${player.inventory_dictionary[key]}/${craftable.crafting.ingredients[key]}`).join(' ');
    document.getElementById("neededMaterials").innerHTML = `Needed Materials: ${parts}`;
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
        if (player.inventory_dictionary[key] < craftable.crafting.ingredients[key]) {
            addMessage(`You don't have enough ${key} to craft a ${craftable.name}!`);
            return;
        }
    }
    
    for (var key in craftable.crafting.ingredients) {
        player.inventory_dictionary[key] -= craftable.crafting.ingredients[key];
    }

    addMessage(`You crafted a ${craftable.name}!`);
    addToOwnedEquipment(craftable.name, craftable.type);
}