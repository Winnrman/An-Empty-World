export default [
    // tools
    {
        name: "Axe",
        description: "A wooden axe.",
        type: "tool",
        rarity: "common",
        price: 20,
        health: 20,
    },{
        name: "Fishing Pole",
        description: "A wooden fishing pole.",
        type: "tool",
        rarity: "common",
        price: 50,
        health: 10,
    },{
        name: "Hunting Rifle",
        description: "A hunting rifle.",
        type: "tool",
        rarity: "common",
        price: 300,
        health: 10,
    },{
        name: "Pickaxe",
        description: "A pickaxe.",
        type: "tool",
        rarity: "common",
        price: 1200,
        health: 20,
    },

    // helmets
    {
        name: "Wooden Helmet",
        description: "A wooden helmet.",
        type: "Helmet",
        rarity: "common",
        price: 10,
        armor: 1,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 2,
                "Iron": 1
            }
        }
    },
    {
        name: "Iron Helmet",
        description: "An iron helmet.",
        type: "Helmet",
        rarity: "uncommon",
        price: 20,
        armor: 2,
        crafting: {
            requiredLevel: 5,
            ingredients: {
                "Wood": 3,
                "Iron": 6
            }
        }
    },
    {
        name: "Bronze Helmet",
        description: "A bronze helmet.",
        type: "Helmet",
        rarity: "common",
        price: 30,
        armor: 2.25,
    },
    {
        name: "Copper Helmet",
        description: "A copper helmet.",
        type: "Helmet",
        rarity: "common",
        price: 10,
        armor: 1.5,
    },
    {
        name: "Gold Helmet",
        description: "A gold helmet.",
        type: "Helmet",
        rarity: "rare",
        price: 40,
        armor: 4,
    },
    {
        name: "Crystal Helmet",
        description: "Ultra rare crystal helmet.",
        type: "Helmet",
        rarity: "legendary",
        price: 2000,
        armor: 10,
    },
    {
        name: "Dragon Scale Helmet",
        description: "Made from the scales of the scariest beast, this helmet is said to be the stuff of legends.",
        rarity: "legendary",
        type: "Helmet",
        price: 32000,
        armor: 20,
        crafting: {
            requiredLevel: 25,
            ingredients: {
                "Dragon Scale": 3,
                "Titanium": 2,
            },
        }
    },

    // Chestplates
    {
        name: "Wooden Chestplate",
        description: "A wooden chestplate.",
        type: "Chestplate",
        rarity: "common",
        price: 10,
        armor: 1 + 3,
    },
    {
        name: "Iron Chestplate",
        description: "An iron chestplate.",
        type: "Chestplate",
        rarity: "uncommon",
        price: 20,
        armor: 2 + 3,
    },
    {
        name: "Bronze Chestplate",
        description: "A bronze chestplate.",
        type: "Chestplate",
        rarity: "common",
        price: 30,
        armor: 2.25 + 3,
    },
    {
        name: "Copper Chestplate",
        description: "A copper chestplate.",
        type: "Chestplate",
        rarity: "common",
        price: 10,
        armor: 1.5 + 3,
    },
    {
        name: "Gold Chestplate",
        description: "A gold chestplate.",
        type: "Chestplate",
        rarity: "rare",
        price: 40,
        armor: 4 + 3,
    },
    {
        name: "Crystal Chestplate",
        description: "Ultra rare crystal chestplate.",
        type: "Chestplate",
        rarity: "legendary",
        price: 2000,
        armor: 10 + 3,
    },
    {
        name: "Dragon Scale Chestplate",
        description: "Made from the scales of the scariest beast, this chestplate is said to be the stuff of legends.",
        type: "Chestplate",
        rarity: "legendary",
        price: 32000,
        armor: 20 + 3,
        crafting: {
            requiredLevel: 25,
            ingredients: {
                "Dragon Scale": 7,
                "Titanium": 5,
            },
        }
    },

    // Leggings
    {
        name: "Wooden Leggings",
        description: "A wooden leggings.",
        type: "Leggings",
        rarity: "common",
        price: 10,
        armor: 1 + 2,
    },
    {
        name: "Iron Leggings",
        description: "An iron leggings.",
        type: "Leggings",
        rarity: "uncommon",
        price: 20,
        armor: 2 + 2,
    },
    {
        name: "Bronze Leggings",
        description: "A bronze leggings.",
        type: "Leggings",
        rarity: "common",
        price: 30,
        armor: 2.25 + 2,
    },
    {
        name: "Copper Leggings",
        description: "A copper leggings.",
        type: "Leggings",
        rarity: "common",
        price: 10,
        armor: 1.5 + 2,
    },
    {
        name: "Gold Leggings",
        description: "A gold leggings.",
        type: "Leggings",
        rarity: "rare",
        price: 40,
        armor: 4 + 2,
    },
    {
        name: "Crystal Leggings",
        description: "Ultra rare crystal leggings.",
        type: "Leggings",
        rarity: "legendary",
        price: 2000,
        armor: 10 + 2,
    },
    {
        name: "Dragon Scale Leggings",
        description: "Made from the scales of the scariest beast, this leggings are said to be the stuff of legends.",
        type: "Leggings",
        rarity: "legendary",
        price: 32000,
        armor: 20 + 2,
        crafting: {
            requiredLevel: 25,
            ingredients: {
                "Dragon Scale": 4,
                "Titanium": 3,
            },
        }
    },

    // Boots
    {
        name: "Wooden Boots",
        description: "A wooden boots.",
        type: "Boots",
        rarity: "common",
        price: 10,
        armor: 1 + 1,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 3,
                "Iron": 2
            }
        }
    },
    {
        name: "Iron Boots",
        description: "An iron boots.",
        type: "Boots",
        rarity: "uncommon",
        price: 20,
        armor: 2 + 1,
    },
    {
        name: "Bronze Boots",
        description: "A bronze boots.",
        type: "Boots",
        rarity: "common",
        price: 30,
        armor: 2.25 + 1,
    },
    {
        name: "Copper Boots",
        description: "A copper boots.",
        type: "Boots",
        rarity: "common",
        price: 10,
        armor: 1.5 + 1,
    },
    {
        name: "Gold Boots",
        description: "A gold boots.",
        type: "Boots",
        rarity: "rare",
        price: 40,
        armor: 4 + 1,
    },
    {
        name: "Crystal Boots",
        description: "Ultra rare boots.",
        type: "Boots",
        rarity: "legendary",
        price: 4000,
        armor: 20 + 4,
    },
    {
        name: "Dragon Scale Boots",
        description: "Made from the scales of the scariest beast, these boots are said to be the stuff of legends.",
        type: "Boots",
        rarity: "legendary",
        price: 32000,
        armor: 20 + 1,
        crafting: {
            requiredLevel: 25,
            ingredients: {
                "Dragon Scale": 2,
                "Titanium": 1,
            },
        }
    },

    // Offhand
    {
        name: "Amulet of Luck",
        description: "A mysterious amulet which grants the user extreme luck.",
        type: "Offhand",
        rarity: "legendary",
        price: 9000,
    },

    // Weapons
    {
        name: "Wooden Sword",
        description: "A wooden sword",
        type: "Weapon",
        rarity: "common",
        price: 5,
        attack: 1,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 2,
                "Iron": 2
            }
        },
    },
    {
        name: "Iron Sword",
        description: "An iron sword",
        type: "Weapon",
        rarity: "common",
        price: 20,
        attack: 3,
        crafting: {
            requiredLevel: 5,
            ingredients: {
                "Wood": 3,
                "Iron": 6
            }
        }
    },
    {
        name: "Iron Cutlass",
        description: "An iron cutlass",
        type: "Weapon",
        rarity: "common",
        price: 20,
        attack: 3,
        crafting: {
            requiredLevel: 5,
            ingredients: {
                "Wood": 3,
                "Iron": 6
            },
        }
    },

    // Shields
    {
        name: "Iron Shield",
        description: "An iron shield",
        type: "Shield",
        rarity: "common",
        price: 20,
        armor: 4,
        crafting: {
            requiredLevel: 5,
            ingredients: {
                "Wood": 3,
                "Iron": 6
            }
        }
    },
];