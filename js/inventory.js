import player from "./player.js";

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

export function renderInventory() {
    document.getElementById("axeDurability").innerHTML = `Axe: ${player.axeHealth}/20`;
    document.getElementById("pickaxeDurability").innerHTML = `&nbsp;| Pickaxe: ${player.pickaxeHealth}/75`;
    document.getElementById("rifleDurability").innerHTML = `&nbsp;| Rifle: ${player.huntingRifleHealth}/50`;
    document.getElementById("fishingPoleDurability").innerHTML = `&nbsp;| Fishing Pole: ${player.fishingPoleHealth}/10`;
    document.getElementById("inventoryHeader").innerHTML = `Inventory (${calculateInventorySpace()}/${player.maxInventorySize})`;

    const getPart = (type) => `${type} x${player.inventory_dictionary[type]}`;
    const getParts = (types) => types.map(x => getPart(x)).join("&nbsp;|&nbsp;");

    document.getElementById("inventory-tools").innerHTML = getParts(["Axe", "Pickaxe", "Hunting Rifle", "Fishing Pole"]);
    document.getElementById("inventory-basic").innerHTML = getParts(["Wood", "Fish", "Meat", "Stone"]);
    document.getElementById("inventory-ores").innerHTML = getParts(["Iron", "Copper", "Tin", "Silver", "Gold"]);
    document.getElementById("inventory-gems").innerHTML = getParts(["Emerald", "Ruby", "Diamond"]);
}