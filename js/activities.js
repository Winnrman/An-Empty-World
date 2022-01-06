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
        var levelUPMessage = "You leveled up! You are now level " + level + "! " + " [ " + level * 100 + " gold awarded ]";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(levelUPMessage));
        document.getElementById("messages").appendChild(message);
    }
}, 100);

function tree() {
    if (inventory.includes("Axe")) {
        // axeHealth = axe.health;
        //give player 10 xp for each wood they cut down successfully
        // 20% chance the axe breaks and you get no wood
        // if successful, add wood to inventory.

        if (axeHealth <= 0) {
            var brokeAxeMessage = "Your axe broke!";
            //add page break after level up message
            document.getElementById("messages").innerHTML += "<br>";
            var message = document.createElement("li");
            message.appendChild(document.createTextNode(brokeAxeMessage));
            document.getElementById("messages").appendChild(message);
            axeHealth = 20;
            const index = inventory.indexOf('Axe');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        }
        else {
            // alert("You cut down a tree!");
            inventory.push("Wood");
            axeHealth -= 1;
            woodObtained++;
            // console.log('axe health' + axeHealth);
            // alert("Current XP: " + xp);
            // console.log("Needed XP: " + neededLevelUpXP);
            // console.log("Current Level: " + level);
            xp += 10;
        }
    }
    else {
        var needAxeMessage = "You need an axe to cut down trees!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(needAxeMessage));
        document.getElementById("messages").appendChild(message);
    }
}

function goFishing() {
    if (inventory.includes("Fishing Pole")) {
        // give player 10 xp for each fish caught successfully
        // 20% chance the fishing pole breaks and you get no fish
        // if successful, add fish to inventory.
        if (fishingPoleHealth <= 0) {
            var fishingMessage = "Your fishing pole broke!";
            //add page break after level up message
            document.getElementById("messages").innerHTML += "<br>";
            var message = document.createElement("li");
            message.appendChild(document.createTextNode(fishingMessage));
            document.getElementById("messages").appendChild(message);
            fishingPoleHealth = 10;
            const index = inventory.indexOf('Fishing Pole');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        }
        else {
            // alert("You caught a fish!");
            inventory.push("Fish");
            fishingPoleHealth -= 1;
            fishObtained++;
            xp += 15;
        }
    }
    else {
        var fishingMessage = "You need a fishing pole to fish!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(fishingMessage));
        document.getElementById("messages").appendChild(message);
    }
}

function goHunting() {
    if (inventory.includes("Hunting Rifle")) {
        // give player 10 xp for each fish caught successfully
        // 20% chance the fishing pole breaks and you get no fish
        // if successful, add fish to inventory.
        if (huntingRifleHealth <= 0) {
            // alert("Your hunting rifle broke!");
            var huntingMessage = "Your hunting rifle broke!";
            huntingRifleHealth = 50;
            //add page break after level up message
            document.getElementById("messages").innerHTML += "<br>";
            var message = document.createElement("li");
            message.appendChild(document.createTextNode(huntingMessage));
            document.getElementById("messages").appendChild(message);
            const index = inventory.indexOf('Hunting Rifle');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        }
        else {
            // alert("You caught a fish!");
            inventory.push("Meat");
            huntingRifleHealth -= 1;
            meatObtained++;
            xp += 50;
        }
    }
    else {
        // alert("You need a hunting rifle to hunt!");
        // add message to messages div
        // messages.push("You need a hunting rifle to hunt!");
        var huntingMessage = "You need a hunting rifle to hunt!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(huntingMessage));
        document.getElementById("messages").appendChild(message);
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
            var pickaxeMessage = "Your pickaxe broke!";
            //add page break after level up message
            document.getElementById("messages").innerHTML += "<br>";
            var message = document.createElement("li");
            message.appendChild(document.createTextNode(pickaxeMessage));
            document.getElementById("messages").appendChild(message);
            const index = inventory.indexOf('Pickaxe');
            if (index > -1) {
                inventory.splice(index, 1);
            }
        }
        else {
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

            switch (oreRandomizer) {
                case 0:
                    inventory.push(oreDictionary[0]);
                    var IronMessage = "You mined some " + oreDictionary[0] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(IronMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                case 1:
                    inventory.push(oreDictionary[1]);
                    var CopperMessage = "You mined some " + oreDictionary[1] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(CopperMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                case 2:
                    inventory.push(oreDictionary[2]);
                    var TinMessage = "You mined some " + oreDictionary[2] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(TinMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                case 3:
                    inventory.push("Silver");
                    var SilverMessage = "You mined some " + oreDictionary[3] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(SilverMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                case 4:
                    inventory.push("Gold");
                    var GoldMessage = "You mined some " + oreDictionary[4] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(GoldMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                case 5:
                    inventory.push("Emerald");
                    var EmeraldMessage = "You mined some " + oreDictionary[5] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(EmeraldMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                case 6:
                    inventory.push("Ruby");
                    var RubyMessage = "You mined some " + oreDictionary[6] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(RubyMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                case 7:
                    inventory.push("Diamond");
                    var DiamondMessage = "You mined some " + oreDictionary[7] + "!";
                    document.getElementById("messages").innerHTML += "<br>";
                    var message = document.createElement("li");
                    message.appendChild(document.createTextNode(DiamondMessage));
                    document.getElementById("messages").appendChild(message);
                    break;
                default:
                    inventory.push("Stone");
                    stoneObtained++;
                    // var StoneMessage = "You mined some " + oreDictionary[8] + "!";
                    // document.getElementById("messages").innerHTML += "<br>";
                    // var message = document.createElement("li");
                    // message.appendChild(document.createTextNode(StoneMessage));
                    // document.getElementById("messages").appendChild(message);
                    break;
            }

            pickaxeHealth -= 1;
        }
    }
    else {
        var miningMessage = "You need a pickaxe to mine!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(miningMessage));
        document.getElementById("messages").appendChild(message);
    }
}


//TODO: fix this!
var enemyHealth = 10;
var enemyAttack = 10;
var enemyDefense = 1;
var enemyName = "Goblin";
var enemySpeed = 1;
enemyExperience = 5;
enemyGold = 25;

//default player stats
var defaultPlayerHealth = 100;
var defaultPlayerAttack = 2;
var defaultPlayerDefense = 2;
var defaultPlayerSpeed = 5;


function doCombat(enemy) {
    // alert(document.getElementById("opponentSelector").value);
    console.log("Enemy: " + enemy);
    switch (enemy) {
        case "goblin":
            // alert("You encountered a Goblin!");
            var enemyHealth = goblin.health;
            var enemyAttack = goblin.attack;
            var enemyDefense = goblin.defense;
            var enemyName = "Goblin";
            var enemySpeed = goblin.speed;
            setGUI(enemyHealth, enemyAttack, enemyDefense, enemyName, enemySpeed);
            break;
        case "troll":
            var enemyHealth = troll.health;
            var enemyAttack = troll.attack;
            var enemyDefense = troll.defense;
            var enemyName = "Troll";
            var enemySpeed = troll.speed;
            setGUI(enemyHealth, enemyAttack, enemyDefense, enemyName, enemySpeed);
            break;
        case "skeleton":
            var enemyHealth = skeleton.health;
            var enemyAttack = skeleton.attack;
            var enemyDefense = skeleton.defense;
            var enemyName = skeleton.name;
            var enemySpeed = skeleton.speed;
            setGUI(enemyHealth, enemyAttack, enemyDefense, enemyName, enemySpeed);
            break;
        case "knight":
            var enemyHealth = 40;
            var enemyAttack = 25;
            var enemyDefense = 30;
            var enemyName = "Knight";
            var enemySpeed = 4;
            document.getElementById("enemyHeader").innerHTML = enemyName;

            document.getElementById("healthValue").innerHTML = enemyHealth;
            document.getElementById("attackValue").innerHTML = enemyAttack;
            document.getElementById("defenseValue").innerHTML = enemyDefense;
            document.getElementById("speedValue").innerHTML = enemySpeed;

            document.getElementById("fightButton").style.display = "none";
            //hide opponent selector
            document.getElementById("opponentSelector").style.display = "none";
            document.getElementById("attackButton").style.visibility = "visible";
            document.getElementById("fleeButton").style.visibility = "visible";
            document.getElementById("defendButton").style.visibility = "visible";
            document.getElementById("specialButton").style.visibility = "visible";
            break;
        case "king":
            var enemyHealth = 150;
            var enemyAttack = 40;
            var enemyDefense = 25;
            var enemyName = "King";
            var enemySpeed = 75;
            document.getElementById("enemyHeader").innerHTML = enemyName;

            document.getElementById("healthValue").innerHTML = enemyHealth;
            document.getElementById("attackValue").innerHTML = enemyAttack;
            document.getElementById("defenseValue").innerHTML = enemyDefense;
            document.getElementById("speedValue").innerHTML = enemySpeed;

            document.getElementById("fightButton").style.display = "none";
            //hide opponent selector
            document.getElementById("opponentSelector").style.display = "none";
            document.getElementById("attackButton").style.visibility = "visible";
            document.getElementById("fleeButton").style.visibility = "visible";
            document.getElementById("defendButton").style.visibility = "visible";
            document.getElementById("specialButton").style.visibility = "visible";
            break;
    }
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

let isAttacking = false;
var fled = false;

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
    // var newEnemyHealth = enemyHealth;
    var newEnemyHealth = enemyHealth - (playerAttack - enemyDefense);
    isAttacking = true;
    checkAttackStatus();
    var refresh = setInterval(function () {
        if (newEnemyHealth > 0 && fled == false) {
            newEnemyHealth = newEnemyHealth - (playerAttack - enemyDefense);
            console.log("new enemy health:" + newEnemyHealth);
            document.getElementById("healthValue").innerHTML = newEnemyHealth;
            console.log("You attacked the enemy for " + (playerAttack - enemyDefense) + " damage!");
        }
        if (newEnemyHealth <= 0 && fled == false) {
            clearInterval(refresh);
            // alert("You win!");
            var winMessage = "You defeated the " + enemyName + " and earned " + enemyGold + " gold" + " and " + enemyExperience + " XP!";
            //increment XP by enemyExperience
            xp += enemyExperience;
            gold += enemyGold;
            document.getElementById("messages").innerHTML += "<br>";
            //add page break after level up message
            document.getElementById("messages").innerHTML += "<br>";
            var message = document.createElement("li");
            message.appendChild(document.createTextNode(winMessage));
            document.getElementById("messages").appendChild(message);

            var droppedRandomLoot = Math.floor(Math.random() * 100);
            if (droppedRandomLoot < 25) {
                randomLootDrop();
                var lootMessage = "The " + enemyName + " dropped " + finalItem.name + "!";
                //add page break after level up message
                document.getElementById("messages").innerHTML += "<br>";
                var message = document.createElement("li");
                message.appendChild(document.createTextNode(lootMessage));
                document.getElementById("messages").appendChild(message);
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
    if (playerDefense > enemyAttack) {
        //do no damage
        console.log(enemyName + " did no damage!");
        var newPlayerHealth = playerHealth;
    }
    else {
        var newPlayerHealth = playerHealth - (enemyAttack - playerDefense);
        document.getElementById("playerHealthValue").innerHTML = newPlayerHealth + '/100';
    }
    if (newPlayerHealth <= 0) {
        // alert("You lose!");
        //player health set to 0
        document.getElementById("playerHealthValue").innerHTML = 0;
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
        document.getElementById("playerHealthValue").innerHTML = playerHealth + '/100';
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
function buySpecialDeal() {
    if (gold >= 1000) {
        randomLootDrop();
        var lootMessage = "You bought a random item and recieved " + finalItem.name + "!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(lootMessage));
        document.getElementById("messages").appendChild(message);
        gold -= 1000;
        document.getElementById("goldValue").innerHTML = gold;
    }
    else {
        var poorMessage = "You do not have enough gold to buy this item!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(poorMessage));
        document.getElementById("messages").appendChild(message);
    }
}