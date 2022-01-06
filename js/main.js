let xp = 0;
let level = 1;
let neededLevelUpXP = 0;
let inventory = [];
let gold = 100;
// let messages = [];
var fishCaught = 0;
var woodObtained = 0;
var stoneObtained = 0;
meatObtained = 0;
let hitLevel2 = false;
let hitLevel3 = false;
let hitLevel4 = false;
let hitLevel5 = false;

setInterval(function () {
    document.getElementById("inventory").innerHTML = inventory;
    document.getElementById("gold").innerHTML = gold;
    inventory.sort();
    checkLevelUnlocks();
    checkDarkMode();
    localStorage.setItem("inventory", inventory);
    localStorage.setItem("gold", gold);
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
}, 1000)

// function loadSave() {
//     inventory = localStorage.getItem("inventory");
//     // inventory = localStorage.getItem("inventory");
//     gold = localStorage.getItem("gold");
//     xp = localStorage.getItem("xp");
//     level = localStorage.getItem("level");
// }

setInterval(function () {
    //remove messages after 5 seconds
    // messages.shift();
    document.getElementById("messages").innerHTML = [];
}, 15000);

function checkLevelUnlocks() {
    if (level >= 2) {
        if (hitLevel2 == false) {
            gold += 200;
        }
        hitLevel2 = true;
        //add 'Go Hunting' button to activities
        document.getElementById("goHuntingButton").style.visibility = "visible";
        document.getElementById("huntingRifle").style.visibility = "visible";
        //sell meat button
        document.getElementById("sellMeat").style.visibility = "visible";
    }
    if (level >= 3) {
        if (hitLevel3 == false) {
            gold += 300;
        }
        hitLevel3 = true;
        // add 'Go Mining' button to activities
        document.getElementById("goMiningButton").style.visibility = "visible";
        document.getElementById("pickaxe").style.visibility = "visible";
        //sell ores button
        document.getElementById("sellOres").style.visibility = "visible";
        document.getElementById("sellStone").style.visibility = "visible";
    }
    if (level >= 4) {
        if (hitLevel4 == false) {
            gold += 400;
        }
        hitLevel4 = true;
    }
    if (level >= 5) {
        if (hitLevel5 == false) {
            gold += 500;
        }
        hitLevel5 = true;
    }
}


function checkDarkMode() {
    var time = new Date();
    var hours = time.getHours();
    if (hours >= 15 || hours < 8) {
        document.body.setAttribute("class", "dark");
        document.getElementById("messages").style.color = "white";
        document.getElementById("inventory").style.color = "white";
        document.getElementById("gold").style.color = "white";
        // document.getElementById("messages").style.backgroundColor = "black";
        // document.getElementById("inventory").style.backgroundColor = "black";
        // document.getElementById("gold").style.backgroundColor = "black";
        //get all .header elemnts and change their color
        var headers = document.getElementsByClassName("header");
        for (let i = 0; i < headers.length; i++) {
            Array.prototype.forEach.call(headers, function (header) {
                header.style.color = "white";
                header.style.backgroundColor = "rgb(39, 39, 39)";
            });
        }

        var headers2 = document.getElementsByTagName("button");
        for (let i = 0; i < headers2.length; i++) {
            Array.prototype.forEach.call(headers2, function (header3) {
                header3.style.color = "white";
                header3.style.backgroundColor = "black";
            });
        }


        var headers3 = document.getElementsByTagName("div");
        for (let i = 0; i < headers2.length; i++) {
            Array.prototype.forEach.call(headers3, function (header4) {
                header4.style.borderColor = "white";
            })
        }
        var headers3 = document.getElementsByTagName("select");
        for (let i = 0; i < headers2.length; i++) {
            Array.prototype.forEach.call(headers3, function (header4) {
                header4.style.backgroundColor = "black";
                header4.style.color = "white";
                header4.style.border = "none";
            })
        }
    }
    else {
        //nothing
    }
}

document.getElementById("helmetSelect").addEventListener("change", function () {
    console.log('change event');
    //add necessary item armor to total player armor
    let helmey = document.getElementById("helmetSelect").value;
    console.log(helmey);
    for (let i = 0; i <= obtainableItems["Helmets"].length; i++) {
        if (obtainableItems["Helmets"][i].name == helmey) {
            playerDefense += obtainableItems["Helmets"][i].armor;
            document.getElementById("playerDefenseValue").innerHTML = playerDefense;
        }
        else {
            //nothing
        }
    }
});

document.getElementById("chestSelect").addEventListener("change", function () {
    console.log('change event');
    //add necessary item armor to total player armor
    let chestey = document.getElementById("chestSelect").value;
    console.log(chestey);
    for (let i = 0; i <= obtainableItems["Chestplates"].length; i++) {
        if (obtainableItems["Chestplates"][i].name == chestey) {
            playerDefense += obtainableItems["Chestplates"][i].armor;
            document.getElementById("playerDefenseValue").innerHTML = playerDefense;
        }
        else {
            //nothing
        }
    }
}
);

document.getElementById("legsSelect").addEventListener("change", function () {
    console.log('change event');
    //add necessary item armor to total player armor
    let legsey = document.getElementById("legsSelect").value;
    console.log(legsey);
    for (let i = 0; i <= obtainableItems["Leggings"].length; i++) {
        if (obtainableItems["Leggings"][i].name == legsey) {
            playerDefense += obtainableItems["Leggings"][i].armor;
            document.getElementById("playerDefenseValue").innerHTML = playerDefense;
        }
        else {
            //nothing
        }
    }
}
);

document.getElementById("bootsSelect").addEventListener("change", function () {
    console.log('change event');
    //add necessary item armor to total player armor
    let bootsey = document.getElementById("bootsSelect").value;
    console.log(bootsey);
    for (let i = 0; i <= obtainableItems["Boots"].length; i++) {
        if (obtainableItems["Boots"][i].name == bootsey) {
            playerDefense += obtainableItems["Boots"][i].armor;
            document.getElementById("playerDefenseValue").innerHTML = playerDefense;
        }
        else {
            //nothing
        }
    }
}
);
