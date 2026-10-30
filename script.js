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

  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
