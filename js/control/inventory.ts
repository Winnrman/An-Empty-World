import player from "./player";
import { itemsByName } from "../data/items";
import { Resource, ResourceName, resourcesByName } from "../data/items/resources";
import { Potion, PotionName, potionsByName } from "../data/items/potions";
import { Tool, ToolName, toolsByName } from "../data/items/tools";
import * as dom from "../util/dom";
import { getEntries, getKeys, PartialRecord, tween, tweenArrays } from "../util";
import { applyEffects } from "./effects";
import { renderCraftableDetails } from "../activities/crafting";
import { addMessage } from "./messages";

import "../../css/inventory.css";

export type InventoryItemName = ToolName | ResourceName | PotionName;
export type InventoryItem = Tool | Resource | Potion;
export const inventoryItemsByName: Record<InventoryItemName, InventoryItem> = { ...toolsByName, ...resourcesByName, ...potionsByName };

function calculateInventorySpace() {
	let inventorySpace = 0;
	for (let amount of Object.values(player.inventory_dictionary)) {
		inventorySpace += amount;
	}
	return inventorySpace;
}

export function isInventoryFull() {
	return calculateInventorySpace() >= player.maxInventorySize;
}

export function getInventoryCount(itemName: InventoryItemName) {
    return player.inventory_dictionary[itemName] ?? 0;
}

export function hasInInventory(itemName: InventoryItemName) {
    return getInventoryCount(itemName) > 0;
}

export function addToInventory(itemName: InventoryItemName, amount: number) {
    if (!player.inventory_dictionary[itemName])
        player.inventory_dictionary[itemName] = 0;
    
    player.inventory_dictionary[itemName] += amount;
    renderInventory();    
}

export function removeFromInventory(itemName: InventoryItemName, amount: number) {
    if (!player.inventory_dictionary[itemName])
        player.inventory_dictionary[itemName] = 0;
    
    player.inventory_dictionary[itemName] -= amount;
    renderInventory();
}

export function removeAllFromInventory(itemName: InventoryItemName) {
    player.inventory_dictionary[itemName] = 0;
    renderInventory();
}

export function decreaseToolHealth(toolName: ToolName) {
    player.toolHealth[toolName] -= 1;
    
    if (player.toolHealth[toolName] <= 0) {
        addMessage(`Your ${toolName} broke!`);
        removeFromInventory(toolName, 1);
        player.toolHealth[toolName] = itemsByName[toolName].health;
    }

    renderInventory();
}

export function showItemDetails(itemName: InventoryItemName) {
    player.selectedItemName = itemName;
    renderInventory();
}

export function drinkPotion(itemName: PotionName) {
    if (!hasInInventory(itemName))
        return;
    
    const potion = potionsByName[itemName];
    applyEffects(potion.effects);
    removeFromInventory(itemName, 1);
}

function getAllItemsInInventory () {
    return getKeys(player.inventory_dictionary).filter(x => hasInInventory(x)).map(x => inventoryItemsByName[x]);
};

export function renderInventory() {
    dom.setHtml("inventoryHeader", `Inventory (${calculateInventorySpace()}/${player.maxInventorySize})`);
    renderItems();
    renderSelectedItemDetails();
    renderCraftableDetails();
}

function renderToolList(items: InventoryItem[]) {
    let html = "";
    for (const item of items) {
        const durability = player.toolHealth[item.name] / item.health;
        const height = 100 - durability * 100;
        const color = tweenArrays(durability, [255, 0, 0], [39, 39, 39]); // this will get a color that's red for 0% durability and our grey for 100% durability
        const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        html += `<span class="item" onClick="inventory.showItemDetails('${item.name}')">`
        html += `<div class="item-icon inventory" title="${item.name} - ${player.toolHealth[item.name]}/${item.health}">`
        html += `<img style="background: repeating-linear-gradient(transparent, transparent, ${height}%, ${rgb}, ${height}%, ${rgb} 100%);" src="${item.iconUrl}" />`;
        html += "</div>";
        html += `<span class="inventory-count">${getInventoryCount(item.name)}</span>`;
        html += "</span>";
    }
    html += items.length ? "<br />" : "";

    return html;
}

function renderItemList(items: InventoryItem[]) {
    let html = "";
    for (const item of items) {
        html += `<span class="item" onClick="inventory.showItemDetails('${item.name}')">${renderItemIcon(item)} <span class="inventory-count">${getInventoryCount(item.name)}</span></span>`;
    }
    html += items.length ? "<br />" : "";

    return html;
}

function renderItems() {
    let html = "";
    const allItems = getAllItemsInInventory();
    html += renderToolList(allItems.filter(x => x.type === "Tool"));
    html += renderItemList(allItems.filter(x => x.type === "Potion"));
    html += renderItemList(allItems.filter(x => x.type === "Resource"));

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
    const canSell = item.type !== "Tool";
    const hasActions = canDrink || canSell;

    let html = `
        <h3>Item details</h3>
        ${renderItemIcon(item)} ${item.name}<br />
        Description: ${item.description}<br />
        ${hasDurability ? `Durability: ${player.toolHealth[item.name]}/${item.health}<br />` : ""}
        Amount owned: ${getInventoryCount(item.name)}<br />
        <br />
        ${hasActions ? "<h3>Actions<h3>" : ""}
        ${canSell ? `<button class="button" onclick="store.sell('${item.name}', 1)">Sell one</button>&nbsp;` : ""}
        ${canSell ? `<button class="button" onclick="store.sell('${item.name}')">Sell all</button>&nbsp;` : ""}
        ${canDrink ? `<button class="button" onclick="inventory.drinkPotion('${item.name}')">Drink</button>&nbsp;` : ""}
    `;

    dom.setHtml("itemDetails", html);
}