export function setHtml(elementId, html) {
    document.getElementById(elementId).innerHTML = html;
}

export function setIsDisplayed(elementId, isVisible) {
    document.getElementById(elementId).style.display = isVisible ? "" : "none";
}

export function setIsVisible(elementId, isVisible) {
    document.getElementById(elementId).style.visibility = isVisible ? "" : "hidden";
}