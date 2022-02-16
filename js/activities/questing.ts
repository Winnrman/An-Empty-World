import * as dom from "../util/dom";
import { EnemyName, enemiesByName, Enemy } from "../data/enemies";
import { addXp } from "../control/experience";
import { addMessage } from '../control/messages';
import player, { saveData }  from "../control/player";
import { getRandomInt, getRandomItem, getRandomNumber, getWithIndefiniteArticle } from '../util';
import { addLoot, getModifiedChanceList, getRandomItemFromChanceList, Loot, OptionChance, randomLootDrop } from "./looting";
import { calculateTime, sleep } from "../control/timing";
import { wrapAction } from "../control/user";
import { addGold, removeGold } from "../control/inventory";
import { addStatistic } from "../control/statistics";

type LogMessage = {
    message: string;
    count: number;
}

const quest = {
    currentAction: "",
    logs: Array<LogMessage>(),
}

export async function startQuest() {
    if (player.isQuesting == true) {
        addMessage("You are already on a quest!");
        return;
    }

    quest.logs = Array<LogMessage>();

    await doStartQuest();
}

export async function resumeQuesting() {
    if (!player.isQuesting)
        return;
    
    await doStartQuest();
}

async function doStartQuest() {
    if (player.stamina <= 0) {
        addMessage("You don't have enough stamina to start a quest!");
        return;
    }

    player.isQuesting = true;
    type QuestScenario = "Walk" | "FindChest" | "FightMonster" | "FindCave" | "GetAmbushed";
    const questScenarios: OptionChance<QuestScenario>[] = [
        { name: "Walk", chance: 5 },
        { name: "FindCave", chance: 3 },
        { name: "FindChest", chance: 1 },
        { name: "FightMonster", chance: 1 },
        { name: "GetAmbushed", chance: 1 },
    ];

    await runScenarioStartQuest();

    let shouldWalk = true;

    while(player.isQuesting) {
        if (checkRanOutOfStamina())
            break;
        
        if (shouldWalk) {
            shouldWalk = false;
            await runScenarioWalk();
            continue;
        }

        const questScenario = getRandomItemFromChanceList(questScenarios);
        shouldWalk = questScenario != "Walk";
        switch (questScenario) {
            case "Walk": await runScenarioWalk(); break;
            case "FindCave": await runScenarioFindCave(); break;
            case "FindChest": await runScenarioFindChest(); break;
            case "FightMonster": await runScenarioFightMonster(); break;
            case "GetAmbushed": await runScenarioGetAmbushed(); break;
        }

        checkRanOutOfStamina();
    }

    renderQuests();
}

export async function stopQuest() {
    quest.currentAction = "You stopped your glorious quest.";
    player.isQuesting = false;
    renderQuests();
}

async function runScenarioStartQuest() {
    addLog("You begin off on your quest, walking through this empty and barren world.");
    await waitForPart(1, 5000, "Looking for something interesting...");
}

async function runScenarioWalk() {
    addLog("You move on and continue your search.");
    await waitForPart(1, 3000, "Looking for something interesting...");
}

async function runScenarioFindChest() {
    debugger;
    addLog("You find a chest!");
    await lootChest();
    questWasSuccessful();
}

async function runScenarioGetAmbushed() {
    addLog("While you're walking, you get ambushed by a pack of thieves, and you are forced to flee!");
    if (await waitForPart(0, 10000, "Running away..."))
        return;

    if (getRandomNumber(0, 1) + getStaminaPercentage() >= 1) {
        addLog(`You managed to get away!`);
        await waitForPart(3, 10000, "Recovering your senses...");
        return;
    }
    
    const goldToLose = getRandomInt(200, 1200)
    removeGold(goldToLose);
    addLog(`The thieves run faster than you and manage to grab you.`);
    if (await waitForPart(0, 10000, "Getting robbed..."))
        return;
    
    addLog(`You lose ${player.gold === 0 ? "all of your" : goldToLose} gold, and the thieces leave you for dead.`);
    if (await waitForPart(3, 10000, "Lying unconscious..."))
        return;

    addLog("You manage to get up again.");
    await waitForPart(0, 10000, "Getting up...");
}

async function runScenarioFightMonster() {
    addLog("You hear a strange sound behind you.");
    if (await waitForPart(0, 1000, "Turning around..."))
        return;

    const enemy = enemiesByName[getRandomItem<EnemyName>(["Goblin", "Troll", "Skeleton"])];
    addLog(`As you turn around, you see ${getWithIndefiniteArticle(enemy.name)}!`);
    await fightMonster(enemy);
}

async function runScenarioFindCave() {
    addLog("In this barren landscape, you manage to find something that looks like a cave!");
    if (await waitForPart(1, 10000, "Entering the cave..."))
        return;

    let depth = 0;

    type CaveOptions = "ExploreCave" | "FightMonster" | "LootChest" | "ExitCave";
    const caveOptions: OptionChance<CaveOptions>[] = [
        { name: "ExploreCave", chance: 5 },
        { name: "FightMonster", chance: 3 },
        { name: "LootChest", chance: 2 },
        { name: "ExitCave", chance: 1 },
    ];

    let shouldExplore = true;

    while(true) {
        if (checkRanOutOfStamina())
            return;
        
        depth++;

        const modifiedCaveOptions = getModifiedChanceList(caveOptions, { "ExitCave": depth });
        const caveOption = getRandomItemFromChanceList(modifiedCaveOptions);

        if (shouldExplore || caveOption === "ExploreCave") {
            shouldExplore = false;
            addLog("You move deeper into the cave.");
            await waitForPart(1, 3000, "Moving deeper into cave...");
            continue;
        }

        shouldExplore = true;

        if (caveOption === "FightMonster") {
            addLog("You hear a disturbing sound in the cave.");
            if (await waitForPart(0, 10000, "Listening to the sound..."))
                return;
            
            const enemyOptions: OptionChance<EnemyName>[] = [
                { name: "Goblin", chance: 5 },
                { name: "Troll", chance: 2 },
                { name: "Skeleton", chance: 1 },
            ]
            const modifiedEnemyOptions = getModifiedChanceList(enemyOptions, { "Skeleton": depth });
            const enemyOption = getRandomItemFromChanceList(modifiedEnemyOptions);
            const enemy = enemiesByName[enemyOption];
            addLog(`The source of the sound keeps on getting closer, and all of a sudden ${getWithIndefiniteArticle(enemy.name)} is standing in front of you!`);
            await fightMonster(enemy);
            continue;
        }

        if (caveOption === "LootChest") {
            addLog("Hidden in the cave, you find a chest!");
            await lootChest();
            continue;
        }

        if (caveOption === "ExitCave") {
            if (depth === 1) 
                addLog("There doesn't seem to be anything interesting in the cave, so you leave it.");
            else {
                addLog("You seem to be at the end of the cave, so you trace back your steps and leave it.");
            }

            await waitForPart(depth, depth * 3000, "Leaving cave...");
            break;
        }
    }

    if (checkRanOutOfStamina())
        return;
        
    questWasSuccessful();
}

async function fightMonster(enemy: Enemy) {
    if (await waitForPart(0, 10000, `Fighting ${enemy.name}...`))
        return;
    
    if (player.defense > enemy.defense && player.stamina > 5) {
        loseStamina(5);

        addXp(enemy.defeatExperience);
        addLog(`After a brief battle, you manage to defeat the ${enemy.name}! You gain ${enemy.defeatExperience} experience!`);
        
        if (await waitForPart(0, 10000, `Raiding ${enemy.name}...`))
            return;

        const gold = getRandomInt(enemy.gold.min, enemy.gold.max);
        addGold(gold);
        addLog(`You raided the ${enemy.name} and found ${gold} gold!`);
        await sleep(500);
        questWasSuccessful();
    } else {
        if (loseStamina(5))
            return;
        
        addLog(`You lost. You weren't strong enough to defeat the ${enemy.name}.`);
        if (await waitForPart(0, 10000, "Trying to get up..."))
            return;
        
        addLog("Your quest ended in failure, you retreat home having lost everything could have.");
        player.isQuesting = false;
    }
}

async function lootChest() {
    const staminaCost = player.luck >= 3 ? 1 : 2;
    if (await waitForPart(staminaCost, 10000, 'Opening the chest...'))
        return;

    await findGoldAndLoot(getRandomGold(), randomLootDrop());
}

function getRandomGold() {
    const min = player.luck * 4000;
    const max = 1000 + player.luck * 5000;
    return getRandomInt(min, max);
}

async function findGoldAndLoot(gold: number, ...loot: Loot[]) {
    const isLucky = loot.some(x => ["rare", "legendary"].includes(x.rarity));
    const lootPart = loot.map(x => getWithIndefiniteArticle(x.name)).join(", ");
    addLog(`You find ${gold} gold and ${lootPart}!${(isLucky ? " You feel lucky!" : "")}`);

    addGold(gold);
    for (const item of loot)
        addLoot(item);
}

function questWasSuccessful() {
    addStatistic("completedQuests", 1);
}

function addLog(message: string) {
    const [lastLog] = quest.logs.slice(-1);
    if (lastLog?.message === message) {
        lastLog.count++;
    } else {
        quest.logs.push({ message: message, count: 1 });
    }
    renderQuests();
}

async function waitForPart(staminaCost: number, time: number, message: string) {
    if (time > 3000)
        await sleep(500);

    quest.currentAction = message;
    renderQuests();

    if (loseStamina(staminaCost))
        return true;
        
    const actualTime = calculateTime(time);
    dom.resetProgressbar("questActionProgress", actualTime);
    await sleep(actualTime);

    quest.currentAction = "";
    renderQuests();

    if (!player.isQuesting)
        return true;
}

function loseStamina(staminaCost: number) {
    if (!player.isQuesting)
        return true;
    
    const hasInsufficientStamina = player.stamina < staminaCost;
    player.stamina = Math.max(0, player.stamina - staminaCost);
    renderStamina();

    if (hasInsufficientStamina) {
        player.isQuesting = false;
        addLog("You did not have enough stamina to put up with this and stop your quest.");
        return true;
    }
}

function checkRanOutOfStamina() {
    if (!player.isQuesting)
        return true;
    
    if (player.stamina <= 0) {
        player.isQuesting = false;
        addLog("This was all very tiresome, you ran out of stamina and stop your quest.");
        return true;
    }
}

function getStaminaPercentage() {
    return player.stamina / player.maxStamina;
}

export function addStamina(amount: number) {
    player.stamina = Math.min(player.maxStamina, player.stamina + amount);
    renderStamina();
}

export function startStaminaInterval() {
    setInterval(function () {
        if (player.stamina < player.maxStamina && !player.isQuesting) {
            addStamina(1);
            saveData("Stamina interval");
        }
    }, 2000);
}


export function renderStamina() {
    dom.animateWidth("progressStamina", player.stamina, player.maxStamina, 500);
    dom.setHtml("staminaAmount", player.stamina.toString());
}

export function renderQuests() {
    let html = "";


    if (player.isQuesting) {
        html += `<button onClick="questing.stopQuest()">Stop quest</button><br />`;
        html += `<div class="progress-bar"><span id="questActionProgress" style="width: 0%;"></span></div>`;
        html += ` ${quest.currentAction}<br />`;
        html += `<br />`;
    }
    else {
        html += `<button onClick="questing.startQuest()">Start quest</button><br />`;
    }

    for (const messageLog of [...quest.logs].reverse()) {
        html += `${messageLog.message}${messageLog.count > 1 ? ` (${messageLog.count})` : ''}<br />`;
    }

    dom.setHtml("questing", html);
}

export const actions = {
    startQuest: wrapAction(startQuest),
    stopQuest: wrapAction(stopQuest),
}