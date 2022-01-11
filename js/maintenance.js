import { addMessage } from "./activities.js";
import player from "./player.js";

function checkInventorySize() {
    //add up all keys in inventory_dict and compare to maxInventorySize
    var totalInventorySize = 0;
    for (var key in player.inventory_dictionary) {
        totalInventorySize += player.inventory_dictionary[key];
    }
    if (totalInventorySize >= player.maxInventorySize) {
        player.fullInventory = true;
    }
}

setInterval(function () {
    document.getElementById("staminaAmount").innerHTML = player.stamina; //keep updating the stamina bar
}, 100)

var inventoryChecker = setInterval(function () {
    checkInventorySize();
    // getArmorStats();
    if (player.fullInventory == true) {
        addMessage("Your inventory is full. You can't carry any more items.");
        clearInterval(inventoryChecker);
        setTimeout(function () {
            setInterval(function () {
                checkInventorySize();
                if (player.fullInventory == false) {
                    clearInterval(inventoryChecker);
                }
            }, 100);
        }, 100);
    }
    // checkInventorySize();
}, 100);


let helmetItems = [];
let chestItems = [];
let leggingItems = [];
let bootsItems = [];
let offhandItems = [];

export function isInInventory(itemName, itemType) {
    if (itemType == 'Helmet') {
        if (helmetItems.includes(itemName)) {
            if (isQuesting == true) {
                addMessage("You already have a " + itemName + ", so you toss them away.");
            } else {
                addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
                player.gold += 1000;
                return true;
            }
        } else {
            helmetItems.push(itemName);
            var helmetSelect = document.getElementById("helmetSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            helmetSelect.add(newOption);
            return false;
        }
    }
    else if (itemType == 'Chestplate') {
        if (chestItems.includes(itemName)) {
            if (isQuesting == true) {
                addMessage("You already have a " + itemName + ", so you toss them away.");
            } else {
                addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
                player.gold += 1000;
                return true;
            }
        } else {
            chestItems.push(itemName);
            var chestplateSelect = document.getElementById("chestSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            chestplateSelect.add(newOption);
            return false;
        }
    }
    else if (itemType == 'Leggings') {
        if (leggingItems.includes(itemName)) {
            if (isQuesting == true) {
                addMessage("You already have a " + itemName + ", so you toss them away.");
            } else {
                addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
                player.gold += 1000;
            }
            // return true;
        } else {
            leggingItems.push(itemName);
            var leggingSelect = document.getElementById("legsSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            leggingSelect.add(newOption);
            // return false;
        }
    }
    else if (itemType == 'Boots') {
        if (bootsItems.includes(itemName)) {
            if (isQuesting == true) {
                addMessage("You already have a " + itemName + ", so you toss them away.");
            } else {
                addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
                player.gold += 1000;
            }
            // return true;
        } else {
            bootsItems.push(itemName);
            var bootSelect = document.getElementById("bootsSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            bootSelect.add(newOption);
            // return false;
        }
    }
    else if (itemType == "Offhand") {
        if (offhandItems.includes(itemName)) {
            if (isQuesting == true) {
                addMessage("You already have a " + itemName + ", so you toss them away.");
            } else {
                addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
                player.gold += 1000;
            }
        } else {
            offhandItems.push(itemName);
            var offhandSelect = document.getElementById("offhandSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            offhandSelect.add(newOption);
        }
    }
    else if (itemType == "Shield") {
        if (offhandItems.includes(itemName)) {
            if (isQuesting == true) {
                addMessage("You already have a " + itemName + ", so you toss them away.");
            } else {
                addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
                gold += 1000;
            }
        } else {
            offhandItems.push(itemName);
            var offhandSelect = document.getElementById("offhandSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            offhandSelect.add(newOption);
        }
    }
}

setInterval(function () {
    if (player.stamina < player.maxStamina) {
        if (isQuesting == false) {
            player.stamina++;
        }
    }
}, 2000);

document.getElementById("helmetSelect").addEventListener("change", function () {
    player.playerDefense = 0;
    getArmorStats();
});

document.getElementById("chestSelect").addEventListener("change", function () {
    player.playerDefense = 0;
    getArmorStats();
});

document.getElementById("legsSelect").addEventListener("change", function () {
    player.playerDefense = 0;
    getArmorStats();
});

document.getElementById("bootsSelect").addEventListener("change", function () {
    player.playerDefense = 0;
    getArmorStats();
});

//get armor stats of all equipped armor, and make that the player's defense
function getArmorStats() {
    var helmet = document.getElementById("helmetSelect").value;
    var chestplate = document.getElementById("chestSelect").value;
    var leggings = document.getElementById("legsSelect").value;
    var boots = document.getElementById("bootsSelect").value;
    // console.log(helmet, chestplate, leggings, boots);

    for (i = 0; i < obtainableItems["Helmets"].length; i++) {
        if (obtainableItems["Helmets"][i]["name"] == helmet) {
            // console.log(helmetStats)['defense'];
            player.playerDefense += obtainableItems["Helmets"][i]["armor"];
            helmet += player.playerDefense;
        }
    }
    for (i = 0; i < obtainableItems["Chestplates"].length; i++) {
        if (obtainableItems["Chestplates"][i]["name"] == chestplate) {
            player.playerDefense += obtainableItems["Chestplates"][i]["armor"];
            chestplate += player.playerDefense;
        }
    }
    for (i = 0; i < obtainableItems["Leggings"].length; i++) {
        if (obtainableItems["Leggings"][i]["name"] == leggings) {
            player.playerDefense += obtainableItems["Leggings"][i]["armor"];
            leggings += player.playerDefense;
        }
    }
    for (i = 0; i < obtainableItems["Boots"].length; i++) {
        if (obtainableItems["Boots"][i]["name"] == boots) {
            player.playerDefense += obtainableItems["Boots"][i]["armor"];
            boots += player.playerDefense;
        }
    }
    document.getElementById("playerDefenseValue").innerHTML = player.playerDefense;
}


// var canCraftItem = setInterval(function(){
//     var craftingSelect = document.getElementById("craftingSelect");
//     for(i = 0; i < craftingSelect.length; i++){
//         if()
//     }
// })
