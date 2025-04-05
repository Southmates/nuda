gsap.from(".fade-in", {
  scrollTrigger: {
    trigger: ".fade-in",
    start: "top 80%",
    toggleActions: "play none none none",
  },
  opacity: 0,
  y: 50,
  duration: 1,
});
