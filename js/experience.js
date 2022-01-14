import * as dom from './dom.js';
import player, { addGold } from "./player.js";
import { addMessage } from './messages.js';

function getNeededLevelUpXp() {
    return player.level * 100 * (player.level + 1);
}

export function addXp(value) {
    player.xp += value;
    
    if (player.xp >= getNeededLevelUpXp()) {
        player.level++;
        player.xp = 0;
        document.getElementById("progressXp").width = 0;
        addMessage(`You leveled up! You are now level ${player.level}! [ ${player.level * 100} gold awarded ]`);
        addGold(player.level * 100);
        checkLevelUnlocks();
    }

    renderLevel();
}

export function checkLevelUnlocks() {
    if (player.level >= 2) {
        dom.setIsVisible("goHuntingButton", true);
        dom.setIsVisible("huntingRifle", true);

        dom.setIsVisible("sellMeat", true);
    }

    if (player.level >= 3) {
        dom.setIsVisible("goMiningButton", true);
        dom.setIsVisible("pickaxe", true);

        dom.setIsVisible("sellOres", true);
        dom.setIsVisible("sellStone", true);
    }

    if (player.level >= 4) {
        dom.setIsVisible("inventoryUpgrade", true);
    }

    if (player.level > 7) {
        dom.setIsVisible("goQuestingButton", true);
    }

    crafting.renderCraftables();
}

export function renderLevel() {
    document.getElementById("progressXp").style.width = `${player.xp / getNeededLevelUpXp() * 100}%`;
    document.getElementById("progressXp").style.transition = "width 0.5s";
    dom.setHtml("lvl", player.level);
}