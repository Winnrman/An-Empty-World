export function setHtml(elementId, html) {
    document.getElementById(elementId).innerHTML = html;
}

export function setValue(elementId, value) {
    document.getElementById(elementId).value = value;
}

export function setIsDisplayed(elementId, isVisible) {
    document.getElementById(elementId).style.display = isVisible ? "" : "none";
}

export function setIsVisible(elementId, isVisible) {
    document.getElementById(elementId).style.visibility = isVisible ? "" : "hidden";
}

export function getValue(elementId) {
    return document.getElementById(elementId).value;
}