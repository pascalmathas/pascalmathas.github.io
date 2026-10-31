(function () {
  var root = document.documentElement;
  var main = document.querySelector("main");
  var groups = { about: "about", contact: "about", publications: "publications", projects: "projects", education: "background", skills: "background", background: "background" };
  var links = document.querySelectorAll(".nav a");

  function show(name) {
    root.setAttribute("data-tab", name);
    main.scrollTop = 0;
    links.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + name);
    });
  }

  root.classList.add("tabs");
  show(groups[location.hash.slice(1)] || "about");

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var name = link.getAttribute("href").slice(1);
      history.replaceState(null, "", "#" + name);
      show(name);
    });
  });

  document.querySelector(".name a").addEventListener("click", function (event) {
    event.preventDefault();
    history.replaceState(null, "", location.pathname + location.search);
    show("about");
  });

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("details").forEach(function (item) {
    var summary = item.querySelector("summary");
    var body = summary.nextElementSibling;
    var running = [];

    summary.addEventListener("click", function (event) {
      if (reduced) return;
      event.preventDefault();

      var closing = item.open && !item.classList.contains("is-closing");
      var from = item.getBoundingClientRect().height;
      var shift = item.open ? getComputedStyle(body).transform : "translateX(-100%)";
      var timing = { duration: closing ? 300 : 450, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" };

      running.forEach(function (animation) { animation.cancel(); });
      item.style.overflow = "hidden";
      item.classList.toggle("is-closing", closing);
      item.open = true;

      var to = closing ? summary.offsetHeight : item.getBoundingClientRect().height;

      running = [
        item.animate({ height: [from + "px", to + "px"] }, timing),
        body.animate({ transform: [shift, closing ? "translateX(-100%)" : "none"] }, timing)
      ];

      running[0].onfinish = function () {
        item.open = !closing;
        item.classList.remove("is-closing");
        item.style.overflow = "";
        running.forEach(function (animation) { animation.cancel(); });
      };
    });
  });

  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
