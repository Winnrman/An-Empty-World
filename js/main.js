import * as achievements from "./achievements.js"; // this may look unnecessary but it's needed to load the file to start the interval. We might want to make this explicit by calling the start interval in this file
import * as activities from "./activities.js";
import player, { saveData, resetData } from "./player.js";
import * as store from "./store.js";
import * as questing from "./questing.js";

window.store = store;
window.activities = activities;
window.questing = questing;
window.saveData = saveData;
window.resetData = function() {
    resetData();
    window.location.reload();
};

//calculate inventory space
function calculateInventorySpace() {
    let inventorySpace = 0;
    for (let key in player.inventory_dictionary) {
        inventorySpace += player.inventory_dictionary[key];
    }
    return inventorySpace;
}

setInterval(function () {
    document.getElementById("inventory").innerHTML = inventory;
    document.getElementById("gold").innerHTML = player.gold;
    player.inventory.sort();
    checkLevelUnlocks();
    checkDarkMode();
    document.getElementById("axeDurability").innerHTML = "Axe: " + player.axeHealth + "/20";
    document.getElementById("pickaxeDurability").innerHTML = "&nbsp;| Pickaxe: " + player.pickaxeHealth + "/75";
    document.getElementById("rifleDurability").innerHTML = "&nbsp;| Rifle: " + player.huntingRifleHealth + "/50";
    document.getElementById("fishingPoleDurability").innerHTML = "&nbsp;| Fishing Pole: " + player.fishingPoleHealth + "/10";
    document.getElementById("inventoryHeader").innerHTML = "Inventory (" + calculateInventorySpace() + "/" + player.maxInventorySize + ")";

    document.getElementById("inventory").innerHTML = "Axe x" + player.inventory_dictionary["Axe"] + "&nbsp;|" + "&nbsp;Pickaxe x" + player.inventory_dictionary["Pickaxe"] + "&nbsp;|" + "&nbsp;Rifle x" + player.inventory_dictionary["Hunting Rifle"] + "&nbsp;|" + "&nbsp;Fishing Pole x" + player.inventory_dictionary["Fishing Pole"] + "&nbsp;|" + "&nbsp;Meat x" + player.inventory_dictionary["Meat"] + "&nbsp;|" + "&nbsp;Wood x" + player.inventory_dictionary["Wood"] + "&nbsp;|" + "&nbsp;Stone x" + player.inventory_dictionary["Stone"] + "&nbsp;|" + "&nbsp;Fish x" + player.inventory_dictionary["Fish"] + "&nbsp;|" + "&nbsp;Iron x" + player.inventory_dictionary["Iron"] + "&nbsp;|" + "&nbsp;Copper x" + player.inventory_dictionary["Copper"] + "&nbsp;|" + "&nbsp;Tin x" + player.inventory_dictionary["Tin"] + "&nbsp;|" + "&nbsp;Silver x" + player.inventory_dictionary["Silver"] + "&nbsp;|" + "&nbsp;Gold x" + player.inventory_dictionary["Gold"] + "&nbsp;|" + "&nbsp;Emerald x" + player.inventory_dictionary["Emerald"] + "&nbsp;|" + "&nbsp;Ruby x" + player.inventory_dictionary["Ruby"] + "&nbsp;|" + "&nbsp;Diamond x" + player.inventory_dictionary["Diamond"];
}, 100);

setInterval(function() {
    saveData();
}, 5000);

let clearMessageInterval = setInterval(function () {
    document.getElementById("messages").innerHTML = [];
}, 8000); //clears messages every 15 seconds

setInterval(function () { // checks to see if messages is full.
    if (document.getElementById("messagesContainer").style.height >= '200px') {
        alert("You have too many messages. Please delete some.");
        document.getElementById("messages").innerHTML = [];
    }
}, 1000);

function checkLevelUnlocks() {
    if (player.level >= 2) {
        //add 'Go Hunting' button to activities
        document.getElementById("goHuntingButton").style.visibility = "visible";
        document.getElementById("huntingRifle").style.visibility = "visible";
        //sell meat button
        document.getElementById("sellMeat").style.visibility = "visible";
    }
    if (player.level >= 3) {
        // add 'Go Mining' button to activities
        document.getElementById("goMiningButton").style.visibility = "visible";
        document.getElementById("pickaxe").style.visibility = "visible";

        //sell ores button
        document.getElementById("sellOres").style.visibility = "visible";
        document.getElementById("sellStone").style.visibility = "visible";
    }
    if (player.level >= 4) {
        document.getElementById("inventoryUpgrade").style.visibility = "visible";
    }
    if (player.level >= 5) {
        for (i = 0; i < 4; i++) {
            document.getElementsByClassName("level5Crafting")[i].style.visibility = "visible";
            document.getElementsByClassName("level5Crafting")[i].style.display = "block";
        }
    }
    if (player.level > 7) {
        document.getElementById("goQuestingButton").style.visibility = "visible";
    }
}

function checkDarkMode() {
    var time = new Date();
    var hours = time.getHours();
    if (hours >= 15 || hours < 8) {
        document.body.setAttribute("class", "dark");
        document.getElementById("messages").style.color = "white";
        document.getElementById("inventory").style.color = "white";
        document.getElementById("gold").style.color = "white";
        // document.getElementById("footer").style.color = "white";
        // document.getElementById("footer").style.backgroundColor = rgb(39, 39, 39);
        var headers = document.getElementsByClassName("header");
        for (let i = 0; i < headers.length; i++) {
            Array.prototype.forEach.call(headers, function (header) {
                header.style.color = "white";
                header.style.backgroundColor = "rgb(39, 39, 39)";
            });
        }

        var headers2 = document.getElementsByTagName("button");
        for (let i = 0; i < headers2.length; i++) {
            Array.prototype.forEach.call(headers2, function (header3) {
                header3.style.color = "white";
                header3.style.backgroundColor = "black";
            });
        }


        var headers3 = document.getElementsByTagName("div");
        for (let i = 0; i < headers2.length; i++) {
            Array.prototype.forEach.call(headers3, function (header4) {
                header4.style.borderColor = "white";
            })
        }
        var headers3 = document.getElementsByTagName("select");
        for (let i = 0; i < headers2.length; i++) {
            Array.prototype.forEach.call(headers3, function (header4) {
                header4.style.backgroundColor = "black";
                header4.style.color = "white";
                header4.style.border = "none";
            })
        }
    }
    else {
        //nothing
    }
}

// TODO: Rework Needed!
document.getElementById("helmetSelect").addEventListener("change", function () {
    var helmetName = document.getElementById("helmetSelect").value;
    for (i = 0; i < obtainableItems.length; i++) {
        if (obtainableItems["Helmets"][i].name == helmetName) {
            // when user changes helmet, update player defense by removing old helmet defense and adding new one
            if (helmetName == "") {
                player.playerDefense -= obtainableItems["Helmets"][i].armor;
            }
            else {
                console.log("Helmet: " + obtainableItems["Helmets"][i].name);
                // playerDefense -= obtainableItems["Helmets"][i].armor;
                var helmetDefense = obtainableItems["Helmets"][i].armor;
                player.playerDefense += helmetDefense;
                document.getElementById("playerDefenseValue").innerHTML += helmetDefense;
            }
        }
    }
});



