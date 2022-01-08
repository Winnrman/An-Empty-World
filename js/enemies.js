var enemy_dictionary = {
    "goblin": {
        name: "Goblin",
        health: 10,
        attack: 2,
        defeatExperience: 5,
        defense: 1,
        gold: Math.floor(Math.random() * 25) + 1,
        speed: 1,
    },
    "troll": {
        name: "Troll",
        health: 30,
        attack: 7,
        defense: 20,
        speed: 0.4,
        defeatExperience: 10,
    },
    "skeleton": {
        name: "Skeleton",
        health: 30,
        attack: 15,
        defense: 10,
        speed: 1,
        defeatExperience: 10,
    },
    "knight": {
        name: "Knight",
        health: 150,
        attack: 40,
        defense: 25,
        speed: 2.5,
    },
    "king": {
        name: "King",
        health: 300,
        attack: 50,
        defense: 50,
        speed: 1.5,
    }
}