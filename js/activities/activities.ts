import iconCoins from "../../img/assets/materials/Coins.png";
import iconSword from "../../img/assets/equipment/Iron/Iron Sword.png";
// import iconAmulet from "../../img/assets/equipment/Amulet of Luck.png";
import iconCrafting from "../../img/assets/equipment/crafting.png";
import iconSpyGlass from "../../img/assets/tools/Spyglass.png";
import player from "../control/player";

import * as dom from "../util/dom";
import { clearGatheringCategory, gatheringCategories, renderGatheringActivity, renderGatheringCategory, resumeGatheringActivity } from "./gathering";
import levelUnlocks from "../data/levelUnlocks";
import { wrapAction } from "../control/user";
import { renderCombat } from "./combat";
import { renderQuests, resumeQuesting, stopQuest } from "./questing";

export type Activity = "Crafting" | "Fighting" | "Store" | "Gathering" | "Questing";

export async function showActivity(activity: Activity) {
    player.currentActivity = activity;
    
    if (activity != "Gathering")
        await clearGatheringCategory();

    if (activity != "Questing")
        await stopQuest();

    showCurrentActivity();
    renderActivities();
}

export function showCurrentActivity() {
    dom.setIsDisplayed("craftingContainer", player.currentActivity === "Crafting");
    dom.setIsDisplayed("combatContainer", player.currentActivity === "Fighting");
    dom.setIsDisplayed("storeContainer", player.currentActivity === "Store");
    dom.setIsDisplayed("gatheringContainer", player.currentActivity === "Gathering");
    dom.setIsDisplayed("questingContainer", player.currentActivity === "Questing");

    if (player.currentActivity === "Gathering") {
        renderGatheringCategory();
        renderGatheringActivity();
    } else if (player.currentActivity === "Fighting") {
        renderCombat();
    } else if (player.currentActivity === "Questing") {
        renderQuests();
    }
}

export async function resumeActivity() {
    if (player.currentActivity == "Gathering")
        await resumeGatheringActivity();
    else if (player.currentActivity === "Questing")
        await resumeQuesting();
}

export function renderActivities() {
    const renderButton = (requiredLevel: number, action: string, text: string, image?: string) => {
        if (player.level < requiredLevel)
            return "";
        
        const imagePart = image ? `<img src='${image}' />` : "";
        return `<button onclick="${action}">${imagePart}${text}</button> `;
    };

    let html = "";
    for (const category of gatheringCategories) {
        html += renderButton(category.requiredLevel, `gathering.showGatheringCategory('${category.name}')`, category.name, category.icon);
    }

    html += renderButton(levelUnlocks.crafting, "activities.showActivity('Crafting')", "Go Crafting", iconCrafting);
    html += renderButton(levelUnlocks.fighting, "activities.showActivity('Fighting')", "Go Fighting", iconSword);
    html += renderButton(levelUnlocks.questing, "activities.showActivity('Questing')", "Go Questing", iconSpyGlass);
    html += renderButton(levelUnlocks.store,    "activities.showActivity('Store')",    "Go to Store", iconCoins);

    dom.setHtml('activities', html);
}

export const actions = {
    showActivity: wrapAction(showActivity),
}