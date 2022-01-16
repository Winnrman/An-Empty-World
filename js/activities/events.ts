import items from "../data/items/items";
import potions from "../data/items/potions";

export function randomLootDrop() {
    var chosenRarity = getRandomRarity();
    let itemsOfType = null;

    const itemType = getRandomItemType();
    if (itemType == "Potion") {
        itemsOfType = potions.filter(x => x.type == itemType);
    }
    else {
        itemsOfType = items.filter(x => x.type == itemType);
    }
    return itemsOfType[Math.floor(Math.random() * itemsOfType.length)];
}

function getRandomRarity() {
    var rarity = Math.floor(Math.random() * 16) + 1;
    if (rarity < 5) return "common";
    if (rarity < 10) return "uncommon";
    if (rarity < 15) return "rare";
    if (rarity == 16) return "legendary";
}

function getRandomItemType() {
    switch (Math.floor(Math.random() * 6) + 1) {
        case 1: return "Helmet";
        case 2: return "Chestplate";
        case 3: return "Leggings";
        case 4: return "Boots";
        case 5: return "Offhand";
        case 6: return "Potion";
        //case 6: return "Shield";
    }
}