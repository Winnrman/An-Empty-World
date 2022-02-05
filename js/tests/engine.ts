import { resetAchievementsToCheck } from "../control/achievements";
import * as equipment from "../control/equipment";
import * as main from "../main";
import player, { pauseSaving, saveData, resetData, restoreData, resumeSaving, Player } from "../control/player";
import { verify } from "./verify";

export default async function runTestScenario(data: Player, runScenario: (step: Step, levelUp?: boolean) => Promise<void>, keepTestDataAfterwards?: boolean, levelUp?: boolean) {
    const start = new Date();
    const dev = player.dev;
    pauseSaving();
    resetData();
    player.dev = dev;
    resetAchievementsToCheck();
    equipment.updateArmour();

    try {
        await runScenario((name: string, action:(data: Player) => Promise<void>) => step(data, name, action), levelUp);
        const end = new Date();
        const diff = end.getTime() - start.getTime();
        console.log(`Tests OK! Took ${diff / 1000}s`)
    } finally {

        if (!keepTestDataAfterwards)
            restoreData();
        
        player.dev = dev;
        main.checkAndRenderEverything();
        resumeSaving();
    
        saveData("Saving after test");
    }
}

export type StepAction = (data: Player) => Promise<void>;
export type Step = (name: string, actions: StepAction | StepAction[], doVerify?: false) => Promise<void>;

export async function step(data: Player, name: string, actions: StepAction | StepAction[], doVerify?: false) {
    if (Array.isArray(actions)) {
        for (const action of actions) {
            await (action(data));
        }
    } else {
        await actions(data);
    }
    
    if (doVerify !== false)
        verify(data, name);
}

export function applyChanges(data: Player, successChange: (data: Player) => void, changes: (true | ((data: Player) => void))[]) {
    if (!changes.length)
        successChange(data);
    
    for (const applyChange of changes) {
        if (applyChange === true)
            successChange(data);
        else
            applyChange(data);
    }
}

export type ChangeSet = (true | ((data: Player) => void))[];
export function execute(action: StepAction, successChange: (data: Player) => void, changes: ChangeSet) {
    return async (data: Player) => {
        await action(data);
        applyChanges(data, successChange, changes);
    };
}

