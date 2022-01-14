import player from "./player.js";
import { addMessage } from "./messages.js";
import { addXp } from "./experience.js";
import { getRandomItem } from "./util.js";
import { isInventoryFull, renderInventory } from "./inventory.js";
import { checkAchievements } from "./achievements.js";

export function tree() {
    if (!player.inventory_dictionary["Axe"]) {
        addMessage("You need an axe to cut down trees!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }


export function tree() {
    if (player.inventory_dictionary["Axe"] == 1) {
        if (player.fullInventory == false) {
            player.inventory_dictionary["Wood"] += 1;
            player.toolHealth["Axe"] -= 1;
            player.xp += 10;
			if (player.toolHealth["Axe"] <= 0) {
				addMessage("Your axe broke!");
				player.inventory_dictionary["Axe"] = 0;
				player.toolHealth["Axe"] = 20;
			}
        } else {
            addMessage("Your inventory is full. You can't carry any more items.");
        }
    } else {
        addMessage("You need an axe to cut down trees!");
    }

    renderInventory();
    checkAchievements();
}

export function goFishing() {
    if (player.inventory_dictionary["Fishing Pole"] == 1) {
        if (player.fullInventory == false) {
            player.inventory_dictionary["Fish"] += 1;
            player.toolHealth["Fishing Pole"] -= 1;
            player.xp += 15;
			if (player.toolHealth["Fishing Pole"] <= 0) {
				addMessage("Your fishing pole broke!");
				player.inventory_dictionary["Fishing Pole"] = 0;
				player.toolHealth["Fishing Pole"] = 10;
			}
        } else {
            addMessage("Your inventory is full. You can't carry any more items.");
        }
    } else {
    if (!player.inventory_dictionary["Fishing Pole"]) {
        addMessage("You need a fishing pole to fish!");
        return;
    }

export function goHunting() {
    if (player.inventory_dictionary["Hunting Rifle"] == 1) {
        if (player.fullInventory == false) {
            player.inventory_dictionary["Meat"] += 1;
            player.toolHealth["Hunting Rifle"] -= 1;
            player.xp += 50;
			if (player.toolHealth["Hunting Rifle"] <= 0) {
				addMessage("Your hunting rifle broke!");
				player.inventory_dictionary["Hunting Rifle"] = 0;
				player.toolHealth["Hunting Rifle"] = 50;
			}
        } else {
			addMessage("Your inventory is full. You can't carry any more items.");
		}
    } else {
        addMessage("You need a hunting rifle to hunt!");
    }
}

export function goMining() {
    if (player.inventory_dictionary["Pickaxe"] == 1) {
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
            // inventory.push(oreDictionary[oreRandomizer]);
            player.xp += xpTable[oreDictionary[oreRandomizer]]
            player.toolHealth["Pickaxe"] -= 1		
			if (player.toolHealth["Pickaxe"] <= 0) {			
				addMessage("Your pickaxe broke!")			
				player.inventory_dictionary["Pickaxe"] = 0			
				player.toolHealth["Pickaxe"] = 75		
			} 
        } else {
            addMessage("Your inventory is full. You can't carry any more items.");
        }
    } else {
        addMessage("You need a pickaxe to mine!");
      if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    player.inventory_dictionary["Fish"] += 1;
    addXp(15);
        
    player.fishingPoleHealth -= 1;
    if (player.fishingPoleHealth <= 0) {
        addMessage("Your fishing pole broke!");
        player.inventory_dictionary["Fishing Pole"] -= 1;
        player.fishingPoleHealth = 10;
    }
    
    renderInventory();
    checkAchievements();
}

export function goHunting() {
    if (!player.inventory_dictionary["Hunting Rifle"]) {
        addMessage("You need a hunting rifle to hunt!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    player.inventory_dictionary["Meat"] += 1;
    addXp(50);
        
    player.huntingRifleHealth -= 1;
    if (player.huntingRifleHealth <= 0) {
        addMessage("Your hunting rifle broke!");
        player.inventory_dictionary["Hunting Rifle"] -= 1;
        player.huntingRifleHealth = 50;
    }
    
    renderInventory();
    checkAchievements();
}

const ores = [
    { name: "Iron", xp: 110 },
    { name: "Copper", xp: 112 },
    { name: "Tin", xp: 113 },
    { name: "Silver", xp: 119 },
    { name: "Gold", xp: 125 },
    { name: "Emerald", xp: 130 },
    { name: "Ruby", xp: 150 },
    { name: "Diamond", xp: 200 },
    { name: "Stone", xp: 1 },
];

export function goMining() {
    if (!player.inventory_dictionary["Pickaxe"]) {
        addMessage("You need a pickaxe to mine!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    const ore = getRandomItem(ores);
    addMessage(`You mined some ${ore.name}!`);
    if (ore.xp > 1) {
        player.inventory_dictionary[ore.name]++;
    }
    addXp(ore.xp);
    renderInventory();
        
    player.pickaxeHealth -= 1;
    if (player.pickaxeHealth <= 0) {
        addMessage("Your pickaxe broke!");
        player.inventory_dictionary["Pickaxe"] -= 1;
        player.pickaxeHealth = 75;
    }
    
    renderInventory();
    checkAchievements();
}