import player from "./player.js";
import items from "./items.js";

function calculateInventorySpace() {
	let inventorySpace = 0;
	for (let key in player.inventory_dictionary) {
		inventorySpace += player.inventory_dictionary[key];
	}
	return inventorySpace;
}

export function isInventoryFull() {
	return calculateInventorySpace() >= player.maxInventorySize;
}

export function renderInventory() {
	// Module for displaying the tool durabilities
	for (var item of items) {
		if (item.type == "tool") {
			if (player.inventory_dictionary[item.name] > 0) {
				document.getElementById(item.elementID).innerHTML = `${item.name}:&nbsp;${player.toolHealth[item.name]}/${item.health}&nbsp;&nbsp;&nbsp;`;
			} else {
				document.getElementById(item.elementID).innerHTML = "";
			}
		}
	}
	document.getElementById("inventoryHeader").innerHTML = `Inventory (${calculateInventorySpace()}/${player.maxInventorySize})`;

	const getPart = (type) => `${type} x${player.inventory_dictionary[type]}`;
	const getParts = (types) => types.map(x => getPart(x)).join("&nbsp;|&nbsp;");

	const categories = {
		"inventory-tools": ["Axe", "Pickaxe", "Hunting Rifle", "Fishing Pole"],
		"inventory-basic": ["Wood", "Fish", "Meat", "Stone"],
		"inventory-ores": ["Iron", "Copper", "Tin", "Silver", "Gold"],
		"inventory-gems": ["Emerald", "Ruby", "Diamond"],
	};

	for (var category in categories) {
		var valid_resources = [];
		for (var key in player.inventory_dictionary) {
			if (categories[category].indexOf(key) >= 0) {
				// check if the property/key is defined in the object itself, not in parent
				if (player.inventory_dictionary.hasOwnProperty(key)) {
					// Check if more than 0 item is present in player inventory
					if (player.inventory_dictionary[key] > 0) {
						valid_resources.push(key)
					}
				}
			}
		}
		document.getElementById(category).innerHTML = getParts(valid_resources)
	}
}