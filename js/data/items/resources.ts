import { Item } from ".";

export type MiningResourceName = "Iron" | "Copper" | "Tin" | "Silver" | "Gold" | "Emerald" | "Ruby" | "Diamond" | "Stone" | "Titanium";
export type ResourceName = "Wood" | "Fish" | "Meat" | MiningResourceName | "Dragon Scale";

export type Resource = Omit<Item, 'name'> & { name: ResourceName };

const resources: Resource[] = [
    {
        name: "Wood",
        type: "Resource",
        price: 5,
        treeCutting: {
            xp: 10,
        },
    },
    {
        name: "Fish",
        type: "Resource",
        price: 10,
        fishing: {
            xp: 15,
        },
    },
    {
        name: "Meat",
        type: "Resource",
        price: 20,
        hunting: {
            xp: 50,
        },
    },
    {
        name: "Iron",
        type: "Resource",
        price: 120,
        mining: {
            xp: 110,
        },
    },
    {
        name: "Copper",
        type: "Resource",
        price: 125,
        mining: {
            xp: 112,
        },
    },
    {
        name: "Tin",
        type: "Resource",
        price: 115,
        mining: {
            xp: 113,
        },
    },
    {
        name: "Silver",
        type: "Resource",
        price: 150,
        mining: {
            xp: 119,
        },
    },
    {
        name: "Gold",
        type: "Resource",
        price: 125,
        mining: {
            xp: 125,
        },
    },
    {
        name: "Emerald",
        type: "Resource",
        price: 130,
        mining: {
            xp: 130,
        },
    },
    {
        name: "Ruby",
        type: "Resource",
        price: 160,
        mining: {
            xp: 150,
        },
    },
    {
        name: "Diamond",
        type: "Resource",
        price: 1100,
        mining: {
            xp: 200,
        },
    },
    {
        name: "Stone",
        type: "Resource",
        price: 5,
        mining: {
            xp: 5,
        },
    },
];

export default resources;
export const resourcesByName: { [key in ResourceName]: Resource } = Object.assign({}, ...resources.map(x => ({ [x.name]: x })));