import items from "./items.js";

export let finalItem;

export function randomLootDrop() {
    var chosenRarity = getRandomRarity();

    const itemType = getRandomItemType();
    const itemsOfType = items.filter(x => x.type == itemType);

    finalItem = itemsOfType[Math.floor(Math.random() * itemsOfType.length)];
    // console.log("Enemy dropped: " + finalItem.name);
    // addToOwnedEquipment(finalItem.name, finalItem.type);
}

function getRandomRarity() {
    var rarity = Math.floor(Math.random() * 16) + 1;
    if (rarity < 5) return "common";
    if (rarity < 10) return "uncommon";
    if (rarity < 15) return "rare";
    if (rarity == 16) return "legendary";
}

function getRandomItemType() {
    switch (Math.floor(Math.random() * 5) + 1) {
        case 1: return "Helmet";
        case 2: return "Chestplate";
        case 3: return "Leggings";
        case 4: return "Boots";
        case 5: return "Offhand";
        //case 6: return "Shield";
    }
}