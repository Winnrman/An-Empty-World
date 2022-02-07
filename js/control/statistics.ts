import player from "./player";

export type StatisticName = "cutWood" | "minedStone" | "caughtFish" | "huntedMeat" | "minedOre" | "killedEnemies" | "completedQuests" | "earnedGold" | "scavengedHerbs"

export function addStatistic(type: StatisticName | undefined, amount: number) {
    if (!type)
        return;
    
    player.statistics[type] = (player.statistics[type] ?? 0) + amount;
}