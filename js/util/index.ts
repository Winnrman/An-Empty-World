 // Returns a random integer between min (inclusive) and max (inclusive).
 export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomItem<T>(items: T[]) {
    return items[Math.floor(Math.random()*items.length)];
}

export function getKeys<T extends string | number | symbol, V>(record: Record<T, V> | PartialRecord<T, V>) {
    return Object.keys(record) as Array<T>
}

export function getEntries<T extends string | number | symbol, V>(record: Record<T, V> | PartialRecord<T, V>) {
    return Object.entries(record) as [T, V][]
}

export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export function minMax(min: number, value: number, max: number) {
    return Math.min(Math.max(min, value), max)
}

export function sum(items: number[]) {
    return items.reduce((a, b) => a + b);
}

export function tween(value: number, a: number, b: number) {
    return a + value * (b - a);
}

export function tweenArrays(value: number, a: number[], b: number[]) {
    return a.map((_, i) => tween(value, a[i], b[i]));
}

export function displayNumber(value: number) {
    return Math.round(value * 10) / 10;
}

function startsWithVowelOrHPlusVowel(value: string) {
    const isVowel = (char: string) => "aeiou".indexOf(char) >= 0;
    
    return isVowel(value[0]) || value[0] == "h" && isVowel(value[1]);
}

export function getWithIndefiniteArticle(value: string) {
    const lowerValue = value.toLowerCase();
    return (startsWithVowelOrHPlusVowel(lowerValue) ? "an " : "a ") + lowerValue;
}