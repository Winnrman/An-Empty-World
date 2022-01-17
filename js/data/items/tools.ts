import { Item } from ".";

export type ToolName = "Axe" | "Fishing Pole" | "Hunting Rifle" | "Pickaxe";
export type Tool = Omit<Item, 'name'> & { name: ToolName };

const tools: Tool[] = [
    {
        name: "Axe",
        description: "A wooden axe.",
        type: "Tool",
		elementID: "axeDurability",
        rarity: "common",
        price: 20,
        health: 20,
    },
    {
        name: "Fishing Pole",
        description: "A wooden fishing pole.",
        type: "Tool",
		elementID: "fishingPoleDurability",
        rarity: "common",
        price: 50,
        health: 10,
    },
    {
        name: "Hunting Rifle",
        description: "A hunting rifle.",
        type: "Tool",
		elementID: "rifleDurability",
        rarity: "common",
        price: 300,
        health: 50,
    },
    {
        name: "Pickaxe",
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