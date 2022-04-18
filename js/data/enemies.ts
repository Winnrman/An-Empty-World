import { PartialRecord } from "../util";
import { ResourceName } from "./items/resources";

export type EnemyName = "Goblin" | "Troll" | "Skeleton" | "Knight" | "King" | "Dragon";

export type Enemy = {
    name: EnemyName,
    health: number;
    attack: number;
    defeatExperience: number;
    defense: number;
    gold: {
        min: number;
        max: number;
    },
    speed: number;
    drops?: PartialRecord<ResourceName, {
        min: number;
        max: number;
    }>
}

export const enemies: Enemy[] = [
    {
        name: "Goblin",
        health: 10,
        attack: 2,
        defeatExperience: 5,
        defense: 1,
        gold: {
            min: 20,
            max: 25,
        },
        speed: 1,
    },
    {
        name: "Troll",
        health: 30,
        attack: 7,
        defense: 20,
        gold: {
            min: 80,
            max: 100,
        },
        speed: 0.4,
        defeatExperience: 10,
    },
    {
        name: "Skeleton",
        health: 30,
        attack: 15,
        defense: 10,
        speed: 1,
        gold: {
            min: 80,
            max: 100,
        },
        defeatExperience: 10,
    },
    {
        name: "Knight",
        health: 150,
        attack: 40,
        defense: 25,
        speed: 2.5,
        gold: {
            min: 175,
            max: 200,
        },
        defeatExperience: 20,
    },
    {
        name: "King",
        health: 300,
        attack: 50,
        defense: 50,
        speed: 1.5,
        gold: {
            min: 250,
            max: 350,
        },
        defeatExperience: 40,
    },
    {
        name: "Dragon",
        health: 700,
        attack: 100,
        drops:
        {
            "Dragon Scale": {
                min: 1,
                max: 2,
            }
        },
        defense: 100,
        speed: 3,
        gold: {
            min: 400,
            max: 500,
        },
        defeatExperience: 1200,
    }
];

export const enemiesByName: { [key in EnemyName]: Enemy } = Object.assign({}, ...enemies.map(x => ({ [x.name]: x })));