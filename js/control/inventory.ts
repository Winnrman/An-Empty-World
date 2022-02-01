import player from "./player";
import { Resource, ResourceName, resourcesByName } from "../data/items/resources";
import { Potion, PotionName, potionsByName } from "../data/items/potions";
import { Tool, ToolName, toolsByName } from "../data/items/tools";
import * as dom from "../util/dom";
import { displayNumber, getKeys, tweenArrays } from "../util";
import { applyEffects } from "./effects";
import { renderCraftableDetails, renderCraftables } from "../activities/crafting";
import { addMessage } from "./messages";
import iconCoins from "../../img/assets/materials/Coins.png";
import { renderStore } from "../activities/store";
import { renderActivities } from "../activities/activities";
import { wrapAction } from "./user";

import "../../css/inventory.css";

export type InventoryItemName = ToolName | ResourceName | PotionName;
export type InventoryItem = Tool | Resource | Potion;
export const inventoryItemsByName: Record<InventoryItemName, InventoryItem> = { ...toolsByName, ...resourcesByName, ...potionsByName };

function calculateInventorySpace() {
    return Object.values(player.inventory).reduce((a, b) => a + b, 0);
}

export function isInventoryFull() {
	return calculateInventorySpace() >= player.maxInventorySize;
}

export function getInventoryCount(itemName: InventoryItemName) {
    return displayNumber(player.inventory[itemName] ?? 0);
}

export function hasInInventory(itemName: InventoryItemName) {
    return getInventoryCount(itemName) > 0;
}

export function addToInventory(itemName: InventoryItemName, amount: number) {
    const leftSpace = player.maxInventorySize - calculateInventorySpace();
    if (leftSpace < amount) {
        addMessage(`you were receiving ${amount} ${itemName}, but didn't have space for it so you got ${leftSpace > 0 ? `only ${leftSpace}` : 'none'}!`);
        amount = leftSpace;
    }
    player.inventory[itemName] = (player.inventory[itemName] ?? 0) + amount;
    renderInventory();
}

export function addToolToInventory(tool: Tool) {
    addToInventory(tool.name, 1);
    player.toolHealth[tool.name] = tool.tool.health;
}

export async function removeFromInventory(itemName: InventoryItemName, amount: number) {
    player.inventory[itemName] = Math.max(0, (player.inventory[itemName] ?? 0) - amount);
    renderInventory();
}

export async function removeAllFromInventory(itemName: InventoryItemName) {
    player.inventory[itemName] = 0;
    renderInventory();
}

export function decreaseToolHealth(toolName: ToolName) {
    player.toolHealth[toolName] -= 1;
    
    if (player.toolHealth[toolName] <= 0) {
        addMessage(`Your ${toolName} broke!`);
        removeFromInventory(toolName, 1);
    }

    renderInventory();
}

export async function showItemDetails(itemName: InventoryItemName) {
    player.selectedItemName = itemName;
    renderInventory();
}

export async function drinkPotion(itemName: PotionName) {
    if (!hasInInventory(itemName))
        return;
    
    const potion = potionsByName[itemName];
    applyEffects(potion.effects);
    removeFromInventory(itemName, 1);
}

function getAllItemsInInventory () {
    return getKeys(player.inventory).filter(x => hasInInventory(x)).map(x => inventoryItemsByName[x]);
};

export function renderInventory() {
    dom.setHtml("inventoryHeader", `Inventory (${displayNumber(calculateInventorySpace())}/${player.maxInventorySize})`);
    renderItems();
    renderSelectedItemDetails();
    renderCraftables();
    renderCraftableDetails();  
    renderStore();
    renderActivities();
}

function renderToolList(items: Tool[]) {
    let html = "";

    if (player.gold > 0)
        html += `<div class="item"><div class="item-icon inventory" title="gold"><img src="${iconCoins}" /></div><br /><div class="inventory-count">${displayNumber(player.gold)}</div></div>`;
    
    for (const item of items) {
        const durability = player.toolHealth[item.name] / item.tool.health!;
        const height = 100 - durability * 100;
        const color = tweenArrays(durability, [255, 0, 0], [39, 39, 39]); // this will get a color that's red for 0% durability and our grey for 100% durability
        const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        html += `<div class="item" onClick="inventory.showItemDetails('${item.name}')">`
        html += `<div class="item-icon inventory" title="${item.name} - ${player.toolHealth[item.name]}/${item.tool.health}">`
        html += `<img style="background: repeating-linear-gradient(transparent, transparent, ${height}%, ${rgb}, ${height}%, ${rgb} 100%);" src="${item.iconUrl}" />`;
        html += "</div>";
        html += "<br />";
        html += `<div class="inventory-count">${displayNumber(getInventoryCount(item.name))}</div>`;
        html += "</div>";
    }

    return html;
}

function renderItemList(items: InventoryItem[]) {
    let html = "";
    for (const item of items) {
        html += `<div class="item" onClick="inventory.showItemDetails('${item.name}')">${renderItemIcon(item)}<br /><div class="inventory-count">${displayNumber(getInventoryCount(item.name))}</div></div>`;
    }
    html += items.length ? "<br />" : "";

    return html;
}

function renderItems() {
    let html = "";
    const allItems = getAllItemsInInventory();

    html += renderToolList(allItems.filter(x => x.type === "Tool").map(x => x as Tool));
    html += renderItemList(allItems.filter(x => x.type !== "Tool"));

    dom.setHtml("inventory", html);
}

function renderItemIcon(item: InventoryItem) {
    return `<div class="item-icon" title="${item.name}"><img src="${item.iconUrl}" /></div>`;
}

function renderSelectedItemDetails() {
    if (!player.selectedItemName || !hasInInventory(player.selectedItemName)) {
        dom.setHtml("itemDetails", "");
        player.selectedItemName = undefined;
        return;
    }
    
    const item = inventoryItemsByName[player.selectedItemName];
    const hasDurability = item.type === "Tool";
    const canDrink = item.type === "Potion";
    const canSell = item.type !== "Tool" && player.currentActivity === "Store";
    const tool = item as Tool;

    let html = `
        <h3>Item details</h3>
        ${renderItemIcon(item)} ${item.name}<br />
        Description: ${item.description}<br />
        ${hasDurability ? `Durability: ${player.toolHealth[tool.name]}/${tool.tool.health}<br />` : ""}
        Amount owned: ${displayNumber(getInventoryCount(item.name))}<br />
        <br />
        ${"<h3>Actions<h3>"}
        ${canSell ?      `<button onclick="store.sell('${item.name}', 1)">Sell one</button>&nbsp;` : ""}
        ${canSell ?      `<button onclick="store.sell('${item.name}')">Sell all</button>&nbsp;` : ""}
        ${canSell ? "" : `<button onclick="inventory.removeFromInventory('${item.name}', 1)">Drop one</button>&nbsp;`}
        ${canSell ? "" : `<button onclick="inventory.removeAllFromInventory('${item.name}')">Drop all</button>&nbsp;`}
        ${canDrink ?     `<button onclick="inventory.drinkPotion('${item.name}')">Drink</button>&nbsp;` : ""}
    `;

    dom.setHtml("itemDetails", html);
}

export const actions = {
    showItemDetails: wrapAction(showItemDetails),
    removeFromInventory: wrapAction(removeFromInventory),
    removeAllFromInventory: wrapAction(removeAllFromInventory),
    drinkPotion: wrapAction(drinkPotion),
}