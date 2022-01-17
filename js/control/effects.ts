import player from "../control/player";
import { ItemEffect } from "../data/items";

export type PlayerEffect = {
    name: string;
    value?: any;
    appliedOn: Date;
    expiresOn: Date;
}

enum EffectType {
    Immediate,
    Duration
}

const effects = [
    {
        name: "addHealth",
        type: EffectType.Immediate,
        execute: (value) => player.playerHealth = Math.min(player.maxHealth, player.playerHealth + value),
    },
    {
        name: "addStamina",
        type: EffectType.Immediate,
        execute: (value) => player.stamina += value,
    },
    {
        name: "addAttack",
        type: EffectType.Duration,
    },
    {
        name: "addSpeed",
        type: EffectType.Duration,
    },
    {
        name: "makeInvisible",
        type: EffectType.Duration,
    },
];

export function applyEffect(itemEffect: ItemEffect) {
    const effectData = effects.find(x => x.name === itemEffect.name);
    if (effectData.type === EffectType.Immediate) {
        effectData.execute(itemEffect.value);
        return;
    }

    const appliedOn = new Date();
    const effect: PlayerEffect = {
        name: itemEffect.name,
        value: itemEffect.value,
        appliedOn: appliedOn,
        expiresOn: new Date(appliedOn.getTime() + itemEffect.duration)
    }
    player.effects.push(effect);

    registerExpiry(effect);
}

export function registerEffectExpiries() {
    for (let effect of player.effects) {
        registerExpiry(effect);
    }
}

function registerExpiry(effect: PlayerEffect) {
    const msUntilExpiry = effect.expiresOn.getTime() - new Date().getTime();
    setTimeout(() => removeEffect(effect), msUntilExpiry)
}

function removeEffect(effect: PlayerEffect) {
    player.effects.splice(player.effects.indexOf(effect));
}