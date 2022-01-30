import * as dom from '../util/dom';
import player, { addGold } from "./player";
import { addMessage } from './messages';
import { renderCraftables } from '../activities/crafting';

import { renderActivities } from '../activities/activities';
import { renderStore } from '../activities/store';

function getNeededLevelUpXp() {
    return player.level * 100 * (player.level + 1);
}

export function addXp(value: number) {
    player.xp += value;

    if (player.xp >= getNeededLevelUpXp()) {
        player.level++;
        player.xp = 0;
        dom.getElement("progressXp").style.width = "0px";
        addMessage(`You leveled up! You are now level ${player.level}!`);
        checkLevelUnlocks();
    }

    renderLevel();
}

export const levelUnlocks = {
    branchCollecting: 1,
    stoneCollecting: 1,
    stoneMining: 1,
    treeCutting: 1,
    crafting: 1,
    fishing: 2,
    fighting: 3,
    hunting: 3,
    ironMining: 5,
    mining: 6,
    store: 7,
    inventoryUpgrade: 7,
    questing: 8,
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