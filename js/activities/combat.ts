import * as dom from '../util/dom';
import { enemy_dictionary } from "../data/enemies";
import { addXp } from "../control/experience";
import { randomLootDrop } from "./events";
import player, { addGold, addStatistic } from "../control/player";
import { addMessage } from '../control/messages';
import { getRandomInt, minMax } from '../util';
import { addLoot } from './looting';

let enemy;
let enemyHealth;
var playerAttackTimer;
var enemyAttackTimer;

export function selectEnemy (enemyName) {
    enemy = enemy_dictionary[enemyName];
    renderPreCombatInfo();
}

export function startCombat () {
    if (enemyHealth)
        return;
    
    enemyHealth = enemy.health;

    queuePlayerAttack();
    queueEnemyAttack();
    dom.getElement("playerAttackProgress").style.width = "100%";
    dom.getElement("enemyAttackProgress").style.width = "100%";
}

function resetProgressbar(id) {
    const element = dom.getElement(id);
    element.style.width = "0%";
    element.classList.add('notransition');
    setTimeout(() => {
        element.classList.remove('notransition');
        element.style.width = "100%";
    }, 10);
}

function queuePlayerAttack() {
    const playerTimeBetweenAttacks = 1000 / player.playerSpeed;
    dom.getElement("playerAttackProgress").style.transition = `width ${playerTimeBetweenAttacks}ms`;
    playerAttackTimer = setTimeout(doPlayerAttack, playerTimeBetweenAttacks);
}

function doPlayerAttack() {
    playerAttackTimer = undefined;
    
    resetProgressbar("playerAttackProgress");
    const damage = Math.max(0, player.playerAttack - enemy.defense);
    setEnemyHealth(enemyHealth - damage);
    if (enemyHealth <= 0)
        enemyDied();
    else
        queuePlayerAttack();
}

function queueEnemyAttack() {
    const enemyTimeBetweenAttacks = 1000 / enemy.speed;
    dom.getElement("enemyAttackProgress").style.transition = `width ${enemyTimeBetweenAttacks}ms`;
    enemyAttackTimer = setTimeout(doEnemyAttack, enemyTimeBetweenAttacks);
}

function doEnemyAttack() {
    enemyAttackTimer = undefined;
    
    resetProgressbar("enemyAttackProgress");
    const damage = Math.max(0, enemy.attack - player.playerDefense);
    setPlayerHealth(player.playerHealth - damage);
    if (player.playerHealth <= 0)
        playerDied();
    else
        queueEnemyAttack();
}

function enemyDied() {
    addXp(enemy.defeatExperience)
    const gold = getRandomInt(enemy.gold.min, enemy.gold.max);
    addGold(gold);
    addMessage(`You defeated the ${enemy.name} and earned ${gold} gold and ${enemy.defeatExperience} XP!`);
    addStatistic("killedEnemies", 1);

    var droppedRandomLoot = Math.floor(Math.random() * 100);
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

export function doFlee() {
    addMessage("You fled!");
    setPlayerHealth(player.maxHealth);
    clearFight();
}

function clearFight() {
    enemy = undefined;

    clearTimeout(playerAttackTimer);
    playerAttackTimer = undefined;

    clearTimeout(enemyAttackTimer);
    enemyAttackTimer = undefined;

    renderPreCombatInfo();
}

export function addPlayerHealth(value) {
    setPlayerHealth(player.playerHealth + value);
}

function setPlayerHealth(value) {
    player.playerHealth = minMax(0, value, player.maxHealth);
    renderPlayerHealth();
}

function renderPlayerHealth() {
    dom.setHtml("playerHealthValue", player.playerHealth.toString());
    dom.getElement("playerHealthProgress").style.width = `${player.playerHealth / player.maxHealth * 100}%`;
}

function setEnemyHealth(value) {
    enemyHealth = Math.max(0, value);
    dom.getElement("healthValue").innerHTML = enemyHealth;
    dom.getElement("enemyHealthProgress").style.width = `${enemyHealth/ enemy.health * 100}%`;
}

export function renderPreCombatInfo(){
    dom.setHtml("enemyHeader", enemy?.name || "Enemy");
    dom.setHtml("healthValue", enemy?.health || 0);
    dom.setHtml("attackValue", enemy?.attack || 0);
    dom.setHtml("defenseValue", enemy?.defense || 0);
    dom.setHtml("speedValue", enemy?.speed || 0);
    dom.getElement("enemyHealthProgress").style.width = `100%`;

    const isInCombat = !!enemy;
    dom.setIsDisplayed("fightButton", !isInCombat);
    dom.setIsDisplayed("opponentSelector", !isInCombat);
    dom.setIsDisplayed("attackButton", isInCombat);
    dom.setIsDisplayed("fleeButton", isInCombat);
    dom.setIsDisplayed("defendButton", isInCombat);
    dom.setIsDisplayed("specialButton", isInCombat);
    dom.setIsDisplayed("enemyStats", isInCombat);

    renderPlayerHealth();
}
