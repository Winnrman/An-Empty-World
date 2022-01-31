import player, { addStatistic, saveData, StatisticName } from "../control/player";
import { addMessage } from "../control/messages";
import { addXp } from "../control/experience";
import { displayNumber, getEntries, getRandomInt, PartialRecord, sum } from "../util";
import { addToInventory, decreaseToolHealth, hasInInventory, isInventoryFull } from "../control/inventory";
import { ResourceName, resourcesByName } from "../data/items/resources";
import * as dom from "../util/dom";
import { ToolName } from "../data/items/tools";
import { showActivity } from "./activities";
import levelUnlocks from "../data/levelUnlocks";
import { sleep } from "../control/timing";
import { getAllPossibleItems, getItemChances, getRandomLootFromTable, LootTable } from "./looting";

import iconWood from "../../img/assets/materials/Wood.png";
import iconStone from "../../img/assets/materials/Stone.png";
import iconAxe from "../../img/assets/tools/stone_axe.png";
import iconPickaxe from "../../img/assets/tools/Pickaxe.png";
import iconFish from "../../img/assets/materials/Fish.png";
import iconMeat from "../../img/assets/materials/Meat.png";
import iconIron from "../../img/assets/materials/Iron.png";
import iconMonofolia from "../../img/assets/materials/Monofolia.png";
import iconBifolia from "../../img/assets/materials/Bifolia.png";
import iconCrimsonica from "../../img/assets/materials/Crimsonica.png";

export type GatheringCategoryName = "Wood" | "Stone" | "Food" | "Ore" | "Herb";

export type GatheringCategory = {
    name: GatheringCategoryName;
    icon: string;
    requiredLevel: number;
    statistic: StatisticName | undefined
}

export const gatheringCategories: GatheringCategory[] = [
    {
        name: "Wood",
        icon: iconWood,
        requiredLevel: levelUnlocks.branchCollecting,
        statistic: "cutWood",
    },
    {
        name: "Stone",
        icon: iconStone,
        requiredLevel: levelUnlocks.stoneCollecting,
        statistic: "minedStone",
    },
    {
        name: "Food",
        icon: iconMeat,
        requiredLevel: levelUnlocks.fishing,
        statistic: undefined
    },
    {
        name: "Ore",
        icon: iconIron,
        requiredLevel: levelUnlocks.ironMining,
        statistic: "minedOre"
    },
    {
        name: "Herb",
        icon: iconBifolia,
        requiredLevel: levelUnlocks.herbScavenging,
        statistic: "scavengedHerbs"
    },
];

export const gatheringCategoriesByName: { [key in GatheringCategoryName]: GatheringCategory } = Object.assign({}, ...gatheringCategories.map(x => ({ [x.name]: x })));

type WoodActivityName = "Collect Branches" | "Cut down Tree";
type StoneActivityName = "Collect Stones" | "Mine Stone";
type FoodActivityName = "Catch Fish" | "Hunt Meat";
type OreActivityName = "Mine Iron" | "Mine Ore";
type HerbActivityName = "Take nearest herbs" | "Search specific herbs";
export type GatheringActivityName = WoodActivityName | StoneActivityName | FoodActivityName | OreActivityName | HerbActivityName;

export type GatheringActivity = {
    name: GatheringActivityName;
    category: GatheringCategoryName;
    requiredLevel: number;
    neededTools: ToolName[] | undefined;
    searchTime?: number;
    time: number;
    itemsTable: LootTable<ResourceName>;
    needsToChooseItem?: true
    icon: string;
};

const gatheringActivities: GatheringActivity[] = [
    {
        name: "Collect Branches",
        category: "Wood",
        neededTools: undefined,
        requiredLevel: levelUnlocks.branchCollecting,
        time: 5000,
        itemsTable: "Wood",
        icon: iconWood,
    },
    {
        name: "Collect Stones",
        category: "Stone",
        requiredLevel: levelUnlocks.stoneCollecting,
        neededTools: undefined,
        time: 5000,
        itemsTable: "Stone",
        icon: iconStone,
    },
    {
        name: "Cut down Tree",
        category: "Wood",
        requiredLevel: levelUnlocks.treeCutting,
        neededTools: ["Axe"],
        time: 2000,
        itemsTable: "Wood",
        icon: iconAxe,
    },
    {
        name: "Mine Stone",
        category: "Stone",
        requiredLevel: levelUnlocks.stoneMining,
        neededTools: ["Pickaxe"],
        time: 2000,
        itemsTable: "Stone",
        icon: iconPickaxe,
    },
    {
        name: "Catch Fish",
        category: "Food",
        requiredLevel: levelUnlocks.fishing,
        neededTools: ["Wooden Harpoon", "Fishing Pole"],
        time: 2000,
        itemsTable: "Fish",
        icon: iconFish,
    },
    {
        name: "Hunt Meat",
        category: "Food",
        requiredLevel: levelUnlocks.hunting,
        neededTools: ["Stone Spear", "Hunting Rifle"],
        time: 5000,
        itemsTable: "Meat",
        icon: iconMeat,
    },
    {
        name: "Mine Iron",
        category: "Ore",
        requiredLevel: levelUnlocks.ironMining,
        neededTools: ["Pickaxe"],
        time: 5000,
        itemsTable: "Iron",
        icon: iconIron,
    },
    {
        name: "Mine Ore",
        category: "Ore",
        requiredLevel: levelUnlocks.mining,
        neededTools: ["Pickaxe"],
        time: 10000,
        itemsTable: { "Iron": 30, "Tin": 20, "Copper": 20, "Silver": 15, "Gold": 10, "Emerald": 5, "Ruby": 3, "Diamond": 2, },
        icon: iconPickaxe,
    },
    {
        name: "Take nearest herbs",
        category: "Herb",
        requiredLevel: levelUnlocks.herbScavenging,
        neededTools: undefined,
        searchTime: 1000,
        time: 2000,
        itemsTable: { "Monofolia": 6, "Bifolia": 4, "Trifolia": 2, "Crimsonica": 1, "Azurica": 1, "Okerica": 1 },
        icon: iconMonofolia,
    },
    {
        name: "Search specific herbs",
        category: "Herb",
        requiredLevel: levelUnlocks.herbScavenging,
        neededTools: undefined,
        searchTime: 1000,
        time: 2000,
        itemsTable: { "Monofolia": 6, "Bifolia": 4, "Trifolia": 2, "Crimsonica": 1, "Azurica": 1, "Okerica": 1 },
        needsToChooseItem: true,
        icon: iconCrimsonica,
    },
];

export const gatheringActivitiesByName: { [key in GatheringActivityName]: GatheringActivity } = Object.assign({}, ...gatheringActivities.map(x => ({ [x.name]: x })));

let activityStatus: string | undefined;
function setStatus(status: string | undefined) {
    activityStatus = status;
    renderGatheringActivity();
}

export async function showGatheringCategory(categoryName: GatheringCategoryName) {
    if (player.currentGatheringCategory === categoryName)
        return;

    player.currentGatheringCategory = categoryName;
    showActivity("Gathering");
    saveData();
}

export async function showGatheringActivity(activityName: GatheringActivityName) {
    if (player.currentGatheringActivity === activityName)
        return;
    
    player.currentGatheringActivity = activityName;
    chosenItems.length = 0;
    const activity = gatheringActivitiesByName[activityName];
    if (!activity.needsToChooseItem) {
        await startGatheringActivity();
        return;
    }

    showActivity("Gathering");
}

const chosenItems = Array<ResourceName>();
export async function toggleItem(resourceName: ResourceName) {
    if (chosenItems.includes(resourceName)) {
        chosenItems.splice(chosenItems.indexOf(resourceName), 1);
    } else {
        chosenItems.push(resourceName)
    }
    renderGatheringActivity();
}

let skippedItem: ResourceName | undefined;

const getDropModifiers = () => {
    const dropModifiers: PartialRecord<ResourceName, number> = {};
    if (chosenItems.length == 1) {
        dropModifiers[chosenItems[0]] = 3;
    } else if (chosenItems.length == 2) {
        dropModifiers[chosenItems[0]] = 2;
        dropModifiers[chosenItems[1]] = 2;
    }
    return dropModifiers;
}

export async function startGatheringActivity() {
    const currentActivityId = getRandomInt(1, 999999);
    player.currentGatheringActivityId = currentActivityId;
    const activity = gatheringActivitiesByName[player.currentGatheringActivity!];

    while (true) {
        const tool = getTool(activity.neededTools, activity.name);
        if ((activity.neededTools && !tool) || hasNoSpace())
            return clearGatheringActivity();
        
        showActivity("Gathering");
        
        if (activity.searchTime) {
            setStatus(`Searching for the next ${activity.category}${skippedItem ? ` (you found a ${skippedItem} that you didn't want)` : ''}...`);
            dom.resetProgressbar("gathering-progress", activity.searchTime);
            await sleep(activity.searchTime);

            if (player.currentGatheringActivityId !== currentActivityId)
                return;
        }

        const dropModifiers = getDropModifiers();
        const [itemName, amount] = getRandomLootFromTable(activity.itemsTable, dropModifiers);

        if (activity.needsToChooseItem && !chosenItems.includes(itemName)) {
            skippedItem = itemName;
            continue;
        }

        skippedItem = undefined;

        setStatus(`Gathering ${itemName}...`);

        dom.resetProgressbar("gathering-progress", activity.time);
        saveData();
        await sleep(activity.time);
    
        if (player.currentGatheringActivityId !== currentActivityId)
            return;
        
        if (hasNoSpace())
            return clearGatheringActivity();

        const gatheringData = resourcesByName[itemName].gathering[activity.category]!;
        const statistic = gatheringData.statistic ?? gatheringCategoriesByName[activity.category].statistic;
        addToInventory(itemName, amount);
        addStatistic(statistic, amount);
        addXp(gatheringData.experience);
        if (tool)
            decreaseToolHealth(tool);
    }
}

export function clearGatheringCategory() {
    player.currentGatheringCategory = undefined;
    renderGatheringCategory();
    clearGatheringActivity();
}

export async function clearGatheringActivity() {
    player.currentGatheringActivity = undefined;
    player.currentGatheringActivityId = undefined;
    activityStatus = undefined;
    renderGatheringActivity();
    saveData();
}

export function resumeGatheringActivity() {
    const activity = player.currentGatheringActivity;
    if (!activity)
        return;
    
    player.currentGatheringActivity = undefined;
    showGatheringActivity(activity);
}

function getTool(toolNames: ToolName[] | undefined, action: string) {
    if (!toolNames)
        return undefined;
    
    const tool = toolNames.filter(x => hasInInventory(x))[0];
    if (tool)
        return tool;

    addMessage(`To ${action}, you need one of these: ${toolNames.join(' ')}!`);
    return undefined;
}

function hasNoSpace() {
    if (!isInventoryFull())
        return false;

    addMessage("Your inventory is full. You can't carry any more items.");
    return true;
}

export function renderGatheringCategory() {
    if (!player.currentGatheringCategory) {
        dom.setHtml("gathering-category", "");
        return;
    }

    let html = "";
    const availablecategories = gatheringActivities.filter(x => x.category === player.currentGatheringCategory && player.level >= x.requiredLevel);
    for (const activity of availablecategories) {
        html += `<button class="button" onclick="gathering.showGatheringActivity('${activity.name}')"><img src='${activity.icon}' />${activity.name}</button> `;
    }
    
    dom.setHtml("gathering-category", html);
}

export function renderGatheringActivity() {
    if (!player.currentGatheringActivity) {
        dom.setHtml("gathering-activity", "");
        return;
    }

    let html = "";
    html += `<br />`;

    const activity = gatheringActivitiesByName[player.currentGatheringActivity];
    if (activity.needsToChooseItem) {
        html += "Choose the items you want. Choosing one item lets you find it 3 times as much, choosing two items lets you find them 2 times as much.<br />";
        
        const dropModifiers = getDropModifiers();
        const itemChances = getItemChances(activity.itemsTable, dropModifiers);
        const totalChance = sum(Object.values(itemChances));

        for (const [resourceName, chance] of getEntries(itemChances)) {
            const resource = resourcesByName[resourceName];
            const itemChance = displayNumber(chance / totalChance * 100)
            html += `<div onClick="gathering.toggleItem('${resource.name}')" class="item-icon ${chosenItems.includes(resource.name) ? 'selected' : ''}" title="${resource.name} - chance: ${itemChance}%"><img src="${resource.iconUrl}" /></div>`;
        }

        if (chosenItems.length === 0) {
            dom.setHtml("gathering-activity", html);
            return;
        }

        html += ` <button class="button" onClick="gathering.startGatheringActivity()">Start</button>`;
        html += "<br />";
        html += "<br />";
    }

    if (!activityStatus) {
        dom.setHtml("gathering-activity", html);
        return;
    }

    html += `${activityStatus}<br />`;
    html += `<div class="progress-bar"><span id="gathering-progress" style="width: 0%;"></span></div> `;
    html += `<button class="button" onClick="gathering.clearGatheringActivity()">Stop</button>`;
    dom.setHtml("gathering-activity", html);
}