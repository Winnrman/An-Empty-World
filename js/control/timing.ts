import { checkAchievements } from "./achievements";
import player, { saveData } from "./player";

let amountOfSleepsToSkip = 0;
let callbackWhenDone: (() => void) | undefined;

export function skipSleeps(amount: number, callback?: () => void) {
    amountOfSleepsToSkip = amount + (callback ? 1 : 0);
    callbackWhenDone = callback;
}

export function sleep(ms: number) {
    if (amountOfSleepsToSkip > 0) {
        amountOfSleepsToSkip--;
        return new Promise(resolve => {
            if (amountOfSleepsToSkip === 0) 
                callbackWhenDone && callbackWhenDone();
            return resolve(undefined);
        });
    }
    
    checkAchievements();
    saveData("Going to sleep");
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function calculateTime(time: number) {
    return (player.isDev && player.devSpeed) ? time / player.devSpeed : time;
}