(function () {
  var root = document.documentElement;

  document.querySelector(".theme").addEventListener("click", function () {
    var set = root.getAttribute("data-theme");
    var current = set || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  var sections = document.querySelectorAll("main section[id]");
  var lastSection = document.querySelector("main > section:last-child");
  var offset = parseInt(getComputedStyle(sections[0]).scrollMarginTop, 10) || 0;

  var links = {};
  document.querySelectorAll(".nav a").forEach(function (link) {
    links[link.getAttribute("href").slice(1)] = link;
  });

  function updateActive() {
    var active = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= offset + 1) active = section;
    });
    for (var id in links) links[id].classList.remove("is-active");
    if (links[active.id]) links[active.id].classList.add("is-active");
  }

  function fitLastSection() {
    lastSection.style.minHeight = "";
    if (window.innerWidth <= 860) return;
    var top = lastSection.getBoundingClientRect().top + window.pageYOffset;
    var wanted = top - offset + window.innerHeight;
    var extra = wanted - root.scrollHeight;
    lastSection.style.minHeight = lastSection.offsetHeight + extra + "px";
  }

  function relayout() {
    fitLastSection();
    updateActive();
  }

  var pending = false;
  window.addEventListener("scroll", function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      updateActive();
      pending = false;
    });
  }, { passive: true });

  window.addEventListener("resize", relayout);
  document.querySelectorAll("main details").forEach(function (item) {
    item.addEventListener("toggle", relayout);
  });

  relayout();
})();
