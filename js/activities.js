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

    player.inventory_dictionary["Wood"] += 1;
    player.obtainedWood += 1;
    addXp(10);
        
    player.axeHealth -= 1;
    if (player.axeHealth <= 0) {
        addMessage("Your axe broke!");
        player.inventory_dictionary["Axe"] -= 1;
        player.axeHealth = 20;
    }

    renderInventory();
    checkAchievements();
}

export function goFishing() {
    if (!player.inventory_dictionary["Fishing Pole"]) {
        addMessage("You need a fishing pole to fish!");
        return;
    }

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