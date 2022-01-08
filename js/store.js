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
        var notEnoughGoldMessage = "You don't have enough gold to buy an axe!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(notEnoughGoldMessage));
        document.getElementById("messages").appendChild(message);
    }
}

function buyFishingPole() {
    if (gold >= 50) {
        if (inventory.includes("Fishing Pole")) {
            console.log("You already have a fishing pole!");
        }
        else {
            inventory.push("Fishing Pole");
            // alert("You bought a fishing pole!");
            gold -= 50;
        }
    }
    else {
        //add to messages
        var notEnoughGoldMessage = "You don't have enough gold to buy a fishing pole!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(notEnoughGoldMessage));
        document.getElementById("messages").appendChild(message);
    }
}

function buyHuntingRifle() {
    if (gold >= 300) {
        if (inventory.includes("Hunting Rifle")) {
            console.log("You already have a hunting rifle!");
        }
        else {
            inventory.push("Hunting Rifle");
            // alert("You bought a fishing pole!");
            gold -= 300;
        }
    }
    else {
        //add to messages
        var notEnoughGoldMessage = "You don't have enough gold to buy a hunting rifle!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(notEnoughGoldMessage));
        document.getElementById("messages").appendChild(message);
    }
}

function buyPickaxe() {
    if (gold >= 1200) {
        if (inventory.includes("Pickaxe")) {
            console.log("You already have a pickaxe!");
        }
        else {
            inventory.push("Pickaxe");
            // alert("You bought a fishing pole!");
            gold -= 1200;
        }
    }
    else {
        //add to messages
        var notEnoughGoldMessage = "You don't have enough gold to buy a pickaxe!";
        //add page break after level up message
        document.getElementById("messages").innerHTML += "<br>";
        var message = document.createElement("li");
        message.appendChild(document.createTextNode(notEnoughGoldMessage));
        document.getElementById("messages").appendChild(message);
    }
}
boughtTimes = 0;

function buySpecialDeal() {
    if (gold >= 1000) {
        randomLootDrop();
        //add page break after level up message
        isInInventory(finalItem.name, finalItem.type); //this handles adding item and displaying message
        gold -= 1000;
    }
    else {
        var poorMessage = "You do not have enough gold to buy this item!";
        addMessage(poorMessage);
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
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i] == 'Iron') {
                inventory.splice(i, 1);
                gold += 20;
            }
            else if (inventory[i] == 'Gold') {
                inventory.splice(i, 1);
                gold += 40;
            }
            else if (inventory[i] == 'Diamond') {
                inventory.splice(i, 1);
                gold += 100;
            }
            else if (inventory[i] == "Emerald") {
                inventory.splice(i, 1);
                gold += 30;
            }
            else if (inventory[i] == "Copper") {
                inventory.splice(i, 1);
                gold += 25;
            }
            else if (inventory[i] == "Tin") {
                inventory.splice(i, 1);
                gold += 15;
            }
            else if (inventory[i] == "Silver") {
                inventory.splice(i, 1);
                gold += 50;
            }
            else if (inventory[i] == "Ruby") {
                inventory.splice(i, 1);
                gold += 60;
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
