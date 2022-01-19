import { EffectName } from "../../control/effects";
import { PartialRecord } from "../../util";
import equipment, { EquipmentName } from "./equipment";
import potions, { PotionName } from "./potions";
import resources, { ResourceName } from "./resources";
import tools, { ToolName } from "./tools";

export type ItemEffect = {
    name: EffectName;
    value?: number;
    delay?: number;
    duration?: number;
}

export type ItemName = EquipmentName | PotionName | ResourceName | ToolName;
export type ItemType = "Equipment" | "Potion" | "Resource" | "Tool";
export type Rarity = "common" | "uncommon" | "rare" | "legendary";
export type EquipmentSlot = "Helmet" | "Chestplate" | "Leggings" | "Boots" | "Weapon" | "Offhand" | "Ranged" | "Shield";

export type Item = {
    name: ItemName;
    iconUrl: string;
    description: string;
    type: ItemType;
    rarity?: Rarity;
    price: number;
    armor?: number;
    attack?: number;
    health?: number;
    equipment?: {
        slot: EquipmentSlot;
    }
    crafting?: {
        requiredLevel: number;
        ingredients: PartialRecord<ResourceName, number>,
    };
    treeCutting?: {
        xp: number;
    }
    fishing?: {
        xp: number;
    }
    hunting?: {
        xp: number;
    }
    mining?: {
        xp: number;
    }
    effects?: ItemEffect[];
    elementID?: string;
};

const items: Item[] = [
    ...equipment,
    ...potions,
    ...resources,
    ...tools,
];

export default items;
export const itemsByName: { [name in ItemName]: Item } = Object.assign({}, ...items.map(x => ({ [x.name]: x })));