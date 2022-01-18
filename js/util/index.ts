/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
 export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomItem<T>(items: T[]) {
    return items[Math.floor(Math.random()*items.length)];
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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