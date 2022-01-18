import player from "./player";
import { Item, itemsByName } from "../data/items";
import { Resource, ResourceName, resourcesByName } from "../data/items/resources";
import { Potion, PotionName, potionsByName } from "../data/items/potions";
import { Tool, ToolName, toolsByName } from "../data/items/tools";
import * as dom from "../util/dom";
import { getEntries, getKeys, PartialRecord } from "../util";

export type InventoryItemName = ToolName | ResourceName | PotionName;
export type InventoryItem = Tool | Resource | Potion;
export const inventoryItemsByName: Record<InventoryItemName, InventoryItem> = { ...toolsByName, ...resourcesByName, ...potionsByName };

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
}

export function removeFromInventory(itemName: InventoryItemName, amount: number) {
    if (!player.inventory_dictionary[itemName])
        player.inventory_dictionary[itemName] = 0;
    
    player.inventory_dictionary[itemName] -= amount;
}

export function removeAllFromInventory(itemName: InventoryItemName) {
    player.inventory_dictionary[itemName] = 0;
}

export function renderInventory() {
    dom.setHtml("inventoryHeader", `Inventory (${calculateInventorySpace()}/${player.maxInventorySize})`);
    renderItems();
    renderDurability();
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
            html += `${item} x${getInventoryCount(item)}&nbsp;|&nbsp;`;
        }
        html = html.substring(0, html.length - 13); // to remove the last separator
        html += "<br />";
    }

    dom.setHtml("inventory", html);
}

function renderDurability() {
    let html = "";
    for (var itemName of getKeys(player.inventory_dictionary)) {
        const item = itemsByName[itemName];
        if (item.type === "Tool") {
            html += `<li>${item.name}: ${player.toolHealth[item.name]}/${item.health}</li>`;
        }
    }

    dom.setHtml("durability", html);
}