//get inventory from main.js file
let axeHealth = 20;
let fishingPoleHealth = 10;
let huntingRifleHealth = 50;
let pickaxeHealth = 75;
let playerHealth = 100;
let playerAttack = 2;
let playerDefense = 2;
let playerSpeed = 2;
let armorBonus = 0;

setInterval(function () {
    neededLevelUpXP = level * 100 * (level + 1);
    // document.getElementById("progress").style.width = xp / neededLevelUpXP * 100 + "%";
    // document.getElementById("progress").style.width = xp / neededLevelUpXP * 100 + "%";
    //use transitions to animate the progress bar to the correct width
    document.getElementById("progress").style.width = xp / neededLevelUpXP * 100 + "%";
    document.getElementById("progress").style.transition = "width 0.5s";
    document.getElementById("lvl").innerHTML = level;
    if (xp >= neededLevelUpXP) {
        level++;
        xp = 0;
        document.getElementById("progress").width = 0;
        addMessage("You leveled up! You are now level " + level + "! " + " [ " + level * 100 + " gold awarded ]");
        gold += level * 100;
    }
}, 100);

function addMessage(message_text) {
    //add page break after level up message
    document.getElementById("messages").innerHTML += "<br>";
    var message = document.createElement("li");
    message.appendChild(document.createTextNode(message_text));
    document.getElementById("messages").appendChild(message);
}

function tree() {
    if (inventory_dictionary["Axe"] == 1) {
        if (axeHealth <= 0) {
            addMessage("Your axe broke!");
            inventory_dictionary["Axe"] = 0;
            axeHealth = 20;
        } else {
            if (fullInventory == false) {
                inventory_dictionary["Wood"] += 1;
                woodAmount++;
                axeHealth -= 1;
                xp += 10;
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need an axe to cut down trees!");
    }
}

function goFishing() {
    if (inventory_dictionary["Fishing Pole"] == 1) {
        if (fishingPoleHealth <= 0) {
            addMessage("Your fishing pole broke!");
            inventory_dictionary["Fishing Pole"] = 0;
            fishingPoleHealth = 10;
        } else {
            if (fullInventory == false) {
                inventory_dictionary["Fish"] += 1;
                fishingPoleHealth -= 1;
                xp += 15;
            } else {
                addMessage("Your inventory is full. You can't carry any more items.");
            }
        }
    } else {
        addMessage("You need a fishing pole to fish!");
    }
}

function goHunting() {
    if (inventory_dictionary["Hunting Rifle"] == 1) {
        if (huntingRifleHealth <= 0) {
            addMessage("Your hunting rifle broke!");
            inventory_dictionary["Hunting Rifle"] = 0;
            huntingRifleHealth = 50;
        } else {
            if (fullInventory == false) {
                inventory_dictionary["Meat"] += 1;
                huntingRifleHealth -= 1;
                xp += 50;
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

function goMining() {
    if (inventory_dictionary["Pickaxe"] == 1) {
        if (pickaxeHealth <= 0) {
            addMessage("Your pickaxe broke!");
            inventory_dictionary["Pickaxe"] = 0;
            pickaxeHealth = 75;
        } else {
            if (fullInventory == false) {
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
                    if (oreDictionary[oreRandomizer] == "Iron") {
                        ironAmount++;
                    }
                }
                // inventory.push(oreDictionary[oreRandomizer]);
                inventory_dictionary[oreDictionary[oreRandomizer]] += 1;
                xp += xpTable[oreDictionary[oreRandomizer]];

                pickaxeHealth -= 1;
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
var defaultPlayerAttack = 2;
var defaultPlayerDefense = 2;
var defaultPlayerSpeed = 5;

var enemyHealth;
var enemyAttack;
var enemyDefense;
var enemySpeed;
var enemyExperience
var enemyGold;

var isAttacking = false;
var fled = false;

function doCombat(enemy) {
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

var refresh;

function doAttack() {
    var enemyHealth = enemy_dictionary[document.getElementById("opponentSelector").value].health; // <-- this works in browser but not in VSCode
    var enemyDefense = enemy_dictionary[document.getElementById("opponentSelector").value].defense;
    var enemyName = enemy_dictionary[document.getElementById("opponentSelector").value].name;
    var enemyGold = enemy_dictionary[document.getElementById("opponentSelector").value].gold;
    var enemyExperience = enemy_dictionary[document.getElementById("opponentSelector").value].defeatExperience;
    var newEnemyHealth = enemyHealth;
    // var newEnemyHealth = document.getElementById("healthValue").innerHTML - (playerAttack - enemyDefense);
    // console.log("Enemy health: " + );
    isAttacking = true;
    checkAttackStatus();
    refresh = setInterval(function () {
        if (newEnemyHealth > 0 && fled == false) {
            newEnemyHealth = newEnemyHealth - Math.max(0, playerAttack - enemyDefense);
            console.log("new enemy health:" + newEnemyHealth);
            document.getElementById("healthValue").innerHTML = Math.max(0, newEnemyHealth);
            // console.log("You attacked the enemy for " + Math.max(0,playerAttack - enemyDefense) + " damage!");
        }
        if (newEnemyHealth <= 0 && fled == false) {
            clearInterval(refresh);
            // alert("You win!");
            //increment XP by enemyExperience
            xp += enemyExperience;
            gold += enemyGold;
            document.getElementById("gold").innerHTML = gold;
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
    }, 1000 / playerSpeed);

}

function doFlee() {
    fled = true;
    document.getElementById("messages").innerHTML = "You fled!";
    document.getElementById("fightButton").style.display = "block";
    document.getElementById("opponentSelector").style.display = "block";
    document.getElementById("attackButton").style.visibility = "hidden";
    document.getElementById("fleeButton").style.visibility = "hidden";
    document.getElementById("defendButton").style.visibility = "hidden";
    document.getElementById("specialButton").style.visibility = "hidden";

    //reset player stats
    playerHealth = defaultPlayerHealth;
    playerAttack = defaultPlayerAttack;
    playerDefense = defaultPlayerDefense;
    playerSpeed = defaultPlayerSpeed;

    document.getElementById("playerHealthValue").innerHTML = playerHealth;
    document.getElementById("playerAttackValue").innerHTML = playerAttack;
    document.getElementById("playerDefenseValue").innerHTML = playerDefense;
    document.getElementById("playerSpeedValue").innerHTML = playerSpeed;

}

function doEnemyAttack() {
    var enemyAttack = enemy_dictionary[document.getElementById("opponentSelector").value].attack;
    // console.log("Enemy is attacking for " + Math.max(0, enemyAttack - playerDefense) + " damage!");
    newPlayerHealth = playerHealth - Math.max(0, enemyAttack - playerDefense);
    playerHealth = newPlayerHealth;
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
    //     playerHealth = newPlayerHealth;
    //     document.getElementById("playerHealthValue").innerHTML = playerHealth;
    // }
}

// document.getElementById("craftingButton").disabled = "disabled";
// document.getElementById("craftingButton").setAttribute("class", "disabled");
let woodAmount = 0;
let ironAmount = 0;


function doCrafting1() {
    var select = document.getElementById("craftingSelect").value;
    if (select == "Wooden Helmet") {
        woodNeeded = 2; //TODO: improve system
        ironNeeded = 1;
        setInterval(function () {
            document.getElementById("neededMaterials").innerHTML = "Needed Materials: Wood: " + inventory_dictionary['Wood'] + "/" + woodNeeded + " Iron: " + inventory_dictionary['Iron'] + "/" + ironNeeded;
        }, 100);
    }
    else if (select == "Wooden Boots") {
        woodNeeded = 3;
        ironNeeded = 2;
        setInterval(function () {
            document.getElementById("neededMaterials").innerHTML = "Needed Materials: Wood: " + inventory_dictionary['Wood'] + "/" + woodNeeded + " Iron: " + inventory_dictionary['Iron'] + "/" + ironNeeded;
        }
            , 100);
    }
    else if (select == "Iron Sword") {
        woodNeeded = 3;
        ironNeeded = 6;
        setInterval(function () {
            document.getElementById("neededMaterials").innerHTML = "Needed Materials: Wood: " + inventory_dictionary['Wood'] + "/" + woodNeeded + " Iron: " + inventory_dictionary['Iron'] + "/" + ironNeeded;
        }
            , 100);
    }
}
function doCrafting2() {
    var item = document.getElementById("craftingSelect").value;
    switch (item) {
        case "Wooden Helmet":
            if ((woodAmount >= 2) && (ironAmount >= 1)) {
                inventory.splice(1, 2, "Wood");
                inventory.splice(1, 1, "Iron");
                addMessage("You crafted a Wooden Helmet!");
                isInInventory("Wooden Helmet", "Helmet");
                woodAmount -= 2;
                ironAmount -= 1;
            }
            else {
                addMessage("You don't have enough materials to craft a Wooden Helmet!");
            }
            break;
        case "Wooden Boots":
            if ((woodAmount >= 3) && (ironAmount >= 2)) {
                inventory.splice(1, 3, "Wood");
                inventory.splice(1, 2, "Iron");
                addMessage("You crafted Wooden Boots!");
                isInInventory("Wooden Boots", "Boots");
                woodAmount -= 3;
                ironAmount -= 2;
            }
            else {
                addMessage("You do not have enough resources to craft Wooden Boots!");
            }
            break;
        case "Iron Sword":
            if ((ironAmount >= 6) && (woodAmount >= 3)) {
                inventory.splice(1, 3, "Wood");
                inventory.splice(1, 6, "Iron");
                addMessage("You crafted an Iron Sword!");
                isInInventory("Iron Sword", "Sword");
                woodAmount -= 3;
                ironAmount -= 6;
            }
            else {
                addMessage("You do not have enough resources to craft an Iron Sword!");
            }
    }
}