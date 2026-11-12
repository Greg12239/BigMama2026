const loader = document.querySelector("[data-loader]");
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const progress = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const scrollMotionItems = document.querySelectorAll("[data-scroll-motion]");
const ingredients = document.querySelectorAll(".ingredient, .ingredient-photo");
const magneticItems = document.querySelectorAll(".magnetic");
const menuSection = document.querySelector("#menu");
const menuTitle = document.querySelector("[data-menu-title]");
const menuTabs = document.querySelectorAll("[data-menu-tab]");
const menuPanels = document.querySelectorAll("[data-menu-panel]");
const stickyOrder = document.querySelector("[data-sticky-order]");
const tokyoRotator = document.querySelector("[data-tokyo-card] .tokyo-image-rotator");
let menuSwitchTimer;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loaderExitDelay = 2150;

if (loader) {
  document.body.classList.add("is-loading");
}

function finishLoader({ immediate = false } = {}) {
  if (loader?.classList.contains("is-hidden")) return;

  if (!loader) {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
    return;
  }

  if (immediate) {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
    return;
  }

  loader.classList.add("is-exiting");

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
  }, 520);
}

if (prefersReducedMotion) {
  window.setTimeout(() => finishLoader({ immediate: true }), 240);
} else {
  window.setTimeout(() => finishLoader(), loaderExitDelay);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
  revealObserver.observe(item);
});

function updateScrollUI() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  progress.style.width = `${progressWidth}%`;
  header?.classList.toggle("is-scrolled", window.scrollY > 24);

  if (stickyOrder && menuSection) {
    const menuRect = menuSection.getBoundingClientRect();
    const showOrderBar = menuRect.top < window.innerHeight * 0.38 && menuRect.bottom > window.innerHeight * 0.18;
    stickyOrder.classList.toggle("is-visible", showOrderBar);
  }

  if (!prefersReducedMotion) {
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.parallax || 0);
      item.style.transform = `translate3d(0, ${window.scrollY * depth * -0.12}px, 0)`;
    });

    scrollMotionItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const viewportMiddle = window.innerHeight * 0.5;
      const elementMiddle = rect.top + rect.height * 0.5;
      const distance = viewportMiddle - elementMiddle;
      const range = window.innerHeight + rect.height;
      const progress = Math.max(-1, Math.min(1, distance / range));
      const x = Number(item.dataset.scrollX || 0) * progress;
      const y = Number(item.dataset.scrollY || 0) * progress;
      const rotate = Number(item.dataset.scrollRotate || 0) * progress;

      item.style.setProperty("--motion-x", `${x.toFixed(2)}px`);
      item.style.setProperty("--motion-y", `${y.toFixed(2)}px`);
      item.style.setProperty("--motion-rotate", `${rotate.toFixed(3)}deg`);
    });

    ingredients.forEach((item) => {
      const stage = item.closest("[data-ingredient-stage]");
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const viewportMiddle = window.innerHeight * 0.5;
      const distance = viewportMiddle - rect.top;
      const depth = Number(item.dataset.depth || 0.1);
      const limited = Math.max(-80, Math.min(110, distance * depth));
      const rotate = Math.max(-7, Math.min(7, limited * 0.05));

      item.style.transform = `translate3d(0, ${limited}px, 0) rotate(${rotate}deg)`;
    });
  }
}

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      updateScrollUI();
      ticking = false;
    });
    ticking = true;
  },
  { passive: true }
);

updateScrollUI();

menuPanels.forEach((panel) => {
  if (panel.classList.contains("is-active")) {
    panel.querySelectorAll(".menu-card").forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 70, 180)}ms`;
      card.classList.add("is-menu-visible", "is-visible");
    });
  }
});

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.menuTab;
    const currentPanel = Array.from(menuPanels).find((panel) => panel.classList.contains("is-active"));
    const nextPanel = Array.from(menuPanels).find((panel) => panel.dataset.menuPanel === target);

    if (!target || !nextPanel || currentPanel === nextPanel || tab.getAttribute("aria-disabled") === "true") return;

    window.clearTimeout(menuSwitchTimer);

    menuTabs.forEach((item) => {
      const isCurrent = item === tab;
      item.classList.toggle("is-active", isCurrent);
      item.setAttribute("aria-selected", String(isCurrent));
    });

    if (menuTitle && tab.dataset.titleSrc) {
      menuTitle.classList.add("is-switching");
      menuTitle.src = tab.dataset.titleSrc;
      menuTitle.alt = tab.dataset.titleAlt || tab.textContent.trim();
      if (tab.dataset.titleWidth) menuTitle.width = Number(tab.dataset.titleWidth);
      if (tab.dataset.titleHeight) menuTitle.height = Number(tab.dataset.titleHeight);
      menuTitle.classList.toggle("is-chicken-title", target === "chicken");

      window.setTimeout(() => {
        menuTitle.classList.remove("is-switching");
      }, 260);
    }

    currentPanel?.classList.add("is-leaving");
    currentPanel?.querySelectorAll(".menu-card").forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 35, 90)}ms`;
      card.classList.remove("is-menu-visible");
    });

    menuSwitchTimer = window.setTimeout(() => {
      currentPanel?.classList.remove("is-active", "is-leaving");
      if (currentPanel) currentPanel.hidden = true;

      nextPanel.hidden = false;
      nextPanel.classList.add("is-active", "is-entering");

      const cards = nextPanel.querySelectorAll(".menu-card");
      cards.forEach((card, index) => {
        card.style.transitionDelay = `${120 + Math.min(index * 75, 220)}ms`;
        card.classList.add("is-visible");
        card.classList.remove("is-menu-visible");
      });

      window.requestAnimationFrame(() => {
        cards.forEach((card) => card.classList.add("is-menu-visible"));
        window.setTimeout(() => nextPanel.classList.remove("is-entering"), 520);
      });
    }, 210);
  });
});

if (tokyoRotator) {
  const tokyoImages = tokyoRotator.querySelectorAll(".tokyo-image");
  let activeTokyoImage = 0;

  tokyoImages.forEach((image) => {
    const preload = new Image();
    preload.src = image.currentSrc || image.src;
  });

  if (!prefersReducedMotion && tokyoImages.length === 2) {
    window.setInterval(() => {
      tokyoImages[activeTokyoImage].classList.remove("is-active");
      activeTokyoImage = (activeTokyoImage + 1) % tokyoImages.length;
      tokyoImages[activeTokyoImage].classList.add("is-active");
    }, 2500);
  }
}

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

if (!prefersReducedMotion) {
  magneticItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate3d(${x * 0.08}px, ${y * 0.1 - 2}px, 0)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });
}
