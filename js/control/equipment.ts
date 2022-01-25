import * as dom from "../util/dom";
import { checkAchievements } from "./achievements";
import { EquipmentSlot } from "../data/items";
import { addMessage } from './messages';
import player, { addGold, saveData } from "./player";
import transient from "./transient";
import { Equipment, equipmentByName, EquipmentName } from "../data/items/equipment";
import { getEffectValue } from "./effects";

import "../../css/equipment.css";

import iconSlotHelmet from "../../img/assets/equipment/Slot/Slot Helmet.png";
import iconSlotChest from "../../img/assets/equipment/Slot/Slot Chest.png";
import iconSlotLeggings from "../../img/assets/equipment/Slot/Slot Leggings.png";
import iconSlotBoots from "../../img/assets/equipment/Slot/Slot Boots.png";
import iconSlotWeapon from "../../img/assets/equipment/Slot/Slot Weapon.png";
import iconSlotOffhand from "../../img/assets/equipment/Slot/Slot Offhand.png";
import iconSlotRanged from "../../img/assets/equipment/Slot/Slot Ranged.png";
import iconSlotShield from "../../img/assets/equipment/Slot/Slot Shield.png";
import { getWithIndefiniteArticle } from "../util";

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
    if (ownsEquipment(item.name)) {
        if (transient.isQuesting == true) {
            addMessage(`You already have ${getWithIndefiniteArticle(item.name)}, so you toss them away.`);
            return;
        }

        addMessage(`You already have ${getWithIndefiniteArticle(item.name)}! [Refunded 1000 Gold]`);
        addGold(1000);
        return;
    }
    player.ownedEquipment.push(item.name as EquipmentName);
    renderEquipmentChooser();
}

export function showEquipmentChooser(slot: EquipmentSlot) {
    if (player.selectedEquipmentSlot === slot) {
        slot = undefined;
    }
    
    player.selectedEquipmentSlot = slot;
    player.selectedEquipment = undefined;
    renderEquipmentChooser();
    saveData();
}

export function selectEquipment(itemName: EquipmentName) {
    if (player.selectedEquipment === itemName)
        itemName = undefined;
    
    player.selectedEquipment = itemName;
    renderSelectedEquipment();
    saveData();
}

export function equip(itemName: EquipmentName) {
    const equipment = equipmentByName[itemName];
    player.equipment[equipment.equipment.slot] = equipment.name;
    player.selectedEquipment = undefined;
    updateArmour();
    renderEquipmentChooser();
    renderSelectedEquipment();
    saveData();
}

export function unequipSlot(slot: EquipmentSlot) {
    player.equipment[slot] = undefined;
    updateArmour();
    renderEquipmentChooser();
    renderSelectedEquipment();
    saveData();
}

export function ownsEquipment(itemName: EquipmentName) {
    return player.ownedEquipment.includes(itemName);
}
export function hasEquiped(itemName: EquipmentName) {
    return Object.values(player.equipment).includes(itemName);
}

export function updateArmour() {
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

    renderEquipment();
    checkAchievements();
    saveData();
}

export function renderEquipment() {
    const renderEquipmentIconForSlot = (slot: EquipmentSlot) => {
        const item = equipmentByName[player.equipment[slot]];
        let html = "";
        html += `<span onClick="equipment.showEquipmentChooser('${slot}')" class="equipment-slot" title="${slot}: ${item?.name || 'None!'}">`
        html += `<img src="${item?.iconUrl || emptyEquipmentIcons[slot]}" />`;
        html += "</span>"
        return html;
    }

    let html = "";
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column">${renderEquipmentIconForSlot("Helmet")}</div>`
    html += `<div class="column"></div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column"></div>`
    html += `<div class="column"></div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column">${renderEquipmentIconForSlot("Weapon")}</div>`
    html += `<div class="column">${renderEquipmentIconForSlot("Chestplate")}</div>`
    html += `<div class="column">${renderEquipmentIconForSlot("Shield")}</div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column">${renderEquipmentIconForSlot("Leggings")}</div>`
    html += `<div class="column"></div>`
    html += `</div>`
    
    html += `<div class="row">`
    html += `<div class="column"></div>`
    html += `<div class="column">${renderEquipmentIconForSlot("Boots")}</div>`
    html += `<div class="column"></div>`
    html += `</div>`

    dom.setHtml("equipment", html);
}

export function renderEquipmentChooser() {
    if (!player.selectedEquipmentSlot) {
        dom.setHtml("equipment-chooser-selector", "");
        renderSelectedEquipment();
        return;
    }

    const renderEquipmentIcon = (equipment: Equipment) => {
        let html = "";
        html += `<span onClick="equipment.selectEquipment('${equipment.name}')" ondblclick="equipment.equip('${equipment.name}')" class="equipment-slot" title="${equipment.name}">`
        html += `<img src="${equipment.iconUrl}" />`;
        html += "</span>"
        return html;
    }

    const slot = player.selectedEquipmentSlot;
    let html = "";

    const equipmentForSlot = player.ownedEquipment.map(x => equipmentByName[x]).filter(x => x.equipment.slot === slot && player.equipment[slot] != x.name)
    html += `<div>Slot: ${slot}</div>`;
    html += `<div id="equipment-chooser-items">`
    for (let equipment of equipmentForSlot) {
        html += renderEquipmentIcon(equipment);
    }

    html += "</div>"
    html += "<br />"

    dom.setHtml("equipment-chooser-selector", html);
    
    renderSelectedEquipment();
}

export function renderSelectedEquipment() {
    const renderEquipment = (equipment: Equipment, isEquipped: boolean) => {
        
        let html = "";
        html += `<div class="row">`

        html += `<div class="auto-column">`
        html += `<div id="equipment-chooser-item">`
        html += `<span class="equipment-slot">`;
        html += `<img src="${equipment.iconUrl}" />`;
        html += "</span>";
        html += "</div>";
        html += "</div>";
        
        html += `<div class="auto-column">`
        html += `<h4>${equipment.name}</h4>`;
        html += `Attack: ${equipment.attack || 0}<br />`;
        html += `Armor: ${equipment.armor || 0}<br />`;
        html += "<br />";
        if (isEquipped)
            html += `<button onClick="equipment.unequipSlot('${equipment.equipment.slot}')" class="button">Unequip</button>`;
        else
            html += `<button onClick="equipment.equip('${equipment.name}')" class="button">Equip</button>`;

        html += "</div>";

        html += "</div>";
        
        dom.setHtml("equipment-chooser-selected", html);
    }

    if (player.selectedEquipment) {
        const equipment = equipmentByName[player.selectedEquipment];
        renderEquipment(equipment, false);
        return;
    }
    
    if (player.equipment[player.selectedEquipmentSlot]) {
        const equipment = equipmentByName[player.equipment[player.selectedEquipmentSlot]];
        renderEquipment(equipment, true);
        return;
    }

    dom.setHtml("equipment-chooser-selected", "");
}