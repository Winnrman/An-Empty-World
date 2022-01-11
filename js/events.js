var finalItem;

function randomLootDrop() {
    var chosenRarity;
    var itemType;

    var rarity = Math.floor(Math.random() * 16) + 1;
    if (rarity <= 0 && rarity >= 5) {
        chosenRarity = "common";
    }
    else if (rarity <= 5 && rarity >= 10) {
        chosenRarity = "uncommon";
    }
    else if (rarity <= 10 && rarity >= 15) {
        chosenRarity = "rare";
    }
    else if (rarity == 16) {
        chosenRarity = "legendary";
    }

    var typeOfItem = Math.floor(Math.random() * 5) + 1;
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
    else if (typeOfItem == 5) {
        itemType = "Offhand";
    }
    // else if (typeOfItem == 6) {
    //     itemType = "Shield"; //improves defense
    // }

    finalItem = obtainableItems[itemType][Math.floor(Math.random() * obtainableItems[itemType].length)];
    // console.log("Enemy dropped: " + finalItem.name);
    // isInInventory(finalItem.name, finalItem.type);
}