import * as dom from '../util/dom';
import { Enemy, EnemyName, enemiesByName } from "../data/enemies";
import { addXp } from "../control/experience";
import { randomLootDrop } from "./events";
import player, { addGold, addStatistic, saveData } from "../control/player";
import { addMessage } from '../control/messages';
import { getRandomInt, minMax } from '../util';
import { addLoot } from './looting';

type Fight = {
    enemy: Enemy;
    enemyHealth: number;
    playerAttackTimer?: NodeJS.Timer;
    enemyAttackTimer?: NodeJS.Timer;
}

let selectedEnemy: Enemy | undefined;
let currentFight: Fight | undefined;

export async function selectEnemy (enemyName: EnemyName) {
    selectedEnemy = enemiesByName[enemyName];
    renderPreCombatInfo();
}

export async function startCombat () {
    if (currentFight || !selectedEnemy)
        return;
    
    currentFight = {
        enemy: selectedEnemy,
        enemyHealth: selectedEnemy.health,
    };

    queuePlayerAttack(currentFight);
    queueEnemyAttack(currentFight);
    dom.getElement("playerAttackProgress").style.width = "100%";
    dom.getElement("enemyAttackProgress").style.width = "100%";
}

function resetProgressbar(id: string) {
    const element = dom.getElement(id);
    element.style.width = "0%";
    element.classList.add('notransition');
    setTimeout(() => {
        element.classList.remove('notransition');
        element.style.width = "100%";
    }, 10);
}

function queuePlayerAttack(fight: Fight) {
    const playerTimeBetweenAttacks = 1000 / player.playerSpeed;
    dom.getElement("playerAttackProgress").style.transition = `width ${playerTimeBetweenAttacks}ms`;
    fight.playerAttackTimer = setTimeout(doPlayerAttack, playerTimeBetweenAttacks);
}

function doPlayerAttack() {
    if (!currentFight)
        return;

    currentFight.playerAttackTimer = undefined;
    resetProgressbar("playerAttackProgress");

    const damage = Math.max(0, player.playerAttack - currentFight.enemy.defense);
    currentFight.enemyHealth = Math.max(0, currentFight.enemyHealth - damage);
    renderEnemyHealth(currentFight);
    if (currentFight.enemyHealth <= 0)
        enemyDied(currentFight);
    else
        queuePlayerAttack(currentFight);
}

function queueEnemyAttack(fight: Fight) {
    const enemyTimeBetweenAttacks = 1000 / fight.enemy.speed;
    dom.getElement("enemyAttackProgress").style.transition = `width ${enemyTimeBetweenAttacks}ms`;
    fight.enemyAttackTimer = setTimeout(doEnemyAttack, enemyTimeBetweenAttacks);
}

function doEnemyAttack() {
    if (!currentFight)
        return;

    currentFight.enemyAttackTimer = undefined;
    
    resetProgressbar("enemyAttackProgress");
    const damage = Math.max(0, currentFight.enemy.attack - player.playerDefense);
    setPlayerHealth(player.playerHealth - damage);
    if (player.playerHealth <= 0)
        playerDied();
    else
        queueEnemyAttack(currentFight);
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
    currentFight?.playerAttackTimer && clearTimeout(currentFight.playerAttackTimer);
    currentFight?.enemyAttackTimer && clearTimeout(currentFight.enemyAttackTimer);
    currentFight = undefined;
    selectedEnemy = undefined;

    renderPreCombatInfo();
    saveData();
}

export function addPlayerHealth(value: number) {
    setPlayerHealth(player.playerHealth + value);
}

function setPlayerHealth(value: number) {
    player.playerHealth = minMax(0, value, player.maxHealth);
    renderPlayerHealth();
}

function renderPlayerHealth() {
    dom.setHtml("playerHealthValue", player.playerHealth.toString());
    dom.getElement("playerHealthProgress").style.width = `${player.playerHealth / player.maxHealth * 100}%`;
}

function renderEnemyHealth(fight: Fight) {
    dom.setHtml("healthValue", fight.enemyHealth.toString());
    dom.getElement("enemyHealthProgress").style.width = `${fight.enemyHealth/ fight.enemy.health * 100}%`;
}

export function renderPreCombatInfo(){
    const enemy = selectedEnemy;
    dom.setHtml("enemyHeader", enemy?.name ?? "Enemy");
    dom.setHtml("healthValue", (enemy?.health ?? 0).toString());
    dom.setHtml("attackValue", (enemy?.attack ?? 0).toString());
    dom.setHtml("defenseValue", (enemy?.defense ?? 0).toString());
    dom.setHtml("speedValue", (enemy?.speed ?? 0).toString());
    dom.getElement("enemyHealthProgress").style.width = `100%`;

    const isInCombat = enemy !== undefined;
    dom.setIsDisplayed("fightButton", !isInCombat);
    dom.setIsDisplayed("opponentSelector", !isInCombat);
    dom.setIsDisplayed("attackButton", isInCombat);
    dom.setIsDisplayed("fleeButton", isInCombat);
    dom.setIsDisplayed("defendButton", isInCombat);
    dom.setIsDisplayed("specialButton", isInCombat);
    dom.setIsDisplayed("enemyStats", isInCombat);

    renderPlayerHealth();
}
