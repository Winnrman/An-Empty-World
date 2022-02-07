import { addPlayerHealth } from "../activities/combat";
import { addStamina } from "../activities/questing";
import player from "../control/player";
import { DurationItemEffect, ImmediateItemEffect, ItemEffect } from "../data/items";
import { setHtml } from "../util/dom";
import { updateArmour } from "./equipment";
import { displayNumber } from "../util";

import "../../css/effects.css";

export type PlayerEffect = {
    name: DurationEffectName;
    value: number;
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

export type ImmediateEffectName = "addHealth" | "addStamina";
export type DurationEffectName =  "addAttack" | "decreaseAttack" | "addDefense" | "addSpeed" | "makeInvisible";
export type EffectName = ImmediateEffectName | DurationEffectName;

type ImmediateEffectData = {
    name: ImmediateEffectName;
    type: EffectType;
    execute: (value: number) => void;
}

type DurationEffectData = {
    name: DurationEffectName;
    type: EffectType;
    calculation: EffectCalculation;
    getDescription: (value: number) => string;
    start: () => void;
    end: () => void;
}

const immediateEffects: ImmediateEffectData[] = [
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
];

const durationEffects: DurationEffectData[] = [
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

const immediateEffectsByName: { [key in ImmediateEffectName]: ImmediateEffectData } = Object.assign({}, ...immediateEffects.map(x => ({ [x.name]: x })));
const durationEffectsByName: { [key in DurationEffectName]: DurationEffectData } = Object.assign({}, ...durationEffects.map(x => ({ [x.name]: x })));

export type EffectData = ImmediateEffectData | DurationEffectData;
const effects: EffectData[] = [...immediateEffects, ...durationEffects];
const effectsByName: { [key in EffectName]: EffectData } = Object.assign({}, ...effects.map(x => ({ [x.name]: x })));

export function applyEffects(itemEffects: ItemEffect[]) {
    for (const itemEffect of itemEffects) {
        applyEffect(itemEffect);
    }
}

export function applyEffect(itemEffect: ItemEffect) {
    if (!itemEffect.duration) {
        const immediateItemEffect = itemEffect as ImmediateItemEffect;
        const immediateEffect = immediateEffectsByName[immediateItemEffect.name];
        immediateEffect.execute(itemEffect.value);
        return;
    }

    const durationItemEffect = itemEffect as DurationItemEffect;
    const durationEffect = durationEffectsByName[durationItemEffect.name];
    const appliedOn = new Date();
    const effect: PlayerEffect = {
        name: durationEffect.name,
        value: durationItemEffect.value,
        appliedOn: appliedOn,
        expiresOn: new Date(appliedOn.getTime() + durationItemEffect.duration),
        duration: durationItemEffect.duration
    }

    player.effects.push(effect);
    durationEffect.start();

    registerExpiry(effect);
    if (player.effects.length === 1)
        renderEffects();
}

export function registerEffectExpiries() {
    for (const effect of player.effects) {
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
    player.effects.splice(player.effects.indexOf(effect), 1);
    const effectData = durationEffectsByName[effect.name];
    effectData.end!();
    renderEffects();
}

export function getEffectValue(effectName: DurationEffectName) {
    if (!hasEffect(effectName))
        return 0;

    const effectData = durationEffectsByName[effectName];
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
    if (!player.effects.length) {
        setHtml("effects", "None!");
        return;
    }

    let html = "";
    for (const effect of player.effects) {
        const effectData = durationEffectsByName[effect.name];
        const millisecondsUntilExpiry = getMilisecondsUntilExpiry(effect);
        const timeUntilExpiry = Math.ceil(millisecondsUntilExpiry / 100) / 10;
        const width = millisecondsUntilExpiry / effect.duration * 100;
        const description = effectData.getDescription(effect.value);
        html += `<div class="progress-bar"><span style="width: ${width}%;"></span></div> ${description} (${displayNumber(timeUntilExpiry)}s)<br />`;
    }

    setHtml("effects", html);

    setTimeout(renderEffects, 100);
}