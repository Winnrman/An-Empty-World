import player, { addStatistic } from "../control/player";
import { addMessage } from "../control/messages";
import { addXp } from "../control/experience";
import { itemsByName } from "../data/items";
import { getRandomItem } from "../util";
import { addToInventory, hasInInventory, InventoryItem, isInventoryFull, removeFromInventory } from "../control/inventory";
import resources from "../data/items/resources";
import { setHtml } from "../util/dom";

export function tree() {
    if (!hasInInventory("Axe")) {
        addMessage("You need an axe to cut down trees!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addToInventory("Wood", 1);
    addStatistic("cutWood", 1);
    addXp(itemsByName["Wood"].treeCutting.xp);
    player.toolHealth["Axe"] -= 1;
    
    if (player.toolHealth["Axe"] <= 0) {
        addMessage("Your axe broke!");
        removeFromInventory("Axe", 1);
        player.toolHealth["Axe"] = itemsByName["Axe"].health;
    }
}

export function goFishing() {
    if (!hasInInventory("Fishing Pole")) {
        addMessage("You need a fishing pole to fish!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addToInventory("Fish", 1);
    addStatistic("caughtFish", 1);
    addXp(itemsByName["Fish"].fishing.xp);

    player.toolHealth["Fishing Pole"] -= 1;
    if (player.toolHealth["Fishing Pole"] <= 0) {
        addMessage("Your fishing pole broke!");
        removeFromInventory("Fishing Pole", 1);
        player.toolHealth["Fishing Pole"] = itemsByName["Fishing Pole"].health;
    }
}

export function goHunting() {
    if (!hasInInventory("Hunting Rifle")) {
        addMessage("You need a hunting rifle to hunt!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addToInventory("Meat", 1);
    addStatistic("huntedMeat", 1);
    addXp(itemsByName["Meat"].hunting.xp);

    player.toolHealth["Hunting Rifle"] -= 1;
    if (player.toolHealth["Hunting Rifle"] <= 0) {
        addMessage("Your hunting rifle broke!");
        removeFromInventory("Hunting Rifle", 1);
        player.toolHealth["Hunting Rifle"] = itemsByName["Hunting Rifle"].health;
    }
}

const ores = resources.filter(x => x.mining);

function mineOre(ore: InventoryItem) {
    if (!hasInInventory("Pickaxe")) {
        addMessage("You need a pickaxe to mine!");
        return;
    }

    if (isInventoryFull()) {
        addMessage("Your inventory is full. You can't carry any more items.");
        return;
    }

    addMessage(`You mined some ${ore.name}!`);
    addToInventory(ore.name, 1);
    addStatistic("minedRocks", 1);
    addXp(ore.mining.xp);

    player.toolHealth["Pickaxe"] -= 1;
    if (player.toolHealth["Pickaxe"] <= 0) {
        addMessage("Your pickaxe broke!");
        removeFromInventory("Pickaxe", 1);
        player.toolHealth["Pickaxe"] = itemsByName["Pickaxe"].health;
    }
}

export function goMining() {
    mineOre(getRandomItem(ores));
}

export function goIronMining() {
    mineOre(ores.find(x => x.name === "Iron"));
}