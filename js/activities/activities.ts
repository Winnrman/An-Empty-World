import iconCoins from "../../img/assets/materials/Coins.png";
import iconSword from "../../img/assets/equipment/Iron/Iron Sword.png";
import iconAmulet from "../../img/assets/equipment/Amulet of Luck.png";
import iconSpyGlass from "../../img/assets/tools/Spyglass.png";
import player from "../control/player";

import * as dom from "../util/dom";
import { clearGatheringCategory, gatheringCategories, renderGatheringActivity, renderGatheringCategory } from "./gathering";
import levelUnlocks from "../data/levelUnlocks";
import { wrapAction } from "../control/user";
import { renderCombat } from "./combat";

export type Activity = "Crafting" | "Fighting" | "Store" | "Gathering";

export async function goCrafting() {
    await showActivity("Crafting");
}

export async function goFighting() {
    await showActivity("Fighting");
}

export async function goToStore() {
    await showActivity("Store");
}

export async function showActivity(activity: Activity) {
    player.currentActivity = activity;
    if (activity != "Gathering")
        await clearGatheringCategory();

    showCurrentActivity();
    renderActivities();
}

export function showCurrentActivity() {
    dom.setIsDisplayed("craftingContainer", player.currentActivity === "Crafting");
    dom.setIsDisplayed("combatContainer", player.currentActivity === "Fighting");
    dom.setIsDisplayed("storeContainer", player.currentActivity === "Store");
    dom.setIsDisplayed("gatheringContainer", player.currentActivity === "Gathering");

    if (player.currentActivity === "Gathering") {
        renderGatheringCategory();
        renderGatheringActivity();
    } else if (player.currentActivity === "Fighting") {
        renderCombat();
    }
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

    html += renderButton(levelUnlocks.crafting, "activities.showActivity('Crafting')", "Go Crafting", iconAmulet);
    html += renderButton(levelUnlocks.fighting, "activities.showActivity('Fighting')", "Go Fighting", iconSword);
    html += renderButton(levelUnlocks.questing, "questing.doQuest()",                  "Go Questing", iconSpyGlass);
    html += renderButton(levelUnlocks.store,    "activities.showActivity('Store')",    "Go to Store", iconCoins);

    dom.setHtml('activities', html);
}

export const actions = {
    showActivity: wrapAction(showActivity),
}