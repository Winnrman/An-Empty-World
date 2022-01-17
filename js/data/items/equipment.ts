import { Item } from ".";

export type EquipmentName = 
        "Wooden Helmet"       | "Wooden Chestplate"       | "Wooden Leggings"       | "Wooden Boots"       | "Wooden Sword"
      | "Iron Helmet"         | "Iron Chestplate"         | "Iron Leggings"         | "Iron Boots"         | "Iron Sword" | "Iron Cutlass" | "Iron Shield"
      | "Bronze Helmet"       | "Bronze Chestplate"       | "Bronze Leggings"       | "Bronze Boots"       | "Bronze Sword"
      | "Copper Helmet"       | "Copper Chestplate"       | "Copper Leggings"       | "Copper Boots"       | "Copper Sword"
      | "Gold Helmet"         | "Gold Chestplate"         | "Gold Leggings"         | "Gold Boots"         | "Gold Sword"
      | "Crystal Helmet"      | "Crystal Chestplate"      | "Crystal Leggings"      | "Crystal Boots"      | "Crystal Sword"
      | "Dragon Scale Helmet" | "Dragon Scale Chestplate" | "Dragon Scale Leggings" | "Dragon Scale Boots" | "Dragon Scale Sword"
      | "Amulet of Luck";

export type Equipment = Omit<Item, 'name'> & { name: EquipmentName };

const equipment: Equipment[] = [
    // Wooden
    {
        name: "Wooden Helmet",
        description: "A wooden helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet"
        },
        rarity: "common",
        price: 10,
        armor: 1,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 4,
            }
        }
    },
    {
        name: "Wooden Chestplate",
        description: "A wooden chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate"
        },
        rarity: "common",
        price: 10,
        armor: 1 + 3,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 8
            }
        }
    },
    {
        name: "Wooden Leggings",
        description: "A wooden leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings"
        },
        rarity: "common",
        price: 10,
        armor: 1 + 2,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 5,
            }
        }
    },
    {
        name: "Wooden Boots",
        description: "A wooden boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots"
        },
        rarity: "common",
        price: 10,
        armor: 1 + 1,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 3,
            }
        }
    },
    {
        name: "Wooden Sword",
        description: "A wooden sword",
        type: "Equipment",
        equipment: {
            slot: "Weapon"
        },
        rarity: "common",
        price: 5,
        attack: 1,
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 5,
            }
        },
    },

    // Iron
    {
        name: "Iron Helmet",
        description: "An iron helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet"
        },
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
        name: "Iron Chestplate",
        description: "An iron chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate"
        },
        rarity: "uncommon",
        price: 20,
        armor: 2 + 3,
        crafting: {
            requiredLevel: 5,
            ingredients: {
                "Wood": 2,
                "Iron": 5
            }
        }
    },
    {
        name: "Iron Leggings",
        description: "An iron leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings"
        },
        rarity: "uncommon",
        price: 20,
        armor: 2 + 2,
        crafting: {
            requiredLevel: 5,
            ingredients: {
                "Wood": 1,
                "Iron": 3
            }
        }
    },
    {
        name: "Iron Boots",
        description: "An iron boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots"
        },
        rarity: "uncommon",
        price: 20,
        armor: 2 + 1,
        crafting: {
            requiredLevel: 5,
            ingredients: {
                "Wood": 1,
                "Iron": 3
            }
        },
    },
    {
        name: "Iron Sword",
        description: "An iron sword",
        type: "Equipment",
        equipment: {
            slot: "Weapon"
        },
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
        type: "Equipment",
        equipment: {
            slot: "Weapon"
        },
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
    {
        name: "Iron Shield",
        description: "An iron shield",
        type: "Equipment",
        equipment: {
            slot: "Shield"
        },
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

    // Bronze
    {
        name: "Bronze Helmet",
        description: "A bronze helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet"
        },
        rarity: "common",
        price: 30,
        armor: 2.25,
    },
    {
        name: "Bronze Chestplate",
        description: "A bronze chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate"
        },
        rarity: "common",
        price: 30,
        armor: 2.25 + 3,
    },
    {
        name: "Bronze Leggings",
        description: "A bronze leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings"
        },
        rarity: "common",
        price: 30,
        armor: 2.25 + 2,
    },
    {
        name: "Bronze Boots",
        description: "A bronze boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots"
        },
        rarity: "common",
        price: 30,
        armor: 2.25 + 1,
    },

    // Copper
    {
        name: "Copper Helmet",
        description: "A copper helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet"
        },
        rarity: "common",
        price: 10,
        armor: 1.5,
    },
    {
        name: "Copper Chestplate",
        description: "A copper chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate"
        },
        rarity: "common",
        price: 10,
        armor: 1.5 + 3,
    },
    {
        name: "Copper Leggings",
        description: "A copper leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings"
        },
        rarity: "common",
        price: 10,
        armor: 1.5 + 2,
    },
    {
        name: "Copper Boots",
        description: "A copper boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots"
        },
        rarity: "common",
        price: 10,
        armor: 1.5 + 1,
    },

    // Gold
    {
        name: "Gold Helmet",
        description: "A gold helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet"
        },
        rarity: "rare",
        price: 40,
        armor: 4,
    },
    {
        name: "Gold Chestplate",
        description: "A gold chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate"
        },
        rarity: "rare",
        price: 40,
        armor: 4 + 3,
    },
    {
        name: "Gold Leggings",
        description: "A gold leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings"
        },
        rarity: "rare",
        price: 40,
        armor: 4 + 2,
    },
    {
        name: "Gold Boots",
        description: "A gold boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots"
        },
        rarity: "rare",
        price: 40,
        armor: 4 + 1,
    },

    // Crystal
    {
        name: "Crystal Helmet",
        description: "Ultra rare crystal helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet"
        },
        rarity: "legendary",
        price: 2000,
        armor: 10,
    },
    {
        name: "Crystal Chestplate",
        description: "Ultra rare crystal chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate"
        },
        rarity: "legendary",
        price: 2000,
        armor: 10 + 3,
    },
    {
        name: "Crystal Leggings",
        description: "Ultra rare crystal leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings"
        },
        rarity: "legendary",
        price: 2000,
        armor: 10 + 2,
    },
    {
        name: "Crystal Boots",
        description: "Ultra rare boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots"
        },
        rarity: "legendary",
        price: 4000,
        armor: 20 + 4,
    },

    // Dragon Scale
    {
        name: "Dragon Scale Helmet",
        description: "Made from the scales of the scariest beast, this helmet is said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Helmet"
        },
        rarity: "legendary",
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
    {
        name: "Dragon Scale Chestplate",
        description: "Made from the scales of the scariest beast, this chestplate is said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate"
        },
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
    {
        name: "Dragon Scale Leggings",
        description: "Made from the scales of the scariest beast, this leggings are said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Leggings"
        },
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
    {
        name: "Dragon Scale Boots",
        description: "Made from the scales of the scariest beast, these boots are said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Boots"
        },
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
        type: "Equipment",
        equipment: {
            slot: "Offhand"
        },
        rarity: "legendary",
        price: 9000,
    },
];

export default equipment;
export const equipmentByName: { [key in EquipmentName]: Equipment } = Object.assign({}, ...equipment.map(x => ({ [x.name]: x })));