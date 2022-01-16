import * as dom from './dom.js';
import { enemy_dictionary } from "./enemies.js";
import { addXp } from "./experience.js";
import { randomLootDrop } from "./events.js";
import { addToOwnedEquipment } from "./equipment.js";
import player, { addGold, addStatistic } from "./player.js";
import { addMessage } from './messages.js';
import { getRandomInt } from './util.js';

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
    const playerTimeBetweenAttacks = 1000 / player.playerSpeed;
    playerAttackTimer = setInterval(doPlayerAttack, playerTimeBetweenAttacks);
    document.getElementById("playerAttackProgress").style.transition = `width ${playerTimeBetweenAttacks}ms`;
    document.getElementById("playerAttackProgress").style.width = "100%";

    const enemyTimeBetweenAttacks = 1000 / enemy.speed;
    enemyAttackTimer = setInterval(doEnemyAttack, enemyTimeBetweenAttacks);
    document.getElementById("enemyAttackProgress").style.transition = `width ${enemyTimeBetweenAttacks}ms`;
    document.getElementById("enemyAttackProgress").style.width = "100%";
}

function resetProgressbar(id) {
    const element = document.getElementById(id);
    element.style.width = "0%";
    element.classList.add('notransition');
    setTimeout(() => {
        element.classList.remove('notransition');
        element.style.width = "100%";
    }, 10);
}

function doPlayerAttack() {
    resetProgressbar("playerAttackProgress");
    const damage = Math.max(0, player.playerAttack - enemy.defense);
    setEnemyHealth(enemyHealth - damage);
    if (enemyHealth <= 0)
        enemyDied();
}

function doEnemyAttack() {
    resetProgressbar("enemyAttackProgress");
    const damage = Math.max(0, enemy.attack - player.playerDefense);
    setPlayerHealth(player.playerHealth - damage);
    if (player.playerHealth <= 0)
        playerDied();
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
        addToOwnedEquipment(item);
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
    clearInterval(playerAttackTimer);
    clearInterval(enemyAttackTimer);
    enemy = undefined;
    renderPreCombatInfo();
}

function setPlayerHealth(value) {
    player.playerHealth = Math.max(0, value);
    dom.setHtml("playerHealthValue", player.playerHealth);
    document.getElementById("playerHealthProgress").style.width = `${player.playerHealth / player.maxHealth * 100}%`;
}

function setEnemyHealth(value) {
    enemyHealth = Math.max(0, value);
    document.getElementById("healthValue").innerHTML = enemyHealth;
    document.getElementById("enemyHealthProgress").value = enemyHealth;
    document.getElementById("enemyHealthProgress").style.width = `${enemyHealth/ enemy.health * 100}%`;
}

function renderPreCombatInfo(){
    dom.setHtml("enemyHeader", enemy?.name || "Enemy");
    dom.setHtml("healthValue", enemy?.health || 0);
    dom.setHtml("attackValue", enemy?.attack || 0);
    dom.setHtml("defenseValue", enemy?.defense || 0);
    dom.setHtml("speedValue", enemy?.speed || 0);
    document.getElementById("enemyHealthProgress").style.width = `100%`;

    const isInCombat = !!enemy;
    dom.setIsDisplayed("fightButton", !isInCombat);
    dom.setIsDisplayed("opponentSelector", !isInCombat);
    dom.setIsDisplayed("attackButton", isInCombat);
    dom.setIsDisplayed("fleeButton", isInCombat);
    dom.setIsDisplayed("defendButton", isInCombat);
    dom.setIsDisplayed("specialButton", isInCombat);
}
