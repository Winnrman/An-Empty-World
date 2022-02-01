import * as dom from '../util/dom';
import { Enemy, EnemyName, enemiesByName } from "../data/enemies";
import { addXp } from "../control/experience";
import { randomLootDrop } from "./events";
import player, { addGold, addStatistic, saveData } from "../control/player";
import { addMessage } from '../control/messages';
import { getRandomInt, minMax } from '../util';
import { addLoot } from './looting';
import { wrapAction } from '../control/user';
import { checkAchievements } from '../control/achievements';
import { sleep } from '../control/timing';

import "../../css/combat.css";

type Fight = {
    enemy: Enemy;
    enemyHealth: number;
    timeUntilPlayerAttack: number;
    timeUntilEnemyAttack: number;
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

    setNextPlayerAttack(fight);
    setNextEnemyAttack(fight);

    while(true) {
        const timeUntilNextAttack = getTimeUntilNextAttack(fight);
    
        await sleep(timeUntilNextAttack);

        if (!selectedEnemy)
            break;

        fight.timeUntilPlayerAttack -= timeUntilNextAttack;
        if (fight.timeUntilPlayerAttack <= 0) {
            const damage = Math.max(0, player.playerAttack - fight.enemy.defense);
            fight.enemyHealth = Math.max(0, fight.enemyHealth - damage);
            renderCombatEnemy();
        }

        fight.timeUntilEnemyAttack -= timeUntilNextAttack;
        if (fight.timeUntilEnemyAttack <= 0) {
            const damage = Math.max(0, fight.enemy.attack - player.playerDefense);
            setPlayerHealth(player.playerHealth - damage);
            setNextEnemyAttack(fight);
        }
        
        if (fight.timeUntilPlayerAttack <= 0) {
            setNextPlayerAttack(fight);
        }
        
        if (fight.enemyHealth <= 0) {
            enemyDied(fight);
            break;
        }
        
        if (player.playerHealth <= 0) {
            playerDied();
            break;
        }

        setNextEnemyAttack(fight);
    }
}

function setNextPlayerAttack(fight: Fight) {
    fight.timeUntilPlayerAttack = 1000 / player.playerSpeed;
    dom.resetProgressbar("playerAttackProgress", fight.timeUntilPlayerAttack);
}

function setNextEnemyAttack(fight: Fight) {
    fight.timeUntilEnemyAttack = 1000 / fight.enemy.speed;
    dom.resetProgressbar("enemyAttackProgress", fight.timeUntilEnemyAttack);
}

function enemyDied(fight: Fight) {
    const enemy = fight.enemy;
    addXp(enemy.defeatExperience)
    const gold = getRandomInt(enemy.gold.min, enemy.gold.max);
    addGold(gold);
    addMessage(`You defeated the ${enemy.name} and earned ${gold} gold and ${enemy.defeatExperience} XP!`);
    addStatistic("killedEnemies", 1);

    const droppedRandomLoot = Math.floor(Math.random() * 100);
    if (droppedRandomLoot < 25) {
        const item = randomLootDrop();
        addMessage(`The ${enemy.name} dropped ${item.name}!`);
        addLoot(item);
    }

    clearFight();
}

function playerDied() {
    addMessage("You lose!");
    clearFight();
}

export async function doFlee() {
    addMessage("You fled!");
    setPlayerHealth(player.maxHealth);
    clearFight();
}

function clearFight() {
    selectedEnemy = undefined;
    fight = undefined;

    renderCombat();
    checkAchievements();
    saveData("Clear fight");
}

export function addPlayerHealth(value: number) {
    setPlayerHealth(player.playerHealth + value);
}

function setPlayerHealth(value: number) {
    player.playerHealth = minMax(0, value, player.maxHealth);
    renderCombatPlayer();
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
                <div class="progress-bar"><span id="playerHealthProgress" style="width: ${player.playerHealth / player.maxHealth * 100}%;"></span></div><br />
                <div class="progress-bar"><span id="playerAttackProgress" style="width: 100%;"></span></div>
                <p>Health: ${player.playerHealth}</p>
                <p>Attack: ${player.playerAttack}</p>
                <p>Defense: ${player.playerDefense}</p>
                <p>Speed: ${player.playerSpeed}</p>
            </div>`;
    dom.setHtml("combat-player", html);
}

function renderCombatActions() {
    if (!selectedEnemy) {
        dom.setHtml("combat-actions", "");
        return;
    }

    let html = "";
    html += `<div>
                <button onclick="combat.startCombat()">Attack</button><br />
                <button onclick="combat.doFlee()">Flee</button><br />
                <button onclick="combat.defend()">Defend</button><br />
                <button onclick="combat.special()">Special</button>
            </div>`;
    dom.setHtml("combat-actions", html);
}

function renderCombatEnemy() {
    if (!selectedEnemy) {
        let html = "";
        html += `<select id="opponentSelector">
                    <option value="">Select an opponent</option>
                    <option value="Goblin">Goblin</option>
                    <option value="Troll">Troll</option>
                    <option value="Skeleton">Skeleton</option>
                    <option value="Knight">Knight</option>
                    <option value="King">King</option>
                </select>
                <button onclick="combat.selectEnemy(document.getElementById('opponentSelector').value)">Fight</button>`;
        dom.setHtml("combat-enemy", html);
        return;
    }

    let html = "";
    html += `<div>
                <h4 style="text-decoration: underline;">${selectedEnemy.name}</h4>
                <div class="progress-bar"><span id="enemyHealthProgress" style="width: ${fight ? fight.enemyHealth/ fight.enemy.health * 100 : 100}%;"></span></div><br />
                <div class="progress-bar"><span id="enemyAttackProgress" style="width: 0%;"></span></div>
                <p>Health: ${fight?.enemyHealth ?? selectedEnemy.health}</p>
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