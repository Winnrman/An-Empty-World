import * as dom from "../util/dom";
import { checkAchievements } from "./achievements";
import { EquipmentSlot } from "../data/items";
import { addMessage } from './messages';
import player, { addGold, saveData } from "./player";
import transient from "./transient";
import { Equipment, equipmentByName, EquipmentName } from "../data/items/equipment";
import { getEffectValue } from "./effects";

import iconSlotHelmet from "../../img/assets/equipment/Slot/Slot Helmet.png";
import iconSlotChest from "../../img/assets/equipment/Slot/Slot Chest.png";
import iconSlotLeggings from "../../img/assets/equipment/Slot/Slot Leggings.png";
import iconSlotBoots from "../../img/assets/equipment/Slot/Slot Boots.png";
import iconSlotWeapon from "../../img/assets/equipment/Slot/Slot Weapon.png";
import iconSlotOffhand from "../../img/assets/equipment/Slot/Slot Offhand.png";
import iconSlotRanged from "../../img/assets/equipment/Slot/Slot Ranged.png";
import iconSlotShield from "../../img/assets/equipment/Slot/Slot Shield.png";

const emptyEquipmentIcons: Record<EquipmentSlot, string> = {
    "Helmet": iconSlotHelmet,
    "Chestplate": iconSlotChest,
    "Leggings": iconSlotLeggings,
    "Boots": iconSlotBoots,
    "Weapon": iconSlotWeapon,
    "Offhand": iconSlotOffhand,
    "Ranged": iconSlotRanged,
    "Shield": iconSlotShield,
}

export function addToOwnedEquipment(item: Equipment) {
    if (player.ownedEquipment.includes(item.name as EquipmentName)) {
        if (transient.isQuesting == true) {
            addMessage(`You already have a ${item.name}, so you toss them away.`);
            return;
        }

        addMessage(`You already have a ${item.name}! [Refunded 1000 Gold]`);
        addGold(1000);
        return;
    }
    player.ownedEquipment.push(item.name as EquipmentName);
    addEquipmentOption(item, false);
}

function addEquipmentOption(item: Equipment, isEquipped: boolean) {
    var selectElement = dom.getElement<HTMLSelectElement>(`${item.equipment.slot}Select`);
    var newOption = dom.createElement<HTMLOptionElement>("option", { text: item.name });
    if (isEquipped)
        newOption.setAttribute("selected", "selected");
    selectElement.add(newOption);
}

function getEquipmentFields(slots: EquipmentSlot[]) {
    return slots
        .map(slot =>
            `<span>
                <span class="label">${slot}</span>&nbsp;
                <select id="${slot}Select" class="EquipmentSelect">
                    <option value="">None</option>
                </select>
            </span>`)
        .join("\r\n");
}

export function loadOptionsFromOwnedEquipment() {
    dom.setHtml("armor", getEquipmentFields(["Helmet", "Chestplate", "Leggings", "Boots"]));
    dom.setHtml("weapons", getEquipmentFields(["Weapon", "Offhand", "Shield", "Ranged"]));
    Object.values(document.getElementsByClassName('EquipmentSelect')).forEach(x => x.addEventListener("change", updateArmour));

    for (let equipmentName of player.ownedEquipment) {
        const isEquipped = hasEquiped(equipmentName);
        const equipment = equipmentByName[equipmentName];
        addEquipmentOption(equipment, isEquipped);
    }
    updateArmour();
    showEquipment();
}

const renderEquipmentIcon = (slot: EquipmentSlot) => {
    const item = equipmentByName[player.equipment[slot]];
    let html = "";
    html += `<span class="equipment-slot" title="${slot}: ${item?.name || 'None!'}">`
    html += `<img src="${item?.iconUrl || emptyEquipmentIcons[slot]}" />`;
    html += "</span>"
    return html;
}

function showEquipment() {

    let html = "";
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column">${renderEquipmentIcon("Helmet")}</div>`
    html += `<div class="column"></div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column"></div>`
    html += `<div class="column"></div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column">${renderEquipmentIcon("Weapon")}</div>`
    html += `<div class="column">${renderEquipmentIcon("Chestplate")}</div>`
    html += `<div class="column">${renderEquipmentIcon("Shield")}</div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column">${renderEquipmentIcon("Leggings")}</div>`
    html += `<div class="column"></div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column">${renderEquipmentIcon("Boots")}</div>`
    html += `<div class="column"></div>`
    html += `</div>`

    dom.setHtml("equipment", html);
}

export function ownsEquipment(itemName: EquipmentName) {
    return player.ownedEquipment.includes(itemName);
}
export function hasEquiped(itemName: EquipmentName) {
    return Object.values(player.equipment).includes(itemName);
}

export function updateArmour() {
    const updateEquipment = (slot: EquipmentSlot) => {
        const item = dom.getValue(`${slot}Select`) as EquipmentName;
        player.equipment[slot] = item ? item : undefined;
    }

    updateEquipment("Helmet");
    updateEquipment("Chestplate");
    updateEquipment("Leggings");
    updateEquipment("Boots");
    updateEquipment("Shield");
    updateEquipment("Weapon");

    const getArmorValue = (slot: EquipmentSlot) => equipmentByName[player.equipment[slot]]?.armor || 0;
    player.playerDefense =
          getArmorValue("Helmet")
        + getArmorValue("Chestplate")
        + getArmorValue("Leggings")
        + getArmorValue("Boots")
        + getArmorValue("Shield")
        + getEffectValue("addDefense");

    const getAttackValue = (slot: EquipmentSlot) => equipmentByName[player.equipment[slot]]?.attack || 0;
    player.playerAttack =
          1
        + getAttackValue("Weapon")
        + getEffectValue("addAttack")
        - getEffectValue("decreaseAttack");

    player.playerSpeed =
           1
        + getEffectValue("addSpeed");

    dom.setHtml("playerDefenseValue", player.playerDefense.toString());
    dom.setHtml("playerAttackValue", player.playerAttack.toString());
    dom.setHtml("playerSpeedValue", player.playerSpeed.toString());

    showEquipment();
    checkAchievements();
    saveData();
}