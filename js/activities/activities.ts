import player from "../control/player";
import { hasInInventory } from "../control/inventory";
import * as dom from "../util/dom";

import iconCoins from "../../img/assets/materials/Coins.png";
import iconSword from "../../img/assets/equipment/Iron/Iron Sword.png";
import iconAmulet from "../../img/assets/equipment/Amulet of Luck.png";
import iconSpyGlass from "../../img/assets/tools/Spyglass.png";
import { clearGatheringActivity, clearGatheringCategory, gatheringActivitiesByName, GatheringActivityName, gatheringCategories, gatheringCategoriesByName, GatheringCategoryName, renderGatheringActivity, renderGatheringCategory } from "./gathering";
import levelUnlocks from "../data/levelUnlocks";

export type Activity = "Crafting" | "Fighting" | "Store" | "Gathering";

export function goCrafting() {
    showActivity("Crafting");
}

export function goFighting() {
    showActivity("Fighting");
}

export function goToStore() {
    showActivity("Store");
}

export function showActivity(activity: Activity) {
    player.currentActivity = activity;
    if (activity != "Gathering")
        clearGatheringCategory();

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
    }
}

export function renderActivities() {
    const renderButton = (requiredLevel: number, action: string, text: string, image?: string) => {
        if (player.level < requiredLevel)
            return "";
        
        const imagePart = image ? `<img src='${image}' />` : "";
        return `<button class="button" onclick="${action}">${imagePart}${text}</button> `;
    };

    let html = "";
    for (const category of gatheringCategories) {
        html += renderButton(category.requiredLevel, `gathering.showGatheringCategory('${category.name}')`, category.name, category.icon);
    }

    html += renderButton(levelUnlocks.crafting, "activities.goCrafting()", "Go Crafting", iconAmulet);
    html += renderButton(levelUnlocks.fighting, "activities.goFighting()", "Go Fighting", iconSword);
    html += renderButton(levelUnlocks.questing, "questing.doQuest()",      "Go Questing", iconSpyGlass);
    html += renderButton(levelUnlocks.store,    "activities.goToStore()",  "Go to Store", iconCoins);

    dom.setHtml('activities', html);
}