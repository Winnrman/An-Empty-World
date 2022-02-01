import iconWoodenHelmet from "../../../img/assets/equipment/Wooden/Wooden Helmet.png";
import iconWoodenChestplate from "../../../img/assets/equipment/Wooden/Wooden Chestplate.png";
import iconWoodenLeggings from "../../../img/assets/equipment/Wooden/Wooden Leggings.png";
import iconWoodenBoots from "../../../img/assets/equipment/Wooden/Wooden Boots.png";
import iconWoodenSword from "../../../img/assets/equipment/Wooden/Wooden Sword.png";
import iconIronHelmet from "../../../img/assets/equipment/Iron/Iron Helmet.png";  
import iconIronChestplate from "../../../img/assets/equipment/Iron/Iron Chestplate.png";  
import iconIronLeggings from "../../../img/assets/equipment/Iron/Iron Leggings.png";  
import iconIronBoots from "../../../img/assets/equipment/Iron/Iron Boots.png";  
import iconIronSword from "../../../img/assets/equipment/Iron/Iron Sword.png";
import iconIronCutlass from "../../../img/assets/equipment/Iron/Iron Cutlass.png";
import iconIronShield from "../../../img/assets/equipment/Iron/Iron Shield.png";
import iconBronzeHelmet from "../../../img/assets/equipment/Bronze/Bronze Helmet.png";
import iconBronzeChestplate from "../../../img/assets/equipment/Bronze/Bronze Chestplate.png";
import iconBronzeLeggings from "../../../img/assets/equipment/Bronze/Bronze Leggings.png";
import iconBronzeBoots from "../../../img/assets/equipment/Bronze/Bronze Boots.png";
import iconBronzeSword from "../../../img/assets/equipment/Bronze/Bronze Sword.png";
import iconCopperHelmet from "../../../img/assets/equipment/Copper/Copper Helmet.png";
import iconCopperChestplate from "../../../img/assets/equipment/Copper/Copper Chestplate.png";
import iconCopperLeggings from "../../../img/assets/equipment/Copper/Copper Leggings.png";
import iconCopperBoots from "../../../img/assets/equipment/Copper/Copper Boots.png";
import iconCopperSword from "../../../img/assets/equipment/Copper/Copper Sword.png";
import iconGoldHelmet from "../../../img/assets/equipment/Gold/Gold Helmet.png";  
import iconGoldChestplate from "../../../img/assets/equipment/Gold/Gold Chestplate.png";  
import iconGoldLeggings from "../../../img/assets/equipment/Gold/Gold Leggings.png";  
import iconGoldBoots from "../../../img/assets/equipment/Gold/Gold Boots.png";  
import iconGoldSword from "../../../img/assets/equipment/Gold/Gold Sword.png";
import iconCrystalHelmet from "../../../img/assets/equipment/Crystal/Crystal Helmet.png";
import iconCrystalChestplate from "../../../img/assets/equipment/Crystal/Crystal Chestplate.png";
import iconCrystalLeggings from "../../../img/assets/equipment/Crystal/Crystal Leggings.png";
import iconCrystalBoots from "../../../img/assets/equipment/Crystal/Crystal Boots.png";
import iconCrystalSword from "../../../img/assets/equipment/Crystal/Crystal Sword.png";
import iconDragonScaleHelmet from "../../../img/assets/equipment/Dragon Scale/Dragon Scale Helmet.png";
import iconDragonScaleChestplate from "../../../img/assets/equipment/Dragon Scale/Dragon Scale Chestplate.png";
import iconDragonScaleLeggings from "../../../img/assets/equipment/Dragon Scale/Dragon Scale Leggings.png";
import iconDragonScaleBoots from "../../../img/assets/equipment/Dragon Scale/Dragon Scale Boots.png";
import iconDragonScaleSword from "../../../img/assets/equipment/Dragon Scale/Dragon Scale Sword.png";
import iconAmuletofLuck from "../../../img/assets/equipment//Amulet of Luck.png";

import { EquipmentSlot, Item, Rarity } from ".";
import { ResourceName } from "./resources";
import { PartialRecord } from "../../util";

export type EquipmentName = 
        "Wooden Helmet"       | "Wooden Chestplate"       | "Wooden Leggings"       | "Wooden Boots"       | "Wooden Sword"
      | "Iron Helmet"         | "Iron Chestplate"         | "Iron Leggings"         | "Iron Boots"         | "Iron Sword" | "Iron Cutlass" | "Iron Shield"
      | "Bronze Helmet"       | "Bronze Chestplate"       | "Bronze Leggings"       | "Bronze Boots"       | "Bronze Sword"
      | "Copper Helmet"       | "Copper Chestplate"       | "Copper Leggings"       | "Copper Boots"       | "Copper Sword"
      | "Gold Helmet"         | "Gold Chestplate"         | "Gold Leggings"         | "Gold Boots"         | "Gold Sword"
      | "Crystal Helmet"      | "Crystal Chestplate"      | "Crystal Leggings"      | "Crystal Boots"      | "Crystal Sword"
      | "Dragon Scale Helmet" | "Dragon Scale Chestplate" | "Dragon Scale Leggings" | "Dragon Scale Boots" | "Dragon Scale Sword"
      | "Amulet of Luck";

export type Equipment = Item & { 
    name: EquipmentName;
    rarity: Rarity;
    equipment: {
        slot: EquipmentSlot;
        armor?: number;
        attack?: number;
    };
    crafting?: {
        requiredLevel: number;
        ingredients: PartialRecord<ResourceName, number>;
    };
};

const ResourceArmour = {
    "Wooden": 1,
    "Copper": 1.5,
    "Iron": 2,
    "Bronze": 2.25,
    "Gold": 4,
    "Crystal": 10,
    "Dragon Scale": 20,
};

const EquipmentArmour = {
    "Helmet": 0,
    "Chestplate": 3,
    "Leggings": 2,
    "Boots": 1,
    "Shield": 1
}

const equipment: Equipment[] = [
    // Wooden
    {
        name: "Wooden Helmet",
        iconUrl: iconWoodenHelmet,
        description: "A wooden helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet",
            armor: ResourceArmour.Wooden + EquipmentArmour.Helmet,
        },
        rarity: "common",
        price: 10,
        crafting: {
            requiredLevel: 3,
            ingredients: {
                "Wood": 4,
            }
        }
    },
    {
        name: "Wooden Chestplate",
        iconUrl: iconWoodenChestplate,
        description: "A wooden chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate",
            armor: ResourceArmour.Wooden + EquipmentArmour.Chestplate,
        },
        rarity: "common",
        price: 10,
        crafting: {
            requiredLevel: 3,
            ingredients: {
                "Wood": 8
            }
        }
    },
    {
        name: "Wooden Leggings",
        iconUrl: iconWoodenLeggings,
        description: "A wooden leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings",
            armor: ResourceArmour.Wooden + EquipmentArmour.Leggings,
        },
        rarity: "common",
        price: 10,
        crafting: {
            requiredLevel: 3,
            ingredients: {
                "Wood": 5,
            }
        }
    },
    {
        name: "Wooden Boots",
        iconUrl: iconWoodenBoots,
        description: "A wooden boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots",
            armor: ResourceArmour.Wooden + EquipmentArmour.Boots,
        },
        rarity: "common",
        price: 10,
        crafting: {
            requiredLevel: 3,
            ingredients: {
                "Wood": 3,
            }
        }
    },
    {
        name: "Wooden Sword",
        iconUrl: iconWoodenSword,
        description: "A wooden sword",
        type: "Equipment",
        equipment: {
            slot: "Weapon",
            attack: ResourceArmour.Wooden,
        },
        rarity: "common",
        price: 5,
        crafting: {
            requiredLevel: 3,
            ingredients: {
                "Wood": 5,
            }
        },
    },

    // Iron
    {
        name: "Iron Helmet",
        iconUrl: iconIronHelmet,
        description: "An iron helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet",
            armor: ResourceArmour.Iron + EquipmentArmour.Helmet,
        },
        rarity: "uncommon",
        price: 20,
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
        iconUrl: iconIronChestplate,
        description: "An iron chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate",
            armor: ResourceArmour.Iron + EquipmentArmour.Chestplate,
        },
        rarity: "uncommon",
        price: 20,
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
        iconUrl: iconIronLeggings,
        description: "An iron leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings",
            armor: ResourceArmour.Iron + EquipmentArmour.Leggings,
        },
        rarity: "uncommon",
        price: 20,
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
        iconUrl: iconIronBoots,
        description: "An iron boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots",
            armor: ResourceArmour.Iron + EquipmentArmour.Boots,
        },
        rarity: "uncommon",
        price: 20,
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
        iconUrl: iconIronSword,
        description: "An iron sword",
        type: "Equipment",
        equipment: {
            slot: "Weapon",
            attack: ResourceArmour.Iron,
        },
        rarity: "common",
        price: 20,
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
        iconUrl: iconIronCutlass,
        description: "An iron cutlass",
        type: "Equipment",
        equipment: {
            slot: "Weapon",
            armor: ResourceArmour.Iron,
        },
        rarity: "common",
        price: 20,
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
        iconUrl: iconIronShield,
        description: "An iron shield",
        type: "Equipment",
        equipment: {
            slot: "Shield",
            armor: ResourceArmour.Iron + EquipmentArmour.Shield,
        },
        rarity: "common",
        price: 20,
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
        iconUrl: iconBronzeHelmet,
        description: "A bronze helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet",
            armor: ResourceArmour.Bronze + EquipmentArmour.Helmet,
        },
        rarity: "common",
        price: 30,
    },
    {
        name: "Bronze Chestplate",
        iconUrl: iconBronzeChestplate,
        description: "A bronze chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate",
            armor: ResourceArmour.Bronze + EquipmentArmour.Chestplate,
        },
        rarity: "common",
        price: 30,
    },
    {
        name: "Bronze Leggings",
        iconUrl: iconBronzeLeggings,
        description: "A bronze leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings",
            armor: ResourceArmour.Bronze + EquipmentArmour.Leggings,
        },
        rarity: "common",
        price: 30,
    },
    {
        name: "Bronze Boots",
        iconUrl: iconBronzeBoots,
        description: "A bronze boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots",
            armor: ResourceArmour.Bronze + EquipmentArmour.Boots,
        },
        rarity: "common",
        price: 30,
    },

    // Copper
    {
        name: "Copper Helmet",
        iconUrl: iconCopperHelmet,
        description: "A copper helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet",
            armor: ResourceArmour.Copper + EquipmentArmour.Helmet,
        },
        rarity: "common",
        price: 10,
    },
    {
        name: "Copper Chestplate",
        iconUrl: iconCopperChestplate,
        description: "A copper chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate",
            armor: ResourceArmour.Copper + EquipmentArmour.Chestplate,
        },
        rarity: "common",
        price: 10,
    },
    {
        name: "Copper Leggings",
        iconUrl: iconCopperLeggings,
        description: "A copper leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings",
            armor: ResourceArmour.Copper + EquipmentArmour.Leggings,
        },
        rarity: "common",
        price: 10,
    },
    {
        name: "Copper Boots",
        iconUrl: iconCopperBoots,
        description: "A copper boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots",
            armor: ResourceArmour.Copper + EquipmentArmour.Boots,
        },
        rarity: "common",
        price: 10,
    },

    // Gold
    {
        name: "Gold Helmet",
        iconUrl: iconGoldHelmet,
        description: "A gold helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet",
            armor: ResourceArmour.Gold + EquipmentArmour.Helmet,
        },
        rarity: "rare",
        price: 40,
    },
    {
        name: "Gold Chestplate",
        iconUrl: iconGoldChestplate,
        description: "A gold chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate",
            armor: ResourceArmour.Gold + EquipmentArmour.Chestplate,
        },
        rarity: "rare",
        price: 40,
    },
    {
        name: "Gold Leggings",
        iconUrl: iconGoldLeggings,
        description: "A gold leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings",
            armor: ResourceArmour.Gold + EquipmentArmour.Leggings,
        },
        rarity: "rare",
        price: 40,
    },
    {
        name: "Gold Boots",
        iconUrl: iconGoldBoots,
        description: "A gold boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots",
            armor: ResourceArmour.Gold + EquipmentArmour.Boots,
        },
        rarity: "rare",
        price: 40,
    },

    // Crystal
    {
        name: "Crystal Helmet",
        iconUrl: iconCrystalHelmet,
        description: "Ultra rare crystal helmet.",
        type: "Equipment",
        equipment: {
            slot: "Helmet",
            armor: ResourceArmour.Crystal + EquipmentArmour.Helmet,
        },
        rarity: "legendary",
        price: 2000,
    },
    {
        name: "Crystal Chestplate",
        iconUrl: iconCrystalChestplate,
        description: "Ultra rare crystal chestplate.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate",
            armor: ResourceArmour.Crystal + EquipmentArmour.Chestplate,
        },
        rarity: "legendary",
        price: 2000,
    },
    {
        name: "Crystal Leggings",
        iconUrl: iconCrystalLeggings,
        description: "Ultra rare crystal leggings.",
        type: "Equipment",
        equipment: {
            slot: "Leggings",
            armor: ResourceArmour.Crystal + EquipmentArmour.Leggings,
        },
        rarity: "legendary",
        price: 2000,
    },
    {
        name: "Crystal Boots",
        iconUrl: iconCrystalBoots,
        description: "Ultra rare boots.",
        type: "Equipment",
        equipment: {
            slot: "Boots",
            armor: ResourceArmour.Crystal + EquipmentArmour.Boots,
        },
        rarity: "legendary",
        price: 4000,
    },

    // Dragon Scale
    {
        name: "Dragon Scale Helmet",
        iconUrl: iconDragonScaleHelmet,
        description: "Made from the scales of the scariest beast, this helmet is said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Helmet",
            armor: ResourceArmour["Dragon Scale"] + EquipmentArmour.Helmet,
        },
        rarity: "legendary",
        price: 32000,
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
        iconUrl: iconDragonScaleChestplate,
        description: "Made from the scales of the scariest beast, this chestplate is said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Chestplate",
            armor: ResourceArmour["Dragon Scale"] + EquipmentArmour.Chestplate,
        },
        rarity: "legendary",
        price: 32000,
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
        iconUrl: iconDragonScaleLeggings,
        description: "Made from the scales of the scariest beast, this leggings are said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Leggings",
            armor: ResourceArmour["Dragon Scale"] + EquipmentArmour.Leggings,
        },
        rarity: "legendary",
        price: 32000,
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
        iconUrl: iconDragonScaleBoots,
        description: "Made from the scales of the scariest beast, these boots are said to be the stuff of legends.",
        type: "Equipment",
        equipment: {
            slot: "Boots",
            armor: ResourceArmour["Dragon Scale"] + EquipmentArmour.Boots,
        },
        rarity: "legendary",
        price: 32000,
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
        iconUrl: iconAmuletofLuck,
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