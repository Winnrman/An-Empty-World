import * as dom from './dom.js';
import { enemy_dictionary } from "./enemies.js";
import { addXp } from "./experience.js";
import { randomLootDrop, finalItem } from "./events.js";
import player, { addGold } from "./player.js";
import { addMessage } from './messages.js';
import { getRandomInt } from './util.js';

let enemy;
let enemyHealth;
var playerAttackTimer;
var enemyAttackTimer;

export function selectEnemy (enemyName) {
    enemy = enemy_dictionary[enemyName];
    renderCombatInfo();
}

export function startCombat () {
    if (enemyHealth)
        return;
    
    enemyHealth = enemy.health;
    playerAttackTimer = setInterval(doPlayerAttack, 1000 / player.playerSpeed);
    enemyAttackTimer = setInterval(doEnemyAttack, (1000 / enemy.speed));
}

function doPlayerAttack() {
    const damage = Math.max(0, player.playerAttack - enemy.defense);
    setEnemyHealth(enemyHealth - damage);
    addMessage(`You attack with ${player.playerAttack} attack versus ${enemy.defense} enemy defense doing ${damage} damage`);
    if (enemyHealth <= 0)
        enemyDied();
}

function doEnemyAttack() {
    const damage = Math.max(0, enemy.attack - player.playerDefense);
    setPlayerHealth(player.playerHealth - damage);
    addMessage(`The ${enemy.name} attacks with ${enemy.attack} attack versus ${player.playerDefense} your defense doing ${damage} damage`);
    if (player.playerHealth <= 0)
        playerDied();
}

function enemyDied() {
    addXp(enemy.defeatExperience)
    const gold = getRandomInt(enemy.gold.min, enemy.gold.max);
    addGold(gold);
    addMessage(`You defeated the ${enemy.name} and earned ${gold} gold and ${enemy.defeatExperience} XP!`);

    var droppedRandomLoot = Math.floor(Math.random() * 100);
    if (droppedRandomLoot < 25) {
        randomLootDrop();
        addMessage(`The ${enemy.name} dropped ${finalItem.name}!`);
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
    renderCombatInfo(undefined);
}

function setPlayerHealth(value) {
    player.playerHealth = Math.max(0, value);
    dom.setHtml("playerHealthValue", player.playerHealth);
}

function setEnemyHealth(value) {
    enemyHealth = Math.max(0, value);
    document.getElementById("healthValue").innerHTML = enemyHealth;
}

function renderCombatInfo(){
    dom.setHtml("enemyHeader", enemy?.name || "Enemy");
    dom.setHtml("healthValue", enemy?.health || 0);
    dom.setHtml("attackValue", enemy?.attack || 0);
    dom.setHtml("defenseValue", enemy?.defense || 0);
    dom.setHtml("speedValue", enemy?.speed || 0);

    const isInCombat = !!enemy;
    dom.setIsDisplayed("fightButton", !isInCombat);
    dom.setIsDisplayed("opponentSelector", !isInCombat);
    dom.setIsDisplayed("attackButton", isInCombat);
    dom.setIsDisplayed("fleeButton", isInCombat);
    dom.setIsDisplayed("defendButton", isInCombat);
    dom.setIsDisplayed("specialButton", isInCombat);
}
