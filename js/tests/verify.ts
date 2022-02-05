import { checkAchievements } from "../control/achievements";
import player, { Player } from "../control/player";
import { ToolName } from "../data/items/tools";
import * as inventory from "../control/inventory";

export function verify(data: Player, name?: string) {
    checkAchievements();
    
    const errors = Array<string>();
    verifyProperty(data, errors, "gold");
    verifyProperty(data, errors, "level");
    verifyProperty(data, errors, "xp");

    verifyInventory(data, errors, "Wood");
    verifyInventory(data, errors, "Fish");
    verifyInventory(data, errors, "Axe");
    verifyInventory(data, errors, "Wooden Harpoon");
    verifyInventory(data, errors, "Meat");
    verifyInventory(data, errors, "Monofolia");
    verifyInventory(data, errors, "Bifolia");
    verifyInventory(data, errors, "Trifolia");
    verifyInventory(data, errors, "Crimsonica");
    verifyInventory(data, errors, "Azurica");
    verifyInventory(data, errors, "Okerica");

    verifyToolHealth(data, errors, "Axe");
    verifyToolHealth(data, errors, "Wooden Harpoon");

    verifyArray(data, errors, "ownedEquipment");
    verifyObject(data, errors, "equipment");
    verifyObject(data, errors, "completedAchievements");

    if (errors.length > 0) {
        throw `error in ${name}: ${errors.join(",")}`;
    }
}

const verifyProperty = (data: Player, errors: string[], property: keyof Player) => expectAreEqual(errors, player[property], data[property], property);
const verifyInventory = (data: Player, errors: string[], item: inventory.InventoryItemName) => expectAreEqual(errors, inventory.getInventoryCount(item), data.inventory[item] ?? 0, `inventory ${item}`);
const verifyToolHealth = (data: Player, errors: string[], item: ToolName) => expectAreEqual(errors, player.toolHealth[item], data.toolHealth[item], `toolHealth ${item}`);
const verifyArray = (data: Player, errors: string[], property: keyof Player) => expectArraysAreEqual(errors, player[property] as any[], data[property] as any[], property);
const verifyObject = (data: Player, errors: string[], property: keyof Player) => expectObjectsAreEqual(errors, player[property], data[property], property);

function expectAreEqual(errors: string[], actual: any, expected: any, info: string) {
    if (actual !== expected)
        errors.push(`${info} is ${actual} but expected ${expected}`);
}

function expectArraysAreEqual(errors: string[], actual: any[], expected: any[], info: string) {
    expectAreEqual(errors, actual.length, expected.length,`${info}.length`);
    for (let i = 0; i < actual.length; i++) {
        expectAreEqual(errors, actual[i], expected[i], `${info}[${i}]`);
    }
}

function expectObjectsAreEqual(errors: string[], actual: any, expected: any, info: string) {
    for (const key in actual) {
        expectAreEqual(errors, actual[key], expected[key], `${info}[${key}]`);
    }
    for (const key in expected) {
        expectAreEqual(errors, actual[key], expected[key], `${info}[${key}]`);
    }
}