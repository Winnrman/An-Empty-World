const player = getPlayerData() ?? resetPlayer(<Player>{});

type InventoryItem = 
    "Wood" | "Stone" | "Fish" | "Meat" |
    "Iron" | "Copper" | "Tin" | "Silver" | "Gold" |
    "Emerald" | "Ruby" | "Diamond" |
    "Axe" | "Pickaxe" | "Hunting Rifle" | "Fishing Pole";

type EquipmentType = "Helmet" | "Chestplate" | "Leggings" | "Boots" | "Weapon";

type Player = {
    xp: number;
    level: number;
    neededLevelUpXP: number;
    boughtInventoryUpgrade: number;
    inventory_dictionary: Record<InventoryItem, number>;
    gold: number;
    fullInventory: boolean;
    maxInventorySize: number;
    maxStamina: number;
    stamina: number;
    ownedEquipment: string[];
    equipment: Record<EquipmentType, string>;
    axeHealth: number;
    fishingPoleHealth: number;
    huntingRifleHealth: number;
    pickaxeHealth: number;
    playerHealth: number;
    playerAttack: number;
    playerDefense: number;
    playerSpeed: number;
    armorBonus: number;
    isQuesting: boolean;
}

export default <Player>player;

export function saveData() {
    localStorage["player"] = JSON.stringify(player);
}

function getPlayerData() {
    const playerData = localStorage["player"];
    return playerData && <Player>JSON.parse(playerData);
}

export function resetData() {
    resetPlayer(player);
    saveData();
}

function resetPlayer(player: Player): Player {
    player.xp = 0;
    player.level = 1;
    player.neededLevelUpXP = 0;
    player.boughtInventoryUpgrade = 0;
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
    player.maxInventorySize = 25; //can be upgraded to 50, 75 or 100
    player.maxStamina = 25;
    player.stamina = 25; //this goes down as you quest, can be upgraded to 50, 75 and 100

    player.ownedEquipment = [];
    player.equipment = {
        Helmet: "",
        Chestplate: "",
        Leggings: "",
        Boots: "",
        Weapon: "",
    };

    player.axeHealth = 20;
    player.fishingPoleHealth = 10;
    player.huntingRifleHealth = 50;
    player.pickaxeHealth = 75;
    player.playerHealth = 100;
    player.playerAttack = 1;
    player.playerDefense = 1;
    player.playerSpeed = 1;
    player.armorBonus = 0;

    player.isQuesting = false;

    return player;
}