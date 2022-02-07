import { Item } from ".";
import { PartialRecord } from "../../util";
import { GatheringCategoryName } from "../../activities/gathering";
import { StatisticName } from "../../control/player";

import iconIron from "../../../img/assets/materials/Iron.png";
import iconCopper from "../../../img/assets/materials/Copper.png";
import iconTin from "../../../img/assets/materials/Tin.png";
import iconSilver from "../../../img/assets/materials/Silver.png";
import iconGold from "../../../img/assets/materials/Gold.png";
import iconEmerald from "../../../img/assets/materials/Emerald.png";
import iconRuby from "../../../img/assets/materials/Ruby.png";
import iconDiamond from "../../../img/assets/materials/Diamond.png";
import iconStone from "../../../img/assets/materials/Stone.png";
import iconTitanium from "../../../img/assets/materials/Titanium.png";
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

export type MiningResourceName = "Iron" | "Copper" | "Tin" | "Silver" | "Gold" | "Emerald" | "Ruby" | "Diamond" | "Stone" | "Titanium";
export type HerbResourceName = "Monofolia" | "Bifolia" | "Trifolia" | "Crimsonica" | "Azurica" | "Okerica";
export type ResourceName = "Wood" | "Fish" | "Meat" | MiningResourceName | HerbResourceName | "Dragon Scale";

export type Resource = Item & { 
    name: ResourceName;
    gathering: PartialRecord<GatheringCategoryName, {
        experience: number,
        statistic?: StatisticName
    }>
};

const resources: Resource[] = [
    {
        name: "Wood",
        iconUrl: iconWood,
        type: "Resource",
        description: "Wood you got by hurting a tree. Hurting it more will probably give you more wood.",
        price: 5,
        gathering: {
            "Wood": { experience: 10, },
        },
    },
    {
        name: "Fish",
        iconUrl: iconFish,
        type: "Resource",
        description: "A fish. You're not sure whether it's dead or alive.",
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
        description: "You managed to find a weak animal and decided it had lived long enough. This is what remains.",
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
        description: "You cannot figure out how this material is supposed to protect you, but add wood to it and somehow it does!",
        price: 120,
        gathering: {
            "Ore": { experience: 110, },
        },
    },
    {
        name: "Copper",
        iconUrl: iconCopper,
        type: "Resource",
        description: "This looks like it might make some better armour than Iron",
        price: 125,
        gathering: {
            "Ore": { experience: 112, },
        },
    },
    {
        name: "Tin",
        iconUrl: iconTin,
        type: "Resource",
        description: "According to other games you can combine this with Copper to get Bronze. Let's find out if they are right?",
        price: 115,
        gathering: {
            "Ore": { experience: 113, },
        },
    },
    {
        name: "Silver",
        iconUrl: iconSilver,
        type: "Resource",
        description: "This doesn't seem very useful, unless you were being hunted by a werewolf. Which you are not, we promise! Or not?",
        price: 150,
        gathering: {
            "Ore": { experience: 119, },
        },
    },
    {
        name: "Gold",
        iconUrl: iconGold,
        type: "Resource",
        description: "You'd think this can't make good armour, but you'd be wrong",
        price: 125,
        gathering: {
            "Ore": { experience: 125, },
        },
    },
    {
        name: "Emerald",
        iconUrl: iconEmerald,
        type: "Resource",
        description: "A nice gem shining with a nice green colour. If only you could see things in this game!",
        price: 130,
        gathering: {
            "Ore": { experience: 130, },
        },
    },
    {
        name: "Ruby",
        iconUrl: iconRuby,
        type: "Resource",
        description: "The Kaiser Chiefs seem to really like these. Maybe they'll give you a good price for it!",
        price: 160,
        gathering: {
            "Ore": { experience: 150, },
        },
    },
    {
        name: "Diamond",
        iconUrl: iconDiamond,
        type: "Resource",
        description: "This would be great to put on a ring and give to your significant other. If only it wasn't virtual.",
        price: 1100,
        gathering: {
            "Ore": { experience: 200, },
        },
    },
    {
        name: "Stone",
        iconUrl: iconStone,
        type: "Resource",
        description: "A popular method of execution, according to the bible.",
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