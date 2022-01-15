import { checkAchievements } from "./achievements.js";
import items from "./items.js";
import { addMessage } from './messages.js';
import player, { addGold } from "./player.js";
import transient from "./transient.js";

export function addToOwnedEquipment(item) {
    if (player.ownedEquipment.includes(item.name)) {
        if (transient.isQuesting == true) {
            addMessage(`You already have a ${item.name}, so you toss them away.`);
            return;
        }
        
        addMessage(`You already have a ${item.name}! [Refunded 1000 Gold]`);
        addGold(1000);
        return;
    }

    player.ownedEquipment.push(item.name);
    addEquipmentOption(item)
}

function addEquipmentOption(item, isEquipped) {
    var selectElement = document.getElementById(`${item.type}Select`);
    var newOption = document.createElement("option");
    newOption.text = item.name;
    if (isEquipped)
        newOption.setAttribute("selected", "selected");
    selectElement.add(newOption);
}

export function loadOptionsFromOwnedEquipment() {
    for (let equipmentName of player.ownedEquipment) {
        const isEquipped = hasEquiped(equipmentName);
        const equipment = items.find(x => x.name === equipmentName);
        addEquipmentOption(equipment, isEquipped);
    }
    updateArmour();
}

export function ownsEquipment(itemName) {
    return player.ownedEquipment.includes(itemName);
}
export function hasEquiped(itemName) {
    return Object.values(player.equipment).includes(itemName);
}

Object.values(document.getElementsByClassName('EquipmentSelect')).forEach(x => x.addEventListener("change", updateArmour));

function updateArmour() {
    player.equipment.Helmet = document.getElementById("HelmetSelect").value;
    player.equipment.Chestplate = document.getElementById("ChestplateSelect").value;
    player.equipment.Leggings = document.getElementById("LeggingsSelect").value;
    player.equipment.Boots = document.getElementById("BootsSelect").value;
    player.equipment.Shield = document.getElementById("ShieldSelect").value;
    player.equipment.Weapon = document.getElementById("WeaponSelect").value;

    player.playerDefense = (items.find(x => x.name === player.equipment.Helmet)?.armor || 0)
                         + (items.find(x => x.name === player.equipment.Chestplate)?.armor || 0)
                         + (items.find(x => x.name === player.equipment.Leggings)?.armor || 0)
                         + (items.find(x => x.name === player.equipment.Boots)?.armor || 0)
                         + (items.find(x => x.name === player.equipment.Shield)?.armor || 0);

    player.playerAttack = 1 + (items.find(x => x.name === player.equipment.Weapon)?.attack || 0);

    document.getElementById("playerDefenseValue").innerHTML = player.playerDefense;
    document.getElementById("playerAttackValue").innerHTML = player.playerAttack;

    checkAchievements();
}