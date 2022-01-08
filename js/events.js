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
    console.log("Enemy dropped: " + finalItem.name);
    isInInventory(finalItem.name, finalItem.type);
}