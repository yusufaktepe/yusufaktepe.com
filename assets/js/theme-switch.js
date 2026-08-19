function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.theme = theme;
    loadGiscus();
}

window.addEventListener("DOMContentLoaded", function () {
    const dark_mode_btn = document.getElementById("dark_mode_btn");
    const light_mode_btn = document.getElementById("light_mode_btn");

    dark_mode_btn.addEventListener("click", () => setTheme("dark"));
    light_mode_btn.addEventListener("click", () => setTheme("light"));
});
