import * as dom from "../util/dom";

const themes = ["auto", "time", "dark", "light"];

declare global {
    interface Window {
        checkDarkMode: () => void; // this is defined in index.html
    }
}

export function switchTheme() {
    const currentTheme = localStorage["theme"];
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    localStorage["theme"] = nextTheme;
    loadTheme();
}

export function loadTheme() {
    const theme = localStorage["theme"];
    dom.setHtml("switchTheme", `theme: ${theme}`);
    window.checkDarkMode();
}

export function startDarkmodeInterval() {
    setInterval(window.checkDarkMode, 60000);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', window.checkDarkMode);
}