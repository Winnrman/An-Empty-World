import * as dom from './dom.js';
import { randomLootDrop } from "./events.js";
import { isInventoryFull, renderInventory } from "./inventory.js";
import { itemsByName } from "./items.js";
import { addToOwnedEquipment } from "./equipment.js";
import { addMessage } from './messages.js';
import player, { addGold, removeGold } from "./player.js";
import { displayCraftingNeededMaterials } from './crafting.js';

function buyTool(type, text) {
    const price = itemsByName[type].price;
    if (player.gold < price) {
        addMessage(`You don't have enough gold to buy ${text}!`);
        return;
    }

    if (player.inventory_dictionary[type] > 0) {
        addMessage(`You already have ${text}!`);
        return;
    }

    if (isInventoryFull()) {
        addMessage(`Your inventory is full!`);
        return;
    }

    removeGold(price);
    player.inventory_dictionary[type] = 1;
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
    addToOwnedEquipment(item);
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
        renderInventory();
        return;
    }
    
    sellItem(item);
    displayCraftingNeededMaterials();
    renderInventory();
}

function sellItem(type) {
    addGold(player.inventory_dictionary[type] * itemsByName[type].price);
    player.inventory_dictionary[type] = 0;
}

export function renderInventoryUpgrade () {
    if (player.boughtInventoryUpgrade < 3)
        dom.setHtml("inventoryUpgrade", `Buy Inventory Upgrade [${getInventoryUpgradeCost()}]&nbsp;(${player.boughtInventoryUpgrade} / 3)`);
    else
        dom.setHtml("inventoryUpgrade", "Inventory Upgrade [ Maxed ]");
}
