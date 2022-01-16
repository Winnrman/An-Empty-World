import * as dom from "./dom";
import { checkAchievements } from "./achievements";
import items, { itemsByName } from "./items";
import { addMessage } from './messages';
import player, { addGold } from "./player";
import transient from "./transient";

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
    player.ownedEquipment.push(item.name); //pushes potions to ownedEquipment (shouldn't be here)
    addEquipmentOption(item, false);
}

function addEquipmentOption(item, isEquipped) {
    var selectElement = <HTMLSelectElement>document.getElementById(`${item.type}Select`);
    var newOption = document.createElement("option");
    newOption.text = item.name;
    if (isEquipped)
        newOption.setAttribute("selected", "selected");
    selectElement.add(newOption);
}

function getEquipmentFields(types) {
    return types.map(type =>
        `<span style="display: inline-flex">
        <p>${type} &nbsp;</p>
        <select id="${type}Select" class="EquipmentSelect">
            <option value="">None</option>
        </select>
    </span>`).join("\r\n<br>\r\n");
}

export function loadOptionsFromOwnedEquipment() {
    dom.setHtml("armor", getEquipmentFields(["Helmet", "Chestplate", "Leggings", "Boots"]));
    dom.setHtml("weapons", getEquipmentFields(["Weapon", "Offhand", "Shield", "Ranged"]));
    Object.values(document.getElementsByClassName('EquipmentSelect')).forEach(x => x.addEventListener("change", updateArmour));

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