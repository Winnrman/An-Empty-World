import * as dom from "./dom.js";
import { checkAchievements } from "./achievements.js";
import items, { itemsByName } from "./items.js";
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
        const equipment = itemsByName[equipmentName];
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
    const updateEquipment = (type) => {
        const item = dom.getValue(`${type}Select`);
        player.equipment[type] = item ? item : undefined;
    }

    updateEquipment("Helmet");
    updateEquipment("Chestplate");
    updateEquipment("Leggings");
    updateEquipment("Boots");
    updateEquipment("Shield");
    updateEquipment("Weapon");

    const getArmorValue = (type) => itemsByName[player.equipment[type]]?.armor || 0;
    const getAttackValue = (type) => itemsByName[player.equipment[type]]?.attack || 0;
    player.playerDefense = getArmorValue("Helmet") + getArmorValue("Chestplate") + getArmorValue("Leggings") + getArmorValue("Boots") + getArmorValue("Shield");
    player.playerAttack = 1 + getAttackValue("Weapon");

    dom.setHtml("playerDefenseValue", player.playerDefense);
    dom.setHtml("playerAttackValue", player.playerAttack);

    checkAchievements();
}