/* Client hub — clickable prototype.
   One page, hash-routed views (#/, #/projects, #/projects/<id>,
   #/feedback/<id>, #/design-hub, #/request), rendered from
   client-hub-data.js. Anything the client "submits" only lives in
   memory until the page reloads; the real backend replaces that. */
(function () {
  var data = window.EOD_HUB_DATA;
  var view = document.querySelector("[data-hub-view]");
  if (!data || !view) return;

  var company = document.querySelector("[data-hub-company]");
  if (company) company.textContent = data.client.company;

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ARROW = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M24 20L24 6.66667L10.6667 6.66667M24 6.66667L6.66667 24" stroke-width="2" stroke-miterlimit="10"/></svg>';
  var ARROW_RIGHT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M6 16H26M26 16L17 7M26 16L17 25" stroke-width="2" stroke-miterlimit="10"/></svg>';
  var ARROW_LEFT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M26 16H6M6 16L15 7M6 16L15 25" stroke-width="2" stroke-miterlimit="10"/></svg>';
  var CHECK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="1.5"/></svg>';

  // The site's primary pill+circles button. tag "a" with href, or "button".
  function btn(label, opts) {
    opts = opts || {};
    var cls = "eod-btn eod-btn--" + (opts.variant || "dark") + (opts.className ? " " + opts.className : "");
    var inner =
      '<span class="eod-btn__label">' + esc(label) + "</span>" +
      '<span class="eod-btn__circle eod-btn__circle--accent" aria-hidden="true">' + ARROW + "</span>" +
      '<span class="eod-btn__circle eod-btn__circle--white" aria-hidden="true">' + ARROW + "</span>";
    if (opts.href) return '<a class="' + cls + '" href="' + opts.href + '">' + inner + "</a>";
    return '<button class="' + cls + '" type="' + (opts.type || "button") + '"' + (opts.attrs || "") + ">" + inner + "</button>";
  }

  // The site's secondary text button (arrow slides in on hover).
  function link(label, href, back) {
    var icon = back ? ARROW_LEFT : ARROW;
    return (
      '<a class="eod-btn eod-btn--secondary" href="' + href + '">' +
        '<span class="eod-btn__secondary-viewport"><span class="eod-btn__secondary-track">' +
          '<span class="eod-btn__arrow-slot eod-btn__arrow-slot--lead" aria-hidden="true">' + (back ? ARROW_LEFT : ARROW_RIGHT) + "</span>" +
          '<span class="eod-btn__label">' + esc(label) + "</span>" +
          '<span class="eod-btn__arrow-slot eod-btn__arrow-slot--trail" aria-hidden="true">' + icon + "</span>" +
        "</span></span>" +
      "</a>"
    );
  }

  var STATUS = {
    "in-progress": { label: "In progress", tone: "neutral" },
    feedback: { label: "Your feedback needed", tone: "accent" },
    completed: { label: "Completed", tone: "muted" }
  };
  var FEEDBACK_STATE = {
    draft: "Not requested yet",
    awaiting: "Awaiting your feedback",
    received: "Feedback received",
    revision: "In revision",
    approved: "Approved",
    completed: "Completed"
  };

  function pill(label, tone) {
    return '<span class="eod-hub-pill eod-hub-pill--' + tone + '">' + esc(label) + "</span>";
  }
  function statusPill(p) {
    var s = STATUS[p.status];
    return pill(s.label, s.tone);
  }

  function findProject(id) {
    return data.projects.filter(function (p) { return p.id === id; })[0];
  }
  function findFeedback(id) {
    for (var i = 0; i < data.projects.length; i++) {
      var f = data.projects[i].feedback.filter(function (r) { return r.id === id; })[0];
      if (f) return { project: data.projects[i], round: f };
    }
  }
  function openActions() {
    var list = [];
    data.projects.forEach(function (p) {
      p.feedback.forEach(function (f) {
        if (f.state === "awaiting") list.push({ project: p, round: f });
      });
    });
    return list;
  }
  function stageCount(p) {
    var done = p.stages.filter(function (s) { return s.state === "completed"; }).length;
    var current = p.stages.some(function (s) { return s.state === "current" || s.state === "waiting"; }) ? 1 : 0;
    return { reached: Math.min(done + current, p.stages.length), total: p.stages.length, done: done };
  }

  function progressBar(p) {
    return (
      '<div class="eod-hub-progress" aria-hidden="true">' +
        p.stages.map(function (s) {
          return '<span class="eod-hub-progress__seg is--' + s.state + '"></span>';
        }).join("") +
      "</div>"
    );
  }

  function projectRow(p) {
    var c = stageCount(p);
    return (
      '<a class="eod-hub-row" href="#/projects/' + p.id + '">' +
        '<span class="eod-hub-row__num">' + esc(p.number) + "</span>" +
        '<span class="eod-hub-row__main">' +
          '<span class="eod-hub-row__title">' + esc(p.title) + "</span>" +
          '<span class="eod-hub-row__meta">' + esc(p.type) + "</span>" +
        "</span>" +
        '<span class="eod-hub-row__next">' +
          '<span class="eod-hub-row__label">' + (p.status === "completed" ? "Completed " + esc(p.completed) : "Next") + "</span>" +
          '<span class="eod-hub-row__value">' + (p.status === "completed" ? c.total + " of " + c.total + " stages" : esc(p.nextStep)) + "</span>" +
        "</span>" +
        '<span class="eod-hub-row__status">' + statusPill(p) + "</span>" +
        '<span class="eod-hub-row__arrow" aria-hidden="true">' + ARROW_RIGHT + "</span>" +
      "</a>"
    );
  }

  function fileRow(f) {
    return (
      '<li class="eod-hub-file">' +
        '<span class="eod-hub-file__kind">' + esc(f.kind) + "</span>" +
        '<span class="eod-hub-file__main">' +
          '<span class="eod-hub-file__name">' + esc(f.name) + "</span>" +
          '<span class="eod-hub-file__meta">' + esc(f.formats || f.stage) + " · " + esc(f.size) + "</span>" +
        "</span>" +
        (f.approved === undefined ? "" : f.approved ? pill("Approved", "neutral") : pill("Work in progress", "muted")) +
        '<button class="eod-hub-file__download" type="button" data-hub-download aria-label="Download ' + esc(f.name) + '">Download</button>' +
      "</li>"
    );
  }

  function sectionHead(title, aside) {
    return '<div class="eod-hub-section__head"><h2 class="eod-hub-section__title">' + esc(title) + "</h2>" + (aside || "") + "</div>";
  }

  /* ---------- toast ---------- */

  var toast = document.createElement("p");
  toast.className = "eod-hub-toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  var toastTimer;
  function notify(msg) {
    toast.textContent = msg;
    toast.classList.add("is--visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is--visible"); }, 2600);
  }

  /* ---------- views ---------- */

  function viewHome() {
    var actions = openActions();
    var active = data.projects.filter(function (p) { return p.status !== "completed"; });
    var done = data.projects.filter(function (p) { return p.status === "completed"; });

    var actionHtml = actions.length
      ? actions.map(function (a) {
          return (
            '<div class="eod-hub-action">' +
              '<div class="eod-hub-action__text">' +
                '<p class="eod-hub-action__eyebrow">Your next step</p>' +
                '<h2 class="eod-hub-action__title">Review your ' + esc(a.project.title.toLowerCase()) + " designs</h2>" +
                '<p class="eod-hub-action__meta">' + esc(a.project.title) + " · Feedback by " + esc(a.round.due) + "</p>" +
              "</div>" +
              btn("Review designs", { href: "#/feedback/" + a.round.id, variant: "light" }) +
            "</div>"
          );
        }).join("")
      : '<div class="eod-hub-calm"><span class="eod-hub-calm__dot" aria-hidden="true"></span>Nothing needed from you right now. I\'ll let you know when there is.</div>';

    return (
      '<div class="eod-hub-intro">' +
        '<h1 class="eod-hub-title" tabindex="-1">Welcome back, ' + esc(data.client.name) + ".</h1>" +
        '<p class="eod-hub-lede">Here\'s where your projects stand.</p>' +
      "</div>" +

      '<section class="eod-hub-section">' + actionHtml + "</section>" +

      '<section class="eod-hub-section">' +
        sectionHead("Active projects", '<span class="eod-hub-count">' + active.length + "</span>") +
        '<div class="eod-hub-rows">' + active.map(projectRow).join("") + "</div>" +
      "</section>" +

      '<div class="eod-hub-split">' +
        '<section class="eod-hub-section">' +
          sectionHead("Recently completed") +
          '<div class="eod-hub-rows">' + done.map(projectRow).join("") + "</div>" +
        "</section>" +
        '<section class="eod-hub-section">' +
          sectionHead("Your Design Hub") +
          '<a class="eod-hub-teaser" href="#/design-hub">' +
            '<span class="eod-hub-teaser__mark" aria-hidden="true">nord</span>' +
            '<span class="eod-hub-teaser__text">Your logos, colours, typography and brand files in one place, ready to share.</span>' +
            '<span class="eod-hub-teaser__arrow" aria-hidden="true">' + ARROW_RIGHT + "</span>" +
          "</a>" +
        "</section>" +
      "</div>" +

      '<section class="eod-hub-section eod-hub-idea">' +
        '<div><h2 class="eod-hub-section__title">Have a new idea?</h2>' +
        '<p class="eod-hub-muted">Tell me what you\'re thinking. You don\'t need to have it all figured out yet.</p></div>' +
        link("Let's talk about your idea", "#/request") +
      "</section>"
    );
  }

  function viewProjects() {
    var active = data.projects.filter(function (p) { return p.status !== "completed"; });
    var done = data.projects.filter(function (p) { return p.status === "completed"; });
    return (
      '<div class="eod-hub-intro">' +
        '<h1 class="eod-hub-title" tabindex="-1">Projects</h1>' +
        '<p class="eod-hub-lede">Everything we\'re working on together, and everything we\'ve finished.</p>' +
      "</div>" +
      '<section class="eod-hub-section">' + sectionHead("Active", '<span class="eod-hub-count">' + active.length + "</span>") +
        '<div class="eod-hub-rows">' + active.map(projectRow).join("") + "</div></section>" +
      '<section class="eod-hub-section">' + sectionHead("Completed", '<span class="eod-hub-count">' + done.length + "</span>") +
        '<div class="eod-hub-rows">' + done.map(projectRow).join("") + "</div></section>"
    );
  }

  function viewProject(id) {
    var p = findProject(id);
    if (!p) return viewNotFound();
    var c = stageCount(p);
    var awaiting = p.feedback.filter(function (f) { return f.state === "awaiting"; })[0];

    var stages = p.stages.map(function (s, i) {
      var label = { completed: "Completed", current: "In progress", waiting: "Waiting for you", upcoming: "Upcoming" }[s.state];
      return (
        '<li class="eod-hub-stage is--' + s.state + '">' +
          '<span class="eod-hub-stage__marker" aria-hidden="true">' + (s.state === "completed" ? CHECK : String(i + 1).padStart(2, "0")) + "</span>" +
          '<div class="eod-hub-stage__body">' +
            '<div class="eod-hub-stage__top">' +
              '<h3 class="eod-hub-stage__title">' + esc(s.title) + "</h3>" +
              '<span class="eod-hub-stage__state">' + label + (s.date ? " · " + esc(s.date) : "") + "</span>" +
            "</div>" +
            (s.note ? '<p class="eod-hub-stage__note">' + esc(s.note) + "</p>" : "") +
            (s.state === "waiting" && awaiting ? '<div class="eod-hub-stage__cta">' + btn("Give feedback", { href: "#/feedback/" + awaiting.id }) + "</div>" : "") +
          "</div>" +
        "</li>"
      );
    }).join("");

    var history = p.feedback.map(function (f) {
      return (
        '<li class="eod-hub-history">' +
          '<span class="eod-hub-history__round">Round ' + esc(f.round) + "</span>" +
          '<span class="eod-hub-history__main">' +
            '<span class="eod-hub-history__title">' + esc(f.title) + "</span>" +
            (f.choice ? '<span class="eod-hub-history__meta">“' + esc(f.choice) + "”" + (f.date ? " · " + esc(f.date) : "") + "</span>" : "") +
          "</span>" +
          pill(FEEDBACK_STATE[f.state], f.state === "awaiting" ? "accent" : f.state === "approved" ? "neutral" : "muted") +
          (f.state === "awaiting" || f.state === "received" ? link(f.state === "awaiting" ? "Open" : "View", "#/feedback/" + f.id) : "") +
        "</li>"
      );
    }).join("");

    return (
      '<div class="eod-hub-back">' + link("All projects", "#/projects", true) + "</div>" +
      '<div class="eod-hub-intro eod-hub-intro--project">' +
        '<p class="eod-hub-eyebrow">Project ' + esc(p.number) + " · " + esc(p.type) + "</p>" +
        '<h1 class="eod-hub-title" tabindex="-1">' + esc(p.title) + "</h1>" +
        '<p class="eod-hub-lede">' + esc(p.summary) + "</p>" +
        '<div class="eod-hub-intro__status">' + statusPill(p) + "</div>" +
      "</div>" +

      '<div class="eod-hub-project">' +
        '<section class="eod-hub-section eod-hub-project__journey">' +
          sectionHead("Your project journey") +
          '<ol class="eod-hub-stages">' + stages + "</ol>" +
        "</section>" +

        '<aside class="eod-hub-project__side">' +
          '<div class="eod-hub-card">' +
            '<p class="eod-hub-card__label">Progress</p>' +
            '<p class="eod-hub-card__value">' + (p.status === "completed" ? "All " + c.total + " stages completed" : "Stage " + c.reached + " of " + c.total) + "</p>" +
            progressBar(p) +
          "</div>" +
          (p.status !== "completed"
            ? '<div class="eod-hub-card">' +
                '<p class="eod-hub-card__label">Next milestone</p>' +
                '<p class="eod-hub-card__value">' + esc(p.nextStep) + "</p>" +
                '<p class="eod-hub-card__meta">' + esc(p.nextDate) + "</p>" +
              "</div>"
            : "") +
          '<div class="eod-hub-card eod-hub-card--note">' +
            '<p class="eod-hub-card__label">Latest update · ' + esc(p.update.date) + "</p>" +
            '<p class="eod-hub-card__quote">' + esc(p.update.text) + "</p>" +
            '<p class="eod-hub-card__sign">— Evy</p>' +
          "</div>" +
        "</aside>" +
      "</div>" +

      (history ? '<section class="eod-hub-section">' + sectionHead("Feedback") + '<ul class="eod-hub-list">' + history + "</ul></section>" : "") +

      '<section class="eod-hub-section">' + sectionHead(p.status === "completed" ? "Your final files" : "Files") +
        '<ul class="eod-hub-list">' + p.files.map(fileRow).join("") + "</ul></section>"
    );
  }

  function concept(c) {
    // Abstract placeholder artwork, stands in for an uploaded presentation.
    return (
      '<figure class="eod-hub-concept eod-hub-concept--' + c.tone + '">' +
        '<div class="eod-hub-concept__art" aria-hidden="true">' +
          '<span class="eod-hub-concept__poster"><span>nord</span><small>Opening 14.11</small></span>' +
          '<span class="eod-hub-concept__post"></span>' +
          '<span class="eod-hub-concept__card"></span>' +
        "</div>" +
        '<figcaption><span class="eod-hub-concept__label">' + esc(c.label) + "</span>" + esc(c.name) + "</figcaption>" +
      "</figure>"
    );
  }

  var CHOICES = ["I'm happy with this direction", "I'd like some changes", "I'd like to explore the options further"];

  function viewFeedback(id) {
    var hit = findFeedback(id);
    if (!hit) return viewNotFound();
    var p = hit.project, f = hit.round;
    var sent = f.state !== "awaiting";

    var steps = [
      { title: "Presentation shared", note: "The concepts are ready for you.", state: "completed" },
      { title: "Your feedback", note: sent ? "Thank you, received." : "Waiting for your response.", state: sent ? "completed" : "current" },
      { title: "Evy reviews", note: "I'll go through your feedback and agree the next steps with you.", state: sent ? "current" : "upcoming" }
    ];

    var form = sent
      ? '<div class="eod-hub-confirm">' +
          '<span class="eod-hub-confirm__icon" aria-hidden="true">' + CHECK + "</span>" +
          '<div><h2 class="eod-hub-section__title">Thank you, ' + esc(data.client.name) + ".</h2>" +
          '<p class="eod-hub-muted">Your feedback is in. I\'ll review it and get back to you with the next steps within two working days.</p>' +
          '<p class="eod-hub-confirm__quote">“' + esc(f.choice) + "”" + (f.comment ? "<br>" + esc(f.comment) : "") + "</p>" +
          link("Back to the project", "#/projects/" + p.id) + "</div>" +
        "</div>"
      : '<form class="eod-hub-form" data-hub-feedback-form novalidate>' +
          '<fieldset class="eod-hub-fieldset">' +
            '<legend class="eod-hub-section__title">What do you think?</legend>' +
            '<div class="eod-hub-choices">' +
              CHOICES.map(function (c, i) {
                return '<label class="eod-hub-choice"><input type="radio" name="choice" value="' + esc(c) + '"' + (i === 0 ? " required" : "") + ' /><span>' + esc(c) + "</span></label>";
              }).join("") +
            "</div>" +
          "</fieldset>" +
          '<label class="eod-hub-field">' +
            '<span class="eod-hub-field__label">Anything you\'d like to add? <span class="eod-hub-muted">Optional</span></span>' +
            '<textarea class="eod-hub-input eod-hub-input--area" name="comment" rows="5" placeholder="What you like, what doesn\'t feel right, or what you\'d like to explore further."></textarea>' +
          "</label>" +
          '<p class="eod-hub-form__error" data-hub-error role="alert" hidden></p>' +
          btn("Send feedback", { type: "submit" }) +
        "</form>";

    return (
      '<div class="eod-hub-back">' + link(p.title, "#/projects/" + p.id, true) + "</div>" +
      '<div class="eod-hub-intro">' +
        '<p class="eod-hub-eyebrow">Feedback round ' + esc(f.round) + " · " + esc(p.title) + "</p>" +
        '<h1 class="eod-hub-title" tabindex="-1">' + esc(f.title) + "</h1>" +
        '<p class="eod-hub-lede">' + esc(f.question) + "</p>" +
        '<div class="eod-hub-intro__status">' + pill(FEEDBACK_STATE[f.state], sent ? "neutral" : "accent") + (sent ? "" : '<span class="eod-hub-muted">Feedback by ' + esc(f.due) + "</span>") + "</div>" +
      "</div>" +

      '<section class="eod-hub-section"><div class="eod-hub-concepts">' + f.concepts.map(concept).join("") + "</div>" +
        '<div class="eod-hub-concepts__foot">' + link("Open full presentation (PDF)", "#") + "</div></section>" +

      '<div class="eod-hub-project">' +
        '<section class="eod-hub-section eod-hub-project__journey">' + form + "</section>" +
        '<aside class="eod-hub-project__side"><div class="eod-hub-card">' +
          '<p class="eod-hub-card__label">Where this round stands</p>' +
          '<ol class="eod-hub-mini">' +
            steps.map(function (s) {
              return '<li class="eod-hub-mini__step is--' + s.state + '"><span class="eod-hub-mini__dot" aria-hidden="true">' + (s.state === "completed" ? CHECK : "") + '</span><span><strong>' + esc(s.title) + "</strong>" + esc(s.note) + "</span></li>";
            }).join("") +
          "</ol>" +
        "</div></aside>" +
      "</div>"
    );
  }

  function viewDesignHub() {
    var h = data.designHub;
    var share = h.share;
    var sectionLabels = { overview: "Brand overview", logos: "Logos", colors: "Colours", typography: "Typography", files: "Files" };

    var logos = h.logos.map(function (l) {
      return (
        '<figure class="eod-hub-logo eod-hub-logo--' + l.variant + '">' +
          '<div class="eod-hub-logo__art" aria-hidden="true">' + (l.variant === "icon" ? "n" : "nord<sup>studio</sup>") + "</div>" +
          '<figcaption><span>' + esc(l.name) + '</span><span class="eod-hub-muted">SVG · PNG · PDF</span></figcaption>' +
        "</figure>"
      );
    }).join("");

    var colors = h.colors.map(function (c) {
      return (
        '<button class="eod-hub-swatch" type="button" data-hub-copy="' + esc(c.hex) + '" aria-label="Copy ' + esc(c.name) + " " + esc(c.hex) + '">' +
          '<span class="eod-hub-swatch__chip" style="background:' + esc(c.hex) + '"></span>' +
          '<span class="eod-hub-swatch__name">' + esc(c.name) + "</span>" +
          '<span class="eod-hub-swatch__code">' + esc(c.hex) + "</span>" +
          '<span class="eod-hub-swatch__code">RGB ' + esc(c.rgb) + "</span>" +
          '<span class="eod-hub-swatch__copy">Copy</span>' +
        "</button>"
      );
    }).join("");

    var type = h.typography.map(function (t, i) {
      return (
        '<div class="eod-hub-type">' +
          '<span class="eod-hub-type__specimen' + (i ? " eod-hub-type__specimen--body" : "") + '" aria-hidden="true">' + (i ? "The quick brown fox jumps over the lazy dog." : "Aa") + "</span>" +
          '<span class="eod-hub-type__meta"><strong>' + esc(t.role) + "</strong>" + esc(t.family) + " · " + esc(t.weight) + "</span>" +
        "</div>"
      );
    }).join("");

    var shareChecks = Object.keys(sectionLabels).map(function (k) {
      return '<label class="eod-hub-check"><input type="checkbox" data-hub-share-section="' + k + '"' + (share.sections[k] ? " checked" : "") + (share.enabled ? "" : " disabled") + " /><span>" + sectionLabels[k] + "</span></label>";
    }).join("");

    return (
      '<div class="eod-hub-intro">' +
        '<p class="eod-hub-eyebrow">Design Hub</p>' +
        '<h1 class="eod-hub-title" tabindex="-1">' + esc(data.client.company) + "</h1>" +
        '<p class="eod-hub-lede">' + esc(h.tagline) + "</p>" +
      "</div>" +

      '<div class="eod-hub-project">' +
        '<div class="eod-hub-project__journey">' +
          '<section class="eod-hub-section">' + sectionHead("Brand overview") + '<p class="eod-hub-story">' + esc(h.story) + "</p></section>" +
          '<section class="eod-hub-section">' + sectionHead("Logos") + '<div class="eod-hub-logos">' + logos + "</div></section>" +
          '<section class="eod-hub-section">' + sectionHead("Colours", '<span class="eod-hub-muted">Click to copy</span>') + '<div class="eod-hub-swatches">' + colors + "</div></section>" +
          '<section class="eod-hub-section">' + sectionHead("Typography") + '<div class="eod-hub-types">' + type + "</div></section>" +
          '<section class="eod-hub-section">' + sectionHead("Files") + '<ul class="eod-hub-list">' + h.files.map(fileRow).join("") + "</ul></section>" +
        "</div>" +

        '<aside class="eod-hub-project__side eod-hub-project__side--sticky">' +
          '<div class="eod-hub-card" data-hub-share>' +
            '<div class="eod-hub-share__top">' +
              '<p class="eod-hub-card__value">Share your brand</p>' +
              '<button class="eod-hub-switch" type="button" role="switch" aria-checked="' + share.enabled + '" aria-label="Sharing" data-hub-share-toggle><span></span></button>' +
            "</div>" +
            '<p class="eod-hub-card__meta">' + (share.enabled ? "Anyone with the link can view and download what you select. They can't edit anything." : "Sharing is off. The link doesn't work until you turn it back on.") + "</p>" +
            '<div class="eod-hub-share__link' + (share.enabled ? "" : " is--off") + '">' +
              '<span class="eod-hub-share__url">' + esc(share.link) + "</span>" +
              '<button class="eod-hub-share__copy" type="button" data-hub-copy="https://' + esc(share.link) + '"' + (share.enabled ? "" : " disabled") + ">Copy</button>" +
            "</div>" +
            '<p class="eod-hub-card__label eod-hub-share__label">Visible on the shared page</p>' +
            '<div class="eod-hub-checks">' + shareChecks + "</div>" +
            '<p class="eod-hub-card__meta">Drafts, invoices and project conversations are never shared.</p>' +
            '<button class="eod-hub-textbtn" type="button" data-hub-regenerate' + (share.enabled ? "" : " disabled") + ">Create a new link</button>" +
          "</div>" +
        "</aside>" +
      "</div>"
    );
  }

  var request = { sent: false };
  var TOPICS = ["A new brand or identity", "A new design or campaign", "Something for an existing project", "I'm not quite sure yet"];
  var TIMING = ["As soon as possible", "Within the next few weeks", "I'm flexible / just exploring"];

  function chips(name, options) {
    return '<div class="eod-hub-chips">' + options.map(function (o, i) {
      return '<label class="eod-hub-chip"><input type="radio" name="' + name + '" value="' + esc(o) + '"' + (i === 0 ? " required" : "") + " /><span>" + esc(o) + "</span></label>";
    }).join("") + "</div>";
  }

  function viewRequest() {
    var process = [
      { title: "Request received", note: "Your idea lands with me. You'll get a confirmation by email." },
      { title: "Conversation", note: "We talk it through: what you need, timing and budget." },
      { title: "Proposal", note: "I send a clear proposal with deliverables, price and schedule." },
      { title: "New project", note: "Once you agree, your project appears here with its own stages." }
    ];
    var processHtml =
      '<ol class="eod-hub-process">' + process.map(function (s, i) {
        var state = request.sent ? (i === 0 ? "completed" : i === 1 ? "current" : "upcoming") : "upcoming";
        return '<li class="eod-hub-process__step is--' + state + '"><span class="eod-hub-process__num">' + (state === "completed" ? CHECK : "0" + (i + 1)) + '</span><strong>' + esc(s.title) + "</strong><span>" + esc(s.note) + "</span></li>";
      }).join("") + "</ol>";

    if (request.sent) {
      return (
        '<div class="eod-hub-intro">' +
          '<p class="eod-hub-eyebrow">Request sent</p>' +
          '<h1 class="eod-hub-title" tabindex="-1">Thanks, ' + esc(data.client.name) + ". I'll be in touch.</h1>" +
          '<p class="eod-hub-lede">I\'ll get back to you within two working days to talk it through. Nothing is booked or ordered yet. We\'ll decide that together.</p>' +
        "</div>" +
        '<section class="eod-hub-section">' + sectionHead("What happens next") + processHtml + "</section>" +
        '<section class="eod-hub-section eod-hub-idea"><div><h2 class="eod-hub-section__title">Your request</h2><p class="eod-hub-muted">' + esc(request.topic) + " · " + esc(request.timing) + "</p>" + (request.idea ? '<p class="eod-hub-confirm__quote">' + esc(request.idea) + "</p>" : "") + "</div>" + link("Back to home", "#/") + "</section>"
      );
    }

    return (
      '<div class="eod-hub-intro">' +
        '<p class="eod-hub-eyebrow">New request</p>' +
        '<h1 class="eod-hub-title" tabindex="-1">Have something in mind?</h1>' +
        '<p class="eod-hub-lede">Not every good idea starts with a clear brief. Tell me a little about what you\'re thinking, and we\'ll figure out the right direction together.</p>' +
      "</div>" +
      '<div class="eod-hub-project">' +
        '<section class="eod-hub-section eod-hub-project__journey">' +
          '<form class="eod-hub-form" data-hub-request-form novalidate>' +
            '<fieldset class="eod-hub-fieldset"><legend class="eod-hub-field__label">What are you thinking about?</legend>' + chips("topic", TOPICS) + "</fieldset>" +
            '<label class="eod-hub-field"><span class="eod-hub-field__label">Tell me a little about your idea</span>' +
              '<textarea class="eod-hub-input eod-hub-input--area" name="idea" rows="6" placeholder="A few sentences is plenty."></textarea></label>' +
            '<fieldset class="eod-hub-fieldset"><legend class="eod-hub-field__label">When are you thinking of starting?</legend>' + chips("timing", TIMING) + "</fieldset>" +
            '<p class="eod-hub-form__error" data-hub-error role="alert" hidden></p>' +
            btn("Send to Evy", { type: "submit" }) +
          "</form>" +
        "</section>" +
        '<aside class="eod-hub-project__side"><div class="eod-hub-card"><p class="eod-hub-card__label">How it works</p>' + processHtml + "</div></aside>" +
      "</div>"
    );
  }

  function viewNotFound() {
    return (
      '<div class="eod-hub-intro"><h1 class="eod-hub-title" tabindex="-1">Not found</h1>' +
      '<p class="eod-hub-lede">This page doesn\'t exist, or you don\'t have access to it.</p></div>' +
      link("Back to home", "#/")
    );
  }

  /* ---------- router ---------- */

  function route() {
    var parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
    var html, tab;
    switch (parts[0]) {
      case "":
        html = viewHome(); tab = "home"; break;
      case "projects":
        html = parts[1] ? viewProject(parts[1]) : viewProjects(); tab = "projects"; break;
      case "feedback":
        html = viewFeedback(parts[1]); tab = "projects"; break;
      case "design-hub":
        html = viewDesignHub(); tab = "design-hub"; break;
      case "request":
        html = viewRequest(); tab = "request"; break;
      default:
        html = viewNotFound();
    }
    return { html: html, tab: tab };
  }

  function render(keepScroll) {
    var r = route();
    view.innerHTML = r.html;
    document.querySelectorAll("[data-hub-tab]").forEach(function (a) {
      if (a.getAttribute("data-hub-tab") === r.tab) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (!keepScroll) {
      window.scrollTo(0, 0);
      var h = view.querySelector(".eod-hub-title");
      if (h) h.focus({ preventScroll: true });
    }
    view.classList.remove("is--entering");
    void view.offsetWidth;
    view.classList.add("is--entering");
  }

  window.addEventListener("hashchange", function () { render(false); });

  /* ---------- interactions ---------- */

  function copy(text) {
    var done = function () { notify("Copied " + text); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }

  view.addEventListener("click", function (e) {
    var t = e.target.closest("[data-hub-copy],[data-hub-download],[data-hub-share-toggle],[data-hub-regenerate]");
    if (!t) {
      var dead = e.target.closest('a[href="#"]');
      if (dead) { e.preventDefault(); notify("Files open from here in the live version."); }
      return;
    }
    if (t.hasAttribute("data-hub-copy")) copy(t.getAttribute("data-hub-copy"));
    if (t.hasAttribute("data-hub-download")) notify("Downloads work in the live version.");
    if (t.hasAttribute("data-hub-share-toggle")) {
      data.designHub.share.enabled = !data.designHub.share.enabled;
      render(true);
      notify(data.designHub.share.enabled ? "Sharing is on" : "Sharing is off");
    }
    if (t.hasAttribute("data-hub-regenerate")) {
      var code = Math.random().toString(36).slice(2, 6);
      data.designHub.share.link = data.designHub.share.link.replace(/-[a-z0-9]+$/, "-" + code);
      render(true);
      notify("New link created. The old one no longer works.");
    }
  });

  view.addEventListener("change", function (e) {
    var k = e.target.getAttribute("data-hub-share-section");
    if (k) data.designHub.share.sections[k] = e.target.checked;
  });

  view.addEventListener("submit", function (e) {
    var form = e.target;
    e.preventDefault();
    var error = form.querySelector("[data-hub-error]");
    function fail(msg) { error.textContent = msg; error.hidden = false; }

    if (form.hasAttribute("data-hub-feedback-form")) {
      var choice = form.querySelector('input[name="choice"]:checked');
      if (!choice) return fail("Choose one of the options above.");
      var hit = findFeedback(location.hash.split("/")[2]);
      hit.round.state = "received";
      hit.round.choice = choice.value;
      hit.round.comment = form.comment.value.trim();
      hit.round.date = "Today";
      hit.project.status = "in-progress";
      hit.project.nextStep = "Evy reviews your feedback";
      hit.project.nextDate = "Within two working days";
      hit.project.stages.forEach(function (s) { if (s.state === "waiting") s.state = "completed"; });
      var next = hit.project.stages.filter(function (s) { return s.state === "upcoming"; })[0];
      if (next) next.state = "current";
      render(false);
    }

    if (form.hasAttribute("data-hub-request-form")) {
      var topic = form.querySelector('input[name="topic"]:checked');
      var timing = form.querySelector('input[name="timing"]:checked');
      if (!topic || !timing) return fail("Pick an option for both questions. The rest is up to you.");
      request = { sent: true, topic: topic.value, timing: timing.value, idea: form.idea.value.trim() };
      render(false);
    }
  });

  render(true);
})();
