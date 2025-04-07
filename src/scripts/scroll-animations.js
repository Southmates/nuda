// scroll-animations.js
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  smooth: true,
  lerp: 0.1,
});

function raf(time) {
  lenis.raf(time);
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

// Scroll to bottom (using document.body.scrollHeight)
// document.getElementById("scrollBottomBtn")?.addEventListener("click", () => {
//   lenis.scrollTo(document.body.scrollHeight);
// });
