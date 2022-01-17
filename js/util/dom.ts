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
    return document.getElementById(elementId) as T;
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