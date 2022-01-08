function buyAxe() {
    if (gold >= 20) {
        if (inventory.includes("Axe")) {
            console.log("You already have an axe!");
        }
        else {
            inventory.push("Axe");
            // alert("You bought an axe!");
            gold -= 20;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy an axe!");
    }
}

function buyFishingPole() {
    if (gold >= 50) {
        if (inventory.includes("Fishing Pole")) {
            console.log("You already have a fishing pole!");
        } else {
            inventory.push("Fishing Pole");
            // alert("You bought a fishing pole!");
            gold -= 50;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy a fishing pole!");
    }
}

function buyHuntingRifle() {
    if (gold >= 300) {
        if (inventory.includes("Hunting Rifle")) {
            console.log("You already have a hunting rifle!");
        } else {
            inventory.push("Hunting Rifle");
            // alert("You bought a fishing pole!");
            gold -= 300;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy a hunting rifle!");
    }
}

function buyPickaxe() {
    if (gold >= 1200) {
        if (inventory.includes("Pickaxe")) {
            console.log("You already have a pickaxe!");
        } else {
            inventory.push("Pickaxe");
            // alert("You bought a fishing pole!");
            gold -= 1200;
        }
    } else {
        //add to messages
        addMessage("You don't have enough gold to buy a pickaxe!");
    }
}
boughtTimes = 0;

function buySpecialDeal() {
    if (gold >= 1000) {
        randomLootDrop();
        //add page break after level up message
        isInInventory(finalItem.name, finalItem.type); //this handles adding item and displaying message
        gold -= 1000;
    } else {
        addMessage("You do not have enough gold to buy this item!");
    }
}

function buyInventoryUpgrade() {
    if (boughtTimes < 3) {
        var price = 10000 + (10000 * boughtTimes);
        if (gold >= price) {
            maxInventorySize += 24;
            boughtTimes++;
            gold -= price;
            document.getElementById("inventoryUpgrade").innerHTML = "Buy Inventory Upgrade  [" + price + "<br><br>"
                + "(" + boughtTimes + " / 3)";
            addMessage("Inventory Space increased by 24! [Currently " + maxInventorySize + "]");
        }
        else {
            addMessage("You don't have enough gold to buy an inventory upgrade!");
        }
    }
    else {
        document.getElementById("inventoryUpgrade").innerHTML = "Inventory Upgrade [ Maxed ]";
    }
}

setInterval(function () {
    var price = 10000 + (10000 * boughtTimes);
    if (boughtTimes < 3) {
        document.getElementById("inventoryUpgrade").innerHTML = "Buy Inventory Upgrade  [" + price + "]&nbsp;"
            + "(" + boughtTimes + " / 3)";
    }
    else {
        document.getElementById("inventoryUpgrade").innerHTML = "Inventory Upgrade [ Maxed ]";
    }
}, 100);


function sell(item) {
    fullInventory = false;
    if (item == 'Wood') {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i] == 'Wood') {
                inventory.splice(i, 1);
                gold += 5;
            }
        }
    }
    else if (item == 'Fish') {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i] == 'Fish') {
                inventory.splice(i, 1);
                gold += 10;
            }
        }
    }
    else if (item == 'Meat') {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i] == 'Meat') {
                inventory.splice(i, 1);
                gold += 25;
            }
        }
    }
    else if (item == 'Ores') {
        //remove all ores in inventory
		let goldTable = {
					"Iron": 20,
					"Copper":25,
					"Tin":15,
					"Silver": 50,
					"Gold": 25,
					"Emerald": 30,
					"Ruby": 60,
					"Diamond": 100
		};
		
        for (let i = 0; i < inventory.length; i++) {
			if (goldTable[inventory[i]]) {
				inventory.splice(i, 1);
				gold += goldTable[inventory[i]];
			}
        }
    }
    else if (item == "Stone") {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i] == "Stone") {
                inventory.splice(i, 1);
                gold += 5;
            }
        }
    }
}
