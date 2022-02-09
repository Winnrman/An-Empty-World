import { DurationEffectName, ImmediateEffectName } from "../../control/effects";
import { EquipmentName } from "./equipment";
import { PotionName } from "./potions";
import { ResourceName } from "./resources";
import { ToolName } from "./tools";

export type ImmediateItemEffect = {
    name: ImmediateEffectName;
    value: number;
    duration?: undefined
}

export type DurationItemEffect = {
    name: DurationEffectName;
    value: number;
    duration: number;
}

export type ItemEffect = ImmediateItemEffect | DurationItemEffect;

export type ItemName = EquipmentName | PotionName | ResourceName | ToolName;
export type ItemType = "Equipment" | "Potion" | "Resource" | "Tool";
export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export type Item = {
    name: ItemName;
    iconUrl: string;
    description: string;
    type: ItemType;
    price: number;
};