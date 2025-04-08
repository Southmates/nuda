import gsap from "https://cdn.skypack.dev/gsap";
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import Lenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.mjs";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  smooth: true,
  lerp: 0.1,
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Lenis + ScrollTrigger
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value) : window.scrollY;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.body.style.transform ? "transform" : "fixed",
});

ScrollTrigger.refresh();

// 👇 GSAP + ScrollTrigger
gsap.from(".fade-in", {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: ".fade-in",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});

// Desvanece el hero-content al hacer scroll
// gsap.to(".hero-content", {
//   scrollTrigger: {
//     trigger: ".hero",
//     start: "top top",
//     end: "bottom top",
//     scrub: true,
//   },
//   opacity: 0,
//   y: -50,
// });

// Parallax de la siguiente sección (opcional para dar más onda)
// gsap.from(".next-section", {
//   scrollTrigger: {
//     trigger: ".next-section",
//     start: "top bottom",
//     end: "top top",
//     scrub: true,
//   },
//   y: 100,
// });

// Aparece con fade-up cuando entra en pantalla
gsap.utils.toArray(".fade-up").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );
});

// Anchors links w/ Lenis
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      e.preventDefault();
      lenis.scrollTo(targetEl, {
        offset: 0,
        duration: 1.2,
        easing: (x) => 1 - Math.pow(1 - x, 3), // easeOutCubic
      });
    }
  });
});

// Scroll to top
document.getElementById("scrollTopBtn")?.addEventListener("click", () => {
  lenis.scrollTo(0);
});

// Activate menu link based on visible section (scrollspy light)
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

ScrollTrigger.defaults({ toggleActions: "play none none reverse" });

sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => activateLink(section.id),
    onEnterBack: () => activateLink(section.id),
  });
});

function activateLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.href.includes(`#${id}`));
  });
}

// Scroll indicator for Hero section
const scrollIndicator = document.getElementById("scroll-indicator");

if (scrollIndicator) {
  // Hide indicator when scrolling (with Lenis)
  lenis.on("scroll", ({ scroll }) => {
    if (scroll > 50) {
      gsap.to(scrollIndicator, {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(scrollIndicator, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  });

  // Click to scroll to the next section
  scrollIndicator.addEventListener("click", () => {
    const nextSection = document.querySelector("#ingredients");
    if (nextSection) {
      lenis.scrollTo(nextSection, { offset: -40, duration: 1.2 });
    }
  });
}

// --- MASTER TIMELINE ---
const master = gsap.timeline({
  paused: true,
  defaults: { ease: "power2.out" },
  onComplete: () => {
    lenis.start();
  },
});

// 🌀 1. Loader Animation
master
  .to(".loader-content .loader-text", {
    opacity: 1,
    duration: 1,
    y: -30,
    ease: "power2.out",
  })
  .to("#loader", {
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut",
    delay: 0.5,
  })
  .set("#loader", { display: "none" });

// ✨ 2. Hero Animation (cuando loader termina)
master
  .from(
    ".hero-title",
    {
      y: 40,
      opacity: 0,
      duration: 1,
    },
    "-=0.6"
  )
  .from(
    ".hero-subtitle",
    {
      y: 40,
      opacity: 0,
      duration: 1,
    },
    "-=0.8"
  );

// Lanzamos todo
window.addEventListener("DOMContentLoaded", () => {
  console.log("object");
  master.play();
});
