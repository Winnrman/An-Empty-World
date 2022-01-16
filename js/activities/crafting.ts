import * as dom from "../util/dom";
import items, { itemsByName } from "../data/items/items";
import { addMessage } from '../control/messages';
import { addToOwnedEquipment, ownsEquipment } from "../control/equipment";
import player from "../control/player";
import { renderInventory } from "../control/inventory";

let currentCraftable = undefined;

function getSelectedCraftable() {
    return itemsByName[dom.getValue("craftingSelect")];
}

export function displayCraftingNeededMaterials() {
    const craftable = getSelectedCraftable();
    if (!craftable || !craftable.crafting)
        return;

    currentCraftable = craftable.name;

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
    addToOwnedEquipment(craftable);
    renderCraftables();
    renderInventory();
}

export function renderCraftables() {
    const craftables = items.filter(x => x.crafting && x.crafting.requiredLevel <= player.level && !ownsEquipment(x.name));
    const container = <HTMLSelectElement>document.getElementById('craftingSelect');

    container.innerHTML = '';
    const option = document.createElement("option");
    option.text = "Select an item";
    container.add(option);
    
    for (const craftable of craftables) {
        const option = document.createElement("option");
        option.value = craftable.name;
        option.text = craftable.name;
        if (currentCraftable == craftable.name)
            option.setAttribute("selected", "selected");
        container.add(option);
    }
}