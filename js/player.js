const player = getPlayerData() ?? resetPlayer({});

export default player;

export function saveData() {
    localStorage["player"] = JSON.stringify(player);
}

function getPlayerData() {
    const playerData = localStorage["player"];
    return playerData && JSON.parse(playerData);
}

export function resetData() {
    resetPlayer(player);
    saveData();
}

function resetPlayer(player) {
    player.xp = 0;
    player.level = 1;
    player.neededLevelUpXP = 0;
    player.inventory = [];
    player.inventory_dictionary = {
        "Wood": 0,
        "Stone": 0,
        "Fish": 0,
        "Meat": 0,
        "Iron": 0,
        "Copper": 0,
        "Tin": 0,
        "Silver": 0,
        "Gold": 0,
        "Emerald": 0,
        "Ruby": 0,
        "Diamond": 0,
        "Axe": 0,
        "Pickaxe": 0,
        "Hunting Rifle": 0,
        "Fishing Pole": 0,
    },
    player.gold = 100;
    player.fullInventory = false;
    player.maxInventorySize = 25; //can be upgraded to 48, 72 and 96
    player.maxStamina = 25;
    player.stamina = 25; //this goes down as you quest, can be upgraded to 50, 75 and 100

    // player.messages = [];
    // player.fishObtained = 0;
    // player.woodObtained = 0;
    // player.stoneObtained = 0;
    // player.meatObtained = 0;
    
    player.axeHealth = 20;
    player.fishingPoleHealth = 10;
    player.huntingRifleHealth = 50;
    player.pickaxeHealth = 75;
    player.playerHealth = 100;
    player.playerAttack = 1;
    player.playerDefense = 1;
    player.playerSpeed = 1;
    player.armorBonus = 0;

    return player;
}