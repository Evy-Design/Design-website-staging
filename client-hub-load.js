/* Client hub — data loading.
   NOT SECURE YET (on purpose, for now): the login only looks up the
   email address in the public "clienthub" dataset, there is no
   password or link check. Fine for testing with test clients; the
   server part with a real login replaces this before real clients
   use it.

   Flow: client-portal.js stores the email in sessionStorage, this
   file fetches that client's data from Sanity, reshapes it to what
   client-hub.js expects and calls EOD_HUB_INIT. ?demo (or no login)
   shows the demo data from client-hub-data.js. */
window.EOD_HUB_SANITY = {
  projectId: "16akn05z",
  dataset: "clienthub",
  apiVersion: "2025-02-19"
};

window.EOD_HUB_QUERY = (function () {
  var cfg = window.EOD_HUB_SANITY;
  // POST keeps the email address out of the URL.
  return function (query, params) {
    return fetch("https://" + cfg.projectId + ".api.sanity.io/v" + cfg.apiVersion + "/data/query/" + cfg.dataset, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: query, params: params || {} })
    }).then(function (r) {
      if (!r.ok) throw new Error("Sanity " + r.status);
      return r.json();
    }).then(function (json) { return json.result; });
  };
})();

(function () {
  var QUERY = '*[_type == "hubClient" && lower(email) == lower($email) && active != false][0]{' +
    '_id, name, company, email,' +
    '"projects": *[_type == "hubProject" && client._ref == ^._id && !(_id in path("drafts.**"))] | order(number asc){' +
      '"id": _id, number, title, type, summary, status, nextStep, nextDate, update, feedbackRounds, started, completed, filesStoredMonths,' +
      '"stages": stages[]{title, state, note, "date": dateLabel},' +
      '"files": files[]{"name": title, stage, approved, "url": file.asset->url, "ext": file.asset->extension, "bytes": file.asset->size},' +
      '"feedback": *[_type == "hubFeedbackRound" && project._ref == ^._id && state != "draft" && !(_id in path("drafts.**"))] | order(round asc){' +
        '"id": _id, round, title, action, method, state, question, due, meeting, notes, response, confirmation,' +
        '"presentation": presentation.asset->url,' +
        '"concepts": concepts[]{label, name, "image": image.asset->url}' +
      "}" +
    "}," +
    '"designHub": *[_type == "hubDesignHub" && client._ref == ^._id && !(_id in path("drafts.**"))][0]{' +
      'tagline, story, colors, typography, share,' +
      '"logos": logos[]{name, background, "image": image.asset->url, "download": download.asset->url},' +
      '"files": files[]{"name": title, "url": file.asset->url, "ext": file.asset->extension, "bytes": file.asset->size}' +
    "}" +
  "}";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function pad(n) { return String(n).padStart(2, "0"); }
  // "2026-10-17" -> "17 Oct 2026"
  function fmtDay(iso) {
    var m = iso && String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? +m[3] + " " + MONTHS[+m[2] - 1] + " " + m[1] : "";
  }
  // Sanity datetimes are UTC; the hub works with local "YYYY-MM-DDTHH:MM".
  function localDateTime(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  function fmtDayTime(iso) { return iso ? fmtDay(localDateTime(iso)) : ""; }
  function size(bytes) {
    if (!bytes) return "";
    return bytes > 1e6 ? (bytes / 1e6).toFixed(1).replace(/\.0$/, "") + " MB" : Math.max(1, Math.round(bytes / 1e3)) + " KB";
  }
  function file(f) {
    return {
      name: f.name, stage: f.stage, approved: f.approved,
      url: f.url, kind: (f.ext || "").toUpperCase(), size: size(f.bytes)
    };
  }
  var LOGO_VARIANT = { light: "dark", dark: "light", colour: "icon" };

  function shape(c) {
    var projects = (c.projects || []).map(function (p) {
      return {
        id: p.id,
        number: p.number || "",
        title: p.title || "Untitled project",
        type: p.type || "",
        summary: p.summary || "",
        status: p.status || "in-progress",
        started: fmtDay(p.started),
        completed: p.completed || "",
        filesStoredMonths: p.filesStoredMonths || 1,
        nextStep: p.nextStep || "",
        nextDate: p.nextDate || "",
        update: p.update && p.update.text ? { date: fmtDay(p.update.date), text: p.update.text } : null,
        feedbackRounds: p.feedbackRounds || 0,
        stages: p.stages || [],
        files: (p.files || []).filter(function (f) { return f.url; }).map(file),
        feedback: (p.feedback || []).map(function (f) {
          var r = f.response || {};
          var conf = f.confirmation || {};
          var n = f.notes || {};
          var notes = {
            summary: n.summary || "",
            agreed: n.agreed || [],
            next: n.next || "",
            written: fmtDay(n.written),
            confirmed: fmtDayTime(conf.confirmedAt),
            addition: conf.addition || ""
          };
          return {
            id: f.id,
            round: pad(f.round || 1),
            title: f.title || "Feedback",
            action: f.action || "",
            method: f.method || "online",
            state: f.state,
            question: f.question || "",
            due: f.due || "",
            meeting: f.meeting
              ? { start: localDateTime(f.meeting.start), end: localDateTime(f.meeting.end), where: f.meeting.where || "", link: f.meeting.link || "" }
              : null,
            notes: notes,
            choice: r.choice ? (r.direction ? r.direction + ": " : "") + r.choice : "",
            comment: r.comment || "",
            date: fmtDayTime(r.submittedAt),
            presentation: f.presentation || "",
            concepts: (f.concepts || []).map(function (k, i) {
              return { label: k.label || "", name: k.name || "", image: k.image || "", tone: i % 2 ? "dark" : "light" };
            })
          };
        })
      };
    });

    var h = c.designHub;
    var designHub = h
      ? {
          tagline: h.tagline || "",
          story: h.story || "",
          logos: (h.logos || []).map(function (l) {
            return { name: l.name || "Logo", variant: LOGO_VARIANT[l.background] || "dark", image: l.image || "", download: l.download || "" };
          }),
          colors: (h.colors || []).map(function (k) { return { name: k.name || "", hex: k.hex || "#000000", rgb: k.rgb || "" }; }),
          typography: h.typography || [],
          files: (h.files || []).filter(function (f) { return f.url; }).map(function (f) {
            var x = file(f);
            x.approved = undefined;
            x.formats = x.kind;
            return x;
          }),
          share: {
            enabled: !!(h.share && h.share.enabled),
            link: "hub.evydiepenbroek.nl/brand/" + ((h.share && h.share.token && h.share.token.current) || "not-set-yet"),
            sections: ["overview", "logos", "colors", "typography", "files"].reduce(function (o, k) {
              o[k] = !h.share || !h.share.sections ? k !== "files" : h.share.sections.indexOf(k) !== -1;
              return o;
            }, {})
          }
        }
      : null;

    return { source: "sanity", client: { name: c.name, company: c.company, email: c.email }, projects: projects, designHub: designHub };
  }

  function useDemo() {
    window.EOD_HUB_DATA.source = "demo";
    window.EOD_HUB_INIT(window.EOD_HUB_DATA);
  }

  // Logging out forgets the email for this browser tab.
  var logout = document.querySelector(".eod-hub__logout");
  if (logout) logout.addEventListener("click", function () {
    try { sessionStorage.removeItem("eodHubEmail"); } catch (e) {}
  });

  var email = null;
  try { email = sessionStorage.getItem("eodHubEmail"); } catch (e) {}
  if (/[?&]demo\b/.test(location.search) || !email) return useDemo();

  window.EOD_HUB_QUERY(QUERY, { email: email })
    .then(function (c) {
      if (!c) {
        try { sessionStorage.removeItem("eodHubEmail"); } catch (e) {}
        location.replace("client-portal.html#not-found");
        return;
      }
      window.EOD_HUB_INIT(shape(c));
    })
    .catch(function (err) {
      var view = document.querySelector("[data-hub-view]");
      if (view) view.innerHTML = '<div class="eod-hub-intro"><h1 class="eod-hub-title">Something went wrong</h1><p class="eod-hub-lede">The hub couldn\'t load your projects. Please try again in a moment.</p></div>';
      console.error(err);
    });
})();
