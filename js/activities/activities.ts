import player from "../control/player";
import { hasInInventory } from "../control/inventory";
import * as dom from "../util/dom";

import iconCoins from "../../img/assets/materials/Coins.png";
import iconSword from "../../img/assets/equipment/Iron/Iron Sword.png";
import iconAmulet from "../../img/assets/equipment/Amulet of Luck.png";
import iconSpyGlass from "../../img/assets/tools/Spyglass.png";
import { clearGatheringActivity, gatheringActivitiesByName, GatheringActivityName, renderGatheringActivity } from "./gathering";
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
        clearGatheringActivity();

    showCurrentActivity();
    renderActivities();
}

export function showCurrentActivity() {
    dom.setIsDisplayed("craftingContainer", player.currentActivity === "Crafting");
    dom.setIsDisplayed("combatContainer", player.currentActivity === "Fighting");
    dom.setIsDisplayed("storeContainer", player.currentActivity === "Store");
    dom.setIsDisplayed("gatheringContainer", player.currentActivity === "Gathering");

    if (player.currentActivity === "Gathering")
        renderGatheringActivity();
}

export function renderActivities() {
    const renderButton = (requiredLevel: number, action: string, text: string, image?: string) => {
        if (player.level < requiredLevel)
            return "";
        
        const imagePart = image ? `<img src='${image}' />` : "";
        return `<button class="button" onclick="${action}">${imagePart}${text}</button> `;
    }

    const renderGatheringActivity = (acitivityName: GatheringActivityName) => {
        const activity = gatheringActivitiesByName[acitivityName];
        return renderButton(activity.requiredLevel, `gathering.startGatheringActivity('${acitivityName}')`, acitivityName, activity.icon);
    }

    let html = "";

    if (hasInInventory("Axe"))
        html += renderGatheringActivity("Cut down Tree");
    else
        html += renderGatheringActivity("Collect Branches");
    
    if (hasInInventory("Pickaxe"))
        html += renderGatheringActivity("Mine Stone");
    else
        html += renderGatheringActivity("Collect Stones");
    
    html += renderGatheringActivity("Catch Fish");
    html += renderGatheringActivity("Hunt Meat");
    html += renderGatheringActivity("Mine Iron");
    html += renderGatheringActivity("Mine Ore");

    html += renderButton(levelUnlocks.questing,             "questing.doQuest()",          "Go Questing",      iconSpyGlass);
    
    if (player.currentActivity != "Crafting")
        html += renderButton(levelUnlocks.crafting,         "activities.goCrafting()",     "Go Crafting",      iconAmulet);
        
    if (player.currentActivity != "Fighting")
        html += renderButton(levelUnlocks.fighting,         "activities.goFighting()",     "Go Fighting",      iconSword);
        
    if (player.currentActivity != "Store")
        html += renderButton(levelUnlocks.store,            "activities.goToStore()",      "Go to Store",      iconCoins);

    dom.setHtml('activities', html);
}