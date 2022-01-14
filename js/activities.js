import { enemy_dictionary } from "./enemies.js";
import { randomLootDrop, finalItem } from "./events.js";
import player from "./player.js";
import { addMessage } from './messages.js';

//get inventory from main.js file

setInterval(function () {
    player.neededLevelUpXP = player.level * 100 * (player.level + 1);
    // document.getElementById("progress").style.width = xp / neededLevelUpXP * 100 + "%";
    // document.getElementById("progress").style.width = xp / neededLevelUpXP * 100 + "%";
    //use transitions to animate the progress bar to the correct width
    document.getElementById("progress").style.width = player.xp / player.neededLevelUpXP * 100 + "%";
    document.getElementById("progress").style.transition = "width 0.5s";
    document.getElementById("lvl").innerHTML = player.level;
    if (player.xp >= player.neededLevelUpXP) {
        player.level++;
        player.xp = 0;
        document.getElementById("progress").width = 0;
        addMessage("You leveled up! You are now level " + player.level + "! " + " [ " + player.level * 100 + " gold awarded ]");
        player.gold += player.level * 100;
    }
}, 100);

export function tree() {
    if (player.inventory_dictionary["Axe"] == 1) {
        if (player.axeHealth <= 0) {
            addMessage("Your axe broke!");
            player.inventory_dictionary["Axe"] = 0;
            player.axeHealth = 20;
        } else {
            if (player.fullInventory == false) {
                player.inventory_dictionary["Wood"] += 1;
                player.axeHealth -= 1;
                player.xp += 10;
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need an axe to cut down trees!");
    }
}

export function goFishing() {
    if (player.inventory_dictionary["Fishing Pole"] == 1) {
        if (player.fishingPoleHealth <= 0) {
            addMessage("Your fishing pole broke!");
            player.inventory_dictionary["Fishing Pole"] = 0;
            player.fishingPoleHealth = 10;
        } else {
            if (player.fullInventory == false) {
                player.inventory_dictionary["Fish"] += 1;
                player.fishingPoleHealth -= 1;
                player.xp += 15;
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need a fishing pole to fish!");
    }
}

export function goHunting() {
    if (player.inventory_dictionary["Hunting Rifle"] == 1) {
        if (player.huntingRifleHealth <= 0) {
            addMessage("Your hunting rifle broke!");
            player.inventory_dictionary["Hunting Rifle"] = 0;
            player.huntingRifleHealth = 50;
        } else {
            if (player.fullInventory == false) {
                player.inventory_dictionary["Meat"] += 1;
                player.huntingRifleHealth -= 1;
                player.xp += 50;
            }
            else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    }
    else {
        addMessage("You need a hunting rifle to hunt!");
    }
}

export function goMining() {
    if (player.inventory_dictionary["Pickaxe"] == 1) {
        if (player.pickaxeHealth <= 0) {
            addMessage("Your pickaxe broke!");
            player.inventory_dictionary["Pickaxe"] = 0;
            player.pickaxeHealth = 75;
        } else {
            if (player.fullInventory == false) {
                let oreDictionary = {
                    0: "Iron",
                    1: "Copper",
                    2: "Tin",
                    3: "Silver",
                    4: "Gold",
                    5: "Emerald",
                    6: "Ruby",
                    7: "Diamond",
                    8: "Stone",
                };
                let oreRandomizer = Math.floor(Math.random() * 9);
                let xpTable = {
                    "Stone": 1,
                    "Iron": 110,
                    "Copper": 112,
                    "Tin": 113,
                    "Silver": 119,
                    "Gold": 125,
                    "Emerald": 130,
                    "Ruby": 150,
                    "Diamond": 200
                };
                if (xpTable[oreDictionary[oreRandomizer]] > 1) {
                    addMessage("You mined some " + oreDictionary[oreRandomizer] + "!");
                    player.inventory_dictionary[oreDictionary[oreRandomizer]]++;
                }
                // inventory.push(oreDictionary[oreRandomizer]);
                player.xp += xpTable[oreDictionary[oreRandomizer]];

                player.pickaxeHealth -= 1;
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need a pickaxe to mine!");
    }
}
// Use enemy data in enemies.js to fetch! --> enemy_dictionary is not defined ???
// Bonus points to not do it here, but in each function

//default player stats
var defaultPlayerHealth = 100;
var defaultPlayerAttack = 1;
var defaultPlayerDefense = 1;
var defaultPlayerSpeed = 1;

var enemyHealth;
var enemyAttack;
var enemyDefense;
var enemySpeed;
var enemyExperience
var enemyGold;

var isAttacking = false;
var fled = false;

export function doCombat(enemy) {
    console.log("Enemy: " + enemy);
    console.log("Enemy Health:" + enemyHealth);
    if (!enemy_dictionary[enemy]) { return }
    var data = enemy_dictionary[enemy]
    setGUI(data.health, data.attack, data.defense, data.name, data.speed)
}

function setGUI(health, attack, defense, name, speed) {
    document.getElementById("healthValue").innerHTML = health;
    document.getElementById("attackValue").innerHTML = attack;
    document.getElementById("defenseValue").innerHTML = defense;
    document.getElementById("speedValue").innerHTML = speed;
    document.getElementById("enemyHeader").innerHTML = name;
    document.getElementById("fightButton").style.display = "none";
    document.getElementById("opponentSelector").style.display = "none";
    document.getElementById("attackButton").style.visibility = "visible";
    document.getElementById("fleeButton").style.visibility = "visible";
    document.getElementById("defendButton").style.visibility = "visible";
    document.getElementById("specialButton").style.visibility = "visible";
}

function checkAttackStatus() {
    if (isAttacking == true) {
        console.log("You are attacking!");
        setInterval(function () {
            if (document.getElementById("healthValue").innerHTML > 0 && fled == false) {
                doEnemyAttack();
            }
        }
            , (1000 / enemySpeed));
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var refresh;

export function doAttack() {
    var enemyHealth = enemy_dictionary[document.getElementById("opponentSelector").value].health; // <-- this works in browser but not in VSCode
    var enemyDefense = enemy_dictionary[document.getElementById("opponentSelector").value].defense;
    var enemyName = enemy_dictionary[document.getElementById("opponentSelector").value].name;
    var enemyGold = enemy_dictionary[document.getElementById("opponentSelector").value].gold;
	enemyGold = getRandomInt(enemyGold.min, enemyGold.max) // Otherwise, values stored are static random numbers
    var enemyExperience = enemy_dictionary[document.getElementById("opponentSelector").value].defeatExperience;
    var newEnemyHealth = enemyHealth;
    // var newEnemyHealth = document.getElementById("healthValue").innerHTML - (player.playerAttack - enemyDefense);
    // console.log("Enemy health: " + );
    isAttacking = true;
    checkAttackStatus();
    refresh = setInterval(function () {
        if (newEnemyHealth > 0 && fled == false) {
            newEnemyHealth = newEnemyHealth - Math.max(0, player.playerAttack - enemyDefense);
            console.log("new enemy health:" + newEnemyHealth);
            document.getElementById("healthValue").innerHTML = Math.max(0, newEnemyHealth);
            // console.log("You attacked the enemy for " + Math.max(0, player.playerAttack - enemyDefense) + " damage!");
        }
        if (newEnemyHealth <= 0 && fled == false) {
            clearInterval(refresh);
            // alert("You win!");
            //increment XP by enemyExperience
            player.xp += enemyExperience;
            player.gold += enemyGold;
            document.getElementById("gold").innerHTML = player.gold;
            addMessage("You defeated the " + enemyName + " and earned " + enemyGold + " gold" + " and " + enemyExperience + " XP!");

            var droppedRandomLoot = Math.floor(Math.random() * 100);
            if (droppedRandomLoot < 25) {
                randomLootDrop();
                addMessage("The " + enemyName + " dropped " + finalItem.name + "!");
            }
            document.getElementById("fightButton").style.display = "block";
            document.getElementById("opponentSelector").style.display = "block";
            document.getElementById("attackButton").style.visibility = "hidden";
            document.getElementById("fleeButton").style.visibility = "hidden";
            document.getElementById("defendButton").style.visibility = "hidden";
            document.getElementById("specialButton").style.visibility = "hidden";
            // break;
        }
        else {
            enemyHealth = newEnemyHealth;
            document.getElementById("healthValue").innerHTML = enemyHealth;
        }
    }, 1000 / player.playerSpeed);

}

export function doFlee() {
    fled = true;
    document.getElementById("messages").innerHTML = "You fled!";
    document.getElementById("fightButton").style.display = "block";
    document.getElementById("opponentSelector").style.display = "block";
    document.getElementById("attackButton").style.visibility = "hidden";
    document.getElementById("fleeButton").style.visibility = "hidden";
    document.getElementById("defendButton").style.visibility = "hidden";
    document.getElementById("specialButton").style.visibility = "hidden";

    //reset player stats
    player.playerHealth = defaultPlayerHealth;
    player.playerAttack = defaultPlayerAttack;
    player.playerDefense = defaultPlayerDefense;
    player.playerSpeed = defaultPlayerSpeed;

    document.getElementById("playerHealthValue").innerHTML = player.playerHealth;
    document.getElementById("playerAttackValue").innerHTML = player.playerAttack;
    document.getElementById("playerDefenseValue").innerHTML = player.playerDefense;
    document.getElementById("playerSpeedValue").innerHTML = player.playerSpeed;

}

function doEnemyAttack() {
    var enemyAttack = enemy_dictionary[document.getElementById("opponentSelector").value].attack;
    // console.log("Enemy is attacking for " + Math.max(0, enemyAttack - playerDefense) + " damage!");
    const newPlayerHealth = player.playerHealth - Math.max(0, enemyAttack - player.playerDefense);
    player.playerHealth = newPlayerHealth;
    // console.log("Player now has " + newPlayerHealth + " health.");
    document.getElementById("playerHealthValue").innerHTML = Math.max(0, newPlayerHealth);

    if (newPlayerHealth <= 0) {
        document.getElementById("messages").innerHTML = "You lose!";
        document.getElementById("fightButton").style.display = "block";
        document.getElementById("opponentSelector").style.display = "block";
        document.getElementById("attackButton").style.visibility = "hidden";
        document.getElementById("fleeButton").style.visibility = "hidden";
        document.getElementById("defendButton").style.visibility = "hidden";
        document.getElementById("specialButton").style.visibility = "hidden";
        clearInterval(refresh);
    }
    // else {
    //     player.playerHealth = newPlayerHealth;
    //     document.getElementById("playerHealthValue").innerHTML = player.playerHealth;
    // }
}