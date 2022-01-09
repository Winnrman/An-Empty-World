function sleep(ms) {
    // addMessage("<sleep>")
    return new Promise(resolve => setTimeout(resolve, ms));
}
// let stamina = 100;

var readFirstMessage = false;
var isQuesting = false;

async function doQuest() {
    //check to see if player is wearing armor
    // if ((document.getElementById("helmetSelect").value != "") || (document.getElementById("chestSelect").value != "") || (document.getElementById("legsSelect").value != "") || (document.getElementById("bootsSelect").value != "")) {
    //     addMessage("You must have armor on to go on a quest!");
    //     isQuesting = false;
    // }
    if (stamina > 0) {

        if (readFirstMessage == false) {
            addMessage("You begin off on your quest, walking through this empty and barren world.");
            readFirstMessage = true;
        }
        isQuesting = true;
        await sleep(3000);
        var randomEvent = Math.floor(Math.random() * 50) + 1;
        // console.log("random num between 0-50 is " + randomEvent);
        if (isQuesting) {
            if (randomEvent <= 10) {
                await sleep(2000);
                addMessage("You walk for a little while...");
                // await sleep(2000);
                stamina--;
                doQuest();
            }
            else if (randomEvent <= 20 && randomEvent > 10) {
                await sleep(2000);
                addMessage("You find a chest!");
                lootChest();
            }
            else if (randomEvent <= 30 && randomEvent > 20) {
                await sleep(2000)
                fightMonster();
            }
            else if (randomEvent <= 40 && randomEvent > 30) {
                addMessage("While walking a little more, you find a cave!");
                await sleep(2000);
                addMessage("You enter the cave...");
                let outcome = Math.floor(Math.random() * 3) + 1;
                if (outcome == 1) {
                    addMessage("You find a chest!");
                    await sleep(2000);
                    lootChest();
                }
                else if (outcome == 2) {
                    await sleep(2000);
                    fightMonster();
                }
                else if (outcome == 3) {
                    await sleep(2000);
                    addMessage("You find nothing and leave the cave.");
                    // await sleep(2000)
                    doQuest();
                }
                else {
                    addMessage("You find nothing and leave the cave.");
                    // await sleep(2000)
                    doQuest();
                }
            }
            else if (randomEvent <= 50 && randomEvent > 40) {
                addMessage("While you're walking, you get ambushed by a pack of thieves, and you are forced to flee!");
                goldTolose = Math.floor(Math.random() * 1000) + 200;
                if (goldTolose < gold) {
                    gold -= goldTolose;
                    addMessage("You lose " + goldTolose + " gold.");
                }
                else {
                    gold = 0;
                    addMessage("You lose all of your gold!");
                }
                await sleep(2000);
                addMessage("After running for a while, you continue on your way.");
                stamina -= 3;
                doQuest();
            }
        }
    }
    else if (stamina <= 0) {
        addMessage("You are too tired to continue on your quest.");
        isQuesting = false;
    }
    // else if (isQuesting == true) {
    //     addMessage("You are already on a quest!");
    // }

    async function fightMonster() {
        stamina -= 5;
        var enemyRand = Math.floor(Math.random() * 2) + 1;
        if (enemyRand == 0) {
            enemy = "Goblin";
        }
        else if (enemyRand == 1) {
            enemy = "Troll";
        }
        else if (enemyRand == 2) {
            enemy = "Skeleton";
        }
        addMessage("While walking, you encounted a " + enemy + "!");
        await sleep(2000);
        if (playerDefense > enemy_dictionary[enemy].defense) {
            addMessage("After a brief battle, you manage to defeat the " + enemy + "!");
            await sleep(2000);
            addMessage("You raided the " + enemy + " and found " + enemy_dictionary[enemy].gold + " gold!");
            gold += enemy_dictionary[enemy].gold;
            await sleep(2000);
            addMessage("You gain " + enemy_dictionary[enemy].defeatExperience + " experience!");
            xp += enemy_dictionary[enemy].defeatExperience;
            enemy = "";
            stamina -= 5;
            doQuest();
        }
        else {
            addMessage("You lost. You weren't strong enough to defeat the " + enemy_dictionary[enemy].name + ".");
            await sleep(2000);
            addMessage("You were defeated by the " + enemy_dictionary[enemy].name + "!");
            endQuest();
            isQuesting = false;
            readFirstMessage = false;
        }
    }

    async function lootChest() {
        if (document.getElementById("offhandSelect").value == "Amulet of Luck") {
            gold += Math.floor(Math.random() * 3000) + 12000;
            luckyLootDrop();
        }
        else {
            await sleep(2000);
            var quantity = Math.floor(Math.random() * 800);
            addMessage("You find " + quantity + " gold in the old chest!");
            gold += quantity;
            basicLootDrop();
        }
    }


    function luckyLootDrop() {
        let loot = randomLootDrop();
        if (loot.finalItem.rarity == "rare" || loot.finalItem.rarity == "legendary") {
            addMessage("You found a " + finalItem.name + "! You feel lucky!");
            isInInventory(finalItem.name, finalItem.type);
            stamina--;
            doQuest();
        }
        else {
            luckyLootDrop();
        }
    }

    function basicLootDrop() {
        let loot = randomLootDrop();
        if (finalItem.rarity == "common" || finalItem.rarity == "uncommon") {
            addMessage("You found a " + finalItem.name + "!");
            isInInventory(finalItem.name, finalItem.type);
            stamina--;
            doQuest();
        }
        else {
            basicLootDrop();
            console.log("loot drop failed");
        }
    }

    function endQuest() {
        addMessage("Your quest ended in failure, you retreat home having lost everything could have.");
    }
}

