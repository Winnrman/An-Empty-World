import iconPotionofHealing from "../../../img/assets/potions/Potion of Healing.png";
import iconPotionofStrength from "../../../img/assets/potions/Potion of Strength.png";
import iconPotionofHarming from "../../../img/assets/potions/Potion of Harming.png";
import iconPotionofDefense from "../../../img/assets/potions/Potion of Defense.png";
import iconPotionofStamina from "../../../img/assets/potions/Potion of Stamina.png";
import iconPotionofSpeed from "../../../img/assets/potions/Potion of Speed.png";
import iconPotionofInvisibility from "../../../img/assets/potions/Potion of Invisibility.png";

import { Item, ItemEffect, Rarity } from ".";
import { ResourceName } from "./resources";
import { PartialRecord } from "../../util";

export type PotionName = 
        "Potion of Healing" | "Potion of Strength" | "Potion of Harming"  | "Potion of Defense" 
      | "Potion of Stamina" | "Potion of Speed" | "Potion of Invisibility";

export type Potion = Item & {
    name: PotionName,
    rarity: Rarity;
    crafting: {
        requiredLevel: number;
        ingredients: PartialRecord<ResourceName, number>,
    };
    effects: ItemEffect[];
};

const potions: Potion[] = [
    {
        name: "Potion of Healing",
        iconUrl: iconPotionofHealing,
        type: "Potion",
        description: "Heals you for a small amount of health.",
        rarity: "common",
        price: 10,
        effects: [ { name: "addHealth", value: 10, } ],
        crafting: {
            requiredLevel: 5,
            ingredients: {
                Monofolia: 5,
                Crimsonica: 1,
            }
        },
    },
    {
        name: "Potion of Strength",
        iconUrl: iconPotionofStrength,
        type: "Potion",
        description: "Increases your attack by 1.",
        rarity: "common",
        price: 10,
        effects: [{ name: "addAttack", value: 1, duration: 60000, }],
        crafting: {
            requiredLevel: 5,
            ingredients: {
                Monofolia: 2,
                Bifolia: 3,
                Okerica: 1,
            }
        },
    },
    {
        name: "Potion of Harming",
        iconUrl: iconPotionofHarming,
        type: "Potion",
        description: "Decreases your attack by 2.",
        rarity: "uncommon",
        price: 20,
        effects: [{ name: "decreaseAttack", value: 2, duration: 15000, }],
        crafting: {
            requiredLevel: 5,
            ingredients: {
                Monofolia: 2,
                Bifolia: 3,
                Crimsonica: 1,
            }
        },
    },
    {
        name: "Potion of Defense",
        iconUrl: iconPotionofDefense,
        type: "Potion",
        description: "Increases your defense by 1.",
        rarity: "common",
        price: 10,
        effects: [{ name: "addDefense", value: 1, duration: 60000, }],
        crafting: {
            requiredLevel: 5,
            ingredients: {
                Monofolia: 2,
                Trifolia: 2,
                Azurica: 1,
            }
        },
    },
    {
        name: "Potion of Stamina",
        iconUrl: iconPotionofStamina,
        type: "Potion",
        description: "Increases your stamina by 10.",
        rarity: "common",
        price: 10,
        effects: [{ name: "addStamina", value: 10, }],
        crafting: {
            requiredLevel: 5,
            ingredients: {
                Trifolia: 3,
                Azurica: 1,
            }
        },
    },
    {
        name: "Potion of Speed",
        iconUrl: iconPotionofSpeed,
        type: "Potion",
        description: "Increases your speed by 1, allowing you to escape from bandits and bad situations with ease.",
        rarity: "rare",
        price: 10,
        effects: [{ name: "addSpeed", value: 1, duration: 60000, }],
        crafting: {
            requiredLevel: 5,
            ingredients: {
                Bifolia: 2,
                Trifolia: 1,
                Crimsonica: 1,
            }
        },
    },
    {
        name: "Potion of Invisibility",
        iconUrl: iconPotionofInvisibility,
        type: "Potion",
        description: "Makes you invisible, allowing you to sneak past enemies and avoid being seen.",
        rarity: "legendary",
        price: 10,
        effects: [{ name: "makeInvisible", duration: 25000, value: 1 }],
        crafting: {
            requiredLevel: 5,
            ingredients: {
                Trifolia: 3,
                Azurica: 1,
                Crimsonica: 1,
                Okerica: 1,
            }
        },
    },
];

export default potions;
export const potionsByName: { [key in PotionName]: Potion } = Object.assign({}, ...potions.map(x => ({ [x.name]: x })));