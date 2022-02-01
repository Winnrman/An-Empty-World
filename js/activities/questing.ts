import * as dom from "../util/dom";
import { EnemyName, enemiesByName } from "../data/enemies";
import { addXp } from "../control/experience";
import { hasEquiped } from "../control/equipment";
import { addMessage } from '../control/messages';
import player, { saveData }  from "../control/player";
import transient from '../control/transient';
import { getRandomInt, getRandomItem, getWithIndefiniteArticle } from '../util';
import { Rarity } from "../data/items";
import { addLoot, randomLootDrop } from "./looting";
import { calculateTime, sleep } from "../control/timing";
import { wrapAction } from "../control/user";
import { addGold, removeGold } from "../control/inventory";
import { addStatistic } from "../control/statistics";

export async function doQuest() {
    if (transient.isQuesting == true) {
        addMessage("You are already on a quest!");
        return;
    }

    if (player.stamina <= 0) {
        addMessage("You don't have enough stamina to start a quest!");
        return;
    }

    await startQuest();
}

async function startQuest() {
    addMessage("You begin off on your quest, walking through this empty and barren world.");
    transient.isQuesting = true;
    while(transient.isQuesting) {    
        const eventActions = [startWalkEvent, startLootChestEvent, startFightMonsterEvent, startFindCaveEvent, startGetAmbushedEvent];
        const randomEventAction = getRandomItem(eventActions);
        await randomEventAction();
    }
}

async function startWalkEvent() {
    await waitForPart(3000, "You walk for a little while...");
    await doEvent(1, undefined);
}

async function startLootChestEvent() {
    await waitForPart(3000, "You find a chest!");
    await doEvent(hasAmuletOfLuck() ? 1 : 2, lootChest);
}

async function startFightMonsterEvent() {
    await waitForPart(3000, "You come across a monster!");
    await doEvent(5, fightMonster);
}

async function startFindCaveEvent() {
    await waitForPart(2000, "While walking a little more, you find a cave!");
    await doEvent(1, findCave);
}

async function startGetAmbushedEvent() {
    await waitForPart(3000, "While you're walking, you get ambushed by a pack of thieves, and you are forced to flee!");
    await doEvent(3, getAmbushed);
}

async function startExitCaveEvent() {
    await waitForPart(2000, "You find nothing and leave the cave.");
}

async function doEvent(staminaCost: number, eventAction?: () => Promise<void>) {
    const hasInsufficientStamina = player.stamina < staminaCost;
    removeStamina(staminaCost);
    if (hasInsufficientStamina) {
        transient.isQuesting = false;
        addMessage("However, you did not have enough stamina to put up with this and stop your quest.");
        return;
    }

    if (eventAction)
        await eventAction();
    
    if (player.stamina > 0)
        return;
        
    transient.isQuesting = false;
    addMessage("This was all very tiresome, you ran out of stamina and stop your quest.");
}

async function getAmbushed() {
    const goldTolose = Math.floor(Math.random() * 1000) + 200;
    removeGold(goldTolose);
    await waitForPart(2000, goldTolose < player.gold ? `You lose ${goldTolose} gold.` : "You lose all of your gold!");

    await waitForPart(2000, "After running for a while, you continue on your way.");
}

async function findCave() {
    await waitForPart(2000, "You enter the cave...");
    await doRandomAction([startLootChestEvent, startFightMonsterEvent, startExitCaveEvent]);
}

async function fightMonster() {
    const enemy = enemiesByName[getRandomItem<EnemyName>(["Goblin", "Troll", "Skeleton"])];
    await waitForPart(2000, `Upon closer inspection, the monster appears to be ${getWithIndefiniteArticle(enemy.name)}!`)

    if (player.playerDefense > enemy.defense) {
        await waitForPart(2000, `After a brief battle, you manage to defeat the ${enemy.name}!`);
        
        const gold = getRandomInt(enemy.gold.min, enemy.gold.max);
        addGold(gold);
        await waitForPart(2000, `You raided the ${enemy.name} and found ${gold} gold!`);
        
        addXp(enemy.defeatExperience);
        await waitForPart(2000, `You gain ${enemy.defeatExperience} experience!`);
        questWasSuccessful();
    } else {
        await waitForPart(2000, `You lost. You weren't strong enough to defeat the ${enemy.name}.`);

        addMessage("Your quest ended in failure, you retreat home having lost everything could have.");
        transient.isQuesting = false;
    }
}

async function lootChest() {
    const goldAmount = hasAmuletOfLuck() ? Math.floor(Math.random() * 3000) + 12000 : Math.floor(Math.random() * 800);
    addGold(goldAmount);
    addMessage(`You find ${goldAmount} gold in the old chest!`);

    const item = getLootDrop(hasAmuletOfLuck() ? ["rare", "legendary"] : ["common", "uncommon"]);
    addMessage(`You found ${getWithIndefiniteArticle(item.name)}!${(hasAmuletOfLuck() ? " You feel lucky!" : "")}`);
    addLoot(item);
    questWasSuccessful();
}

function getLootDrop(rarities: Rarity[]) {
    while(true) {
        const item = randomLootDrop();
        if (rarities.includes(item.rarity!)) 
            return item;
    }
}

function hasAmuletOfLuck() {
    return hasEquiped("Amulet of Luck");
}

function questWasSuccessful() {
    addStatistic("completedQuests", 1);
}

async function doRandomAction(actions: (() => void)[]) {
    const randomAction = getRandomItem(actions);
    await randomAction();
}

async function waitForPart(time: number, message: string) {
    await sleep(calculateTime(time));
    addMessage(message);
}

function removeStamina(amount: number) {
    player.stamina = Math.max(0, player.stamina - amount);
    renderStamina();
}

export function addStamina(amount: number) {
    player.stamina = Math.min(player.maxStamina, player.stamina + amount);
    renderStamina();
}

export function startStaminaInterval() {
    setInterval(function () {
        if (player.stamina < player.maxStamina && !transient.isQuesting) {
            addStamina(1);
            saveData("Stamina interval");
        }
    }, 2000);
}


export function renderStamina() {
    dom.getElement("progressStamina").style.width = `${player.stamina / player.maxStamina * 100}%`;
    dom.getElement("progressStamina").style.transition = "width 1.5s";
    dom.setHtml("staminaAmount", player.stamina.toString());
}

export const actions = {
    doQuest: wrapAction(doQuest),
}