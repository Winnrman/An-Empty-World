var maxInventorySize = 24; //can be upgraded to 48, 72 and 96
var fullInventory = false;

function checkInventorySize() {
    if (inventory.length >= maxInventorySize) {
        fullInventory = true;
    }
}

var inventoryChecker = setInterval(function () {
    checkInventorySize();
    if (fullInventory == true) {
        addMessage("Your inventory is full. You can't carry any more items.");
        clearInterval(inventoryChecker);
        setTimeout(function () {
            nextCheck = setInterval(function () {
                checkInventorySize();
                if (fullInventory == false) {
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

function isInInventory(itemName, itemType) {
    if (itemType == 'Helmet') {
        if (helmetItems.includes(itemName)) {
            console.log(helmetItems);
            addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
            gold += 1000;
            return true;
        } else {
            addMessage("You bought a random item and recieved " + finalItem.name + "!");
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
            addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
            gold += 1000;
            return true;
        } else {
            addMessage("You bought a random item and recieved " + finalItem.name + "!";);
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
            addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
            gold += 1000;
            // return true;
        } else {
            addMessage("You bought a random item and recieved " + finalItem.name + "!");
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
            addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
            gold += 1000;
            // return true;
        } else {
            addMessage("You bought a random item and recieved " + finalItem.name + "!");
            bootsItems.push(itemName);
            var bootSelect = document.getElementById("bootsSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            bootSelect.add(newOption);
            // return false;
        }
    }
    // return false;
}