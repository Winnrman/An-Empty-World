import { addPlayerHealth } from "../activities/combat";
import { addStamina } from "../activities/questing";
import player from "../control/player";
import { ItemEffect } from "../data/items";
import { setHtml } from "../util/dom";
import { updateArmour } from "./equipment";

import "../../css/effects.css";
import { displayNumber } from "../util";

export type PlayerEffect = {
    name: EffectName;
    value?: number;
    appliedOn: Date;
    expiresOn: Date;
    duration: number;
}

enum EffectType {
    Immediate,
    Duration
}

enum EffectCalculation {
    Maximum,
    IsPresent
}

export type EffectName = "addHealth" | "addStamina" | "addAttack" | "decreaseAttack" | "addDefense" | "addSpeed" | "makeInvisible";
export type EffectData = {
    name: EffectName;
    type: EffectType;
    calculation?: EffectCalculation;
    getDescription?: (value: number) => string;
    execute?: (value: number) => void;
    start?: () => void;
    end?: () => void;
}

const effects: EffectData[] = [
    {
        name: "addHealth",
        type: EffectType.Immediate,
        execute: (value) => addPlayerHealth(value),
    },
    {
        name: "addStamina",
        type: EffectType.Immediate,
        execute: (value) => addStamina(value),
    },
    {
        name: "addAttack",
        getDescription: (value) => `${value} Attack bonus`,
        type: EffectType.Duration,
        calculation: EffectCalculation.Maximum,
        start: updateArmour,
        end: updateArmour,
    },
    {
        name: "decreaseAttack",
        getDescription: (value) => `-${value} Attack bonus`,
        type: EffectType.Duration,
        calculation: EffectCalculation.Maximum,
        start: updateArmour,
        end: updateArmour,
    },
    {
        name: "addDefense",
        getDescription: (value) => `${value} Defense bonus`,
        type: EffectType.Duration,
        calculation: EffectCalculation.Maximum,
        start: updateArmour,
        end: updateArmour,
    },
    {
        name: "addSpeed",
        getDescription: (value) => `${value} Speed bonus`,
        type: EffectType.Duration,
        calculation: EffectCalculation.Maximum,
        start: updateArmour,
        end: updateArmour,
    },
    {
        name: "makeInvisible",
        getDescription: () => "Become invisible",
        type: EffectType.Duration,
        calculation: EffectCalculation.IsPresent,
        start: () => {},
        end: () => {},
    },
];
const effectsByName: { [key in EffectName]: EffectData } = Object.assign({}, ...effects.map(x => ({ [x.name]: x })));

export function applyEffects(itemEffects: ItemEffect[]) {
    for (const itemEffect of itemEffects) {
        applyEffect(itemEffect);
    }
}

export function applyEffect(itemEffect: ItemEffect) {
    const effectData = effectsByName[itemEffect.name];
    if (effectData.type === EffectType.Immediate) {
        effectData.execute(itemEffect.value);
        return;
    }

    const appliedOn = new Date();
    const effect: PlayerEffect = {
        name: itemEffect.name,
        value: itemEffect.value,
        appliedOn: appliedOn,
        expiresOn: new Date(appliedOn.getTime() + itemEffect.duration),
        duration: itemEffect.duration
    }
    player.effects.push(effect);
    effectData.end();

    registerExpiry(effect);
    renderEffects();
}

export function registerEffectExpiries() {
    for (let effect of player.effects) {
        registerExpiry(effect);
    }
}

function getMilisecondsUntilExpiry(effect: PlayerEffect) {
    return effect.expiresOn.getTime() - new Date().getTime();
}

function registerExpiry(effect: PlayerEffect) {
    setTimeout(() => removeEffect(effect), getMilisecondsUntilExpiry(effect))
}

function removeEffect(effect: PlayerEffect) {
    player.effects.splice(player.effects.indexOf(effect));
    const effectData = effectsByName[effect.name];
    effectData.end();
    renderEffects();
}

export function getEffectValue(effectName: EffectName) {
    if (!hasEffect(effectName))
        return 0;

    const effectData = effectsByName[effectName];
    const playerEffectsOfType = player.effects.filter(x => x.name == effectName);
    
    switch (effectData.calculation) {
        case EffectCalculation.Maximum: return Math.max(...playerEffectsOfType.map(x => x.value))
    }

    return 0;
}

export function hasEffect(effectName: EffectName) {
    return player.effects.some(x => x.name == effectName);
}

export function renderEffects() {
    let html = "";
    for (let effect of player.effects) {
        const effectData = effectsByName[effect.name];
        const millisecondsUntilExpiry = getMilisecondsUntilExpiry(effect);
        const timeUntilExpiry = Math.ceil(millisecondsUntilExpiry / 100) / 10;
        const width = millisecondsUntilExpiry / effect.duration * 100;
        const description = effectData.getDescription(effect.value);
        html += `<div class="progress-bar"><span style="width: ${width}%;"></span></div> ${description} (${displayNumber(timeUntilExpiry)}s)<br />`;
    }

    if (player.effects.length === 0) {
        html += "None!";
    }

    setHtml("effects", html);
}

setInterval(renderEffects, 100);