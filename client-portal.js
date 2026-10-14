/* Client portal login form. The real login (server-side check, session)
   isn't connected yet, so for now submitting only validates the fields
   and shows a notice. */
(function () {
  var form = document.querySelector("[data-eod-portal-form]");
  if (!form) return;
  var status = form.querySelector("[data-eod-portal-status]");

  function show(message) {
    status.textContent = message;
    status.hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.username.value.trim() || !form.password.value) {
      show("Please enter your name and password.");
      return;
    }
    show("The client portal isn't open yet. For now, please get in touch with Evy.");
  });
})();
