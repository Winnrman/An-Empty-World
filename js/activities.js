import player from "./player.js";
import { addMessage } from "./messages.js";
import { addXp } from "./experience.js";

export function tree() {
    if (player.inventory_dictionary["Axe"] == 1) {
        if (player.axeHealth <= 0) {
            addMessage("Your axe broke!");
            player.inventory_dictionary["Axe"] = 0;
            player.axeHealth = 20;
        } else {
            if (player.fullInventory == false) {
                player.inventory_dictionary["Wood"] += 1;
                player.axeHealth -= 1;
                addXp(10);
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need an axe to cut down trees!");
    }
}

export function goFishing() {
    if (player.inventory_dictionary["Fishing Pole"] == 1) {
        if (player.fishingPoleHealth <= 0) {
            addMessage("Your fishing pole broke!");
            player.inventory_dictionary["Fishing Pole"] = 0;
            player.fishingPoleHealth = 10;
        } else {
            if (player.fullInventory == false) {
                player.inventory_dictionary["Fish"] += 1;
                player.fishingPoleHealth -= 1;
                addXp(15);
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need a fishing pole to fish!");
    }
}

export function goHunting() {
    if (player.inventory_dictionary["Hunting Rifle"] == 1) {
        if (player.huntingRifleHealth <= 0) {
            addMessage("Your hunting rifle broke!");
            player.inventory_dictionary["Hunting Rifle"] = 0;
            player.huntingRifleHealth = 50;
        } else {
            if (player.fullInventory == false) {
                player.inventory_dictionary["Meat"] += 1;
                player.huntingRifleHealth -= 1;
                addXp(50);
            }
            else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    }
    else {
        addMessage("You need a hunting rifle to hunt!");
    }
}

export function goMining() {
    if (player.inventory_dictionary["Pickaxe"] == 1) {
        if (player.pickaxeHealth <= 0) {
            addMessage("Your pickaxe broke!");
            player.inventory_dictionary["Pickaxe"] = 0;
            player.pickaxeHealth = 75;
        } else {
            if (player.fullInventory == false) {
                let oreDictionary = {
                    0: "Iron",
                    1: "Copper",
                    2: "Tin",
                    3: "Silver",
                    4: "Gold",
                    5: "Emerald",
                    6: "Ruby",
                    7: "Diamond",
                    8: "Stone",
                };
                let oreRandomizer = Math.floor(Math.random() * 9);
                let xpTable = {
                    "Stone": 1,
                    "Iron": 110,
                    "Copper": 112,
                    "Tin": 113,
                    "Silver": 119,
                    "Gold": 125,
                    "Emerald": 130,
                    "Ruby": 150,
                    "Diamond": 200
                };
                if (xpTable[oreDictionary[oreRandomizer]] > 1) {
                    addMessage("You mined some " + oreDictionary[oreRandomizer] + "!");
                    player.inventory_dictionary[oreDictionary[oreRandomizer]]++;
                }
                addXp(xpTable[oreDictionary[oreRandomizer]]);

                player.pickaxeHealth -= 1;
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need a pickaxe to mine!");
    }
}