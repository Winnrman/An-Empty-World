import player, { addStatistic } from "../control/player";
import { addMessage } from "../control/messages";
import { addXp } from "../control/experience";
import items, { itemsByName } from "../data/items/items";
import { getRandomItem } from "../util";
import { isInventoryFull, renderInventory } from "../control/inventory";
import { displayCraftingNeededMaterials } from "./crafting";

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
    addStatistic("cutWood", 1);
    addXp(itemsByName["Wood"].treeCutting.xp);
        
    player.toolHealth["Axe"] -= 1;
    if (player.toolHealth["Axe"] <= 0) {
        addMessage("Your axe broke!");
        player.inventory_dictionary["Axe"] -= 1;
        player.toolHealth["Axe"] = itemsByName["Axe"].health;
    }

    renderInventory();
    displayCraftingNeededMaterials();
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
    addStatistic("caughtFish", 1);
    addXp(itemsByName["Fish"].fishing.xp);
        
    player.toolHealth["Fishing Pole"] -= 1;
    if (player.toolHealth["Fishing Pole"] <= 0) {
        addMessage("Your fishing pole broke!");
        player.inventory_dictionary["Fishing Pole"] -= 1;
        player.toolHealth["Fishing Pole"] = itemsByName["Fishing Pole"].health;
    }

    renderInventory();
    displayCraftingNeededMaterials();
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
    addStatistic("huntedMeat", 1);
    addXp(itemsByName["Meat"].hunting.xp);
        
    player.toolHealth["Hunting Rifle"] -= 1;
    if (player.toolHealth["Hunting Rifle"] <= 0) {
        addMessage("Your hunting rifle broke!");
        player.inventory_dictionary["Hunting Rifle"] -= 1;
        player.toolHealth["Hunting Rifle"] = itemsByName["Hunting Rifle"].health;
    }

    renderInventory();
    displayCraftingNeededMaterials();
}

const ores = items.filter(x => x.mining);

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
    if (ore.mining.xp > 1) {
        player.inventory_dictionary[ore.name]++;
    }
    addStatistic("minedRocks", 1);
    addXp(ore.mining.xp);
        
    player.toolHealth["Pickaxe"] -= 1;
    if (player.toolHealth["Pickaxe"] <= 0) {
        addMessage("Your pickaxe broke!");
        player.inventory_dictionary["Pickaxe"] -= 1;
        player.toolHealth["Pickaxe"] = itemsByName["Pickaxe"].health;
    }

    renderInventory();
    displayCraftingNeededMaterials();
}

export function goIronMining() {
    if (!player.inventory_dictionary["Pickaxe"]) {
        addMessage("You need a pickaxe to mine!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    // const ore = getRandomItem(ores);
    addMessage(`You mined some Iron!`);
    player.inventory_dictionary['Iron']++;
    addStatistic("minedRocks", 1);
    addXp(ores.find(x => x.name === "Iron").mining.xp);

    player.toolHealth["Pickaxe"] -= 1;
    if (player.toolHealth["Pickaxe"] <= 0) {
        addMessage("Your pickaxe broke!");
        player.inventory_dictionary["Pickaxe"] -= 1;
        player.toolHealth["Pickaxe"] = 75;
    }

    renderInventory();
    displayCraftingNeededMaterials();
}