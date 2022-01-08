var fullInventory = false;

function checkInventorySize() {
    if (inventory.length >= 24) {
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
        if (!helmetItems.includes(itemName)) {
            helmetItems.push(itemName);
            var helmetSelect = document.getElementById("helmetSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            helmetSelect.add(newOption);
            return false;
        }
        else if (helmetItems.includes(itemName)) {
            //do nothing
            return true;
        }
    }
    else if (itemType == 'Chestplate') {
        if (!chestItems.includes(itemName)) {
            chestItems.push(itemName);
            var chestplateSelect = document.getElementById("chestSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            chestplateSelect.add(newOption);
            return false;
        }
        else if (chestItems.includes(itemName)) {
            //do nothing
            return true;
        }
    }
    else if (itemType == 'Leggings') {
        if (!leggingItems.includes(itemName)) {
            leggingItems.push(itemName);
            var leggingSelect = document.getElementById("legsSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            leggingSelect.add(newOption);
            return false;
        }
        else if (leggingItems.includes(itemName)) {
            //do nothing
            return true;
        }
    }
    else if (itemType == 'Boots') {
        if (!bootsItems.includes(itemName)) {
            bootsItems.push(itemName);
            var bootSelect = document.getElementById("bootsSelect");
            var newOption = document.createElement("option");
            newOption.text = itemName;
            bootSelect.add(newOption);
            return false;
        }
        else if (bootsItems.includes(itemName)) {
            //do nothing
            return true;
        }
    }
    return false;
}