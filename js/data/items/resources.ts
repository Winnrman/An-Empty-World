import { Item } from ".";
import { PartialRecord } from "../../util";
import { StatisticName } from "../../control/statistics";
import { GatheringCategoryName } from "../../activities/gathering";

import iconIron from "../../../img/assets/materials/Iron.png";
import iconCopper from "../../../img/assets/materials/Copper.png";
import iconTin from "../../../img/assets/materials/Tin.png";
import iconSilver from "../../../img/assets/materials/Silver.png";
import iconGold from "../../../img/assets/materials/Gold.png";
import iconEmerald from "../../../img/assets/materials/Emerald.png";
import iconRuby from "../../../img/assets/materials/Ruby.png";
import iconDiamond from "../../../img/assets/materials/Diamond.png";
import iconStone from "../../../img/assets/materials/Stone.png";
import iconWood from "../../../img/assets/materials/Wood.png";
import iconFish from "../../../img/assets/materials/Fish.png";
import iconMeat from "../../../img/assets/materials/Meat.png"; 
import iconDragonScale from "../../../img/assets/materials/Dragon Scale.png";
import iconMonofolia from "../../../img/assets/materials/Monofolia.png";
import iconBifolia from "../../../img/assets/materials/Bifolia.png";
import iconTrifolia from "../../../img/assets/materials/Trifolia.png";
import iconCrimsonica from "../../../img/assets/materials/Crimsonica.png";
import iconAzurica from "../../../img/assets/materials/Azurica.png";
import iconOkerica from "../../../img/assets/materials/Okerica.png";
import iconBranch from "../../../img/assets/materials/wood-stick.png";

export type MiningResourceName = "Iron" | "Copper" | "Tin" | "Silver" | "Gold" | "Emerald" | "Ruby" | "Diamond" | "Stone" | "Titanium";
export type HerbResourceName = "Monofolia" | "Bifolia" | "Trifolia" | "Crimsonica" | "Azurica" | "Okerica";
export type ResourceName = "Branch" | "Wood" | "Fish" | "Meat" | MiningResourceName | HerbResourceName | "Dragon Scale";

export type Resource = Item & { 
    name: ResourceName;
    gathering: PartialRecord<GatheringCategoryName, {
        experience: number,
        statistic?: StatisticName
    }>
};

const resources: Resource[] = [
    {
        name: "Branch",
        iconUrl: iconBranch,
        type: "Resource",
        description: "A small branch. Not very interesting.",
        price: 5,
        gathering: {
            "Wood": { experience: 5, },
        },
    },
    {
        name: "Wood",
        iconUrl: iconWood,
        type: "Resource",
        description: "A piece of wood. Can be crafted into crude tools, breaks easily.",
        price: 5,
        gathering: {
            "Wood": { experience: 10, },
        },
    },
    {
        name: "Fish",
        iconUrl: iconFish,
        type: "Resource",
        description: "A fish. Obtained by fishing in the water. Delicious when cooked.",
        price: 10,
        gathering: {
            "Food": {
                experience: 15,
                statistic: "caughtFish",
            },
        },
    },
    {
        name: "Meat",
        iconUrl: iconMeat,
        type: "Resource",
        description: "Meat of some animal. Can be cooked into food.",
        price: 20,
        gathering: {
            "Food": {
                experience: 50,
                statistic: "huntedMeat",
            },
        },
    },
    {
        name: "Iron",
        iconUrl: iconIron,
        type: "Resource",
        description: "Iron mined from the ground. Can be used to craft strong tools.",
        price: 120,
        gathering: {
            "Ore": { experience: 110, },
        },
    },
    {
        name: "Copper",
        iconUrl: iconCopper,
        type: "Resource",
        description: "Material used to make coins, and to make bronze armor and weapons.",
        price: 125,
        gathering: {
            "Ore": { experience: 112, },
        },
    },
    {
        name: "Tin",
        iconUrl: iconTin,
        type: "Resource",
        description: "Not a very strong material, but can be used to make crude armor and weapons.",
        price: 115,
        gathering: {
            "Ore": { experience: 113, },
        },
    },
    {
        name: "Silver",
        iconUrl: iconSilver,
        type: "Resource",
        description: "More valuable as a coin than as a metal used for armor, but it can be used to make silver armor and weapons.",
        price: 150,
        gathering: {
            "Ore": { experience: 119, },
        },
    },
    {
        name: "Gold",
        iconUrl: iconGold,
        type: "Resource",
        description: "One of the weakest metals, this serves better as a coin than as armor.",
        price: 125,
        gathering: {
            "Ore": { experience: 125, },
        },
    },
    {
        name: "Emerald",
        iconUrl: iconEmerald,
        type: "Resource",
        description: "A nice gem shining with a nice green color.",
        price: 130,
        gathering: {
            "Ore": { experience: 130, },
        },
    },
    {
        name: "Ruby",
        iconUrl: iconRuby,
        type: "Resource",
        description: "A nice gem shining with a red color.",
        price: 160,
        gathering: {
            "Ore": { experience: 150, },
        },
    },
    {
        name: "Diamond",
        iconUrl: iconDiamond,
        type: "Resource",
        description: "The rarest of materials, can only be mined from the ground, and is practically indestructible.",
        price: 1100,
        gathering: {
            "Ore": { experience: 200, },
        },
    },
    {
        name: "Stone",
        iconUrl: iconStone,
        type: "Resource",
        description: "A stone, picked up from off the ground or mined. Can be used to make basic stone weapons.",   
        price: 5,
        gathering: {
            "Stone": { experience: 5 },
        },
    },
    {
        name: "Dragon Scale",
        iconUrl: iconDragonScale,
        type: "Resource",
        description: "Scales you found on a dragon.",
        price: 500,
        gathering: { },
    },
    {
        name: "Monofolia",
        iconUrl: iconMonofolia,
        type: "Resource",
        description: "A herb with one leaf.",
        price: 10,
        gathering: {
            Herb: { experience: 10 }
        },
    },
    {
        name: "Bifolia",
        iconUrl: iconBifolia,
        type: "Resource",
        description: "A herb with two leaves.",
        price: 20,
        gathering: {
            Herb: { experience: 20 }
        },
    },
    {
        name: "Trifolia",
        iconUrl: iconTrifolia,
        type: "Resource",
        description: "A herb with three leaves.",
        price: 30,
        gathering: {
            Herb: { experience: 30 }
        },
    },
    {
        name: "Crimsonica",
        iconUrl: iconCrimsonica,
        type: "Resource",
        description: "A herb with red leaves.",
        price: 30,
        gathering: {
            Herb: { experience: 30 }
        },
    },
    {
        name: "Azurica",
        iconUrl: iconAzurica,
        type: "Resource",
        description: "A herb with blue leaves.",
        price: 30,
        gathering: {
            Herb: { experience: 30 }
        },
    },
    {
        name: "Okerica",
        iconUrl: iconOkerica,
        type: "Resource",
        description: "A with yellow leaves.",
        price: 30,
        gathering: {
            Herb: { experience: 30 }
        },
    },
];

export default resources;
export const resourcesByName: { [key in ResourceName]: Resource } = Object.assign({}, ...resources.map(x => ({ [x.name]: x })));