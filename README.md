# An-Empty-World

Main Story:
You wake up in a strange place, surrounded by debris. Unaware of how you got there, it becomes immediately aware that you're not where you should be. Your objective becomes one thing and one thing only; survive. Using your knowledge of tool building, combat, and various other skills, you must find a way to survive and escape this empty world.

## Discord Link: ## 
https://discord.gg/mBZNdYnY

## Project Setup: ##
Webpack support -> Run 'npm install' and then 'npm run start' to load files and launch on localhost:8000

## Goal: Survive ##
## Changelog:
---
 - [X] **January 16, 2022**:
   
   ### Major Changes ###
    - Reconfigured every script file to be TypeScript instead of JavaScript for better compilation error detection, as well as faster code changes reflected in the browser
    - Added webpack functionality to enable instant changes
    - 

    ### New Feature (in-progress): Potions ###
    - Allow player to gain temporary effects which boost stamina, strength, speed etc..
    - Can be found while questing but also ingredients can be found in the new activity: Harvesting!

    ### New Activity (in-development): Harvesting ### 
    - Players can go into the forest to search for berries and useful crafting materials
    - Unique loot table
    - Chance to encounter monsters / animals

    ### Bug Fixes ###
    - Crafting now takes into account what items already are ownnd and will no longer allow you to craft them
    - Crafting materials tweaked
    - Iron mining option added for faster tool / weapon / armor creation
    - Messages UI has been updated with fade out and better placement
    - Dark mode fixes
    ---

 - [X] **January 11, 2022**:

   ### Major Changes ###
    - Redesigned entire game to use modules instead of random global variables everywhere
    - Players now automatically save their progress in local storage. Your gold is safe!

   ### Combat ###
   - Player has been nerfed to now require both a weapon and armor to even be able to fight the first enemy.

   ### Inventory ###
   - When purchasing the 'Bigger Inventory' upgrade, the player's purchase is recorded in local storage, so they can keep their inventory upgrades on reload
---
 - [X] **January 10, 2022**:
   
   ### Major Changes ###
    - Updated inventory system to be based on dictionaries, instead of just one big array
    - Updated UI for inventory to be more eye-catching and easy to read

   ### Crafting ###
   - Materials needed for crafting are now shown below the specific item you have selected
   - If you have enough materials, you can craft the item
   - If you already have the item in your inventory, you can not craft it

   ### Questing ###
   - The Amulet of Luck has been added to 'Off-hand' slot and can be optained through random loot drops and random encounters
   - When held, the Amulet of Luck will cause you to only find rare and legendary items in chests

   ### Bug Fixes ###
   - Clicking 'sell Ores' button now sells all of your ores, not needing multiple presses
   - 'Clicking 'Sell Stone' now sells all of your stone, not needing multiple presses
---
 - [X] **January 8, 2022**:

    ### New Feature: Questing ###
    - Added questing system, unlocked when the player reaches level 7
    - Added sleep integration, so messages show slower than normal adding tension
    - Implemented stamina system so that quests don't last forever
    
    ### Enemies ###
    - Added a new enemy type, the "Dragon" which can drop scales useful in high-level crafting recipes
    
    ### Bug Fixes ###
    - Fixed a bug where player didn't get experience when selling ores
    - Adjusted pickaxe health to be more consistent with other tools
    - Overall semi-colon cleaning, general ESLinting

    ### Combat ###
    - Fixed a bug where the player could not attack enemies
    - Fixed a bug where the enimies would attack, but not damage the player
---
 - [X] **January 7, 2022**: 

    ### Item Shop ###
    - Worked on refund system if item you recieve from a battle or random drop you already own
    - Shop now sees if you already own the item before adding it to your inventory

    ### Inventory ###
    - Added ability to buy inventory upgrades
    - Added 'MAXED OUT' Indicator on inventory upgrade button

    ### Bugs Fixed ###
    - Fixed lag issue caused by incorrectly timed update function
    - Began rework of achievement system
    - Users now get XP when they mine ore

    ### UI ###
    - Fixed overlay issue on headers of all containers
    - Added max height of messages div to be 85% height of screen
    - Added durability box to inventory container
---
- [X] **January 6, 2022**

    ### Back-End ###
    - Added localhost saves for reload protection

    ### Other ###
    - Removed photos from GitHub repo

