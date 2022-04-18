import { getDefaultData } from "../control/player";
import runTestScenario, { Step } from "./engine";
import { collectBranches, collectStones, cutDownTree, mineStone, catchFish, mineIron, sell, drop, craftTool, craftEquipment, equip, huntMeat, takeNearestHerbs, searchSpecificHerbs, getHerb, craftPotion, gatherAndCraftPotion, drinkPotion, attack, startQuesting } from "./actions";
import { gatheredHerb, gotAchievement, gotGold, levelled, nothingHappened, toolBroke } from "./results";

export default async function runTests(keepTestDataAfterwards?: boolean) {
    await runTestScenario(getDefaultData(), runScenario, keepTestDataAfterwards);
}

async function runScenario(step: Step) {
    console.log("0: collect wood and stones for basic tools")
    await step("0.01", sell("Wood", 1, nothingHappened("Nothing to sell")));
    await step("0.02", drop("Wood", 1, nothingHappened("Nothing to drop")));
    await step("0.03", collectBranches(4));
    await step("0.04", collectStones(10));
    await step("0.05", craftTool("Axe"));
    await step("0.06", craftTool("Pickaxe"));

    console.log("1: cut wood until achievement and full inventory, then drop");
    await step("1.01", cutDownTree(20, true, toolBroke("Axe"), levelled(2, 90)));
    await step("1.02", cutDownTree(1, nothingHappened("no axe")));
    await step("1.03", craftTool("Axe", nothingHappened("no stone")));
    await step("1.04", drop("Wood", 1));
    await step("1.05", mineStone(5));
    await step("1.06", craftTool("Axe"));
    await step("1.07", cutDownTree(6, true, gotAchievement("cut_down_trees", 1)));
    await step("1.08", cutDownTree(1, nothingHappened("Inventory full")));
    await step("1.09", drop("Wood", 8));
    
    console.log("2: catch fish until achievement and full inventory, then drop");
    await step("2.01", craftTool("Wooden Harpoon"));
    await step("2.02", catchFish(10, true, toolBroke("Wooden Harpoon")));
    await step("2.03", catchFish(1, nothingHappened("no harpoon")));
    await step("2.04", craftTool("Wooden Harpoon"));
    await step("2.05", catchFish(7));
    await step("2.06", catchFish(1, nothingHappened("Inventory full")));
    await step("2.07", drop("Fish", 17));
    await step("2.08", catchFish(3, true, toolBroke("Wooden Harpoon")));
    await step("2.09", craftTool("Wooden Harpoon"));
    await step("2.10", catchFish(5, true, gotAchievement("catch_fish", 1)));
    await step("2.11", drop("Fish", 8));
    
    console.log("3a: craft all wooden equipment");
    await step("3a.01", cutDownTree(14, true, toolBroke("Axe"), levelled(3, 90)));
    await step("3a.02", mineStone(5));
    await step("3a.03", craftTool("Axe"));
    await step("3a.04", craftEquipment("Wooden Helmet"));
    await step("3a.05", craftEquipment("Wooden Chestplate"));
    await step("3a.06", craftEquipment("Wooden Leggings", nothingHappened("Not enough wood")));
    await step("3a.07", cutDownTree(20, true, gotAchievement("cut_down_trees", 2), toolBroke("Axe")));
    await step("3a.08", craftEquipment("Wooden Leggings"));
    await step("3a.09", craftEquipment("Wooden Boots"));
    await step("3a.10", craftEquipment("Wooden Sword"));
    
    console.log("3b: equip all wooden equipment");
    await step("3b.01", equip("Wooden Helmet"));
    await step("3b.02", equip("Wooden Chestplate"));
    await step("3b.03", equip("Wooden Leggings"));
    await step("3b.04", equip("Wooden Boots", true, gotAchievement("wooden_armor", 1)));
    await step("3b.05", equip("Wooden Sword"));

    console.log("4: hunt until achievement and full inventory, then drop");
    await step("4.01", mineStone(9, true, gotAchievement("mined_stones", 1)));
    await step("4.02", craftTool("Axe"));
    await step("4.03", cutDownTree(5));
    await step("4.05", huntMeat(1, nothingHappened("No spear")));
    await step("4.04", craftTool("Stone Spear"));
    await step("4.05", huntMeat(10, true, toolBroke("Stone Spear")));
    await step("4.06", craftTool("Stone Spear"));
    await step("4.07", huntMeat(10, true, toolBroke("Stone Spear"), levelled(4, 200)));
    await step("4.08", drop("Meat", 5));
    await step("4.09", mineStone(2));
    await step("4.10", cutDownTree(5));
    await step("4.11", craftTool("Stone Spear"));
    await step("4.12", huntMeat(6, true, gotAchievement("hunted_meat", 1)));
    await step("4.13", huntMeat(1, nothingHappened("Inventory full")));
    await step("4.14", drop("Meat", 21));

    console.log("5: keep on hunting until level 5");
    await step("5.01", huntMeat(4));
    await step("5.02", drop("Meat", 4));
    await step("5.03", mineStone(11));
    await step("5.04", cutDownTree(10, true, toolBroke("Axe")));
    await step("5.05", craftTool("Axe"));
    await step("5.06", craftTool("Stone Spear"));
    await step("5.07", huntMeat(10));
    await step("5.08", drop("Meat", 10));
    await step("5.04", cutDownTree(7));
    await step("5.09", craftTool("Stone Spear"));
    await step("5.10", huntMeat(10, true, gotAchievement("hunted_meat", 2)));
    await step("5.11", drop("Meat", 10));
    await step("5.09", craftTool("Stone Spear"));
    await step("5.07", huntMeat(10, true, levelled(5, 450)));
    await step("5.08", drop("Meat", 10));

    console.log("6a: gather nearest herbs");
    // console.log(getItemChanceValueRanges("Take nearest herbs")); // uncomment to get the chances in console
    await step("6a.01a", takeNearestHerbs([0.000, 0.399], gatheredHerb("Monofolia", 2)));
    await step("6a.01b", takeNearestHerbs([0.400, 0.666], gatheredHerb("Bifolia", 2)));
    await step("6a.01c", takeNearestHerbs([0.667, 0.799], gatheredHerb("Trifolia", 2)));
    await step("6a.01d", takeNearestHerbs([0.800, 0.866], gatheredHerb("Azurica", 2)));
    await step("6a.01e", takeNearestHerbs([0.867, 0.933], gatheredHerb("Crimsonica", 2)));
    await step("6a.01f", takeNearestHerbs([0.934, 0.999], gatheredHerb("Okerica", 2)));
    await step("6a.02a", drop("Monofolia", 2));
    await step("6a.02b", drop("Bifolia", 2));
    await step("6a.02c", drop("Trifolia", 2));
    await step("6a.02d", drop("Azurica", 2));
    await step("6a.02e", drop("Crimsonica", 2));
    await step("6a.02f", drop("Okerica", 2));

    console.log("6b: gather specific herbs, focusing on one");
    // console.log(getItemChanceValueRanges("Search specific herbs", { "Monofolia": 3 })); // focusing on one herb gives it a 3x boost, uncomment to get the chances in console
    await step("6b.03a", searchSpecificHerbs(["Monofolia"],  [0.000, 0.666, 0.667], 2, gatheredHerb("Monofolia", 2)));
    await step("6b.03b", searchSpecificHerbs(["Bifolia"],    [0.000, 0.521, 0.522], 2, gatheredHerb("Bifolia", 2)));
    await step("6b.03c", searchSpecificHerbs(["Trifolia"],   [0.315, 0.316, 0.631, 0.632], 2, gatheredHerb("Trifolia", 2)));
    await step("6b.03d", searchSpecificHerbs(["Azurica"],    [0.588, 0.589, 0.764, 0.765], 2, gatheredHerb("Azurica", 2)));
    await step("6b.03e", searchSpecificHerbs(["Crimsonica"], [0.588, 0.589, 0.764, 0.765], 2, gatheredHerb("Crimsonica", 2)));
    await step("6b.03f", searchSpecificHerbs(["Okerica"],    [0.588, 0.589, 0.764, 0.765], 2, gatheredHerb("Okerica", 2)));
    await step("6b.04a", drop("Monofolia", 2));
    await step("6b.04b", drop("Bifolia", 2));
    await step("6b.04c", drop("Trifolia", 2));
    await step("6b.04d", drop("Azurica", 2));
    await step("6b.04e", drop("Crimsonica", 2));
    await step("6b.04f", drop("Okerica", 2));

    console.log("6c: gather specific herbs, focusing on two");
    // console.log(getItemChanceValueRanges("Search specific herbs", { "Monofolia": 2, "Bifolia": 2 })); // focusing on two herbs gives each a 2x boost, uncomment to get the chances in console
    await step("6.05a", searchSpecificHerbs(["Monofolia", "Bifolia"],  [0.000, 0.479], 2, gatheredHerb("Monofolia", 2)));
    await step("6.05ba", searchSpecificHerbs(["Monofolia", "Bifolia"],  [0.480, 0.799, 0.800], 2, gatheredHerb("Bifolia", 2)));
    await step("6.06a", drop("Monofolia", 2));
    await step("6.06b", drop("Bifolia", 2));
    
    console.log("7a: craft potions");
    await step("7a.01a", getHerb("Monofolia", 5));
    await step("7a.01b", getHerb("Crimsonica", 1));
    await step("7a.01c", craftPotion("Potion of Healing"));
    await step("7a.02", gatherAndCraftPotion("Potion of Strength"));
    await step("7a.03", gatherAndCraftPotion("Potion of Harming"));
    await step("7a.04", gatherAndCraftPotion("Potion of Defense"));
    await step("7a.05", gatherAndCraftPotion("Potion of Stamina"));
    await step("7a.06", gatherAndCraftPotion("Potion of Speed"));
    await step("7a.07", gatherAndCraftPotion("Potion of Invisibility"));

    console.log("7b: drink potions");
    await step("7b.01", drinkPotion("Potion of Healing"));
    await step("7b.02", drinkPotion("Potion of Strength"));
    await step("7b.03", drinkPotion("Potion of Defense"));
    await step("7b.04", drinkPotion("Potion of Stamina"));
    await step("7b.05", drinkPotion("Potion of Speed"));
    await step("7b.06", drinkPotion("Potion of Invisibility"));
    await step("7b.07", drop("Potion of Harming", 1));

    console.log("8a: craft iron armour");
    await step("8a.01", cutDownTree(13, true, toolBroke("Axe"), gotAchievement("cut_down_trees", 3)));
    await step("8a.02", mineStone(5));
    await step("8a.03", craftTool("Axe"));
    await step("8a.04", mineIron(11, levelled(6, 220)));
    await step("8a.05", craftEquipment("Iron Helmet"));
    await step("8a.06", craftEquipment("Iron Boots"));
    await step("8a.07", mineIron(13));
    await step("8a.08", craftEquipment("Iron Chestplate"));
    await step("8a.09", craftEquipment("Iron Leggings"));
    await step("8a.10", craftEquipment("Iron Sword"));
    await step("8a.11", cutDownTree(5));
    await step("8a.12", mineIron(9, true, gotAchievement("mined_ores", 1)));
    await step("8a.12", mineStone(5, true, gotAchievement("mined_stones", 2), toolBroke("Pickaxe")));
    await step("8a.03", craftTool("Pickaxe"));
    await step("8a.13", craftEquipment("Iron Cutlass"));
    await step("8a.11", cutDownTree(2));
    await step("8a.12", mineIron(2));
    await step("8a.14", craftEquipment("Iron Shield"));
    
    console.log("8b: equip iron armour");
    await step("8b.01", equip("Iron Helmet"));
    await step("8b.02", equip("Iron Chestplate"));
    await step("8b.03", equip("Iron Leggings"));
    await step("8b.04", equip("Iron Boots", true, gotAchievement("iron_armor", 1)));
    await step("8b.03", equip("Iron Shield"));
    await step("8b.05", equip("Iron Sword"));

    console.log("9: fight");
    await step("9.01", attack("Goblin", 4, true, gotAchievement("killed_enemies", 1)));
    await step("9.02", attack("Goblin", 4));
    await step("9.03", attack("Goblin", 4));
    await step("9.04", attack("Goblin", 4));
    await step("9.05", attack("Goblin", 4, true, gotAchievement("killed_enemies", 2)));

    console.log("10: mindlessly mine iron until we're level 8");
    await step("10.01a", mineIron(16, levelled(7, 440), gotAchievement("mined_ores", 2)));
    await step("10.01b", drop("Iron", 16));
    await step("10.02a", mineIron(16));
    await step("10.02b", drop("Iron", 16));
    await step("10.03a", mineIron(16));
    await step("10.03b", drop("Iron", 16));
    await step("10.03a", mineIron(15, levelled(8, 0)));
    await step("10.03b", drop("Iron", 15));

    console.log("11: questing");
    const eventChances = {
        Walk: 0 / 11,
        LootChest: 8 / 11
    }
    const eventCosts = {
        Walk: 1,
        LootChest: 2,
        LootChestWithLuck: 1
    }
    await step("11.01", startQuesting([eventChances.Walk], 3, eventCosts.Walk));
    await step("11.02", startQuesting([
        eventChances.LootChest,
        0.99999, // gold: max,
        4 / 7 // loot type: Offhand
    ], 5, eventCosts.LootChest, gotAchievement("completed_quests", 1), gotGold(1000), gotAchievement("earned_gold", 2)));
}