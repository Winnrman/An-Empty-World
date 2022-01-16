//different types of potions
import player from "../../control/player";

const potions = [
    {
        name: "Potion of Healing",
        type: "Potion",
        description: "Heals you for a small amount of health.",
        rarity: "Common",
        value: 10,
        effect: function () {
            player.playerHealth = Math.min(player.maxHealth, player.playerHealth + 10);
        }
    },
    {
        name: "Potion of Strength",
        type: "Potion",
        description: "Increases your attack by 1.",
        rarity: "common",
        value: 10,
        effect: function () {
            player.playerAttack += 1;
        }
    },
    {
        name: "Potion of Harming",
        type: "Potion",
        description: "Decreases your attack by 2.",
        rarity: "uncommon",
        value: 20,
        effect: function () {
            setTimeout(function () {
                player.playerAttack -= 2;
            }
                , 15000);
        }
    },
    {
        name: "Potion of Stamina",
        type: "Potion",
        description: "Increases your stamina by 10.",
        rarity: "common",
        value: 10,
        effect: function () {
            player.stamina += 10;
        }
    },
    {
        name: "Potion of Speed",
        type: "Potion",
        description: "Increases your speed by 1, allowing you to escape from bandits and bad situations with ease.",
        rarity: "rare",
        value: 10,
        effect: function () {
            player.playerSpeed += 1;
        }
    },
    {
        name: "Potion of Invisibility",
        type: "Potion",
        description: "Makes you invisible, allowing you to sneak past enemies and avoid being seen.",
        rarity: "legendary",
        value: 10,
        effect: function () {
            setTimeout(function () {
                player.playerInvisible = false;
            }, 25000); //25 seconds
            player.playerInvisible = true;
        }
    },
];

export default potions;