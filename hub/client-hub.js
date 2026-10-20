/* Client hub.
   One page, hash-routed views (#/, #/projects, #/projects/<id>,
   #/feedback/<id>, #/design-hub, #/request). client-hub-load.js
   fetches the logged-in client's data from Sanity (or uses the demo
   data in client-hub-data.js) and calls EOD_HUB_INIT with it.
   Anything the client "submits" only lives in memory until the page
   reloads; saving comes with the server part. */
window.EOD_HUB_INIT = function (data) {
  var view = document.querySelector("[data-hub-view]");
  if (!data || !view) return;

  var company = document.querySelector("[data-hub-company]");
  if (company) company.textContent = data.client.company;
  var note = document.querySelector(".eod-hub__prototype");
  if (note && data.source === "sanity") note.textContent = "Early version: feedback and requests you send here aren't saved yet.";

  // Short lowercase word used in placeholder artwork (e.g. "nord").
  var BRAND = String(data.client.company || "").split(/\s+/)[0].toLowerCase();

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
    if (opts.href) return '<a class="' + cls + '" href="' + esc(opts.href) + '"' + (opts.external ? ' target="_blank" rel="noopener"' : "") + ">" + inner + "</a>";
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

  function backLink(label, href) {
    return '<a class="eod-hub-backlink" href="' + href + '"><span aria-hidden="true">' + ARROW_LEFT + "</span>" + esc(label) + "</a>";
  }

  var STATUS = {
    "in-progress": { label: "In progress", tone: "neutral" },
    feedback: { label: "Your feedback needed", tone: "accent" },
    completed: { label: "Completed", tone: "muted" }
  };
  var FEEDBACK_STATE = {
    draft: "Not requested yet",
    awaiting: "Awaiting your feedback",
    scheduled: "Meeting planned",
    notes: "Notes ready to check",
    received: "Feedback received",
    revision: "In revision",
    approved: "Approved",
    completed: "Completed"
  };

  /* ---------- dates ---------- */
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function toDate(iso) {
    var m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null;
  }
  function fmtDate(iso, withDay) {
    var d = toDate(iso);
    if (!d) return iso;
    return (withDay ? DAYS[d.getDay()] + " " : "") + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  function fmtTime(iso) {
    var d = toDate(iso);
    return d ? String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") : "";
  }
  function daysLeft(iso) {
    var d = toDate(iso), now = new Date();
    if (!d) return "";
    var n = Math.round((d - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    if (n < 0) return "deadline passed";
    if (n === 0) return "due today";
    return n === 1 ? "1 day left" : n + " days left";
  }
  function meetingWhen(m) {
    if (!m || !m.start) return "Date to be confirmed";
    return fmtDate(m.start, true) + ", " + fmtTime(m.start) + (m.end ? "–" + fmtTime(m.end) : "");
  }
  // Final files stay online for filesStoredMonths (default 1) after completion.
  function filesUntil(p) {
    var d = toDate(p.completed);
    if (!d) return null;
    d.setMonth(d.getMonth() + (p.filesStoredMonths || 1));
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function roundOf(p, f) {
    return "Feedback round " + f.round + (p.feedbackRounds ? " of " + String(p.feedbackRounds).padStart(2, "0") : "");
  }
  function roundTone(state) {
    return state === "awaiting" || state === "notes" ? "accent" : state === "approved" || state === "received" ? "neutral" : "muted";
  }

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
        if (f.state === "awaiting" || f.state === "notes") list.push({ project: p, round: f });
      });
    });
    return list;
  }
  function upcomingMeetings() {
    var list = [];
    data.projects.forEach(function (p) {
      p.feedback.forEach(function (f) {
        if (f.state === "scheduled" && f.meeting && f.meeting.start) list.push({ project: p, round: f });
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
          '<span class="eod-hub-row__label">' + (p.status === "completed" ? "Completed " + fmtDate(p.completed) : "Next") + "</span>" +
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
        (f.url
          ? '<a class="eod-hub-file__download" href="' + esc(f.url) + '?dl=" download aria-label="Download ' + esc(f.name) + '">Download</a>'
          : '<button class="eod-hub-file__download" type="button" data-hub-download aria-label="Download ' + esc(f.name) + '">Download</button>') +
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
          var notes = a.round.state === "notes";
          return (
            '<div class="eod-hub-action">' +
              '<div class="eod-hub-action__text">' +
                '<p class="eod-hub-action__eyebrow">Your next step</p>' +
                '<h2 class="eod-hub-action__title">' + (notes ? "Check the notes from our meeting" : esc(a.round.action || "Review: " + a.round.title)) + "</h2>" +
                '<p class="eod-hub-action__meta">' + esc(a.project.title) + " · " +
                  (notes ? "Confirm that they match what we discussed" : "Feedback by " + fmtDate(a.round.due) + " · " + daysLeft(a.round.due)) + "</p>" +
              "</div>" +
              btn(notes ? "Read the notes" : "Review designs", { href: "#/feedback/" + a.round.id, variant: "light" }) +
            "</div>"
          );
        }).join("")
      : '<div class="eod-hub-calm"><span class="eod-hub-calm__dot" aria-hidden="true"></span>Nothing needed from you right now. I\'ll let you know when there is.</div>';

    return (
      '<div class="eod-hub-intro">' +
        '<h1 class="eod-hub-title" tabindex="-1">Welcome back, ' + esc(data.client.name) + ".</h1>" +
        '<p class="eod-hub-lede">Here\'s where your projects stand.</p>' +
      "</div>" +

      '<section class="eod-hub-section">' + actionHtml +
        upcomingMeetings().map(function (m) {
          return (
            '<a class="eod-hub-meetrow" href="#/feedback/' + m.round.id + '">' +
              '<span class="eod-hub-meetrow__date"><strong>' + toDate(m.round.meeting.start).getDate() + "</strong>" + MONTHS[toDate(m.round.meeting.start).getMonth()] + "</span>" +
              '<span class="eod-hub-meetrow__main"><span class="eod-hub-card__label">Coming up · Feedback meeting</span>' +
                "<span>" + esc(m.round.title) + " · " + esc(m.project.title) + "</span></span>" +
              '<span class="eod-hub-meetrow__time">' + meetingWhen(m.round.meeting) + "</span>" +
              '<span class="eod-hub-row__arrow" aria-hidden="true">' + ARROW_RIGHT + "</span>" +
            "</a>"
          );
        }).join("") +
      "</section>" +

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
            '<span class="eod-hub-teaser__mark" aria-hidden="true">' + esc(BRAND) + "</span>" +
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
      var meta = f.method === "meeting"
        ? "In a meeting · " + (f.meeting ? meetingWhen(f.meeting) : "")
        : "Online · " + (f.state === "awaiting" ? "Feedback by " + fmtDate(f.due) : f.date ? "Given " + esc(f.date) : "");
      return (
        '<li class="eod-hub-history">' +
          '<span class="eod-hub-history__round">Round ' + esc(f.round) + "</span>" +
          '<span class="eod-hub-history__main">' +
            '<span class="eod-hub-history__title">' + esc(f.title) + "</span>" +
            '<span class="eod-hub-history__meta">' + meta + "</span>" +
          "</span>" +
          pill(FEEDBACK_STATE[f.state], roundTone(f.state)) +
          link(f.state === "awaiting" || f.state === "notes" ? "Open" : "View", "#/feedback/" + f.id) +
        "</li>"
      );
    }).join("");
    var usedRounds = p.feedback.filter(function (f) { return f.state !== "draft"; }).length;

    return (
      '<div class="eod-hub-back">' + backLink("All projects", "#/projects") + "</div>" +
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
          (p.feedbackRounds
            ? '<div class="eod-hub-card">' +
                '<p class="eod-hub-card__label">Feedback rounds</p>' +
                '<p class="eod-hub-card__value">' + usedRounds + " of " + p.feedbackRounds + " included</p>" +
                '<div class="eod-hub-rounds" aria-hidden="true">' +
                  Array.apply(null, Array(p.feedbackRounds)).map(function (_, i) {
                    return '<span class="eod-hub-rounds__dot' + (i < usedRounds ? " is--used" : "") + '"></span>';
                  }).join("") +
                "</div>" +
                '<p class="eod-hub-card__meta">' + (usedRounds >= p.feedbackRounds ? "All included rounds are in use. Need another? We can add one in consultation." : "Need more? Extra rounds can be added in consultation.") + "</p>" +
              "</div>"
            : "") +
          (p.status !== "completed" && p.nextStep
            ? '<div class="eod-hub-card">' +
                '<p class="eod-hub-card__label">Next milestone</p>' +
                '<p class="eod-hub-card__value">' + esc(p.nextStep) + "</p>" +
                '<p class="eod-hub-card__meta">' + esc(p.nextDate) + "</p>" +
              "</div>"
            : "") +
          (p.update && p.update.text
            ? '<div class="eod-hub-card eod-hub-card--note">' +
                '<p class="eod-hub-card__label">Latest update' + (p.update.date ? " · " + esc(p.update.date) : "") + "</p>" +
                '<p class="eod-hub-card__quote">' + esc(p.update.text) + "</p>" +
                '<p class="eod-hub-card__sign">— Evy</p>' +
              "</div>"
            : "") +
        "</aside>" +
      "</div>" +

      (history ? '<section class="eod-hub-section">' + sectionHead("Feedback") + '<ul class="eod-hub-list">' + history + "</ul></section>" : "") +

      '<section class="eod-hub-section">' + sectionHead(p.status === "completed" ? "Your final files" : "Files") +
        filesNotice(p) +
        (filesExpired(p) ? "" : '<ul class="eod-hub-list">' + p.files.map(fileRow).join("") + "</ul>") +
      "</section>"
    );
  }

  function filesExpired(p) {
    var until = p.status === "completed" && filesUntil(p);
    return until ? daysLeft(until) === "deadline passed" : false;
  }
  function filesNotice(p) {
    var until = p.status === "completed" && filesUntil(p);
    if (!until) return "";
    if (filesExpired(p)) {
      return (
        '<div class="eod-hub-retention is--expired">' +
          "<p><strong>These files were stored online until " + fmtDate(until) + ".</strong> " +
          "They're no longer available here. Need them again? Just ask and I'll send them over.</p>" +
          link("Ask Evy for the files", "#/request") +
        "</div>"
      );
    }
    return (
      '<div class="eod-hub-retention">' +
        '<p><strong>Files stored online until ' + fmtDate(until, true) + '</strong> <span class="eod-hub-muted">· ' + daysLeft(until).replace("deadline", "") + "</span></p>" +
        '<p class="eod-hub-muted">That\'s one month after the project was completed. Download everything you\'d like to keep before then. Your logos and brand files stay available in your Design Hub.</p>' +
      "</div>"
    );
  }

  function concept(c) {
    // An uploaded design image, or abstract placeholder artwork in the demo.
    var art = c.image
      ? '<div class="eod-hub-concept__art eod-hub-concept__art--image"><img src="' + esc(c.image) + '?w=1400&auto=format" alt="' + esc((c.label || "") + " " + (c.name || "")) + '" loading="lazy" /></div>'
      : data.source === "sanity"
      ? '<div class="eod-hub-concept__art eod-hub-concept__art--empty" aria-hidden="true"></div>'
      : '<div class="eod-hub-concept__art" aria-hidden="true">' +
          '<span class="eod-hub-concept__poster"><span>' + esc(BRAND) + "</span><small>Opening 14.11</small></span>" +
          '<span class="eod-hub-concept__post"></span>' +
          '<span class="eod-hub-concept__card"></span>' +
        "</div>";
    return (
      '<figure class="eod-hub-concept eod-hub-concept--' + (c.tone || "light") + '">' +
        art +
        '<figcaption><span class="eod-hub-concept__label">' + esc(c.label) + "</span>" + esc(c.name) + "</figcaption>" +
      "</figure>"
    );
  }

  var CHOICES = ["I'm happy with this direction", "I'd like some changes", "I'd like to explore the options further"];

  function viewFeedback(id) {
    var hit = findFeedback(id);
    if (!hit) return viewNotFound();
    return hit.round.method === "meeting" ? viewFeedbackMeeting(hit.project, hit.round) : viewFeedbackOnline(hit.project, hit.round);
  }

  function viewFeedbackOnline(p, f) {
    var sent = f.state !== "awaiting";
    var fresh = f.state === "received";

    var steps = [
      { title: "Presentation shared", note: "The concepts are ready for you.", state: "completed" },
      { title: "Your feedback", note: sent ? "Thank you, received." : "Waiting for your response.", state: sent ? "completed" : "current" },
      { title: "Evy reviews", note: "I'll go through your feedback and agree the next steps with you.", state: sent ? "current" : "upcoming" }
    ];

    var form = sent
      ? '<div class="eod-hub-confirm">' +
          '<span class="eod-hub-confirm__icon" aria-hidden="true">' + CHECK + "</span>" +
          '<div><h2 class="eod-hub-section__title">' + (fresh ? "Thank you, " + esc(data.client.name) + "." : "Your feedback") + "</h2>" +
          '<p class="eod-hub-muted">' + (fresh ? "Your feedback is in. I\'ll review it and get back to you with the next steps within two working days." : "Given online" + (f.date ? " on " + esc(f.date) : "") + ".") + "</p>" +
          '<p class="eod-hub-confirm__quote">“' + esc(f.choice) + "”" + (f.comment ? "<br>" + esc(f.comment) : "") + "</p>" +
          link("Back to the project", "#/projects/" + p.id) + "</div>" +
        "</div>"
      : '<form class="eod-hub-form" data-hub-feedback-form novalidate>' +
          (f.concepts.length > 1
            ? '<fieldset class="eod-hub-fieldset">' +
                '<legend class="eod-hub-section__title">Which direction feels right?</legend>' +
                chips("direction", f.concepts.map(function (c) { return c.label + " · " + c.name; }).concat(["Not sure yet"])) +
              "</fieldset>"
            : "") +
          '<fieldset class="eod-hub-fieldset">' +
            '<legend class="eod-hub-section__title">' + (f.concepts.length > 1 ? "And how do you feel about it?" : "What do you think?") + "</legend>" +
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
      '<div class="eod-hub-back">' + backLink(p.title, "#/projects/" + p.id) + "</div>" +
      '<div class="eod-hub-intro">' +
        '<p class="eod-hub-eyebrow">' + roundOf(p, f) + " · " + esc(p.title) + " · Online</p>" +
        '<h1 class="eod-hub-title" tabindex="-1">' + esc(f.title) + "</h1>" +
        (f.question ? '<p class="eod-hub-lede">' + esc(f.question) + "</p>" : "") +
        '<div class="eod-hub-intro__status">' + pill(FEEDBACK_STATE[f.state], roundTone(f.state)) +
          (sent ? "" : '<span class="eod-hub-deadline">Feedback by ' + fmtDate(f.due, true) + ' <span class="eod-hub-muted">· ' + daysLeft(f.due) + "</span></span>") + "</div>" +
      "</div>" +

      (f.concepts.length
        ? '<section class="eod-hub-section"><div class="eod-hub-concepts">' + f.concepts.map(concept).join("") + "</div>" +
            (f.presentation || data.source !== "sanity" ? '<div class="eod-hub-concepts__foot">' + link("Open full presentation (PDF)", f.presentation || "#") + "</div>" : "") + "</section>"
        : "") +

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

  function notesBlock(n, author) {
    return (
      '<div class="eod-hub-notes">' +
        '<p class="eod-hub-card__label">Notes from our meeting · written by ' + author + (n.written ? " · " + esc(n.written) : "") + "</p>" +
        '<p class="eod-hub-notes__summary">' + esc(n.summary) + "</p>" +
        '<h3 class="eod-hub-notes__head">What we agreed</h3>' +
        '<ul class="eod-hub-notes__list">' + n.agreed.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" +
        '<h3 class="eod-hub-notes__head">Next step</h3>' +
        '<p class="eod-hub-notes__next">' + esc(n.next) + "</p>" +
        (n.addition ? '<h3 class="eod-hub-notes__head">Your addition</h3><p class="eod-hub-confirm__quote">' + esc(n.addition) + "</p>" : "") +
      "</div>"
    );
  }

  function viewFeedbackMeeting(p, f) {
    var m = f.meeting || {};
    var order = ["scheduled", "notes", "received", "approved", "completed"];
    var at = Math.max(0, order.indexOf(f.state));
    var steps = [
      { title: "Meeting planned", note: meetingWhen(m) },
      { title: "We talk it through", note: "Together, in the meeting." },
      { title: "Evy writes the notes", note: "What we discussed and agreed, written down here." },
      { title: "You confirm the notes", note: "So we both know what was agreed." }
    ].map(function (s, i) {
      var reached = at === 0 ? 0 : at === 1 ? 3 : 4;
      s.state = i < reached ? "completed" : i === reached ? "current" : "upcoming";
      return s;
    });

    var body;
    if (f.state === "scheduled") {
      body =
        '<div class="eod-hub-meeting">' +
          (m.start
            ? '<div class="eod-hub-meeting__date" aria-hidden="true"><strong>' + toDate(m.start).getDate() + "</strong>" + MONTHS[toDate(m.start).getMonth()] + "</div>"
            : '<div class="eod-hub-meeting__date" aria-hidden="true"><strong>–</strong>TBC</div>') +
          '<div class="eod-hub-meeting__main">' +
            '<p class="eod-hub-card__label">Our feedback meeting</p>' +
            '<p class="eod-hub-meeting__when">' + meetingWhen(m) + "</p>" +
            (m.where ? '<p class="eod-hub-muted">' + esc(m.where) + "</p>" : "") +
            '<div class="eod-hub-meeting__actions">' +
              (m.link ? btn("Join the call", data.source === "sanity" ? { href: m.link, external: true } : { attrs: " data-hub-join" }) : "") +
              (m.start ? '<button class="eod-hub-textbtn" type="button" data-hub-ics>Add to calendar</button>' : "") +
            "</div>" +
          "</div>" +
        "</div>" +
        '<p class="eod-hub-muted eod-hub-meeting__after">After the meeting I\'ll write down what we discussed and agreed. You\'ll find the notes here to check and confirm.</p>' +
        (f.draftNotes ? '<button class="eod-hub-textbtn eod-hub-prototype-skip" type="button" data-hub-simulate>Prototype: skip to after the meeting</button>' : "");
    } else if (f.state === "notes") {
      body =
        notesBlock(f.notes, "Evy") +
        '<form class="eod-hub-form eod-hub-notes__form" data-hub-notes-form novalidate>' +
          '<h2 class="eod-hub-section__title">Do these notes match what we discussed?</h2>' +
          '<label class="eod-hub-field">' +
            '<span class="eod-hub-field__label">Something to add or correct? <span class="eod-hub-muted">Optional</span></span>' +
            '<textarea class="eod-hub-input eod-hub-input--area" name="addition" rows="4" placeholder="Anything I missed, or remember differently."></textarea>' +
          "</label>" +
          btn("Confirm the notes", { type: "submit" }) +
        "</form>";
    } else {
      body =
        notesBlock(f.notes, "Evy") +
        '<p class="eod-hub-confirmed"><span class="eod-hub-confirm__icon" aria-hidden="true">' + CHECK + "</span>" +
          "Confirmed by " + esc(data.client.name) + (f.notes.confirmed ? " · " + esc(f.notes.confirmed) : "") + "</p>";
    }

    return (
      '<div class="eod-hub-back">' + backLink(p.title, "#/projects/" + p.id) + "</div>" +
      '<div class="eod-hub-intro">' +
        '<p class="eod-hub-eyebrow">' + roundOf(p, f) + " · " + esc(p.title) + " · In a meeting</p>" +
        '<h1 class="eod-hub-title" tabindex="-1">' + esc(f.title) + "</h1>" +
        (f.question ? '<p class="eod-hub-lede">' + esc(f.question) + "</p>" : "") +
        '<div class="eod-hub-intro__status">' + pill(FEEDBACK_STATE[f.state], roundTone(f.state)) + "</div>" +
      "</div>" +
      '<div class="eod-hub-project">' +
        '<section class="eod-hub-section eod-hub-project__journey">' + body + "</section>" +
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

  function downloadIcs(p, f) {
    var m = f.meeting;
    function stamp(iso) { return iso.replace(/[-:]/g, "").slice(0, 15); }
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Evy Diepenbroek//Client hub//EN",
      "BEGIN:VEVENT",
      "UID:" + f.id + "@evydiepenbroek.nl",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART:" + stamp(m.start), "DTEND:" + stamp(m.end || m.start),
      "SUMMARY:Feedback meeting: " + f.title + " (" + p.title + ")",
      "LOCATION:" + (m.link || m.where),
      "DESCRIPTION:" + m.where,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "feedback-meeting.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function viewDesignHub() {
    var h = data.designHub;
    if (!h) {
      return (
        '<div class="eod-hub-intro"><p class="eod-hub-eyebrow">Design Hub</p>' +
        '<h1 class="eod-hub-title" tabindex="-1">' + esc(data.client.company) + "</h1>" +
        '<p class="eod-hub-lede">Your Design Hub is being set up. Your logos, colours, typography and brand files will appear here.</p></div>'
      );
    }
    var share = h.share;
    var sectionLabels = { overview: "Brand overview", logos: "Logos", colors: "Colours", typography: "Typography", files: "Files" };

    var logos = h.logos.map(function (l) {
      return (
        '<figure class="eod-hub-logo eod-hub-logo--' + l.variant + '">' +
          '<div class="eod-hub-logo__art"' + (l.image ? "" : ' aria-hidden="true"') + ">" +
            (l.image
              ? '<img src="' + esc(l.image) + '?w=800&auto=format" alt="' + esc(l.name) + '" />'
              : l.variant === "icon" ? esc(BRAND.charAt(0)) : "<span>" + esc(BRAND) + "<sup>studio</sup></span>") +
          "</div>" +
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
          // Sections without content are left out until you fill them in.
          (h.story ? '<section class="eod-hub-section">' + sectionHead("Brand overview") + '<p class="eod-hub-story">' + esc(h.story) + "</p></section>" : "") +
          (logos ? '<section class="eod-hub-section">' + sectionHead("Logos") + '<div class="eod-hub-logos">' + logos + "</div></section>" : "") +
          (colors ? '<section class="eod-hub-section">' + sectionHead("Colours", '<span class="eod-hub-muted">Click to copy</span>') + '<div class="eod-hub-swatches">' + colors + "</div></section>" : "") +
          (type ? '<section class="eod-hub-section">' + sectionHead("Typography") + '<div class="eod-hub-types">' + type + "</div></section>" : "") +
          (h.files.length ? '<section class="eod-hub-section">' + sectionHead("Files") + '<ul class="eod-hub-list">' + h.files.map(fileRow).join("") + "</ul></section>" : "") +
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
    var t = e.target.closest("[data-hub-copy],[data-hub-download],[data-hub-share-toggle],[data-hub-regenerate],[data-hub-ics],[data-hub-join],[data-hub-simulate]");
    if (!t) {
      var dead = e.target.closest('a[href="#"]');
      if (dead) { e.preventDefault(); notify("Files open from here in the live version."); }
      return;
    }
    if (t.hasAttribute("data-hub-copy")) copy(t.getAttribute("data-hub-copy"));
    if (t.hasAttribute("data-hub-ics") || t.hasAttribute("data-hub-simulate") || t.hasAttribute("data-hub-join")) {
      var hitM = findFeedback(location.hash.split("/")[2]);
      if (t.hasAttribute("data-hub-ics")) downloadIcs(hitM.project, hitM.round);
      if (t.hasAttribute("data-hub-join")) notify("The call link opens here in the live version.");
      if (t.hasAttribute("data-hub-simulate")) {
        hitM.round.state = "notes";
        hitM.round.notes = hitM.round.draftNotes;
        hitM.round.notes.written = "Today";
        render(false);
      }
    }
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
    function fail(msg) { if (error) { error.textContent = msg; error.hidden = false; } }

    if (form.hasAttribute("data-hub-feedback-form")) {
      var dirInputs = form.querySelectorAll('input[name="direction"]');
      var dir = form.querySelector('input[name="direction"]:checked');
      var choice = form.querySelector('input[name="choice"]:checked');
      if ((dirInputs.length && !dir) || !choice) return fail("Choose an option for each question above.");
      var hit = findFeedback(location.hash.split("/")[2]);
      hit.round.state = "received";
      hit.round.choice = (dir ? dir.value + ": " : "") + choice.value;
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

    if (form.hasAttribute("data-hub-notes-form")) {
      var hitN = findFeedback(location.hash.split("/")[2]);
      hitN.round.state = "received";
      hitN.round.notes.addition = form.addition.value.trim();
      hitN.round.notes.confirmed = "Today";
      hitN.project.nextStep = "Refining the chosen direction";
      hitN.project.nextDate = "I'll share the update here";
      render(false);
      notify("Thank you. The notes are confirmed.");
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
};
