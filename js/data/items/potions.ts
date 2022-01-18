import { Item } from ".";

export type PotionName = 
        "Potion of Healing" | "Potion of Strength" | "Potion of Harming"  | "Potion of Defense" 
      | "Potion of Stamina" | "Potion of Speed" | "Potion of Invisibility";

export type Potion = Omit<Item, 'name'> & { name: PotionName };

const potions: Potion[] = [
    {
        name: "Potion of Healing",
        type: "Potion",
        description: "Heals you for a small amount of health.",
        rarity: "common",
        price: 10,
        effects: [ { name: "addHealth", value: 10, } ],
        crafting: {
            requiredLevel: 1,
            ingredients: {}
        },
    },
    {
        name: "Potion of Strength",
        type: "Potion",
        description: "Increases your attack by 1.",
        rarity: "common",
        price: 10,
        effects: [{ name: "addAttack", value: 1, duration: 60000, }],
        crafting: {
            requiredLevel: 1,
            ingredients: {}
        },
    },
    {
        name: "Potion of Harming",
        type: "Potion",
        description: "Decreases your attack by 2.",
        rarity: "uncommon",
        price: 20,
        effects: [{ name: "decreaseAttack", value: 2, duration: 15000, }],
        crafting: {
            requiredLevel: 1,
            ingredients: {}
        },
    },
    {
        name: "Potion of Defense",
        type: "Potion",
        description: "Increases your defense by 1.",
        rarity: "common",
        price: 10,
        effects: [{ name: "addDefense", value: 1, duration: 60000, }],
        crafting: {
            requiredLevel: 1,
            ingredients: {}
        },
    },
    {
        name: "Potion of Stamina",
        type: "Potion",
        description: "Increases your stamina by 10.",
        rarity: "common",
        price: 10,
        effects: [{ name: "addStamina", value: 10, }],
        crafting: {
            requiredLevel: 1,
            ingredients: {}
        },
    },
    {
        name: "Potion of Speed",
        type: "Potion",
        description: "Increases your speed by 1, allowing you to escape from bandits and bad situations with ease.",
        rarity: "rare",
        price: 10,
        effects: [{ name: "addSpeed", value: 1, duration: 60000, }],
        crafting: {
            requiredLevel: 1,
            ingredients: {}
        },
    },
    {
        name: "Potion of Invisibility",
        type: "Potion",
        description: "Makes you invisible, allowing you to sneak past enemies and avoid being seen.",
        rarity: "legendary",
        price: 10,
        effects: [{ name: "makeInvisible", duration: 25000, }],
        crafting: {
            requiredLevel: 1,
            ingredients: {}
        },
    },
];

export default potions;
export const potionsByName: { [key in PotionName]: Potion } = Object.assign({}, ...potions.map(x => ({ [x.name]: x })));