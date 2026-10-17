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

  document.querySelector(".name a").addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo(0, 0);
    history.replaceState(null, "", location.pathname + location.search);
  });

  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  var sections = document.querySelectorAll("main section[id]");
  var lastSection = document.querySelector("main > section:last-child");
  var head = document.querySelector(".sidebar-head");
  var offset = 0;

  var links = {};
  document.querySelectorAll(".nav a").forEach(function (link) {
    links[link.getAttribute("href").slice(1)] = link;
  });

  function measureHead() {
    var mobile = window.innerWidth <= 860;
    root.style.setProperty("--head-height", mobile ? head.offsetHeight + "px" : "0px");
    offset = parseInt(getComputedStyle(sections[0]).scrollMarginTop, 10) || 0;
  }

  function updateStuck() {
    head.classList.toggle("is-stuck", window.pageYOffset > 0 && head.getBoundingClientRect().top <= 0);
  }

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
    measureHead();
    fitLastSection();
    updateActive();
    updateStuck();
  }

  var pending = false;
  window.addEventListener("scroll", function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      updateActive();
      updateStuck();
      pending = false;
    });
  }, { passive: true });

  window.addEventListener("resize", relayout);
  document.querySelectorAll("main details").forEach(function (item) {
    item.addEventListener("toggle", relayout);
  });

  relayout();
})();
