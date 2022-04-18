import { PartialRecord } from ".";

export function setHtml(elementId: string, html: string) {
    getElement(elementId).innerHTML = html;
}

export function setValue(elementId: string, value: string) {
    getElement<HTMLInputElement>(elementId).value = value;
}

export function setIsDisplayed(elementId: string, isVisible: boolean) {
    getElement(elementId).style.display = isVisible ? "" : "none";
}

export function setIsVisible(elementId: string, isVisible: boolean) {
    getElement(elementId).style.visibility = isVisible ? "" : "hidden";
}

export function getValue(elementId: string) {
    return getElement<HTMLInputElement>(elementId).value;
}

export function getElement<T extends HTMLElement>(elementId: string) {
    const element = document.getElementById(elementId) as T;
    if (!element)
        throw new Error(`Could not find element with id ${elementId}!`);
        
    return element;
}

export function createElement<T extends HTMLElement>(tagName: string, properties?: PartialRecord<keyof T, any>) {
    const element = document.createElement(tagName) as T;
    Object.assign(element, properties);
    return element as T;
}

export function createText(data: string) {
    return document.createTextNode(data);
}

export function removeElement(elementId: string) {
    getElement(elementId).remove();
}

export function addClass(elementId: string, className: string) {
    getElement(elementId).classList.add(className);
}

export function removeClass(elementId: string, className: string) {
    getElement(elementId).classList.remove(className);
}

export function resetProgressbar(id: string, time: number) {
    getElement(id).animate([
        { width: '0%' },
        { width: '100%' }
      ], time);
}

export function animateWidth(id: string, current: number, max: number, time: number) {
    getElement(id).animate([{ width: `${current / max * 100}%` }], { duration: time, fill: 'forwards' });
}