import "../../css/combat.css";

import * as dom from '../util/dom';
import { Enemy, EnemyName, enemiesByName } from "../data/enemies";
import { addXp } from "../control/experience";
import player from "../control/player";
import { addMessage } from '../control/messages';
import { displayNumber, getRandomInt, minMax } from '../util';
import { addLoot, randomLootDrop } from './looting';
import { wrapAction } from '../control/user';
import { calculateTime, sleep } from '../control/timing';
import { addGold } from '../control/inventory';
import { addStatistic } from '../control/statistics';

type Fight = {
    enemy: Enemy;
    enemyHealth: number;
    timeUntilPlayerAttack: number;
    timeUntilEnemyAttack: number;
    isClearing?: boolean;
}

let selectedEnemy: Enemy | undefined;
let fight: Fight | undefined;

export async function selectEnemy (enemyName: EnemyName) {
    selectedEnemy = enemiesByName[enemyName];
    renderCombat();
}

function getTimeUntilNextAttack(fight: Fight) {
    return Math.min(fight.timeUntilPlayerAttack, fight.timeUntilEnemyAttack);
}

export async function startCombat () {
    if (!selectedEnemy)
        return;
    
    fight = {
        enemy: selectedEnemy,
        enemyHealth: selectedEnemy.health,
        timeUntilPlayerAttack: 0,
        timeUntilEnemyAttack: 0
    };
    renderCombatActions();

    setNextPlayerAttack(fight);
    setNextEnemyAttack(fight);

    while(true) {
        const timeUntilNextAttack = getTimeUntilNextAttack(fight);
    
        await sleep(timeUntilNextAttack);

        if (!selectedEnemy)
            break;

        fight.timeUntilPlayerAttack -= timeUntilNextAttack;
        if (fight.timeUntilPlayerAttack <= 0) {
            const damage = calculateDamage(player.attack, fight.enemy.defense);
            setEnemyHealth(fight, fight.enemyHealth - damage);

        }

        fight.timeUntilEnemyAttack -= timeUntilNextAttack;
        if (fight.timeUntilEnemyAttack <= 0) {
            const damage = calculateDamage(fight.enemy.attack, player.defense);
            setPlayerHealth(player.health - damage);
        }
        
        if (fight.enemyHealth <= 0) {
            await enemyDied(fight);
            break;
        }
        
        if (player.health <= 0) {
            await playerDied();
            break;
        }

        if (fight.timeUntilPlayerAttack <= 0) {
            setNextPlayerAttack(fight);
        }
        
        if (fight.timeUntilEnemyAttack <= 0) {
            setNextEnemyAttack(fight);
        }
    }
}

function calculateDamage(attack: number, defense: number) {
    if (attack > defense)
        return attack - defense / 2;
    return attack * attack / defense / 2
}

function setNextPlayerAttack(fight: Fight) {
    const timeUntilNextAttack = calculateTime(1000 / player.speed);
    fight.timeUntilPlayerAttack = timeUntilNextAttack;
    dom.resetProgressbar("playerAttackProgress", timeUntilNextAttack);
}

function setNextEnemyAttack(fight: Fight) {
    const timeUntilNextAttack = calculateTime(1000 / fight.enemy.speed);
    fight.timeUntilEnemyAttack = timeUntilNextAttack;
    dom.resetProgressbar("enemyAttackProgress", timeUntilNextAttack);
}

async function enemyDied(fight: Fight) {
    const enemy = fight.enemy;
    addXp(enemy.defeatExperience)
    const gold = getRandomInt(enemy.gold.min, enemy.gold.max);
    addGold(gold);
    addMessage(`You defeated the ${enemy.name} and earned ${gold} gold and ${enemy.defeatExperience} XP!`);
    addStatistic("killedEnemies", 1);

    const droppedRandomLoot = getRandomInt(1, 100);
    if (droppedRandomLoot < 25) {
        const item = randomLootDrop();
        addMessage(`The ${enemy.name} dropped ${item.name}!`);
        addLoot(item);
    }

    await clearFight(false);
}

async function playerDied() {
    addMessage("You lose!");
    await clearFight(false);
}

export async function doFlee() {
    addMessage("You fled!");
    setPlayerHealth(player.maxHealth);
    await clearFight(true);
}

async function clearFight(clearEnemy: boolean) {
    if (fight && !clearEnemy) {
        fight.isClearing = true;
        renderCombat();
        await sleep(calculateTime(2000));
    }

    if (clearEnemy)
        selectedEnemy = undefined;

    fight = undefined;

    renderCombat();
}

export function addPlayerHealth(value: number) {
    setPlayerHealth(player.health + value);
}

function setPlayerHealth(value: number) {
    player.health = minMax(0, value, player.maxHealth);
    dom.setHtml("playerHealth", displayNumber(player.health).toString());
    dom.getElement("playerHealthProgress").style.width = `${player.health / player.maxHealth * 100}%`;
}

function setEnemyHealth(fight: Fight, value: number) {
    fight.enemyHealth = Math.max(0, value);
    dom.setHtml("enemyHealth", displayNumber(fight.enemyHealth).toString());
    dom.getElement("enemyHealthProgress").style.width = `${fight.enemyHealth / fight.enemy.health * 100}%`;
}

export function renderCombat() {
    renderCombatPlayer();
    renderCombatActions();
    renderCombatEnemy();
}

export function renderCombatPlayer() {
    let html = "";
    html += `<div>
                <h4 style="text-decoration: underline;">Player</h4>
                <div class="progress-bar"><span id="playerHealthProgress" style="width: ${player.health / player.maxHealth * 100}%;"></span></div><br />
                <div class="progress-bar"><span id="playerAttackProgress" style="width: 100%;"></span></div>
                <p>Health: <span id="playerHealth">${displayNumber(player.health)}</span></p>
                <p>Attack: ${player.attack}</p>
                <p>Defense: ${player.defense}</p>
                <p>Speed: ${player.speed}</p>
            </div>`;
    dom.setHtml("combat-player", html);
}

function renderCombatActions() {
    if (!selectedEnemy) {
        let html = ""
        html += `<select id="opponentSelector">
                    <option value="">Select an opponent</option>
                    <option value="Goblin">Goblin</option>
                    <option value="Troll">Troll</option>
                    <option value="Skeleton">Skeleton</option>
                    <option value="Knight">Knight</option>
                    <option value="King">King</option>
                </select>
                <button onclick="combat.selectEnemy(document.getElementById('opponentSelector').value)">Fight</button>`;
        dom.setHtml("combat-actions", html);
        return;
    }

    let html = "";
    html += `<div>`
    if (!fight)
        html += `<button onclick="combat.startCombat()">Attack</button><br />`;

    if (fight?.isClearing)
        html += `Clearing fight...<br />`;
    else
        html += `<button onclick="combat.doFlee()">Flee</button><br />`;
    // html += `<button onclick="combat.defend()">Defend</button><br />`;
    // html += `<button onclick="combat.special()">Special</button>`;
    html +=`</div>`;
    dom.setHtml("combat-actions", html);
}

function renderCombatEnemy() {
    if (!selectedEnemy) {
        dom.setHtml("combat-enemy", "");
        return;
    }

    let html = "";
    html += `<div>
                <h4 style="text-decoration: underline;">${selectedEnemy.name}</h4>
                <div class="progress-bar"><span id="enemyHealthProgress" style="width: ${fight ? fight.enemyHealth / fight.enemy.health * 100 : 100}%;"></span></div><br />
                <div class="progress-bar"><span id="enemyAttackProgress" style="width: 0%;"></span></div>
                <p>Health: <span id="enemyHealth">${displayNumber(fight?.enemyHealth ?? selectedEnemy.health)}</span></p>
                <p>Attack: ${selectedEnemy.attack}</p>
                <p>Defense: ${selectedEnemy.defense}</p>
                <p>Speed: ${selectedEnemy.speed}</p>
            </div>`;
    dom.setHtml("combat-enemy", html);
}

export const actions = {
    selectEnemy: wrapAction(selectEnemy),
    startCombat: wrapAction(startCombat),
    doFlee: wrapAction(doFlee),
}