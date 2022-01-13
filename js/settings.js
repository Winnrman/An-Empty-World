function checkDarkMode() {
    var hours = new Date().getHours();
    if (hours >= 15 || hours < 8) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

export function startDarkmodeInterval() {
    setInterval(checkDarkMode, 60000);
}