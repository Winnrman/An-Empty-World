import { Item } from ".";

export type MiningResourceName = "Iron" | "Copper" | "Tin" | "Silver" | "Gold" | "Emerald" | "Ruby" | "Diamond" | "Stone" | "Titanium";
export type ResourceName = "Wood" | "Fish" | "Meat" | MiningResourceName | "Dragon Scale";

export type Resource = Omit<Item, 'name'> & { name: ResourceName };

const resources: Resource[] = [
    {
        name: "Wood",
        type: "Resource",
        description: "Wood you got by hurting a tree. Hurting it more will probably give you more wood.",
        price: 5,
        treeCutting: {
            xp: 10,
        },
    },
    {
        name: "Fish",
        type: "Resource",
        description: "A fish. You're not sure whether it's dead or alive.",
        price: 10,
        fishing: {
            xp: 15,
        },
    },
    {
        name: "Meat",
        type: "Resource",
        description: "You managed to find a weak animal and decided it had lived long enough. This is what remains.",
        price: 20,
        hunting: {
            xp: 50,
        },
    },
    {
        name: "Iron",
        type: "Resource",
        description: "You cannot figure out how this material is supposed to protect you, but add wood to it and somehow it does!",
        price: 120,
        mining: {
            xp: 110,
        },
    },
    {
        name: "Copper",
        type: "Resource",
        description: "This looks like it might make some better armour than Iron",
        price: 125,
        mining: {
            xp: 112,
        },
    },
    {
        name: "Tin",
        type: "Resource",
        description: "According to other games you can combine this with Copper to get Bronze. Let's find out if they are right?",
        price: 115,
        mining: {
            xp: 113,
        },
    },
    {
        name: "Silver",
        type: "Resource",
        description: "This doesn't seem very useful, unless you were being hunted by a werewolf. Which you are not, we promise! Or not?",
        price: 150,
        mining: {
            xp: 119,
        },
    },
    {
        name: "Gold",
        type: "Resource",
        description: "You'd think this can't make good armour, but you'd be wrong",
        price: 125,
        mining: {
            xp: 125,
        },
    },
    {
        name: "Emerald",
        type: "Resource",
        description: "A nice gem shining with a nice green colour. If only you could see things in this game!",
        price: 130,
        mining: {
            xp: 130,
        },
    },
    {
        name: "Ruby",
        type: "Resource",
        description: "The Kaiser Chiefs seem to really like these. Maybe they'll give you a good price for it!",
        price: 160,
        mining: {
            xp: 150,
        },
    },
    {
        name: "Diamond",
        type: "Resource",
        description: "This would be great to put on a ring and give to your significant other. If only it wasn't virtual.",
        price: 1100,
        mining: {
            xp: 200,
        },
    },
    {
        name: "Stone",
        type: "Resource",
        description: "A popular method of execution, according to the bible.",
        price: 5,
        mining: {
            xp: 5,
        },
    },
];

export default resources;
export const resourcesByName: { [key in ResourceName]: Resource } = Object.assign({}, ...resources.map(x => ({ [x.name]: x })));