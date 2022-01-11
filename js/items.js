let axe = {
    name: "Axe",
    price: 20,
    description: "A wooden axe.",
    health: 20,
    // image: "images/axe.png"
}

let fishingPole = {
    name: "Fishing Pole",
    price: 50,
    description: "A wooden fishing pole.",
    health: 10,
    // image: "images/fishingPole.png"
}
let huntingRifle = {
    name: "Hunting Rifle",
    price: 300,
    description: "A hunting rifle.",
    health: 10,
    // image: "images/huntingRifle.png"
}
let pickaxe = {
    name: "Pickaxe",
    price: 1200,
    description: "A pickaxe.",
    health: 20,
    // image: "images/pickaxe.png"
}

let obtainableItems = {
    "Helmets": [
        {
            name: "Wooden Helmet",
            price: 10,
            description: "A wooden helmet.",
            armor: 1,
            type: "Helmet",
            rarity: "common",
        },
        {
            name: "Iron Helmet",
            price: 20,
            description: "An iron helmet.",
            armor: 2,
            type: "Helmet",
            rarity: "uncommon",
        },
        {
            name: "Bronze Helmet",
            price: 30,
            description: "A bronze helmet.",
            armor: 2.25,
            type: "Helmet",
            rarity: "common",
        },
        {
            name: "Copper Helmet",
            price: 10,
            description: "A copper helmet.",
            armor: 1.5,
            type: "Helmet",
            rarity: "common",
        },
        {
            name: "Gold Helmet",
            price: 40,
            description: "A gold helmet.",
            armor: 4,
            type: "Helmet",
            rarity: "rare",
        },
        {
            name: "Crystal Helmet",
            price: 2000,
            description: "Ultra rare crystal helmet.",
            armor: 10,
            type: "Helmet",
            rarity: "legendary",
        },
    ],
    "Chestplates": [
        {
            name: "Wooden Chestplate",
            price: 10,
            description: "A wooden chestplate.",
            armor: 1 + 3,
            type: "Chestplate",
            rarity: "common",
        },
        {
            name: "Iron Chestplate",
            price: 20,
            description: "An iron chestplate.",
            armor: 2 + 3,
            type: "Chestplate",
            rarity: "uncommon",
        },
        {
            name: "Bronze Chestplate",
            price: 30,
            description: "A bronze chestplate.",
            armor: 2.25 + 3,
            type: "Chestplate",
            rarity: "common",
        },
        {
            name: "Copper Chestplate",
            price: 10,
            description: "A copper chestplate.",
            armor: 1.5 + 3,
            type: "Chestplate",
            rarity: "common",
        },
        {
            name: "Gold Chestplate",
            price: 40,
            description: "A gold chestplate.",
            armor: 4 + 3,
            type: "Chestplate",
            rarity: "rare",
        },
        {
            name: "Crystal Chestplate",
            price: 2000,
            description: "Ultra rare crystal chestplate.",
            armor: 10 + 3,
            type: "Chestplate",
            rarity: "legendary",
        },
    ],
    "Leggings": [
        {
            name: "Wooden Leggings",
            price: 10,
            description: "A wooden leggings.",
            armor: 1 + 2,
            type: "Leggings",
            rarity: "common",
        },
        {
            name: "Iron Leggings",
            price: 20,
            description: "An iron leggings.",
            armor: 2 + 2,
            type: "Leggings",
            rarity: "uncommon",
        },
        {
            name: "Bronze Leggings",
            price: 30,
            description: "A bronze leggings.",
            armor: 2.25 + 2,
            type: "Leggings",
            rarity: "common",
        },
        {
            name: "Copper Leggings",
            price: 10,
            description: "A copper leggings.",
            armor: 1.5 + 2,
            type: "Leggings",
            rarity: "common",
        },
        {
            name: "Gold Leggings",
            price: 40,
            description: "A gold leggings.",
            armor: 4 + 2,
            type: "Leggings",
            rarity: "rare",
        },
        {
            name: "Crystal Leggings",
            price: 2000,
            description: "Ultra rare crystal leggings.",
            armor: 10 + 2,
            type: "Leggings",
            rarity: "legendary",
        }
    ],
    "Boots": [
        {
            name: "Wooden Boots",
            price: 10,
            description: "A wooden boots.",
            armor: 1 + 1,
            type: "Boots",
            rarity: "common",
        },
        {
            name: "Iron Boots",
            price: 20,
            description: "An iron boots.",
            armor: 2 + 1,
            type: "Boots",
            rarity: "uncommon",
        },
        {
            name: "Bronze Boots",
            price: 30,
            description: "A bronze boots.",
            armor: 2.25 + 1,
            type: "Boots",
            rarity: "common",
        },
        {
            name: "Copper Boots",
            price: 10,
            description: "A copper boots.",
            armor: 1.5 + 1,
            type: "Boots",
            rarity: "common",
        },
        {
            name: "Gold Boots",
            price: 40,
            description: "A gold boots.",
            armor: 4 + 1,
            type: "Boots",
            rarity: "rare",
        },
        {
            name: "Crystal Boots",
            price: 4000,
            description: "Ultra rare boots.",
            armor: 20 + 4,
            type: "Boots",
            rarity: "legendary",
        }
    ],
    "Offhand": [
        {
            name: "Amulet of Luck",
            price: 9000,
            description: "A mysterious amulet which grants the user extreme luck.",
            type: "Offhand",
            rarity: "legendary",
        },
    ],
}


craftableItems = {
    "Armor": [
        {
            name: "Wooden Helmet",
            price: 10,
            description: "A wooden helmet.",
            armor: 1,
            type: "Helmet",
            rarity: "common",
            requiredCraftingLevel: 1,
            requiredCraftingItems: [
                {
                    "Wood": 2,
                    "Iron": 1,
                }
            ]
        },
        {
            name: "Dragon Scale Helmet",
            price: 32000,
            description: "Made from the scales of the scariest beast, this helmet is said to be the stuff of legends.",
            armor: 20,
            type: "Helmet",
            requiredCraftingLevel: 25,
            rarity: "legendary",
            requiredCraftingItems: [
                {
                    "Dragon Scale": 3,
                    "Titanium": 2,
                }
            ]
        },
        {
            name: "Dragon Scale Chestplate",
            price: 32000,
            description: "Made from the scales of the scariest beast, this chestplate is said to be the stuff of legends.",
            armor: 20 + 3,
            type: "Chestplate",
            requiredCraftingLevel: 25,
            rarity: "legendary",
            requiredCraftingItems: [
                {
                    "Dragon Scale": 7,
                    "Titanium": 5,
                }
            ]
        },
        {
            name: "Dragon Scale Leggings",
            price: 32000,
            description: "Made from the scales of the scariest beast, this leggings are said to be the stuff of legends.",
            armor: 20 + 2,
            type: "Leggings",
            requiredCraftingLevel: 25,
            rarity: "legendary",
            requiredCraftingItems: [
                {
                    "Dragon Scale": 4,
                    "Titanium": 3,
                }
            ]
        },
        {
            name: "Dragon Scale Boots",
            price: 32000,
            description: "Made from the scales of the scariest beast, these boots are said to be the stuff of legends.",
            armor: 20 + 1,
            type: "Boots",
            requiredCraftingLevel: 25,
            rarity: "legendary",
            requiredCraftingItems: [
                {
                    "Dragon Scale": 2,
                    "Titanium": 1,
                }
            ]
        }
    ]
}