(function () {
  var root = document.documentElement;

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

  var pinned = null;

  document.querySelectorAll(".nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      pinned = document.getElementById(link.getAttribute("href").slice(1));
      updateActive();
    });
  });

  ["wheel", "touchmove", "keydown"].forEach(function (name) {
    window.addEventListener(name, function () {
      pinned = null;
    }, { passive: true });
  });

  function updateActive() {
    var active = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= offset + 1) active = section;
    });
    if (window.innerHeight + window.pageYOffset >= root.scrollHeight - 2) active = sections[sections.length - 1];
    if (pinned) active = pinned;
    for (var id in links) links[id].classList.remove("is-active");
    if (links[active.id]) links[active.id].classList.add("is-active");
  }

  function relayout() {
    measureHead();
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
