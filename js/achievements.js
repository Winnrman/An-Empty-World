import { addMessage } from "./activities.js";
import player from "./player.js";
import { hasEquiped } from "./maintenance.js";

export const completedAchievements = [];

function achievement_iron_armor() {
    if (completedAchievements.includes("achievement_iron_armor"))
        return;
    
    if (!hasEquiped("Iron Helmet") || !hasEquiped("Iron Chestplate") || !hasEquiped("Iron Leggings") || !hasEquiped("Iron Boots"))
        return;

    addMessage("You have completed the Iron Armor achievement!");
    player.gold += 250;
    document.getElementById("gold").innerHTML = gold;
    completedAchievements.push("achievement_iron_armor");
}

var interval = setInterval(function () {
    achievement_iron_armor();
    if (completedAchievements.includes("achievement_iron_armor")) {
        clearInterval(interval);
    }
}, 2000);

// var timesRun = 0;
// var achievementMaster = setInterval(function () { //needs work
//     achievement_iron_armor();
//     timesRun++;
//     if (timesRun > 2) {
//         clearInterval(achievementMaster);
//     }
// }, 1000);

// function achievement_cut_down_trees(woodObtained) {

//     if (woodObtained == 500 || woodObtained == 1000 || woodObtained == 1500 || woodObtained == 2000 || woodObtained == 2500 || woodObtained == 3000 || woodObtained == 3500 || woodObtained == 4000 || woodObtained == 4500 || woodObtained == 5000) {
//         var achievementMessage = "You have completed the Cut Down " + woodObtained + " Trees achievement!";
//         //add page break after level up message
//         document.getElementById("messages").innerHTML += "<br>";
//         var message = document.createElement("li");
//         message.appendChild(document.createTextNode(achievementMessage));
//         document.getElementById("messages").appendChild(message);
//         gold += woodObtained;
//         document.getElementById("goldValue").innerHTML = gold;
//         completedAchievements.push("achievement_cut_down_500_trees");
//         // clearInterval(achievementMaster);
//         return true;
//     }
// }