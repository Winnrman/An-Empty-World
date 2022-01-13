import * as dom from './dom.js';
import { randomLootDrop, finalItem } from "./events.js";
import { addToOwnedEquipment } from "./maintenance.js";
import { addMessage } from './messages.js';
import player, { addGold, removeGold } from "./player.js";

function buyTool(type, text, price) {
    if (player.gold < price) {
        addMessage(`You don't have enough gold to buy ${text}!`);
        return;
    }

    if (player.inventory_dictionary[type] > 0) {
        addMessage(`You already have ${text}!`);
        return;
    }

    removeGold(price);
    player.inventory_dictionary[type] = 1;
}

export function buyAxe() {
    buyTool("Axe", "an axe", 20);
}

export function buyFishingPole() {
    buyTool("Fishing Pole", "a fishing pole", 50);
}

export function buyHuntingRifle() {
    buyTool("Hunting Rifle", "a hunting rifle", 300);
}

export function buyPickaxe() {
    buyTool("Pickaxe", "a pickaxe", 1200);
}

export function buySpecialDeal() {
    if (player.gold < 1000) {
        addMessage("You do not have enough gold to buy this item!");
        return;
    }

    removeGold(1000);
    randomLootDrop();
    addToOwnedEquipment(finalItem.name, finalItem.type);
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
}

const goldTable = {
    "Wood": 5,
    "Fish": 10,
    "Meat": 20,
    "Stone": 5,
    "Iron": 120,
    "Copper": 125,
    "Tin": 115,
    "Silver": 150,
    "Gold": 125,
    "Emerald": 130,
    "Ruby": 160,
    "Diamond": 1100
};

export function sell(item) {
    if (item === "Ores") {
        sellItem("Iron");
        sellItem("Copper");
        sellItem("Tin");
        sellItem("Silver");
        sellItem("Gold");
        sellItem("Emerald");
        sellItem("Ruby");
        sellItem("Diamond");
        return;
    }
    
    sellItem(item);
}

function sellItem(type) {
    player.fullInventory = false;

    addGold(player.inventory_dictionary[type] * goldTable[type]);
    player.inventory_dictionary[type] = 0;
}

export function renderInventoryUpgrade () {
    if (player.boughtInventoryUpgrade < 3)
        dom.setHtml("inventoryUpgrade", `Buy Inventory Upgrade [${getInventoryUpgradeCost()}]&nbsp;(${player.boughtInventoryUpgrade} / 3)`);
    else
        dom.setHtml("inventoryUpgrade", "Inventory Upgrade [ Maxed ]");
}
