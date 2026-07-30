const syncViewportHeight = () => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty("--app-vh", `${viewportHeight * 0.01}px`);
};

syncViewportHeight();

const isDesktopHomePage = () => document.body.classList.contains("home-page") && window.matchMedia("(min-width: 768px)").matches;

const resetDesktopHomeScroll = () => {
    if (!isDesktopHomePage()) {
        return;
    }

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
};

resetDesktopHomeScroll();

window.addEventListener("load", () => {
    syncViewportHeight();
    window.requestAnimationFrame(syncViewportHeight);
    resetDesktopHomeScroll();
    window.requestAnimationFrame(resetDesktopHomeScroll);
});

window.addEventListener("pageshow", () => {
    document.body.classList.remove("mobile-nav-open", "modal-open");
    document.documentElement.classList.remove("modal-lock");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    syncViewportHeight();
    window.requestAnimationFrame(syncViewportHeight);
    resetDesktopHomeScroll();
    window.requestAnimationFrame(resetDesktopHomeScroll);
});

window.addEventListener("resize", syncViewportHeight);
window.addEventListener("orientationchange", () => {
    window.setTimeout(syncViewportHeight, 250);
});
window.visualViewport?.addEventListener("resize", syncViewportHeight);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll reveal for sections
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add 'active' class when element enters viewport
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.1 });

reveals.forEach(reveal => {
    observer.observe(reveal);
});

// Mobile navigation drawer
const mobileNavToggles = document.querySelectorAll(".mobile-nav-toggle");
const mobileNavDrawers = document.querySelectorAll(".mobile-nav-drawer");
const mobileNavCloseButtons = document.querySelectorAll(".mobile-nav-close");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

const closeMobileNav = () => {
    document.body.classList.remove("mobile-nav-open");
    mobileNavDrawers.forEach(drawer => {
        drawer.setAttribute("aria-hidden", "true");
        drawer.setAttribute("inert", "");
    });
    mobileNavToggles.forEach(toggle => {
        toggle.setAttribute("aria-expanded", "false");
    });
};

const openMobileNav = (drawer) => {
    document.body.classList.add("mobile-nav-open");
    mobileNavDrawers.forEach(node => {
        node.setAttribute("aria-hidden", node === drawer ? "false" : "true");
        if (node === drawer) {
            node.removeAttribute("inert");
        } else {
            node.setAttribute("inert", "");
        }
    });
    mobileNavToggles.forEach(toggle => {
        toggle.setAttribute("aria-expanded", "true");
    });
};

mobileNavToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
        const drawerId = toggle.getAttribute("aria-controls");
        const drawer = drawerId ? document.getElementById(drawerId) : null;

        if (document.body.classList.contains("mobile-nav-open")) {
            closeMobileNav();
            return;
        }

        openMobileNav(drawer);
    });
});

mobileNavCloseButtons.forEach(button => {
    button.addEventListener("click", closeMobileNav);
});

mobileNavDrawers.forEach(drawer => {
    const backdrop = drawer.querySelector(".mobile-nav-backdrop");
    if (backdrop) {
        backdrop.addEventListener("click", closeMobileNav);
    }

    drawer.addEventListener("click", closeMobileNav);
});

mobileNavLinks.forEach(link => {
    link.addEventListener("click", closeMobileNav);
});

document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("mobile-nav-open")) {
        return;
    }

    const clickedToggle = event.target.closest(".mobile-nav-toggle");
    if (!clickedToggle) {
        closeMobileNav();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        closeMobileNav();
    }
});

// About page mobile "More" toggle
const aboutMoreToggle = document.querySelector(".about-more-toggle");
const aboutMoreContent = document.querySelector(".about-more-content");

if (aboutMoreToggle && aboutMoreContent) {
    aboutMoreToggle.addEventListener("click", () => {
        const isOpen = aboutMoreContent.classList.toggle("about-more-content-open");
        aboutMoreToggle.setAttribute("aria-expanded", String(isOpen));
        aboutMoreToggle.textContent = isOpen ? "Less" : "More";
    });
}

// Hero background fade carousel
const heroRotator = document.querySelector(".hero-bg-rotator");
if (heroRotator) {
    const heroSlides = Array.from(heroRotator.querySelectorAll(".hero-bg-slide"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileHero = window.matchMedia("(max-width: 767px)").matches;
    const slideDelayMs = 3000;
    const fadeDurationMs = 5000;
    let currentHeroSlideIndex = 0;
    let heroSlideTimer = null;

    const setHeroSlide = (nextIndex) => {
        const currentSlide = heroSlides[currentHeroSlideIndex];
        const nextSlide = heroSlides[nextIndex];

        if (!currentSlide || !nextSlide || currentSlide === nextSlide) {
            return;
        }

        nextSlide.classList.add("hero-bg-slide-active");

        window.setTimeout(() => {
            currentSlide.classList.remove("hero-bg-slide-active");
            currentHeroSlideIndex = nextIndex;
        }, 50);
    };

    if (heroSlides.length > 0) {
        heroSlides.forEach((slide, index) => {
            slide.classList.toggle("hero-bg-slide-active", index === 0);
        });
    }

    if (!prefersReducedMotion && !isMobileHero && heroSlides.length > 1) {
        window.setTimeout(() => {
            setHeroSlide((currentHeroSlideIndex + 1) % heroSlides.length);

            heroSlideTimer = window.setInterval(() => {
                const nextIndex = (currentHeroSlideIndex + 1) % heroSlides.length;
                setHeroSlide(nextIndex);
            }, slideDelayMs + fadeDurationMs);
        }, slideDelayMs);
    }
}

// Gallery modal logic
const projectImages = {
    "help-fifa-track": [
        "assets/images/projects/help-fifa-track/help-fifa-track-01.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-02.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-03.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-04.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-05.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-06.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-07.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-08.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-09.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-10.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-11.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-12.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-13.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-14.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-15.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-16.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-17.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-18.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-19.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-20.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-21.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-22.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-23.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-24.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-25.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-26.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-27.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-28.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-29.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-30.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-31.webp",
        "assets/images/projects/help-fifa-track/help-fifa-track-32.webp"
    ],
    "hoki-field": [
        "assets/images/projects/hoki-field/hoki-field-01.webp",
        "assets/images/projects/hoki-field/hoki-field-02.webp",
        "assets/images/projects/hoki-field/hoki-field-03.webp",
        "assets/images/projects/hoki-field/hoki-field-04.webp",
        "assets/images/projects/hoki-field/hoki-field-05.webp",
        "assets/images/projects/hoki-field/hoki-field-06.webp",
        "assets/images/projects/hoki-field/hoki-field-07.webp",
        "assets/images/projects/hoki-field/hoki-field-08.webp",
        "assets/images/projects/hoki-field/hoki-field-09.webp",
        "assets/images/projects/hoki-field/hoki-field-10.webp",
        "assets/images/projects/hoki-field/hoki-field-11.webp",
        "assets/images/projects/hoki-field/hoki-field-12.webp",
        "assets/images/projects/hoki-field/hoki-field-13.webp",
        "assets/images/projects/hoki-field/hoki-field-14.webp",
        "assets/images/projects/hoki-field/hoki-field-15.webp",
        "assets/images/projects/hoki-field/hoki-field-16.webp",
        "assets/images/projects/hoki-field/hoki-field-17.webp",
        "assets/images/projects/hoki-field/hoki-field-18.webp",
        "assets/images/projects/hoki-field/hoki-field-19.webp",
        "assets/images/projects/hoki-field/hoki-field-20.webp",
        "assets/images/projects/hoki-field/hoki-field-21.webp",
        "assets/images/projects/hoki-field/hoki-field-22.webp",
        "assets/images/projects/hoki-field/hoki-field-23.webp",
        "assets/images/projects/hoki-field/hoki-field-24.webp",
        "assets/images/projects/hoki-field/hoki-field-25.webp"
    ],
    "driving-school": [
        "assets/images/projects/driving-school/driving-school-01.webp",
        "assets/images/projects/driving-school/driving-school-02.webp",
        "assets/images/projects/driving-school/driving-school-03.webp",
        "assets/images/projects/driving-school/driving-school-04.webp",
        "assets/images/projects/driving-school/driving-school-05.webp",
        "assets/images/projects/driving-school/driving-school-06.webp",
        "assets/images/projects/driving-school/driving-school-07.webp",
        "assets/images/projects/driving-school/driving-school-08.webp",
        "assets/images/projects/driving-school/driving-school-09.webp",
        "assets/images/projects/driving-school/driving-school-10.webp",
        "assets/images/projects/driving-school/driving-school-11.webp",
        "assets/images/projects/driving-school/driving-school-12.webp",
        "assets/images/projects/driving-school/driving-school-13.webp",
        "assets/images/projects/driving-school/driving-school-14.webp",
        "assets/images/projects/driving-school/driving-school-15.webp",
        "assets/images/projects/driving-school/driving-school-16.webp",
        "assets/images/projects/driving-school/driving-school-17.webp",
        "assets/images/projects/driving-school/driving-school-18.webp",
        "assets/images/projects/driving-school/driving-school-19.webp"
    ],
    "i-city-go-kart": [
        "assets/images/projects/i-city-go-kart/i-city-go-kart-01.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-02.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-03.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-04.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-05.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-06.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-07.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-08.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-09.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-10.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-11.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-12.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-13.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-14.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-15.webp",
        "assets/images/projects/i-city-go-kart/i-city-go-kart-16.webp"
    ],
    "gce-projects": [
        {
            title: "Construction of Water Pipe Chambers",
            images: [
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-01.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-02.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-03.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-04.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-05.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-06.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-07.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-08.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-09.webp",
                "assets/images/projects/gce/water-pipe-chambers/gce-water-pipe-chambers-10.webp"
            ]
        },
        {
            title: "Site Clearing,Earthwork and Temporary Access at KKB",
            images: [
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-01.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-02.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-03.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-04.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-05.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-06.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-07.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-08.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-09.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-10.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-11.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-12.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-13.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-14.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-15.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-16.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-17.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-18.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-19.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-20.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-21.webp",
                "assets/images/projects/gce/site-clearing-earthwork-temporary-access-kkb/gce-site-clearing-earthwork-temporary-access-kkb-22.webp"
            ]
        }
    ],
    "sunway-earthwork-road": [
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-01.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-02.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-03.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-04.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-05.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-06.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-07.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-08.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-09.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-10.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-11.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-12.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-13.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-14.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-15.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-16.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-17.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-18.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-19.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-20.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-21.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-22.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-23.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-24.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-25.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-26.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-27.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-28.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-29.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-30.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-31.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-32.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-33.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-34.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-35.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-36.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-37.webp",
        "assets/images/projects/sunway-earthwork-road/sunway-earthwork-road-38.webp"
    ],
    "ongoing-tafe": [
        "assets/images/projects/ongoing-tafe/ongoing-tafe-01.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-02.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-03.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-04.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-05.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-06.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-07.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-08.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-09.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-10.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-11.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-12.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-13.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-14.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-15.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-16.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-17.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-18.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-19.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-20.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-21.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-22.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-23.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-24.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-25.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-26.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-27.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-28.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-29.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-30.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-31.webp",
        "assets/images/projects/ongoing-tafe/ongoing-tafe-32.webp"
    ],
    "ongoing-tmc": [
        "assets/images/projects/ongoing-tmc/ongoing-tmc-01.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-02.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-03.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-04.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-05.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-06.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-07.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-08.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-09.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-10.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-11.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-12.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-13.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-14.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-15.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-16.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-17.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-18.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-19.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-20.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-21.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-22.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-23.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-24.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-25.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-26.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-27.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-28.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-29.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-30.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-31.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-32.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-33.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-34.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-35.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-36.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-37.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-38.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-39.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-40.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-41.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-42.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-43.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-44.webp",
        "assets/images/projects/ongoing-tmc/ongoing-tmc-45.webp"
    ]
};

const galleryItems = document.querySelectorAll(".gallery-item");
const galleryModal = document.getElementById("galleryModal");
const modalGallery = document.getElementById("modalGallery");
const modalGalleryTitle = document.getElementById("modalGalleryTitle");

if (galleryModal && modalGallery && galleryItems.length > 0) {
    const galleryPanel = galleryModal.querySelector(".modal-panel");

    const lockGalleryScroll = () => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    };

    const unlockGalleryScroll = () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    };

    const closeGalleryModal = () => {
        galleryModal.classList.add("opacity-0");
        galleryPanel?.classList.add("scale-95");
        window.setTimeout(() => {
            galleryModal.classList.add("hidden");
            galleryModal.classList.remove("flex");
            modalGallery.innerHTML = "";
            if (modalGalleryTitle) {
                modalGalleryTitle.textContent = "Project Gallery";
            }
            unlockGalleryScroll();
        }, 300);
    };

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const project = item.dataset.project;
            const projectEntry = projectImages[project] || [];
            const projectTitle = item.querySelector("h3")?.textContent?.trim()
                || item.querySelector("img")?.alt?.trim()
                || "Project Gallery";

            modalGallery.innerHTML = "";
            modalGallery.className = "project-gallery-grid";
            if (modalGalleryTitle) {
                modalGalleryTitle.textContent = projectTitle;
            }

            const appendImageCard = (src, altText, container) => {
                const card = document.createElement("div");
                card.className = "project-gallery-card";

                const img = document.createElement("img");
                img.src = src;
                img.alt = altText;
                img.loading = "lazy";
                img.className = "project-gallery-image";

                card.appendChild(img);
                container.appendChild(card);
            };

            const hasSections = Array.isArray(projectEntry)
                && projectEntry.length > 0
                && typeof projectEntry[0] === "object"
                && !Array.isArray(projectEntry[0]);

            if (hasSections) {
                modalGallery.className = "project-gallery-stack";
                projectEntry.forEach(section => {
                    const sectionWrap = document.createElement("section");
                    sectionWrap.className = "project-gallery-section";

                    const sectionTitle = document.createElement("h4");
                    sectionTitle.className = "project-gallery-section-title";
                    sectionTitle.textContent = section.title || "Project Photos";

                    const sectionGrid = document.createElement("div");
                    sectionGrid.className = "project-gallery-grid";

                    (section.images || []).forEach(src => {
                        appendImageCard(src, section.title || projectTitle, sectionGrid);
                    });

                    sectionWrap.appendChild(sectionTitle);
                    sectionWrap.appendChild(sectionGrid);
                    modalGallery.appendChild(sectionWrap);
                });
            } else {
                projectEntry.forEach(src => {
                    appendImageCard(src, projectTitle, modalGallery);
                });
            }

            if (modalGallery.children.length === 0) {
                const emptyState = document.createElement("div");
                emptyState.className = "col-span-full rounded-2xl border border-white/15 bg-white/10 px-5 py-10 text-center text-white/85";
                emptyState.textContent = "Project photos will appear here once they are added.";
                modalGallery.appendChild(emptyState);
            }

            galleryModal.classList.remove("hidden");
            galleryModal.classList.add("flex");

            // Animate fade/zoom in
            requestAnimationFrame(() => {
                galleryModal.classList.remove("opacity-0");
                galleryPanel?.classList.remove("scale-95");
            });

            lockGalleryScroll();
        });
    });

    // Close modal on overlay click
    galleryModal.addEventListener("click", (e) => {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !galleryModal.classList.contains("hidden")) {
            closeGalleryModal();
        }
    });
}

// Document preview modal for certifications / charts
const documentPreviewCards = document.querySelectorAll(".document-preview-card");
const documentPreviewModal = document.getElementById("documentPreviewModal");
const documentPreviewContent = document.getElementById("documentPreviewContent");

if (documentPreviewModal && documentPreviewContent && documentPreviewCards.length > 0) {
    const lockPageScroll = () => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    };

    const unlockPageScroll = () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    };

    const closeDocumentPreview = () => {
        documentPreviewModal.classList.remove("document-preview-open");
        window.setTimeout(() => {
            documentPreviewModal.classList.add("hidden");
            documentPreviewModal.classList.remove("flex");
            documentPreviewModal.setAttribute("aria-hidden", "true");
            documentPreviewContent.innerHTML = "";
            unlockPageScroll();
        }, 220);
    };

    documentPreviewCards.forEach(card => {
        card.addEventListener("click", () => {
            documentPreviewContent.innerHTML = "";
            const previewImage = card.querySelector("img");

            if (previewImage && previewImage.offsetParent !== null) {
                const imageClone = previewImage.cloneNode(true);
                documentPreviewContent.appendChild(imageClone);
            } else {
                const placeholder = document.createElement("div");
                placeholder.className = "document-preview-placeholder";

                const title = card.parentElement?.querySelector("h3")?.textContent?.trim() || "Document Preview";
                const body = card.textContent?.trim() || "Preview not available yet.";

                placeholder.innerHTML = `
                    <h3 class="text-2xl sm:text-4xl font-black mb-4">${title}</h3>
                    <p class="text-base sm:text-lg text-white/85 leading-relaxed">${body}</p>
                `;

                documentPreviewContent.appendChild(placeholder);
            }

            documentPreviewModal.classList.remove("hidden");
            documentPreviewModal.classList.add("flex");
            documentPreviewModal.setAttribute("aria-hidden", "false");

            requestAnimationFrame(() => {
                documentPreviewModal.classList.add("document-preview-open");
            });

            lockPageScroll();
        });
    });

    documentPreviewModal.addEventListener("click", closeDocumentPreview);

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && documentPreviewModal.classList.contains("document-preview-open")) {
            closeDocumentPreview();
        }
    });
}
