import { AchievementName } from "../control/achievements";
import * as gathering from "../activities/gathering";
import { ToolName, toolsByName } from "../data/items/tools";
import { HerbResourceName, ResourceName, resourcesByName } from "../data/items/resources";
import { Player } from "../control/player";
import { equipmentByName, EquipmentName } from "../data/items/equipment";
import * as inventory from "../control/inventory";
import { getEntries, PartialRecord } from "../util";
import { PotionName } from "../data/items/potions";
import { CraftableName, craftablesByName } from "../activities/crafting";
import { enemiesByName, EnemyName } from "../data/enemies";

export function gathered(resourceName: ResourceName, amount: number, toolname: ToolName | undefined, category: gathering.GatheringCategoryName) {
    return (data: Player) => {
        data.inventory[resourceName] = (data.inventory[resourceName] ?? 0) + amount;
        if (toolname)
            data.toolHealth[toolname] -= amount;
        data.xp += resourcesByName[resourceName].gathering[category]!.experience * amount;
    }
}

export function gatheredMany(resourceNames: PartialRecord<ResourceName, number>, toolname: ToolName | undefined, category: gathering.GatheringCategoryName) {
    return (data: Player) => {
        for (const [resourceName, amount] of getEntries(resourceNames)) {
            data.inventory[resourceName] = (data.inventory[resourceName] ?? 0) + amount;
            if (toolname)
                data.toolHealth[toolname] -= amount;
            data.xp += resourcesByName[resourceName].gathering[category]!.experience * amount;
        }
    }
}

export function cutWood(amount: number) {
    return gathered("Wood", amount, "Axe", "Wood");
}

export function collectedBranches(amount: number) {
    return gathered("Wood", amount, undefined, "Wood");
}

export function collectedStones(amount: number) {
    return gathered("Stone", amount, undefined, "Stone");
}

export function minedStone(amount: number) {
    return gathered("Stone", amount, "Pickaxe", "Stone");
}

export function minedIron(amount: number) {
    return gathered("Iron", amount, "Pickaxe", "Ore");
}

export function caughtFish(amount: number) {
    return gathered("Fish", amount, "Wooden Harpoon", "Food");
}

export function huntedMeat(amount: number) {
    return gathered("Meat", amount, "Stone Spear", "Food");
}

export function gatheredHerb(herb: HerbResourceName, amount: number) {
    return gathered(herb, amount, undefined, "Herb");
}

export function gatheredHerbs(herbs: PartialRecord<HerbResourceName, number>) {
    return gatheredMany(herbs, undefined, "Herb");
}

export function soldItem(itemName: ResourceName, amount: number) {
    return (data: Player) => {
        data.gold += amount * resourcesByName[itemName].price;
        data.inventory[itemName] = amount === 0 ? 0 : data.inventory[itemName]! - amount;
    };
}

export function gotGold(amount: number) {
    return (data: Player) => {
        data.gold += amount;
    };
}

export function toolBroke(itemName: ToolName) {
    return (data: Player) => {
        data.inventory[itemName] = 0;
    }
}

export function levelled(level: number, newXp: number) {
    return (data: Player) => {
        data.level = level;
        data.xp = newXp;
    }
}

export function droppedItem(itemName: inventory.InventoryItemName, amount: number) {
    return (data: Player) => {
        data.inventory[itemName] = amount === 0 ? 0 : data.inventory[itemName]! - amount;
    }
}

export function gotAchievement(id: AchievementName, amount: number) {
    return (data: Player) => {
        data.completedAchievements[id] = amount;
    }
}

export function craftedTool(itemName: ToolName) {
    return (data: Player) => {
        data.inventory[itemName] = 1;
        const craftable = toolsByName[itemName];
        data.toolHealth[itemName] = craftable.tool.health;
        craftedItem(data, itemName);
    }
}

export function craftedEquipment(itemName: EquipmentName) {
    return (data: Player) => {
        data.ownedEquipment.push(itemName);
        craftedItem(data, itemName);
    }
}

export function craftedPotion(itemName: PotionName) {
    return (data: Player) => {
        data.inventory[itemName] = 1;
        craftedItem(data, itemName);
    }
}

function craftedItem(data: Player, itemName: CraftableName) {
    const craftable = craftablesByName[itemName];
    for (const [key, requiredAmount] of getEntries(craftable.crafting!.ingredients)) {
        data.inventory[key]! -= requiredAmount;
    }
}

export function drankPotion(itemName: PotionName) {
    return (data: Player) => {
        data.inventory[itemName] = data.inventory[itemName]! - 1;
    }
}

export function equippedItem(itemName: EquipmentName) {
    return (data: Player) => {
        const item = equipmentByName[itemName];
        if (data.equipment[item.equipment!.slot]) {
            const oldItem = equipmentByName[data.equipment![item.equipment!.slot]!];
            data.defense -= oldItem.equipment.armor ?? 0;
            data.attack -= oldItem.equipment.attack ?? 0;
        }

        data.equipment[item.equipment!.slot] = itemName;
        data.defense += item.equipment.armor ?? 0;
        data.attack += item.equipment.attack ?? 0;
    }
}

export function killedEnemy(enemyName: EnemyName) {
    return (data: Player) => {
        data.xp += enemiesByName[enemyName].defeatExperience;
        data.gold += enemiesByName[enemyName].gold.min;
    }
}

export function lostStamina(amount: number) {
    return (data: Player) => {
        data.stamina -= amount;
    }
}

export function nothingHappened(reason: string) {
    return () => { reason }
}