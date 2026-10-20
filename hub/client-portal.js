/* Client portal login form.
   NOT SECURE YET (on purpose, for testing): it only checks that the
   email address belongs to an active client in the "clienthub"
   dataset in Sanity, then opens the hub. The real login (a link sent
   by email, checked on a server) replaces this before real clients
   use it. */
(function () {
  var form = document.querySelector("[data-eod-portal-form]");
  if (!form) return;
  var status = form.querySelector("[data-eod-portal-status]");
  var button = form.querySelector('button[type="submit"]');

  function show(message) {
    status.textContent = message;
    status.hidden = false;
  }

  // Without a stored email the hub shows the demo data (some local
  // servers drop the ?demo from the link).
  var demo = document.querySelector("[data-eod-portal-demo]");
  if (demo) demo.addEventListener("click", function () {
    try { sessionStorage.removeItem("eodHubEmail"); } catch (err) {}
  });

  if (location.hash === "#not-found") show("We couldn't find an account for that email address.");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!email) {
      show("Please enter your email address.");
      return;
    }
    button.disabled = true;
    // POST keeps the email address out of the URL.
    fetch("https://16akn05z.api.sanity.io/v2025-02-19/data/query/clienthub", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: 'count(*[_type == "hubClient" && lower(email) == lower($email) && active != false && !(_id in path("drafts.**"))])',
        params: { email: email }
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json.result) {
          show("We couldn't find an account for that email address. Check the spelling, or get in touch with Evy.");
          button.disabled = false;
          return;
        }
        try { sessionStorage.setItem("eodHubEmail", email); } catch (err) {}
        window.location.href = "client-hub.html";
      })
      .catch(function () {
        show("Something went wrong. Please try again in a moment.");
        button.disabled = false;
      });
  });
})();
