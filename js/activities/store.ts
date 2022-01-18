import * as dom from '../util/dom';
import { randomLootDrop } from "./events";
import { addToInventory, getInventoryCount, hasInInventory, InventoryItemName, isInventoryFull, removeAllFromInventory, removeFromInventory, renderInventory } from "../control/inventory";
import { itemsByName } from "../data/items";
import { addMessage } from '../control/messages';
import player, { addGold, removeGold } from "../control/player";
import { ToolName } from '../data/items/tools';
import { addLoot } from './looting';

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
    renderInventoryUpgrade();
    renderInventory();
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
}

function sellItem(itemName: InventoryItemName, amount?: number) {
    amount ||= getInventoryCount(itemName);
    addGold(amount * itemsByName[itemName].price);
    removeFromInventory(itemName, amount);
    renderInventory();
}

export function renderInventoryUpgrade () {
    if (player.boughtInventoryUpgrade < 3)
        dom.setHtml("inventoryUpgrade", `Buy Inventory Upgrade [${getInventoryUpgradeCost()}]&nbsp;(${player.boughtInventoryUpgrade} / 3)`);
    else
        dom.setHtml("inventoryUpgrade", "Inventory Upgrade [ Maxed ]");
}
