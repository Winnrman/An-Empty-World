import * as dom from "../util/dom";
import { addMessage } from '../control/messages';
import { ownsEquipment } from "../control/equipment";
import player, { saveData } from "../control/player";
import { getInventoryCount, removeFromInventory, renderInventory } from "../control/inventory";
import equipment, { Equipment, equipmentByName, EquipmentName } from "../data/items/equipment";
import potions, { Potion, PotionName, potionsByName } from "../data/items/potions";
import { ResourceName, resourcesByName } from "../data/items/resources";
import { getKeys } from "../util";
import { addLoot } from "./looting";
import { Item } from "../data/items";

import "../../css/crafting.css";

export type CraftableName = EquipmentName | PotionName;
export type Craftable = Equipment | Potion;
export const craftablesByName: Record<CraftableName, Craftable> = { ...equipmentByName, ...potionsByName };

export function selectItemToCraft(craftableName: CraftableName) {
    player.selectedCraftable = craftablesByName[craftableName];
    renderCraftableDetails();
}

export function doCrafting() {
    const craftable = player.selectedCraftable;
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

    let craftableIndex = craftable.type === "Equipment" ? getCraftableEquipment().indexOf(craftable as Equipment) : 0;
    addMessage(`You crafted a ${craftable.name}!`);
    addLoot(craftable);

    if (craftable.type === "Equipment") {
        const craftableEquipment = getCraftableEquipment();
        const nextCraftableIndex = craftableEquipment.length ? craftableIndex++ % craftableEquipment.length : -1;
        player.selectedCraftable = craftableEquipment[nextCraftableIndex];
    }
    
    renderCraftables();
    renderInventory();
    saveData();
}

const canCraft = (item: Item) => item.crafting && item.crafting.requiredLevel <= player.level;

function renderCraftable(craftable: Craftable) {
    return `<div onclick="crafting.selectItemToCraft('${craftable.name}')" class="item-icon" title="${craftable.name}"><img src="${craftable.iconUrl}" /></div>`;
}

function getCraftableEquipment() {
    return equipment.filter(x => canCraft(x) && !ownsEquipment(x.name));
}

export function renderCraftables() {
    const craftableEquipment = getCraftableEquipment();
    const craftablePotions = potions.filter(x => canCraft(x));
    
    let html = "<div>";

    if (craftableEquipment.length) {
        for (const craftable of craftableEquipment) {
            html += renderCraftable(craftable);
        }
        html += "<br />";
    }

    if (craftablePotions.length) {
        for (const craftable of craftablePotions) {
            html += renderCraftable(craftable);
        }
    }
    
    html += "</div>";

    dom.setHtml('craftables', html);
}

export function renderCraftableDetails() {
    if (!player.selectedCraftable || !player.selectedCraftable.crafting) {
        dom.setHtml("craftable-details", "");
        return;
    }

    const craftable = player.selectedCraftable;
    const ingredients = craftable.crafting.ingredients;

    let html = "<div>";
    html += `<h3>Item to craft</h3>`;
    html += `<div class="item-icon" title="${craftable.name}"><img src="${craftable.iconUrl}" /></div>${craftable.name}<br />`;
    html += "<br />"

    html += `<h3>Ingredients</h3>`
    html += `<div class="crafting-ingredients">`
    for (const ingredientName of getKeys(ingredients)) {
        html += `<span class="crafting-ingredient">`;

        const ingredient = resourcesByName[ingredientName];
        html += `<div class="item-icon" title="${ingredient.name}"><img src="${ingredient.iconUrl}" /></div>`;
        
        const ownedAmount = getInventoryCount(ingredientName);
        const requiredAmount = ingredients[ingredientName];
        const classForAmount = ownedAmount < requiredAmount ? "red" : ""
        html += `<span class="${classForAmount}">${ownedAmount}/${requiredAmount}</span>`;

        html += "</span>";
    }
    html += "</div>";

    html += "<br />";
    html += `<button class="button" onclick="crafting.doCrafting()">Craft</button>`;
    html += "</div>";
    
    dom.setHtml("craftable-details", html);
}