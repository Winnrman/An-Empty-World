import { saveData } from "./player";
import * as messages from "./messages";
import { checkAchievements } from "./achievements";

export const wrapAction = (action: ((...args: any[]) => Promise<void>)) => {
    return async (...args: any[]) => {
        try {
            await action(...args);
            checkAchievements();
            saveData("User action done");
        } catch(e) {
            messages.addMessage(e);
        }
    }
}