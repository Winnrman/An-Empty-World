import player from "./player";
import { itemsByName } from "../data/items";
import { Resource, ResourceName, resourcesByName } from "../data/items/resources";
import { Potion, PotionName, potionsByName } from "../data/items/potions";
import { Tool, ToolName, toolsByName } from "../data/items/tools";
import * as dom from "../util/dom";
import { getEntries, getKeys, PartialRecord } from "../util";
import { applyEffects } from "./effects";
import { displayCraftingNeededMaterials } from "../activities/crafting";
import { addMessage } from "./messages";

export type InventoryItemName = ToolName | ResourceName | PotionName;
export type InventoryItem = Tool | Resource | Potion;
export const inventoryItemsByName: Record<InventoryItemName, InventoryItem> = { ...toolsByName, ...resourcesByName, ...potionsByName };

let selectedItemName: InventoryItemName;

function calculateInventorySpace() {
	let inventorySpace = 0;
	for (let key in player.inventory_dictionary) {
		inventorySpace += player.inventory_dictionary[key];
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
    selectedItemName = itemName;
    renderInventory();
}

export function drinkPotion(itemName: PotionName) {
    if (!hasInInventory(itemName))
        return;
    
    const potion = potionsByName[itemName];
    applyEffects(potion.effects);
    removeFromInventory(itemName, 1);
}

export function renderInventory() {
    dom.setHtml("inventoryHeader", `Inventory (${calculateInventorySpace()}/${player.maxInventorySize})`);
    renderItems();
    renderDurability();
    renderSelectedItemDetails();
    displayCraftingNeededMaterials();
}

type Category = "Tool" | "Basic" | "Ore" | "Gem" | "Potion" | "Other";
const categoriesAsItemType = ["Tool", "Potion"];
const categoriesAsItemNames: PartialRecord<Category, InventoryItemName[]> = {
    "Basic": ["Wood", "Fish", "Meat", "Stone"],
    "Ore": ["Iron", "Copper", "Tin", "Silver", "Gold"],
    "Gem": ["Emerald", "Ruby", "Diamond"],
};

function renderItems() {
	const categories: PartialRecord<Category, InventoryItemName[]> = {};

    const getCategory = (item: InventoryItem): Category => {
        if (categoriesAsItemType.includes(item.type))
            return item.type as Category;
        
        for (const [category, itemNames] of getEntries(categoriesAsItemNames)) {
            if (itemNames.includes(item.name))
                return category;
        }
        
        return "Other";
    }

	for (const itemName of getKeys(player.inventory_dictionary)) {
        if (!hasInInventory(itemName))
            continue;
        
        const item = inventoryItemsByName[itemName];
        const category = getCategory(item);
        if (!categories[category])
            categories[category] = [];
        categories[category].push(itemName);
    }

    let html = "";
    for (const itemsOfCategory of Object.values(categories)) {
        for (const item of itemsOfCategory) {
            html += `<span onClick="inventory.showItemDetails('${item}')">${item} x${getInventoryCount(item)}</span>&nbsp;|&nbsp;`;
        }
        html = html.substring(0, html.length - 13); // to remove the last separator
        html += "<br />";
    }

    dom.setHtml("inventory", html);
}

function renderDurability() {
    let html = "";
    for (var itemName of getKeys(player.inventory_dictionary)) {
        if (!hasInInventory(itemName))
            continue;
        
        const item = itemsByName[itemName];
        if (item.type === "Tool") {
            html += `<li>${item.name}: ${player.toolHealth[item.name]}/${item.health}</li>`;
        }
    }

    dom.setHtml("durability", html);
}

function renderSelectedItemDetails() {
    if (!selectedItemName || !hasInInventory(selectedItemName)) {
        dom.setHtml("itemDetails", "");
        selectedItemName = undefined;
        return;
    }
    
    const item = inventoryItemsByName[selectedItemName];
    const hasDurability = item.type === "Tool";
    const canDrink = item.type === "Potion";
    const canSell = item.type !== "Tool";
    const hasActions = canDrink || canSell;

    let html = `
        <h3>Item details</h3>
        Item: ${item.name}
        <img src="${item.iconUrl}" /><br />
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