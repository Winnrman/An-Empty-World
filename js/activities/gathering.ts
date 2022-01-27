import player, { addStatistic, saveData, StatisticName } from "../control/player";
import { addMessage } from "../control/messages";
import { addXp } from "../control/experience";
import { getRandomInt, getRandomItem } from "../util";
import { addToInventory, decreaseToolHealth, hasInInventory, isInventoryFull } from "../control/inventory";
import resources, { Resource, ResourceName, resourcesByName } from "../data/items/resources";
import * as dom from "../util/dom";
import { ToolName } from "../data/items/tools";
import { showActivity } from "./activities";

import iconWood from "../../img/assets/materials/Wood.png";
import iconStone from "../../img/assets/materials/Stone.png";
import iconPickaxe from "../../img/assets/tools/Pickaxe.png";
import iconFish from "../../img/assets/materials/Fish.png";
import iconMeat from "../../img/assets/materials/Meat.png";
import iconIron from "../../img/assets/materials/Iron.png";
import levelUnlocks from "../data/levelUnlocks";
import { sleep } from "../control/timing";

export type GatheringActivityName = "Collect Branches" | "Collect Stones" | "Cut down Tree" | "Mine Stone" | "Catch Fish" | "Hunt Meat" | "Mine Iron" | "Mine Ore";

export type GatheringActivity = {
    name: GatheringActivityName;
    requiredLevel: number;
    neededTools: ToolName[] | undefined;
    time: number;
    getItem: () => ResourceName;
    getXp: (itemGathered: Resource) => number | undefined;
    getStatistic: (itemGathered: Resource) => StatisticName | undefined;
    icon: string;
}

const gatheringActivities: GatheringActivity[] = [
    {
        name: "Collect Branches",
        neededTools: undefined,
        requiredLevel: levelUnlocks.branchCollecting,
        time: 5000,
        getItem: () => "Wood",
        getXp: (itemGathered: Resource) => itemGathered.gathering.treeCuttingXp,
        getStatistic: () => "cutWood",
        icon: iconWood,
    },
    {
        name: "Collect Stones",
        requiredLevel: levelUnlocks.stoneCollecting,
        neededTools: undefined,
        time: 5000,
        getItem: () => "Stone",
        getXp: (itemGathered: Resource) => itemGathered.gathering.miningXp,
        getStatistic: () => "minedRocks",
        icon: iconStone,
    },
    {
        name: "Cut down Tree",
        requiredLevel: levelUnlocks.treeCutting,
        neededTools: ["Axe"],
        time: 2000,
        getItem: () => "Wood",
        getXp: (itemGathered: Resource) => itemGathered.gathering.treeCuttingXp,
        getStatistic: () => "cutWood",
        icon: iconWood,
    },
    {
        name: "Mine Stone",
        requiredLevel: levelUnlocks.stoneMining,
        neededTools: ["Pickaxe"],
        time: 2000,
        getItem: () => "Stone",
        getXp: (itemGathered: Resource) => itemGathered.gathering.miningXp,
        getStatistic: () => "minedRocks",
        icon: iconStone,
    },
    {
        name: "Catch Fish",
        requiredLevel: levelUnlocks.fishing,
        neededTools: ["Wooden Harpoon", "Fishing Pole"],
        time: 2000,
        getItem: () => "Fish",
        getXp: (itemGathered: Resource) => itemGathered.gathering.fishingXp,
        getStatistic: () => "caughtFish",
        icon: iconFish,
    },
    {
        name: "Hunt Meat",
        requiredLevel: levelUnlocks.hunting,
        neededTools: ["Stone Spear", "Hunting Rifle"],
        time: 5000,
        getItem: () => "Meat",
        getXp: (itemGathered: Resource) => itemGathered.gathering.huntingXp,
        getStatistic: () => "huntedMeat",
        icon: iconMeat,
    },
    {
        name: "Mine Iron",
        requiredLevel: levelUnlocks.ironMining,
        neededTools: ["Pickaxe"],
        time: 5000,
        getItem: () => "Iron",
        getXp: (itemGathered: Resource) => itemGathered.gathering.miningXp,
        getStatistic: () => "minedRocks",
        icon: iconIron,
    },
    {
        name: "Mine Ore",
        requiredLevel: levelUnlocks.mining,
        neededTools: ["Pickaxe"],
        time: 10000,
        getItem: () => getRandomItem(resources.filter(x => x.gathering.miningXp)).name,
        getXp: (itemGathered: Resource) => itemGathered.gathering.miningXp,
        getStatistic: () => "minedRocks",
        icon: iconPickaxe,
    },
];

export const gatheringActivitiesByName: { [key in GatheringActivityName]: GatheringActivity } = Object.assign({}, ...gatheringActivities.map(x => ({ [x.name]: x })));

export async function startGatheringActivity(activityName: GatheringActivityName) {
    if (player.currentGatheringActivity === activityName)
        return;

    player.currentGatheringActivity = activityName;
    const currentActivityId = getRandomInt(1, 999999);
    player.currentGatheringActivityId = currentActivityId;
    const activity = gatheringActivitiesByName[activityName];

    while (true) {
        const tool = getTool(activity.neededTools, activity.name);
        if ((activity.neededTools && !tool) || hasNoSpace())
            return clearGatheringActivity();
        
        showActivity("Gathering");
        dom.resetProgressbar("gathering-progress", activity.time);
        saveData();
    
        await sleep(activity.time);
    
        if (player.currentGatheringActivityId !== currentActivityId)
            return;
        
        if (hasNoSpace())
            return clearGatheringActivity();
    
        const itemGathered = resourcesByName[activity.getItem()];
        addToInventory(itemGathered.name, 1);
        const statistic = activity.getStatistic(itemGathered);
        statistic && addStatistic(statistic, 1);
        addXp(activity.getXp(itemGathered) ?? 0);
        if (tool)
            decreaseToolHealth(tool);
    }
}

export function clearGatheringActivity() {
    player.currentGatheringActivity = undefined;
    player.currentGatheringActivityId = undefined;
    renderGatheringActivity();
    saveData();
}

export function resumeGatheringActivity() {
    const activity = player.currentGatheringActivity;
    if (!activity)
        return;
    
    player.currentGatheringActivity = undefined;
    startGatheringActivity(activity);
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

export function renderGatheringActivity() {
    if (!player.currentGatheringActivity) {
        dom.setHtml("gathering", "");
        return;
    }

    let html = "";
    html += `${player.currentGatheringActivity} `;
    html += `<div class="progress-bar"><span id="gathering-progress" style="width: 0%;"></span></div> `;
    html += `<button onClick="gathering.clearGatheringActivity()">Stop</button>`;
    dom.setHtml("gathering", html);
}