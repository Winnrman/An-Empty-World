import "../../css/crafting.css";

import * as dom from "../util/dom";
import { addMessage } from '../control/messages';
import { ownsEquipment } from "../control/equipment";
import player from "../control/player";
import { getInventoryCount, hasInInventory, removeFromInventory, renderInventory } from "../control/inventory";
import equipment, { Equipment, equipmentByName, EquipmentName } from "../data/items/equipment";
import potions, { Potion, PotionName, potionsByName } from "../data/items/potions";
import { resourcesByName } from "../data/items/resources";
import { displayNumber, getEntries, getWithIndefiniteArticle } from "../util";
import { addLoot } from "./looting";
import tools, { Tool, ToolName, toolsByName } from "../data/items/tools";
import { sleep } from "../control/timing";
import { wrapAction } from "../control/user";

export type CraftableName = EquipmentName | PotionName | ToolName;
export type Craftable = Equipment | Potion | Tool;
export const craftablesByName: Record<CraftableName, Craftable> = { ...equipmentByName, ...potionsByName, ...toolsByName };

export async function selectItemToCraft(craftableName: CraftableName) {
    player.selectedCraftable = craftablesByName[craftableName];
    renderCraftableDetails();
}

let isCrafting = false;

export async function stopCrafting() {
    isCrafting = false;
    renderCraftableDetails();
}

function checkIngredientCount(craftable: Craftable) {
    for (const [ingredientName, ingredient] of getEntries(craftable.crafting!.ingredients)) {
        if (getInventoryCount(ingredientName) < ingredient) {
            addMessage(`You don't have enough ${ingredientName} to craft ${getWithIndefiniteArticle(craftable.name)}!`);
            return false;
        }
    }

    return true;
}

export async function doCrafting() {
    const craftable = player.selectedCraftable;
    if (!craftable || !craftable.crafting)
        return;

    if (player.level < craftable.crafting.requiredLevel) {
        addMessage(`You need level ${craftable.crafting.requiredLevel} to craft ${craftable.name}!`);
        return;
    }

    if (!checkIngredientCount(craftable))
        return;
    
    let craftingTime = 5000;
    for (const [ingredientName, amount] of getEntries(craftable.crafting.ingredients)) {
        craftingTime += 2000 * amount;
    }

    isCrafting = true;
    renderCraftableDetails();
    dom.resetProgressbar("crafting-progress", craftingTime);

    await sleep(craftingTime);

    if (!isCrafting)
        return;
    
    isCrafting = false;

    if (!checkIngredientCount(craftable))
        return;
        
    for (const [ingredientName, amount] of getEntries(craftable.crafting.ingredients)) {
        removeFromInventory(ingredientName, amount);
    }

    let craftableIndex = craftable.type === "Equipment" ? getCraftableEquipment().indexOf(craftable as Equipment) : 0;
    addMessage(`You crafted ${getWithIndefiniteArticle(craftable.name)}!`);
    addLoot(craftable);

    if (craftable.type === "Equipment") {
        const craftableEquipment = getCraftableEquipment();
        const nextCraftableIndex = craftableEquipment.length ? craftableIndex++ % craftableEquipment.length : -1;
        player.selectedCraftable = craftableEquipment[nextCraftableIndex];
    }

    if (craftable.type === "Tool") {
        const craftableTool = getCraftableTools();
        const nextCraftableIndex = craftableTool.length ? craftableIndex++ % craftableTool.length : -1;
        player.selectedCraftable = craftableTool[nextCraftableIndex];
    }
    
    renderCraftables();
    renderInventory();
}

const canCraft = (item: Craftable) => item.crafting && item.crafting.requiredLevel <= player.level;

function renderCraftable(craftable: Craftable) {
    return `<div onclick="crafting.selectItemToCraft('${craftable.name}')" class="item-icon" title="${craftable.name}"><img src="${craftable.iconUrl}" /></div>`;
}

function getCraftableTools() {
    return tools.filter(x => canCraft(x) && !hasInInventory(x.name));
}

function getCraftableEquipment() {
    return equipment.filter(x => canCraft(x) && !ownsEquipment(x.name));
}

export function renderCraftables() {
    const craftableTools = getCraftableTools();
    const craftableEquipment = getCraftableEquipment();
    const craftablePotions = potions.filter(x => canCraft(x));
    
    let html = "<div>";

    if (craftableEquipment.length || craftableTools.length) {
        for (const craftable of craftableTools) {
            html += renderCraftable(craftable);
        }
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
    const ingredients = craftable.crafting!.ingredients;

    let html = "<div>";
    html += `<h3>Item to craft</h3>`;
    html += `<div class="row">`
    html += `<div class="auto-column item-icon" title="${craftable.name}"><img src="${craftable.iconUrl}" /></div>`;
    html += `<div>${craftable.name}<br />${craftable.description}<br /></div>`;
    html += "</div>";
    html += "<br />";

    if (isCrafting) {
        html += `<div class="progress-bar"><span id="crafting-progress" style="width: 0%;"></span></div>`;
        html += `<button onClick="crafting.stopCrafting()">Stop</button>`;
    } else {
        html += `<h3>Ingredients</h3>`
        html += `<div class="crafting-ingredients">`
        for (const [ingredientName, requiredAmount] of getEntries(ingredients)) {
            html += `<span class="crafting-ingredient">`;
    
            const ingredient = resourcesByName[ingredientName];
            html += `<div class="item-icon" title="${ingredient.name}"><img src="${ingredient.iconUrl}" /></div>`;
            
            const ownedAmount = getInventoryCount(ingredientName);
            const classForAmount = ownedAmount < requiredAmount ? "red" : ""
            html += `<span class="${classForAmount}">${displayNumber(ownedAmount)}/${requiredAmount}</span>`;
    
            html += "</span>";
        }
        html += "</div>";
    
        html += "<br />";
        html += `<button onclick="crafting.doCrafting()">Craft</button>`;
    }

    html += "</div>";
    
    dom.setHtml("craftable-details", html);
}

export const actions = {
    selectItemToCraft: wrapAction(selectItemToCraft),
    doCrafting: wrapAction(doCrafting),
    stopCrafting: wrapAction(stopCrafting),
}