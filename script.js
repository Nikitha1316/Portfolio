
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector("#heroVisual");
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

// MOBILE NAVIGATION

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// SUBTLE SCROLL PARALLAX

let ticking = false;

function updateParallax() {
    if (!hero || !heroVisual || reduceMotion.matches) {
        ticking = false;
        return;
    }

    const heroRect = hero.getBoundingClientRect();

    // Stop calculating once the hero is outside the viewport.
    if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) {
        ticking = false;
        return;
    }

    // The image moves more slowly than the page.
    const shift = Math.max(
        -25,
        Math.min(35, -heroRect.top * 0.09)
    );

    heroVisual.style.setProperty("--scroll-shift", `${shift}px`);

    ticking = false;
}

window.addEventListener(
    "scroll",
    () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateParallax);
        }
    },
    { passive: true }
);

window.addEventListener("resize", updateParallax);

updateParallax();

// SUBTLE MOUSE PARALLAX

if (hero && heroVisual && !reduceMotion.matches) {
    hero.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;

        const rect = hero.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        heroVisual.style.setProperty(
            "--mouse-x",
            `${x * 8}px`
        );

        heroVisual.style.setProperty(
            "--mouse-y",
            `${y * 6}px`
        );
    });

    hero.addEventListener("pointerleave", () => {
        heroVisual.style.setProperty("--mouse-x", "0px");
        heroVisual.style.setProperty("--mouse-y", "0px");
    });
}

const yearElement = document.getElementById("currentYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* EXPERIENCE TIMELINE SCROLL ANIMATION */

const journeyBlocks = document.querySelectorAll(
    ".journey-block:not(.education-block)"
);

function updateExperienceTimeline() {
    const startPoint = window.innerHeight * 0.75;
    const endPoint = window.innerHeight * 0.35;

    journeyBlocks.forEach((block) => {
        const rect = block.getBoundingClientRect();

        const totalDistance =
            rect.height + startPoint - endPoint;

        const progress =
            (startPoint - rect.top) / totalDistance;

        const clampedProgress = Math.max(
            0,
            Math.min(1, progress)
        );

        block.style.setProperty(
            "--timeline-progress",
            clampedProgress
        );

        const items = block.querySelectorAll(".timeline-item");

        items.forEach((item) => {
            const itemPosition = item.getBoundingClientRect();

            if (itemPosition.top < startPoint) {
                item.classList.add("is-reached");
            } else {
                item.classList.remove("is-reached");
            }
        });
    });
}

let timelineFrame = null;

function requestTimelineUpdate() {
    if (timelineFrame !== null) return;

    timelineFrame = requestAnimationFrame(() => {
        updateExperienceTimeline();
        timelineFrame = null;
    });
}

window.addEventListener("scroll", requestTimelineUpdate, {
    passive: true
});

window.addEventListener("resize", requestTimelineUpdate);

updateExperienceTimeline();



/* LIGHT / DARK THEME SWITCH */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);

    if (themeToggle) {
        const iconName = theme === "dark" ? "sun" : "moon";
        const nextTheme = theme === "dark" ? "light" : "dark";

        themeToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;

        themeToggle.setAttribute(
            "aria-label",
            `Switch to ${nextTheme} theme`
        );

        themeToggle.setAttribute(
            "title",
            `Switch to ${nextTheme} theme`
        );

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    }
}

// Restore the saved theme, or use dark mode by default.
const savedTheme = localStorage.getItem("portfolio-theme");
applyTheme(savedTheme === "light" ? "light" : "dark");

// Toggle between light and dark.
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "dark";

        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
}

if (typeof lucide !== "undefined") {
    lucide.createIcons();
}