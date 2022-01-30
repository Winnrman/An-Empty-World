import * as dom from '../util/dom';
import { randomLootDrop } from "./events";
import { addToInventory, getInventoryCount, hasInInventory, InventoryItemName, isInventoryFull, removeAllFromInventory, removeFromInventory, renderInventory } from "../control/inventory";
import { itemsByName } from "../data/items";
import { addMessage } from '../control/messages';
import player, { addGold, removeGold, saveData } from "../control/player";
import { ToolName } from '../data/items/tools';
import { addLoot } from './looting';
import { levelUnlocks } from '../control/experience';
import resources from '../data/items/resources';

function buyTool(type: ToolName, text: string) {
    const price = itemsByName[type].price;
    if (player.gold < price) {
        addMessage(`You don't have enough gold to buy ${text}!`);
        return;
    }

    if (hasInInventory(type)) {
        addMessage(`You already have ${text}!`);
        return;
    }

    if (isInventoryFull()) {
        addMessage(`Your inventory is full!`);
        return;
    }

    removeGold(price);
    addToInventory(type, 1);
    renderInventory();
    saveData();
}

export function buyAxe() {
    buyTool("Axe", "an axe");
}

export function buyFishingPole() {
    buyTool("Fishing Pole", "a fishing pole");
}

export function buyHuntingRifle() {
    buyTool("Hunting Rifle", "a hunting rifle");
}

export function buyPickaxe() {
    buyTool("Pickaxe", "a pickaxe");
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

    const ores = resources.filter(x => x.mining && x.name != "Stone");

    let html = "";
    html += ``;
    html += `<span style="display: inline-flex">`;
    html += `<h3 class="subheader" id="buyHeader">Buy</h3>`;

    html += renderButton(levelUnlocks.treeCutting, !hasInInventory("Axe"), "buyAxe()", "Buy Axe", 20);    
    html += renderButton(levelUnlocks.fishing, !hasInInventory("Fishing Pole"), "buyFishingPole()", "Buy Fishing Pole", 50);
    html += renderButton(levelUnlocks.hunting, !hasInInventory("Hunting Rifle"), "buyHuntingRifle()", "Buy Hunting Rifle", 300);
    html += renderButton(levelUnlocks.mining, !hasInInventory("Pickaxe"), "buyPickaxe()", "Buy Pickaxe", 1200);
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