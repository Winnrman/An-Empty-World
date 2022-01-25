import * as dom from '../util/dom';
import { randomLootDrop } from "./events";
import { addToolToInventory, getInventoryCount, hasInInventory, InventoryItemName, isInventoryFull, removeAllFromInventory, removeFromInventory, renderInventory } from "../control/inventory";
import { itemsByName } from "../data/items";
import { addMessage } from '../control/messages';
import player, { addGold, removeGold, saveData } from "../control/player";
import { ToolName, toolsByName } from '../data/items/tools';
import { addLoot } from './looting';
import { levelUnlocks } from '../control/experience';
import resources from '../data/items/resources';
import { getWithIndefiniteArticle } from '../util';

export function buyTool(toolName: ToolName) {
    const tool = toolsByName[toolName];
    if (player.gold < tool.price) {
        addMessage(`You don't have enough gold to buy ${getWithIndefiniteArticle(tool.name)}!`);
        return;
    }

    if (hasInInventory(toolName)) {
        addMessage(`You already have ${getWithIndefiniteArticle(tool.name)}!`);
        return;
    }
 
    if (isInventoryFull()) {
        addMessage(`Your inventory is full!`);
        return;
    }

    removeGold(tool.price);
    addToolToInventory(tool);
    saveData();
}

export function buySpecialDeal() {
    if (player.gold < 1000) {
        addMessage("You do not have enough gold to buy this item!");
        return;
    }

    removeGold(1000);
    const item = randomLootDrop();
    addLoot(item);
}

function getInventoryUpgradeCost() {
    return 10000 + 10000 * player.boughtInventoryUpgrade;
}

export function buyInventoryUpgrade() {
    if (player.boughtInventoryUpgrade >= 3)
        return;

    var price = getInventoryUpgradeCost();
    if (player.gold < price) {
        addMessage("You don't have enough gold to buy an inventory upgrade!");
        return;
    }

    removeGold(price);
    player.maxInventorySize += 25;
    player.boughtInventoryUpgrade++;
    addMessage(`Inventory Space increased by 25! [Currently ${player.maxInventorySize}]`);
    renderInventory();
    saveData();
}

export type SellType = "Ores" | InventoryItemName;

export function sell(item: SellType, amount?: number) {
    if (item === "Ores") {
        sellItems(["Iron", "Copper", "Tin", "Silver", "Gold", "Emerald", "Ruby", "Diamond"]);
        return;
    }
    
    sellItem(item, amount);
}

function sellItems(itemNames: InventoryItemName[]) {
    for (const itemName of itemNames) {
        addGold(getInventoryCount(itemName) * itemsByName[itemName].price);
        removeAllFromInventory(itemName);
    }
    renderInventory();
    saveData();
}

function sellItem(itemName: InventoryItemName, amount?: number) {
    amount ||= getInventoryCount(itemName);
    addGold(amount * itemsByName[itemName].price);
    removeFromInventory(itemName, amount);
    renderInventory();
    saveData();
}

export function renderStore() {

    const renderButton = (requiredLevel: number, requirement: boolean, action: string, text: string, price?: number) => {
        if (player.level < requiredLevel || !requirement)
            return "";
        
        const pricePart = price ? ` [ ${price} ]` : "";
        return `<button class="store button" onclick="store.${action}">${text}${pricePart}</button> `
    }

    const renderToolButton = (requiredLevel: number, toolName: ToolName) => {
        return renderButton(requiredLevel, !hasInInventory(toolName), `buyTool('${toolName}')`, `Buy ${toolName}`, toolsByName[toolName].price);
    }

    const ores = resources.filter(x => x.mining && x.name != "Stone");

    let html = "";
    html += ``;
    html += `<span style="display: inline-flex">`;
    html += `<h3 class="subheader" id="buyHeader">Buy</h3>`;

    html += renderToolButton(levelUnlocks.treeCutting, "Axe");
    html += renderToolButton(levelUnlocks.treeCutting, "Fishing Pole");
    html += renderToolButton(levelUnlocks.treeCutting, "Hunting Rifle");
    html += renderToolButton(levelUnlocks.treeCutting, "Pickaxe");
    html += renderButton(levelUnlocks.inventoryUpgrade, player.boughtInventoryUpgrade < 3, "buyInventoryUpgrade()", `Buy Inventory Upgrade ${player.boughtInventoryUpgrade} / 3`, getInventoryUpgradeCost());

    html += `<h3 class="subheader">Special Deals</h3>`;
    html += renderButton(levelUnlocks.store, true, "buySpecialDeal()", "Buy Random Armor Piece", 1000);
    html += `</span>`;
    html += `<br><br>`;
    html += `<div style="display: inline-flex">`;
    html += `<h3 class="subheader" id="sellHeader">Sell</h3>`;

    html += renderButton(levelUnlocks.treeCutting, hasInInventory("Wood"), "sell('Wood')", "Sell Wood");
    html += renderButton(levelUnlocks.fishing, hasInInventory("Fish"), "sell('Fish')", "Sell Fish");
    html += renderButton(levelUnlocks.hunting, hasInInventory("Meat"), "sell('Meat')", "Sell Meat");
    html += renderButton(levelUnlocks.mining, hasInInventory("Stone"), "sell('Stone')", "Sell Stone");
    html += renderButton(levelUnlocks.mining, ores.some(x => hasInInventory(x.name)), "sell('Ores')", "Sell Ores");
    html += renderButton(levelUnlocks.mining, hasInInventory("Iron"), "sell('Iron')", "Sell Iron");
    
    html += `</div>`;

    dom.setHtml("store", html);
}