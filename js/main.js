import * as achievements from "./achievements.js"; // this may look unnecessary but it's needed to load the file to start the interval. We might want to make this explicit by calling the start interval in this file
import * as activities from "./activities.js";
import * as crafting from "./crafting.js";
import player, { saveData, resetData } from "./player.js";
import * as store from "./store.js";
import * as questing from "./questing.js";
import { loadOptionsFromOwnedEquipment } from "./maintenance.js";

window.player = player;
window.store = store;
window.activities = activities;
window.crafting = crafting;
window.questing = questing;
window.saveData = saveData;
window.resetData = function () {
    resetData();
    window.location.reload();
};

//calculate inventory space
function calculateInventorySpace() {
    let inventorySpace = 0;
    for (let key in player.inventory_dictionary) {
        inventorySpace += player.inventory_dictionary[key];
    }
    return inventorySpace;
}

setInterval(function () {
    document.getElementById("gold").innerHTML = player.gold;
    player.inventory.sort();
    checkDarkMode();

    document.getElementById("axeDurability").innerHTML = "Axe: " + player.axeHealth + "/20";
    document.getElementById("pickaxeDurability").innerHTML = "&nbsp;| Pickaxe: " + player.pickaxeHealth + "/75";
    document.getElementById("rifleDurability").innerHTML = "&nbsp;| Rifle: " + player.huntingRifleHealth + "/50";
    document.getElementById("fishingPoleDurability").innerHTML = "&nbsp;| Fishing Pole: " + player.fishingPoleHealth + "/10";
    document.getElementById("inventoryHeader").innerHTML = "Inventory (" + calculateInventorySpace() + "/" + player.maxInventorySize + ")";

    const getPart = (type) => `${type} x${player.inventory_dictionary[type]}`;
    const getParts = (types) => types.map(x => getPart(x)).join("&nbsp;|&nbsp;");

    document.getElementById("inventory-tools").innerHTML = getParts(["Axe", "Pickaxe", "Hunting Rifle", "Fishing Pole"]);
    document.getElementById("inventory-basic").innerHTML = getParts(["Wood", "Fish", "Meat", "Stone"]);
    document.getElementById("inventory-ores").innerHTML = getParts(["Iron", "Copper", "Tin", "Silver", "Gold"]);
    document.getElementById("inventory-gems").innerHTML = getParts(["Emerald", "Ruby", "Diamond"]);
}, 100);

setInterval(function () {
    saveData();
}, 5000);


function checkDarkMode() {
    var hours = new Date().getHours();
    if (hours >= 15 || hours < 8) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

loadOptionsFromOwnedEquipment();
activities.checkLevelUnlocks();
crafting.renderCraftables();