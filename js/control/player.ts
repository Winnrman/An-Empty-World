import { checkAchievements } from './achievements';
import * as dom from '../util/dom';
import { EquipmentSlot } from '../data/items';
import { PlayerEffect } from './effects';
import { EquipmentName } from '../data/items/equipment';
import { ToolName } from '../data/items/tools';
import { InventoryItemName } from './inventory';
import { PartialRecord } from '../util';
import { Activity } from '../activities/activities';

const player = getPlayerData();
export type Player = typeof player;

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

export function saveData() {
    localStorage["player"] = JSON.stringify(player);
}

function getPlayerData() {
    return (localStorage["player"] && parsePlayer(localStorage["player"])) ?? getDefaultData();
}

function parsePlayer(data: string): ReturnType<typeof getDefaultData> {

    const parseJsonValue = function (key, value) {
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
            var b = regexResult[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
        
        return value;
    };

    return JSON.parse(localStorage["player"], parseJsonValue);
}

export function resetData(data?) {
    data ??= getDefaultData();
    for (let key in data)
        player[key] = data[key];
}

export function restoreData() {
    resetData(getPlayerData());
}

export function getDefaultData() {
    return {
        xp: 0,
        level: 1,
        boughtInventoryUpgrade: 0,
        inventory_dictionary: {} as PartialRecord<InventoryItemName, number | undefined>,
        gold: 100,
        maxInventorySize: 25,
        maxStamina: 25,
        stamina: 25,

        ownedEquipment: [] as EquipmentName[],
        equipment: {} as PartialRecord<EquipmentSlot, EquipmentName | undefined>,

        toolHealth: {
            "Axe": 20,
            "Fishing Pole": 10,
            "Hunting Rifle": 50,
            "Pickaxe": 75,
        } as PartialRecord<ToolName, number>,

        playerHealth: 100,
        maxHealth: 100,
        playerAttack: 1,
        playerDefense: 1,
        playerSpeed: 1,
        armorBonus: 0,

        effects: [] as PlayerEffect[],

        statistics: {
            cutWood: 0,
            caughtFish: 0,
            huntedMeat: 0,
            minedRocks: 0,
            killedEnemies: 0,
            completedQuests: 0,
            earnedGold: 0
        },

        completedAchievements: {},

        currentActivity: undefined as Activity | undefined,
        selectedItemName: undefined as InventoryItemName | undefined,
    }
}

export function addGold(value) {
    player.gold += value;
    addStatistic("earnedGold", value);

    renderGold();
}

export function removeGold(value) {
    player.gold = Math.max(0, player.gold - value);
    renderGold();
}

export function renderGold() {
    dom.setHtml("gold", player.gold.toString());
}

export function addStatistic(type, amount) {
    player.statistics[type] += amount;
    setTimeout(checkAchievements);
}

export let saveInterval;
export function startSaveInterval() {
    if (!saveInterval)
        saveInterval = setInterval(saveData, 5000);
}
export function stopSaveInterval() {
    clearInterval(saveInterval);
    saveInterval = undefined;
}