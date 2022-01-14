import * as achievements from "./achievements.js"; // this may look unnecessary but it's needed to load the file to start the interval. We might want to make this explicit by calling the start interval in this file
import * as activities from "./activities.js";
import * as crafting from "./crafting.js";
import player, { saveData, resetData } from "./player.js";
import * as store from "./store.js";
import * as questing from "./questing.js";
import { loadOptionsFromOwnedEquipment } from "./maintenance.js";
import items from "./items.js";

window.player = player;
window.store = store;
window.activities = activities;
window.crafting = crafting;
window.questing = questing;
window.saveData = saveData;
window.resetData = function () {
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
	
	for (var item of items) { 
		if (item.type == "tool") {
			if (player.inventory_dictionary[item.name] > 0) {
				document.getElementById(item.elementID).innerHTML = item.name + ":&nbsp;" + player.toolHealth[item.name] + "/" + item.health + "&nbsp;&nbsp;&nbsp;";
			} else {
				document.getElementById(item.elementID).innerHTML = "&nbsp;&nbsp;&nbsp;";
			}
		}		
	}
    document.getElementById("inventoryHeader").innerHTML = "Inventory (" + calculateInventorySpace() + "/" + player.maxInventorySize + ")";
	
	var inventory_text = "&nbsp;"
	for (var key in player.inventory_dictionary) {
		// check if the property/key is defined in the object itself, not in parent
		if (player.inventory_dictionary.hasOwnProperty(key)) {           
			// Check if more than 0 item is present in player inventory
			if (player.inventory_dictionary[key] > 0) {
				inventory_text += "&nbsp;" + key + " x" + player.inventory_dictionary[key]
				inventory_text += "&nbsp;|"
			}
		}
	}
	inventory_text = inventory_text.substring(0,inventory_text.length - 1); // remove last | at the end
	if (inventory_text.length < 6) {inventory_text = "&nbsp;None"}
	
	document.getElementById("inventory").innerHTML = inventory_text
	
    //document.getElementById("inventory").innerHTML = "Axe x" + player.inventory_dictionary["Axe"] + "&nbsp;|" + "&nbsp;Pickaxe x" + player.inventory_dictionary["Pickaxe"] + "&nbsp;|" + "&nbsp;Rifle x" + player.inventory_dictionary["Hunting Rifle"] + "&nbsp;|" + "&nbsp;Fishing Pole x" + player.inventory_dictionary["Fishing Pole"] + "&nbsp;|" + "&nbsp;Meat x" + player.inventory_dictionary["Meat"] + "&nbsp;|" + "&nbsp;Wood x" + player.inventory_dictionary["Wood"] + "&nbsp;|" + "&nbsp;Stone x" + player.inventory_dictionary["Stone"] + "&nbsp;|" + "&nbsp;Fish x" + player.inventory_dictionary["Fish"] + "&nbsp;|" + "&nbsp;Iron x" + player.inventory_dictionary["Iron"] + "&nbsp;|" + "&nbsp;Copper x" + player.inventory_dictionary["Copper"] + "&nbsp;|" + "&nbsp;Tin x" + player.inventory_dictionary["Tin"] + "&nbsp;|" + "&nbsp;Silver x" + player.inventory_dictionary["Silver"] + "&nbsp;|" + "&nbsp;Gold x" + player.inventory_dictionary["Gold"] + "&nbsp;|" + "&nbsp;Emerald x" + player.inventory_dictionary["Emerald"] + "&nbsp;|" + "&nbsp;Ruby x" + player.inventory_dictionary["Ruby"] + "&nbsp;|" + "&nbsp;Diamond x" + player.inventory_dictionary["Diamond"];
}, 100);

setInterval(function () {
    saveData();
}, 5000);

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
        for (var i = 0; i < 4; i++) {
            document.getElementsByClassName("level5Crafting")[i].style.visibility = "visible";
            document.getElementsByClassName("level5Crafting")[i].style.display = "block";
        }
    }
    if (player.level > 7) {
        document.getElementById("goQuestingButton").style.visibility = "visible";
    }
}

function checkDarkMode() {
    var hours = new Date().getHours();
    if (hours >= 15 || hours < 8) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

loadOptionsFromOwnedEquipment();