import * as dom from '../util/dom';
import player, { addGold } from "./player";
import { addMessage } from './messages';
import { renderCraftables } from '../activities/crafting';

import { renderActivities } from '../activities/activities';
import { renderStore } from '../activities/store';

function getNeededLevelUpXp() {
    return player.level * 100 * (player.level + 1);
}

export function addXp(value) {
    player.xp += value;

    if (player.xp >= getNeededLevelUpXp()) {
        player.level++;
        player.xp = 0;
        dom.getElement("progressXp").style.width = "0px";
        addMessage(`You leveled up! You are now level ${player.level}! [ ${player.level * 100} gold awarded ]`);
        addGold(player.level * 100);
        checkLevelUnlocks();
    }

    renderLevel();
}

export const levelUnlocks = {
    treeCutting: 1,
    fishing: 1,
    crafting: 1,
    fighting: 1,
    store: 1,
    hunting: 2,
    mining: 3,
    ironMining: 3,
    inventoryUpgrade: 4,
    questing: 8
}

export function checkLevelUnlocks() {
    renderActivities();
    renderStore();
    renderCraftables();
}

export function renderLevel() {
    dom.getElement("progressXp").style.width = `${player.xp / getNeededLevelUpXp() * 100}%`;
    dom.getElement("progressXp").style.transition = "width 0.5s";
    dom.setHtml("lvl", player.level.toString());
}