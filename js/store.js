import { addMessage } from "./activities.js";
import { randomLootDrop, finalItem } from "./events.js";
import { isInInventory } from "./maintenance.js";
import player from "./player.js";

export function buyAxe() {
    if (player.gold >= 20) {
        if (player.inventory_dictionary["Axe"] > 0) {
            console.log("You already have an axe!");
        }
        else {
            // inventory.push("Axe");
            player.inventory_dictionary["Axe"] = 1;
            // alert("You bought an axe!");
            player.gold -= 20;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy an axe!");
    }
}

export function buyFishingPole() {
    if (player.gold >= 50) {
        if (player.inventory_dictionary["Fishing Pole"] > 0) {
            console.log("You already have a fishing pole!");
        } else {
            // inventory.push("Fishing Pole");
            player.inventory_dictionary["Fishing Pole"] = 1;
            // alert("You bought a fishing pole!");
            player.gold -= 50;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy a fishing pole!");
    }
}

export function buyHuntingRifle() {
    if (player.gold >= 300) {
        if (inventory.includes("Hunting Rifle")) {
            console.log("You already have a hunting rifle!");
        } else {
            // inventory.push("Hunting Rifle");
            player.inventory_dictionary["Hunting Rifle"] = 1;
            // alert("You bought a fishing pole!");
            player.gold -= 300;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy a hunting rifle!");
    }
}

export function buyPickaxe() {
    if (player.gold >= 1200) {
        if (inventory.includes("Pickaxe")) {
            console.log("You already have a pickaxe!");
        } else {
            // inventory.push("Pickaxe");
            player.inventory_dictionary["Pickaxe"] = 1;
            // alert("You bought a fishing pole!");
            player.gold -= 1200;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy a pickaxe!");
    }
}
let boughtTimes = 0;

export function buySpecialDeal() {
    if (player.gold >= 1000) {
        randomLootDrop();
        //add page break after level up message
        isInInventory(finalItem.name, finalItem.type); //this handles adding item and displaying message
        player.gold -= 1000;
    } else {
        addMessage("You do not have enough gold to buy this item!");
    }
}

export function buyInventoryUpgrade() {
    if (boughtTimes < 3) {
        var price = 10000 + (10000 * boughtTimes);
        if (player.gold >= price) {
            player.maxInventorySize += 25;
            boughtTimes++;
            player.gold -= price;
            document.getElementById("inventoryUpgrade").innerHTML = "Buy Inventory Upgrade  [" + price + "<br><br>"
                + "(" + boughtTimes + " / 3)";
            addMessage("Inventory Space increased by 25! [Currently " + player.maxInventorySize + "]");
        }
        else {
            addMessage("You don't have enough gold to buy an inventory upgrade!");
        }
    }
    else {
        document.getElementById("inventoryUpgrade").innerHTML = "Inventory Upgrade [ Maxed ]";
    }
}

setInterval(function () {
    var price = 10000 + (10000 * boughtTimes);
    if (boughtTimes < 3) {
        document.getElementById("inventoryUpgrade").innerHTML = "Buy Inventory Upgrade  [" + price + "]&nbsp;"
            + "(" + boughtTimes + " / 3)";
    }
    else {
        document.getElementById("inventoryUpgrade").innerHTML = "Inventory Upgrade [ Maxed ]";
    }
}, 100);


export function sell(item) {
    player.fullInventory = false;
    if (item == 'Wood') {
        if (player.inventory_dictionary[item] > 0) {
            player.gold += player.inventory_dictionary[item] * 5;
            player.inventory_dictionary[item] = 0;
        }
    }
    else if (item == 'Fish') {
        if (player.inventory_dictionary[item] > 0) {
            player.gold += player.inventory_dictionary[item] * 10;
            player.inventory_dictionary[item] = 0;
        }
    }
    else if (item == 'Meat') {
        if (player.inventory_dictionary[item] > 0) {
            player.gold += player.inventory_dictionary[item] * 20;
            player.inventory_dictionary[item] = 0;
        }
    }
    else if (item == 'Ores') {
        //remove all ores in inventory
        let goldTable = {
            "Iron": 120,
            "Copper": 125,
            "Tin": 115,
            "Silver": 150,
            "Gold": 125,
            "Emerald": 130,
            "Ruby": 160,
            "Diamond": 1100
        };

        for (let key in goldTable) {
            if (player.inventory_dictionary[key] > 0) {
                player.gold += player.inventory_dictionary[key] * goldTable[key];
                player.inventory_dictionary[key] = 0;
            }
            // if (inventory[i] in goldTable) {
            //     inventory.splice(i, 1);
            //     gold += Object.values(goldTable)[i];
            // }
        }
    }
    else if (item == "Stone") {
        if (player.inventory_dictionary[item] > 0) {
            player.inventory_dictionary[item] = 0;
            player.gold += player.inventory_dictionary[item] * 5;
        }
    }
}
