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
                gold += 1000;
            }
            else if (inventory[i] == "Emerald") {
                inventory.splice(i, 1);
                gold += 300;
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
                gold += 150;
            }
            else if (inventory[i] == "Ruby") {
                inventory.splice(i, 1);
                gold += 600;
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
