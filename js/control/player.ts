import { AchievementName, checkAchievements } from './achievements';
import { EquipmentSlot } from '../data/items';
import { PlayerEffect } from './effects';
import { EquipmentName } from '../data/items/equipment';
import { ToolName } from '../data/items/tools';
import { InventoryItemName, renderInventory } from './inventory';
import { PartialRecord } from '../util';
import { Activity } from '../activities/activities';
import { Craftable } from '../activities/crafting';
import { GatheringActivityName, GatheringCategoryName } from '../activities/gathering';

export type Player = ReturnType<typeof getPlayerData>;
const player: Player = getPlayerData();

// temporary fixes so other developers don't need to reset their data
if (!player.completedAchievements) player.completedAchievements = {};
if (!player.ownedEquipment.length) player.ownedEquipment = [];
if (!player.statistics) player.statistics = {
    cutWood: 0,
    caughtFish: 0,
    huntedMeat: 0,
    minedRocks: 0,
    killedEnemies: 0,
    completedQuests: 0,
    earnedGold: 0
};
if (!player.effects) player.effects = [];

export default player;

let isAllowedToSave = true;

export function saveData() {
    if (isAllowedToSave) {
        localStorage["player"] = JSON.stringify(player);
    }
}

function getPlayerData() {
    return localStorage["player"] ? parsePlayer(localStorage["player"]) : getDefaultData();
}

function parsePlayer(data: string): ReturnType<typeof getDefaultData> {

    const parseJsonValue = function (key: string, value: unknown) {
        // by default, Date gets converted to a string but not back again
        // so if a string looks like a Date, turn it into a Date again
        // found on https://stackoverflow.com/a/23691273
        
        if (typeof value !== 'string')
            return value;

        const ISODateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        if (ISODateRegex.exec(value)) {
            return new Date(value);
        }

        const MicrosoftDateRegex = /^\/Date\((d|-|.*)\)[\/|\\]$/;
        const regexResult = MicrosoftDateRegex.exec(value);
        if (regexResult) {
            const b = regexResult[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
        
        return value;
    };

    return JSON.parse(localStorage["player"], parseJsonValue);
}

export function resetData(data?: Player | undefined) {
    data ??= getDefaultData();
    Object.assign(player, data);
}

export function restoreData() {
    resetData(getPlayerData());
}

export type StatisticName = "cutWood" | "caughtFish" | "huntedMeat" | "minedRocks" | "killedEnemies" | "completedQuests" | "earnedGold"

export function getDefaultData() {
    return {
        xp: 0,
        level: 1,
        boughtInventoryUpgrade: 0,
        inventory: {} as PartialRecord<InventoryItemName, number>,
        gold: 0,
        maxInventorySize: 25,
        maxStamina: 25,
        stamina: 25,

        ownedEquipment: [] as EquipmentName[],
        equipment: {} as PartialRecord<EquipmentSlot, EquipmentName | undefined>,

        toolHealth: {} as Record<ToolName, number>,

        playerHealth: 100,
        maxHealth: 100,
        playerAttack: 1,
        playerDefense: 1,
        playerSpeed: 1,
        armorBonus: 0,

        effects: [] as PlayerEffect[],

        statistics: {} as PartialRecord<StatisticName, number>,

        completedAchievements: {} as PartialRecord<AchievementName, number>,

        currentActivity: "Crafting" as Activity,
        currentGatheringCategory: undefined as GatheringCategoryName | undefined,
        currentGatheringActivity: undefined as GatheringActivityName | undefined,
        currentGatheringActivityId: undefined as number | undefined,
        selectedItemName: undefined as InventoryItemName | undefined,
        selectedCraftable: undefined as Craftable | undefined,
        selectedEquipmentSlot: undefined as EquipmentSlot | undefined,
        selectedEquipment: undefined as EquipmentName | undefined,
    }
}

export function addGold(value: number) {
    player.gold += value;
    addStatistic("earnedGold", value);

    renderInventory();
}

export function removeGold(value: number) {
    player.gold = Math.max(0, player.gold - value);
    renderInventory();
}

export function addStatistic(type: StatisticName, amount: number) {
    player.statistics[type] = (player.statistics[type] ?? 0) + amount;
    setTimeout(checkAchievements);
}

export let saveInterval: NodeJS.Timer | undefined;
export function resumeSaving() {
    isAllowedToSave = true;
    if (!saveInterval)
        saveInterval = setInterval(saveData, 5000);
}
export function pauseSaving() {
    isAllowedToSave = false;
    saveInterval && clearInterval(saveInterval);
    saveInterval = undefined;
}