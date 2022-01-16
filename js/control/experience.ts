import * as dom from '../util/dom';
import player, { addGold } from "./player";
import { addMessage } from './messages';
import * as crafting from '../activities/crafting';

function getNeededLevelUpXp() {
    return player.level * 100 * (player.level + 1);
}

export function addXp(value) {
    player.xp += value;

    if (player.xp >= getNeededLevelUpXp()) {
        player.level++;
        player.xp = 0;
        document.getElementById("progressXp").style.width = "0px";
        addMessage(`You leveled up! You are now level ${player.level}! [ ${player.level * 100} gold awarded ]`);
        addGold(player.level * 100);
        checkLevelUnlocks();
    }

    renderLevel();
}

export const levelUnlocks = {
    hunting: 2,
    mining: 3,
    ironMining: 3,
    inventoryUpgrade: 4,
    questing: 8
}

export function checkLevelUnlocks() {
    if (player.level >= levelUnlocks.hunting) {
        dom.setIsVisible("goHuntingButton", true);
        dom.setIsVisible("huntingRifle", true);

        dom.setIsVisible("sellMeat", true);
    }

    if (player.level >= levelUnlocks.mining) {
        dom.setIsVisible("goMiningButton", true);
        dom.setIsVisible("pickaxe", true);

        dom.setIsVisible("sellOres", true);
        dom.setIsVisible("sellStone", true);
    }

    if (player.level >= levelUnlocks.ironMining) {
        dom.setIsVisible("goIronMiningButton", true);
        dom.setIsVisible("sellIron", true);

    }

    if (player.level >= levelUnlocks.inventoryUpgrade) {
        dom.setIsVisible("inventoryUpgrade", true);
    }

    if (player.level >= levelUnlocks.questing) {
        dom.setIsVisible("goQuestingButton", true);
    }

    crafting.renderCraftables();
}

export function renderLevel() {
    document.getElementById("progressXp").style.width = `${player.xp / getNeededLevelUpXp() * 100}%`;
    document.getElementById("progressXp").style.transition = "width 0.5s";
    dom.setHtml("lvl", player.level);
}