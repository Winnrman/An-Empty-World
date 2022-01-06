var finalItem;

function randomLootDrop() {
    var chosenRarity;
    var itemType;

    var raity = Math.floor(Math.random() * 16) + 1;
    if (raity <= 0 && raity >= 5) {
        chosenRarity = "common";
    }
    else if (raity <= 5 && raity >= 10) {
        chosenRarity = "uncommon";
    }
    else if (raity <= 10 && raity >= 15) {
        chosenRarity = "rare";
    }
    else if (raity == 16) {
        chosenRarity = "legendary";
    }

    var typeOfItem = Math.floor(Math.random() * 4) + 1;
    if (typeOfItem == 1) {
        itemType = "Helmets";
    }
    else if (typeOfItem == 2) {
        itemType = "Chestplates";
    }
    else if (typeOfItem == 3) {
        itemType = "Leggings";
    }
    else if (typeOfItem == 4) {
        itemType = "Boots";
    }

    finalItem = obtainableItems[itemType][Math.floor(Math.random() * obtainableItems[itemType].length)];
    // return finalItem.name;
    console.log(itemType);
    console.log("Enemy dropped: " + finalItem.name);

    //add item to inventory
    if (itemType == "Helmets") {
        // inventory.push(finalItem.name);
        //add item to 'helmetSelect select as an option
        var helmetSelect = document.getElementById("helmetSelect");
        var newOption = document.createElement("option");
        newOption.text = finalItem.name;
        helmetSelect.add(newOption);
    }
    if (itemType == "Chestplates") {
        // inventory.push(finalItem.name);
        //add item to 'chestplateSelect select as an option
        var chestplateSelect = document.getElementById("chestSelect");
        var newOption = document.createElement("option");
        newOption.text = finalItem.name;
        chestplateSelect.add(newOption);
    }
    if (itemType == "Leggings") {
        // inventory.push(finalItem.name);
        //add item to 'leggingSelect select as an option
        var leggingSelect = document.getElementById("legsSelect");
        var newOption = document.createElement("option");
        newOption.text = finalItem.name;
        leggingSelect.add(newOption);
    }
    if (itemType == "Boots") {
        // inventory.push(finalItem.name);
        //add item to 'bootSelect select as an option
        var bootSelect = document.getElementById("bootsSelect");
        var newOption = document.createElement("option");
        newOption.text = finalItem.name;
        bootSelect.add(newOption);
    }

}