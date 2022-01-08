//get inventory from main.js file
let axeHealth = 20;
let fishingPoleHealth = 10;
let huntingRifleHealth = 50;
let pickaxeHealth = 100;
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
    if (inventory.includes("Axe")) {
        // axeHealth = axe.health;
        //give player 10 xp for each wood they cut down successfully
        // 20% chance the axe breaks and you get no wood
        // if successful, add wood to inventory.

        if (axeHealth <= 0) {
            addMessage(Your axe broke!");
            axeHealth = 20;
            const index = inventory.indexOf('Axe');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        } else {
            if (fullInventory == false) {
                // alert("You cut down a tree!");
                inventory.push("Wood");
                axeHealth -= 1;
                // woodObtained++;
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
    if (inventory.includes("Fishing Pole")) {
        // give player 10 xp for each fish caught successfully
        // 20% chance the fishing pole breaks and you get no fish
        // if successful, add fish to inventory.
        if (fishingPoleHealth <= 0) {
            addMessage("Your fishing pole broke!");
            fishingPoleHealth = 10;
            const index = inventory.indexOf('Fishing Pole');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        }
        else {
            if (fullInventory == false) {
                // alert("You caught a fish!");
                inventory.push("Fish");
                fishingPoleHealth -= 1;
                xp += 15;
                fishObtained++;
            }
        }
    } else {
        addMessage("You need a fishing pole to fish!");
    }
}

function goHunting() {
    if (inventory.includes("Hunting Rifle")) {
        // give player 10 xp for each fish caught successfully
        // 20% chance the fishing pole breaks and you get no fish
        // if successful, add fish to inventory.
        if (huntingRifleHealth <= 0) {
            // alert("Your hunting rifle broke!");
            huntingRifleHealth = 50;
            addMessage("Your hunting rifle broke!");
            const index = inventory.indexOf('Hunting Rifle');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        }
        else {
            if (fullInventory == false) {
                // alert("You caught a fish!");
                inventory.push("Meat");
                huntingRifleHealth -= 1;
                meatObtained++;
                xp += 50;
            }
            else {
                addMessage("Your inventory is full. You can't carry any more items.");
                // addMessage(inventoryFullMessage);
            }
        }
    }
    else {
        // alert("You need a hunting rifle to hunt!");
        // add message to messages div
        // messages.push("You need a hunting rifle to hunt!");
        addMessage("You need a hunting rifle to hunt!");
    }
}

function goMining() {
    //random chance to get good ores
    // alert("Going into the mines...");
    if (inventory.includes("Pickaxe")) {
        //give player 10 xp for each ore you mine successfully
        // 20% chance the pickaxe breaks and you get no ore
        // if successful, add ore to inventory.
        if (pickaxeHealth <= 0) {
            // alert("Your pickaxe broke!");
            addMessage("Your pickaxe broke!");
            const index = inventory.indexOf('Pickaxe');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        } else {
            if (fullInventory == false) {
                // alert("You mined some ore!");
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
                let oreRandomizer = Math.floor(Math.random() * 10);
                console.log(oreRandomizer);
				
				let xpTable = {
					"Stone": 1,
					"Iron": 110,
					"Copper":112,
					"Tin":113,
					"Silver": 119,
					"Gold": 125,
					"Emerald": 130,
					"Ruby": 150,
					"Diamond": 200
				};
				if (xpTable[oreDictionary[oreRandomizer]] > 1) {
					addMessage("You mined some " + oreDictionary[oreRandomizer] + "!");
				} else {
					stoneObtained++;
				}
				inventory.push(oreDictionary[oreRandomizer]);
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


//TODO: fix this!
// Use enemy data in enemies.js to fetch!
// Bonus points to not do it here, but in each function
var enemyHealth = 1;
var enemyAttack = 5;
var enemyDefense = 1;
var enemySpeed = 1;
var enemyName = "Goblin"
var enemyGold = 100;
var enemyExperience = 10;

//default player stats
var defaultPlayerHealth = 100;
var defaultPlayerAttack = 2;
var defaultPlayerDefense = 2;
var defaultPlayerSpeed = 5;

let isAttacking = false;
var fled = false;

function doCombat(enemy) {
    console.log("Enemy: " + enemy);
	if (!enemy_dictionary[enemy]) {return}
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

function doAttack() {
    var newEnemyHealth = enemyHealth;
    // var newEnemyHealth = document.getElementById("healthValue").innerHTML - (playerAttack - enemyDefense);
    // console.log("Enemy health: " + );
    isAttacking = true;
    checkAttackStatus();
    var refresh = setInterval(function () {
        if (newEnemyHealth > 0 && fled == false) {
            newEnemyHealth = newEnemyHealth - Math.max(0,playerAttack - enemyDefense);
            console.log("new enemy health:" + newEnemyHealth);
            document.getElementById("healthValue").innerHTML = Math.max(0,newEnemyHealth);
            // console.log("You attacked the enemy for " + Math.max(0,playerAttack - enemyDefense) + " damage!");
        }
        if (newEnemyHealth <= 0 && fled == false) {
            clearInterval(refresh);
            // alert("You win!");
            //increment XP by enemyExperience
            xp += enemyExperience;
            gold += enemyGold;
            document.getElementById("gold").innerHTML = gold;
            addMessage("You defeated the " + enemyName + " and earned " + enemyGold + " gold" + " and " + enemyExperience + " XP!";);

            var droppedRandomLoot = Math.floor(Math.random() * 100);
            if (droppedRandomLoot < 25) {
                randomLootDrop();
                addMessage("The " + enemyName + " dropped " + finalItem.name + "!";)
            }
            document.getElementById("fightButton").style.display = "block";
            document.getElementById("opponentSelector").style.display = "block";
            document.getElementById("attackButton").style.visibility = "hidden";
            document.getElementById("fleeButton").style.visibility = "hidden";
            document.getElementById("defendButton").style.visibility = "hidden";
            document.getElementById("specialButton").style.visibility = "hidden";
            // break;
        }
        // else {
        //     // enemyHealth = newEnemyHealth;
        //     document.getElementById("healthValue").innerHTML = newEnemyHealth;
        // }
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
    var newPlayerHealth = playerHealth - Math.max(0, enemyAttack - playerDefense);
    document.getElementById("playerHealthValue").innerHTML = Math.max(0,newPlayerHealth) + '/100';
	
    if (newPlayerHealth <= 0) {
        // alert("You lose!");
        //player health set to 0
        document.getElementById("messages").innerHTML = "You lose!";
        document.getElementById("fightButton").style.display = "block";
        document.getElementById("opponentSelector").style.display = "block";
        document.getElementById("attackButton").style.visibility = "hidden";
        document.getElementById("fleeButton").style.visibility = "hidden";
        document.getElementById("defendButton").style.visibility = "hidden";
        document.getElementById("specialButton").style.visibility = "hidden";
    }
    else {
        playerHealth = newPlayerHealth;
        document.getElementById("healthValue").innerHTML = enemyHealth;
    }
}

document.getElementById("craftingButton").disabled = "disabled";
document.getElementById("craftingButton").setAttribute("class", "disabled");

function doCrafting(item) {

    switch (item) {
        case "Wooden Helmet":
            if (wood >= 2 && iron >= 1) {
                inventory.splice(1, 2, wood);
                inventory.splice(1, 1, iron);

                document.getElementById("playerDefenseValue").innerHTML = playerDefense;
                document.getElementById("messages").innerHTML = "You crafted a Wooden Helmet!";
            }
            else {
                document.getElementById("messages").innerHTML = "You do not have enough resources to craft this item!";
            }
            break;
            document.getElementById("crafting").style.display = "block";
            // document.getElementById("craftingButton").style.display = "none";

            for (var i = 0; i < requiredItems.length; i++) {
                if (inventory.includes(requiredItems[i])) {
                    document.getElementById("craftingButton").style.clickable = "true";
                    //add item in select to correct armor slot
                }
            }
    }
}
