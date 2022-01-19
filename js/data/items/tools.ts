import { Item } from ".";

export type ToolName = "Axe" | "Fishing Pole" | "Hunting Rifle" | "Pickaxe";
export type Tool = Omit<Item, 'name'> & { name: ToolName };

import iconAxe from "../../../img/assets/tools/stone_axe.png";
import iconFishingPole from "../../../img/assets/tools/Fishing Pole.png";
import iconHuntingRifle from "../../../img/assets/tools/Hunting Rifle.png";
import iconPickaxe from "../../../img/assets/tools/Pickaxe.png";

const tools: Tool[] = [
    {
        name: "Axe",
        iconUrl: iconAxe,
        description: "A wooden axe.",
        type: "Tool",
		elementID: "axeDurability",
        rarity: "common",
        price: 20,
        health: 20,
    },
    {
        name: "Fishing Pole",
        iconUrl: iconFishingPole,
        description: "A wooden fishing pole.",
        type: "Tool",
		elementID: "fishingPoleDurability",
        rarity: "common",
        price: 50,
        health: 10,
    },
    {
        name: "Hunting Rifle",
        iconUrl: iconHuntingRifle,
        description: "A hunting rifle.",
        type: "Tool",
		elementID: "rifleDurability",
        rarity: "common",
        price: 300,
        health: 50,
    },
    {
        name: "Pickaxe",
        iconUrl: iconPickaxe,
        description: "A pickaxe.",
        type: "Tool",
		elementID: "pickaxeDurability",
        rarity: "common",
        price: 1200,
        health: 75,
    }
];

export default tools;
export const toolsByName: { [key in ToolName]: Tool } = Object.assign({}, ...tools.map(x => ({ [x.name]: x })));