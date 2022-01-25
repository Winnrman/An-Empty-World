import { Item } from ".";
import { ResourceName } from "./resources";
import { PartialRecord } from "../../util";

import iconAxe from "../../../img/assets/tools/stone_axe.png";
import iconPickaxe from "../../../img/assets/tools/Pickaxe.png";
import iconHarpoon from "../../../img/assets/tools/Harpoon.png";
import iconStoneSpear from "../../../img/assets/tools/Stone Spear.png";
import iconFishingPole from "../../../img/assets/tools/Fishing Pole.png";
import iconHuntingRifle from "../../../img/assets/tools/Hunting Rifle.png";

export type ToolName = "Axe" | "Pickaxe" | "Wooden Harpoon" | "Stone Spear" | "Fishing Pole" | "Hunting Rifle";
export type Tool = Item & { 
    name: ToolName;
    tool: {
        health: number;
    },
    crafting?: {
        requiredLevel: number;
        ingredients: PartialRecord<ResourceName, number>,
    };
};

const tools: Tool[] = [
    {
        name: "Axe",
        iconUrl: iconAxe,
        description: "A wooden axe.",
        type: "Tool",
        price: 20,
        tool: {
            health: 20,
        },
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 2,
                "Stone": 5,
            }
        }
    },
    {
        name: "Pickaxe",
        iconUrl: iconPickaxe,
        description: "A pickaxe.",
        type: "Tool",
        price: 1200,
        tool: {
            health: 75,
        },
        crafting: {
            requiredLevel: 1,
            ingredients: {
                "Wood": 2,
                "Stone": 5,
            }
        }
    },
    {
        name: "Wooden Harpoon",
        iconUrl: iconHarpoon,
        description: "It's just a stick, really.",
        type: "Tool",
        price: 50,
        tool: {
            health: 10,
        },
        crafting: {
            requiredLevel: 2,
            ingredients: {
                "Wood": 5,
            }
        }
    },
    {
        name: "Stone Spear",
        iconUrl: iconStoneSpear,
        description: "It's just a stone on a stick, really",
        type: "Tool",
        price: 50,
        tool: {
            health: 10,
        },
        crafting: {
            requiredLevel: 3,
            ingredients: {
                "Wood": 5,
                "Stone": 2,
            }
        }
    },
    {
        name: "Fishing Pole",
        iconUrl: iconFishingPole,
        description: "A wooden fishing pole.",
        type: "Tool",
        price: 50,
        tool: {
            health: 10,
        },
    },
    {
        name: "Hunting Rifle",
        iconUrl: iconHuntingRifle,
        description: "A hunting rifle.",
        type: "Tool",
        price: 300,
        tool: {
            health: 50,
        },
    }
];

export default tools;
export const toolsByName: { [key in ToolName]: Tool } = Object.assign({}, ...tools.map(x => ({ [x.name]: x })));