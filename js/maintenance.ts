import { addMessage } from "./activities";
import items from "./items";
import player from "./player";

function checkInventorySize() {
    //add up all keys in inventory_dict and compare to maxInventorySize
    var totalInventorySize = 0;
    for (var key in player.inventory_dictionary) {
        totalInventorySize += player.inventory_dictionary[key];
    }
    player.fullInventory = totalInventorySize >= player.maxInventorySize;
}

setInterval(function () {
    document.getElementById("staminaAmount").innerHTML = player.stamina.toString(); //keep updating the stamina bar
}, 100)

var inventoryChecker = setInterval(function () {
    checkInventorySize();
    // getArmorStats();
    if (player.fullInventory == true) {
        addMessage("Your inventory is full. You can't carry any more items.");
        clearInterval(inventoryChecker);
        setTimeout(function () {
            setInterval(function () {
                checkInventorySize();
                if (player.fullInventory == false) {
                    clearInterval(inventoryChecker);
                }
            }, 100);
        }, 100);
    }
    // checkInventorySize();
}, 100);

export function addToOwnedEquipment(itemName, itemType) {
    if (player.ownedEquipment.includes(itemName)) {
        if (player.isQuesting == true) {
            addMessage("You already have a " + itemName + ", so you toss them away.");
        } else {
            addMessage("You already have a " + itemName + "! [Refunded 1000 Gold]");
            player.gold += 1000;
            return;
        }
    }

    player.ownedEquipment.push(itemName);
    addEquipmentOption(itemName, itemType)
}

function addEquipmentOption(itemName, itemType, isEquipped?: boolean) {
    var selectElement = <HTMLSelectElement>document.getElementById(`${itemType}Select`); //this doesn't work for chestplates or leggings because the id is different
    var newOption = document.createElement("option");
    newOption.text = itemName;
    if (isEquipped)
        newOption.setAttribute("selected", "selected");
    selectElement.add(newOption);
}

export function loadOptionsFromOwnedEquipment() {
    for (let equipment of player.ownedEquipment) {
        const type = items.find(x => x.name == equipment).type;
        const isEquipped = player.equipment[type] === equipment;
        addEquipmentOption(equipment, type, isEquipped);
    }
    updateArmour();
}

export function hasEquipmentInInventory(itemName) {
    return player.ownedEquipment.includes(itemName);
}
export function hasEquiped(itemName) {
    return Object.values(player.equipment).includes(itemName);
}

setInterval(function () {
    if (player.stamina < player.maxStamina) {
        if (player.isQuesting == false) {
            player.stamina++;
        }
    }
}, 2000);

Object.values(document.getElementsByClassName('EquipmentSelect')).forEach(x => x.addEventListener("change", updateArmour));

function updateArmour() {
    player.equipment.Helmet = (<HTMLSelectElement>document.getElementById("HelmetSelect")).value;
    player.equipment.Chestplate = (<HTMLSelectElement>document.getElementById("ChestplateSelect")).value;
    player.equipment.Leggings = (<HTMLSelectElement>document.getElementById("LeggingsSelect")).value;
    player.equipment.Boots = (<HTMLSelectElement>document.getElementById("BootsSelect")).value;
    player.equipment.Weapon = (<HTMLSelectElement>document.getElementById("WeaponSelect")).value;

    player.playerDefense = (items.find(x => x.name === player.equipment.Helmet)?.armor || 0)
                         + (items.find(x => x.name === player.equipment.Chestplate)?.armor || 0)
                         + (items.find(x => x.name === player.equipment.Leggings)?.armor || 0)
                         + (items.find(x => x.name === player.equipment.Boots)?.armor || 0);

    player.playerAttack = 1 + (items.find(x => x.name === player.equipment.Weapon)?.attack || 0)

    document.getElementById("playerDefenseValue").innerHTML = player.playerDefense.toString();
    document.getElementById("playerAttackValue").innerHTML = player.playerAttack.toString();
}