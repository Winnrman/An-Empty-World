export const enemy_dictionary = {
    "Goblin": {
        name: "Goblin",
        health: 10,
        attack: 2,
        defeatExperience: 5,
        defense: 1,
        gold: Math.floor(Math.random() * 25) + 1,
        speed: 1,
    },
    "Troll": {
        name: "Troll",
        health: 30,
        attack: 7,
        defense: 20,
        gold: Math.floor(Math.random() * 100) + 1,
        speed: 0.4,
        defeatExperience: 10,
    },
    "Skeleton": {
        name: "Skeleton",
        health: 30,
        attack: 15,
        defense: 10,
        speed: 1,
        gold: Math.floor(Math.random() * 100) + 1,
        defeatExperience: 10,
    },
    "Knight": {
        name: "Knight",
        health: 150,
        attack: 40,
        defense: 25,
        gold: Math.floor(Math.random() * 200) + 1,
        speed: 2.5,
    },
    "King": {
        name: "King",
        health: 300,
        attack: 50,
        defense: 50,
        speed: 1.5,
    },
    "Dragon": {
        name: "Dragon",
        health: 700,
        attack: 100,
        drops:
        {
            "Dragon Scales": {
                name: "Dragon Scales",
                type: "Material",
                price: 100,
                description: "A dragon scale.",
                rarity: "legendary",
            },
        },
        defense: 100,
        speed: 3,
        gold: Math.floor(Math.random() * 500) + 1,
        defeatExperience: 1200,
    }
};