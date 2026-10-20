/* Client hub on its own subdomain (hub.evydiepenbroek.nl).
   The shared menu and footer (chrome.js) link to the website pages
   with relative links ("about.html"), which don't exist on the hub's
   subdomain. There, this points those links to the main website.
   The hub's own pages keep working as they are. Does nothing on the
   main site or locally. */
(function () {
  var SITE = "https://evydiepenbroek.nl/";
  var HUB_PAGES = /^(client-portal|client-hub)\.html/;
  if (!/^hub\./.test(location.hostname)) return;

  function fix() {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/.test(href) || HUB_PAGES.test(href)) return;
      a.setAttribute("href", SITE + href.replace(/^\.?\//, ""));
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fix);
  else fix();
})();
