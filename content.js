/* ===========================================================
   Evy Diepenbroek — Shared page content

   Single source of truth for text that's meant to be IDENTICAL on
   every page that shows it (Awards, the "I am a [ ] Design" CTA).
   Edit the data below once — every page loading this file (Home,
   About, …) re-renders from it, so there's no separate copy to
   remember to update elsewhere.

   Runs synchronously, no DOMContentLoaded wait: this script tag
   must be placed AFTER the markup for .eod-awards__list /
   .eod-cta__word / .eod-cta__badge / .eod-cta__suffix / .eod-cta__body
   (i.e. after </main>), and BEFORE script.js — so by the time
   script.js's own DOMContentLoaded-gated inits (award toggles,
   reveal-in, word/badge cyclers) run, the content below has
   already been rendered into the page.
   =========================================================== */
window.EOD_CONTENT = {
  awards: [
    {
      year: "2022",
      title: "The Penguin Cover Design Award",
      body: "My book design cover was shortlisted for the 2022 Fiction category, Girl, Woman, Other by Bernardine Evaristo with Penguin Random House UK. Everything was incredible. I've learned alot and met some amazing and inspirational people. I'm grateful and honoured to have been selected for this."
    },
    {
      year: "2024",
      title: "Motion Graphic Honorable Mention Prize – Your Craft DOOH‑design challenge",
      body: "In this challenge, I won the Motion Design Honorable Mention Prize. The goal was to celebrate authenticity and unique craftsmanship, using the Netherlands as a canvas. Global and RA*W launched the 2024 Digital Out-of-Home challenge, showcasing work on over 2650 digital screens nationwide. The focus was on evoking emotions and inspiring passersby with creativity. I'm honored to be recognized for my contribution."
    }
  ],
  // The About page's "Time line" section — add a new milestone by
  // adding a new object here, nowhere else. Order here is DOM order
  // (top-to-bottom as you scroll), so put new entries wherever they
  // belong chronologically rather than always at an end. `body` and
  // the `cta` pair are both OPTIONAL — omit either on a milestone that
  // doesn't have one (see renderTimeline() below, which only renders
  // what's actually provided).
  timeline: [
    {
      year: "2026 – Now",
      title: "Creative / UX&UI designer at Kool Collective",
      image: "assets/timeline/Kool Collective.jpg",
      alt: "Evy's work at Kool Collective",
      ctaLabel: "Go to website",
      ctaHref: "https://koolcollective.nl"
    },
    {
      year: "2022 – 2025",
      title: "Brand Designer at NOSUCH",
      image: "assets/timeline/Nosuch_Evy.jpg",
      alt: "Evy's brand design work at NOSUCH",
      body: "As a designer at NOSUCH, I create and maintain comprehensive visual identities, covering logo design, typography, UX design, motion graphics, and all other aspects of visual identity. Within the agency, I collaborate closely with various creative professionals, designing for major companies like Microsoft and Shell, as well as startups and smaller companies.",
      ctaLabel: "Go to website",
      ctaHref: "https://nosuch.nl"
    },
    {
      year: "2024",
      title: "Global DOOH-Motion Design Challenge Honorable Mention Prize",
      image: "assets/timeline/Global DOOH-Motion Design Challenge  Honorable Mention Prize.jpeg",
      alt: "Evy's Digital Out-of-Home motion design entry",
      body: "In this challenge, I won the Motion Design Honorable Mention Prize. The goal was to celebrate authenticity and unique craftsmanship, using the Netherlands as a canvas. Global and RA*W launched the 2024 Digital Out-of-Home challenge, showcasing work on over 2650 digital screens nationwide. The focus was on evoking emotions and inspiring passersby with creativity. I'm honored to be recognized for my contribution."
    },
    {
      year: "2022",
      title: "Bachelor Of Arts In Graphic Communication",
      image: "assets/timeline/Bachelor Of Arts In Graphic Communication.jpg",
      alt: "Evy's graduation work in Graphic Communication",
      body: "In 2021 I got the opportunity to move to the United Kingdom and get my bachelor's degree in Graphic Communication from The University of Northampton. I did this not only for the amazing travel experience but also expand my range in design and to increase my level at the same time.",
      // TODO: swap in the real LinkedIn profile URL when it's ready —
      // matches the same "#" placeholder the nav's own LinkedIn link
      // currently uses.
      ctaLabel: "View my LinkedIn",
      ctaHref: "#"
    },
    {
      year: "2022",
      title: "The Penguin Cover Design Award",
      image: "assets/timeline/The Penguin Cover Design Award.webp",
      alt: "The Girl, Woman, Other Penguin book cover design",
      body: "My book design cover was shortlisted for the 2022 Fiction category, Girl, Woman, Other by Bernardine Evaristo with Penguin Random House UK. Everything was incredible. I've learned alot and met some amazing and inspirational people. I'm grateful and honoured to have been selected for this.",
      ctaLabel: "View this project",
      ctaHref: "project.html?slug=penguin-cover-design-award"
    },
    {
      year: "2021 – 2018",
      title: "MBO Media & Corporate Design",
      image: "assets/timeline/MBO Media & Corporate Design.webp",
      alt: "Evy's MBO Media & Corporate Design coursework",
      body: "in 2021 I graduated as a graphic designer at Grafisch Lyceum Rotterdam. After studying for 3 years, I could then officially call myself a graphic designer."
    },
    {
      year: "2018",
      title: "Masterclass",
      image: "assets/timeline/Masterclass.webp",
      alt: "Evy's Masterclass coursework",
      body: "I am a dedicated worker who thrives on new challenges. And as they say, working hard pays off. So, after the first year of my study, I was accepted into the Masterclass of my college. Every year a select number of people are allowed to enter this class. This class is for students with a higher level of design and who wants an extra challenge. In this class you get more assignments and you work together with the class for external companies."
    }
  ],
  // Projects grid (projects.html) + case-study pages (project.html —
  // one shared template, reads ?slug= to pick which entry here to
  // render). Add a new project by adding a new object here, nowhere
  // else — same pattern as `timeline` above. `deliverables` and
  // `process` are both OPTIONAL, same reasoning as `body`/`cta` on a
  // timeline entry: omit either on a project that doesn't have one.
  projects: [
    {
      slug: "blockchain",
      title: "What the F*ck is Blockchain?",
      // Grid thumbnail (projects.html) — deliberately its own image,
      // separate from `hero` below: the source design uses a
      // DIFFERENT image for the grid card than for the detail page's
      // own top image, for every project that has both.
      cover: "assets/projects/blockchain/cover.jpg",
      // Detail page's (project.html) large top image.
      hero: "assets/projects/blockchain/gallery-1.png",
      alt: "Spread from the What the F*ck is Blockchain magazine",
      description: "You have probably already heard about its Bitcoin, NFTs or Blockchain. On the news, on social media or just in a conversation. It is everywhere. But what does it all mean? People throw around terms such as blockchain, crypto art, ledger, and NFTs and expect other people to understand what they mean. So, I made a magazine explaining the basics of blockchain in the simplest way possible. This work was also displayed at the NewDesigners exhibition in London.",
      deliverables: ["Rebranding", "Design System", "UX Design decisions"],
      // Each entry is either a single full-width image ("full") or a
      // side-by-side pair ("pair", exactly 2 srcs) — this is the real
      // flow from the source design: full, pair, pair, full, pair,
      // full, not a uniform grid. See projects.css's own comment on
      // .eod-project__gallery for how these two types render.
      gallery: [
        { type: "full", src: ["assets/projects/blockchain/gallery-2.jpg"] },
        { type: "pair", src: ["assets/projects/blockchain/gallery-3.jpg", "assets/projects/blockchain/gallery-4.jpg"] },
        { type: "pair", src: ["assets/projects/blockchain/gallery-5.jpg", "assets/projects/blockchain/gallery-6.jpg"] },
        { type: "full", src: ["assets/projects/blockchain/gallery-7.jpg"] },
        // "text" block: left h2 heading, right body copy — same
        // column split as the title/description and process rows
        // (projects.css .eod-project__gallery-row--text). Placeholder
        // copy — Evy asked for a spot to explain more about the
        // image right below, edit these two strings directly.
        { type: "text", heading: "Add a heading", body: "Write more about this image here." },
        { type: "pair", src: ["assets/projects/blockchain/gallery-8.jpg", "assets/projects/blockchain/gallery-9.jpg"] },
        { type: "full", src: ["assets/projects/blockchain/gallery-10.jpg"] },
        // The old standalone "process" section was its own bespoke
        // component duplicating this exact heading+body layout — Evy:
        // "Delete this and add here a text explain section". Now
        // just another "text" gallery block, same as any other.
        { type: "text", heading: "The process:", body: "In the first video, you can see me working hard. I like to mix manual drawings with digital designs. In the second video, you can see my research and sketches." }
      ],
      process: {
        // Only the vertical process videos still live here — the
        // full-screen black treatment they get (see
        // .eod-project__vertical-video-section below) is genuinely
        // different from anything the gallery's own block types do,
        // so it keeps its own small data slot. { src, vertical: true }
        // instead of a plain string routes them into their own
        // full-screen black section (renderProjectDetail() below)
        // rather than the small side-by-side tile grid, which
        // cropped them awkwardly (Evy: "ik heb soms verticale
        // videos, deze mag je dan gewoon in een full screen section
        // zetten die zwart is").
        videos: [
          { src: "assets/projects/blockchain/process-1.mp4", vertical: true },
          { src: "assets/projects/blockchain/process-2.mp4", vertical: true }
        ]
      }
    },
    {
      slug: "my-type-of-place",
      title: "My Type Of Place",
      cover: "assets/projects/my-type-of-place/cover.jpg",
      hero: "assets/projects/my-type-of-place/gallery-1.jpg",
      alt: "Illuminated typography installation in an alley",
      description: "This alley is mainly known as the pissing alley, but also as a scary alley where you don’t want to be in the evening. I have highlighted this with all kinds of colourful typography that also refer to the text that is there. With all kinds of jokes about peeing, it is already a nice place for an Instagram story. But when I looked at my target group I saw that most young people who come here find the most important thing in the evening to show where they have been out on social media. I could use this to make this alley safer as well because no one wants to appear naked or peeing on Instagram. Therefore, by having large luminous letters stuck between the walls I made it a perfect place to take pictures for. Plus it lights up the alley too.",
      // Source design repeats the hero image again mid-sequence (a
      // deliberate bookend, not a mistake — it does the same on the
      // Penguin project below) — kept here to match.
      gallery: [
        { type: "pair", src: ["assets/projects/my-type-of-place/gallery-2.jpg", "assets/projects/my-type-of-place/gallery-3.jpg"] },
        { type: "full", src: ["assets/projects/my-type-of-place/gallery-1.jpg"] },
        { type: "pair", src: ["assets/projects/my-type-of-place/cover.jpg", "assets/projects/my-type-of-place/gallery-4.jpg"] }
      ]
    },
    {
      slug: "penguin-cover-design-award",
      title: "The Penguin Cover Design Award",
      cover: "assets/projects/penguin-cover-design-award/cover.jpg",
      hero: "assets/projects/penguin-cover-design-award/cover.jpg",
      alt: "The Girl, Woman, Other Penguin book cover design",
      description: "My book design cover was shortlisted for the 2022 Fiction category, Girl, Woman, Other by Bernardine Evaristo with Penguin Random House UK. Everything was incredible. I've learned a lot and met some amazing and inspirational people. I'm grateful and honoured to have been selected for this.",
      // Process text + image folded into the gallery flow itself
      // (see the blockchain project above for why) — a "text" block
      // for the old process copy, then the process image as an
      // ordinary "full" block right after it.
      gallery: [
        { type: "full", src: ["assets/projects/penguin-cover-design-award/gallery-1.png"] },
        { type: "text", heading: "The process:", body: "I first let loose on paper and sketches and visual illustrations dealing with women, class, race, and sexuality. I always go a long way on this, but I find it difficult to illustrate something that reflects all these subjects at once. So, I took a break from my sketchbook and started reading the first chapter. When I started reading the book, it began with a scene where they mentioned the theatre. I did some theatre myself, and I remembered there were always saying “don’t forget the red thread of the story”, so the thought of doing something with thread was already in my mind. I tried to stop illustrating the situations too literally and was focusing more on what it made the characters feel. The several topics made me feel stuck. And then the red thread comes in handy. I tried many things like making the letters stuck or one person, but I feel like it didn’t bring out all the stories of the book. I remember that I both thread to take photos for the book cover, and I was playing with the thread in my hand when I realized you can express so much with hands. We do things with our hands. Then everything was falling together fast. Subjects I have linked with hands and rope. All these hands visualize a topic; some are pulling, some are stuck, some are being played and some pick up the paces. I like that it doesn’t immediately give away what it is about but does connect well with the subjects." },
        { type: "full", src: ["assets/projects/penguin-cover-design-award/gallery-2.jpg"] }
      ]
    },
    {
      slug: "cense",
      title: "Cense",
      cover: "assets/projects/cense/cover.jpg",
      hero: "assets/projects/cense/cover.jpg",
      alt: "Cense project cover"
      // TODO: description/gallery still pending — the source Figma
      // page for this one wasn't finished yet at the time this was
      // built (same "#" / "/projects" placeholder pattern as the
      // other unfinished TODOs above). Card links to a case-study page
      // that just shows the cover + title until this is filled in.
    }
  ],
  cta: {
    // Each role's word and badge image cycle together in lockstep
    // (script.js's initCyclers steps every data-eod-cycle="cta-role"
    // wrapper on one shared interval) — index i here becomes the i-th
    // word AND the i-th badge image, so they can never drift apart.
    roles: [
      { word: "Motion", image: "https://images.unsplash.com/photo-1523294587484-bae6cc870010?w=500&h=700&fit=crop" },
      { word: "Brand", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&h=700&fit=crop" },
      { word: "UI/UX", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&h=700&fit=crop" },
      { word: "Graphic", image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=500&h=700&fit=crop" }
    ],
    suffix: "Design",
    body: "Lets have a coffee and talk about what I can be for you, text here longer need"
  }
};

(function () {
  function renderAwards() {
    const list = document.querySelector(".eod-awards__list");
    if (!list) return;
    list.innerHTML = window.EOD_CONTENT.awards.map(function (award, i) {
      return (
        '<li class="eod-awards__item" data-eod-reveal data-eod-reveal-delay="' + (i + 1) + '">' +
          '<button class="eod-awards__item-header" data-eod-award-toggle aria-expanded="false">' +
            '<span class="eod-awards__item-title">' + award.title + "</span>" +
            '<span class="eod-awards__item-year">' + award.year + "</span>" +
            '<span class="eod-awards__item-chevron" aria-hidden="true">&#8964;</span>' +
          "</button>" +
          '<div class="eod-awards__item-body"><p>' + award.body + "</p></div>" +
        "</li>"
      );
    }).join("");
  }

  function renderCta() {
    const cta = window.EOD_CONTENT.cta;
    const wordWrap = document.querySelector(".eod-cta__word[data-eod-cycle='cta-role']");
    const badgeWrap = document.querySelector(".eod-cta__badge[data-eod-cycle='cta-role']");
    const suffixEl = document.querySelector(".eod-cta__suffix");
    const bodyEl = document.querySelector(".eod-cta__body");
    if (!wordWrap && !badgeWrap && !suffixEl && !bodyEl) return;

    if (wordWrap) {
      wordWrap.innerHTML = cta.roles.map(function (role, i) {
        return '<span class="eod-cta__word-item eod-cta__accent' + (i === 0 ? " is-active" : "") + '">' + role.word + "</span>";
      }).join("");
    }
    if (badgeWrap) {
      badgeWrap.innerHTML = cta.roles.map(function (role, i) {
        return '<img class="eod-cta__badge-item' + (i === 0 ? " is-active" : "") + '" src="' + role.image + '" alt="" />';
      }).join("");
    }
    if (suffixEl) suffixEl.textContent = cta.suffix;
    if (bodyEl) bodyEl.textContent = cta.body;
  }

  function renderTimeline() {
    const list = document.querySelector(".eod-timeline__list");
    const photo = document.querySelector("[data-eod-journey-photo]");
    if (!list) return;
    const items = window.EOD_CONTENT.timeline;

    list.innerHTML = items.map(function (item, i) {
      const hasCta = item.ctaLabel && item.ctaHref;
      const isExternal = hasCta && /^https?:\/\//.test(item.ctaHref);
      return (
        '<li class="eod-timeline__item" data-eod-timeline-item data-index="' + i + '">' +
          '<div class="eod-timeline__row">' +
            '<div class="eod-timeline__col eod-timeline__col--meta" data-eod-timeline-col="meta">' +
              '<span class="eod-timeline__year">' + item.year + "</span>" +
              '<h3 class="eod-timeline__title">' + item.title + "</h3>" +
            "</div>" +
            '<div class="eod-timeline__col eod-timeline__col--desc" data-eod-timeline-col="desc">' +
              (item.body ? '<p class="eod-timeline__desc">' + item.body + "</p>" : "") +
              (hasCta ?
                '<div class="eod-timeline__cta">' +
                  '<a href="' + item.ctaHref + '" class="eod-btn eod-btn--secondary"' + (isExternal ? ' target="_blank" rel="noopener noreferrer"' : "") + '>' +
                    '<span class="eod-btn__secondary-viewport">' +
                      '<span class="eod-btn__secondary-track">' +
                        '<span class="eod-btn__arrow-slot eod-btn__arrow-slot--lead" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M24 20L24 6.66667L10.6667 6.66667M24 6.66667L6.66667 24" stroke-width="2" stroke-miterlimit="10"/></svg></span>' +
                        '<span class="eod-btn__label">' + item.ctaLabel + "</span>" +
                        '<span class="eod-btn__arrow-slot eod-btn__arrow-slot--trail" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M24 20L24 6.66667L10.6667 6.66667M24 6.66667L6.66667 24" stroke-width="2" stroke-miterlimit="10"/></svg></span>' +
                      "</span>" +
                    "</span>" +
                  "</a>" +
                "</div>"
              : "") +
            "</div>" +
          "</div>" +
        "</li>"
      );
    }).join("");

    // Appended AFTER the hero portrait already sitting in the figure
    // (see about.html) — not a replace — since that portrait is the
    // shared card's starting image; about.js flips into image[0] and
    // cross-fades through the rest from there.
    if (photo) {
      photo.insertAdjacentHTML("beforeend", items.map(function (item, i) {
        return '<img class="eod-journey__photo-img" data-index="' + i + '" src="' + item.image + '" alt="' + item.alt + '" />';
      }).join(""));
    }
  }

  // Shared by both project render functions below — the exact same
  // markup as the Timeline's own secondary-button CTAs above, just
  // factored out since it's now used in three places instead of one.
  function secondaryButtonInner(label) {
    return (
      '<span class="eod-btn__secondary-viewport">' +
        '<span class="eod-btn__secondary-track">' +
          '<span class="eod-btn__arrow-slot eod-btn__arrow-slot--lead" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M24 20L24 6.66667L10.6667 6.66667M24 6.66667L6.66667 24" stroke-width="2" stroke-miterlimit="10"/></svg></span>' +
          '<span class="eod-btn__label">' + label + "</span>" +
          '<span class="eod-btn__arrow-slot eod-btn__arrow-slot--trail" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M24 20L24 6.66667L10.6667 6.66667M24 6.66667L6.66667 24" stroke-width="2" stroke-miterlimit="10"/></svg></span>' +
        "</span>" +
      "</span>"
    );
  }

  // Projects grid (projects.html, "My work") — each card is its own
  // fixed-frame link: the cover photo fills it, and the title sits
  // just below the frame's bottom edge as a secondary-button-styled
  // caption (Evy: "de tekst is het zelfde als de secondary button").
  // On hover the photo slides up by exactly the caption's own height
  // (--eod-projects-caption-h, see projects.css) while the caption
  // slides up into the gap that opens up beneath it — a push, not an
  // overlay, per Evy's own description of the effect. Pure CSS
  // (:hover), nothing here drives the motion itself.
  function renderProjectsGrid() {
    const grid = document.querySelector(".eod-projects__grid");
    if (!grid) return;
    const items = window.EOD_CONTENT.projects;

    grid.innerHTML = items.map(function (item, i) {
      return (
        '<a href="project.html?slug=' + item.slug + '" class="eod-projects__card" data-eod-reveal data-eod-reveal-delay="' + (i % 4) + '">' +
          '<span class="eod-projects__photo-wrap">' +
            '<img class="eod-projects__photo" src="' + item.cover + '" alt="' + (item.alt || "") + '" />' +
          "</span>" +
          '<span class="eod-projects__caption">' +
            '<span class="eod-btn eod-btn--secondary eod-projects__caption-btn">' + secondaryButtonInner(item.title) + "</span>" +
          "</span>" +
        "</a>"
      );
    }).join("");
  }

  // Project detail (project.html) — one shared template for every
  // case study, picking which project via ?slug= in the URL rather
  // than being a separate HTML file per project (same reasoning as
  // the Timeline/Awards being data-driven instead of hand-duplicated
  // markup: adding project #5 means adding an object above, not a
  // new page). gallery/deliverables/process are each only rendered
  // if the project actually provides them — see Cense above for a
  // project that currently has neither (a placeholder awaiting real
  // content from Evy).
  function renderProjectDetail() {
    const root = document.querySelector("[data-eod-project-detail]");
    if (!root) return;
    const slug = new URLSearchParams(window.location.search).get("slug");
    const items = window.EOD_CONTENT.projects;
    const item = items.find(function (p) { return p.slug === slug; }) || items[0];
    if (!item) return;

    const heroEl = document.querySelector(".eod-project__hero-img");
    if (heroEl) heroEl.src = item.hero || item.cover;

    // Each gallery entry is { type: "full", src: [one] },
    // { type: "pair", src: [two] }, or { type: "text", heading, body }
    // — see the data's own comment for why (the source design flows
    // full/pair/pair/full/…, not a uniform grid). A "pair" just
    // renders its 2 images as siblings inside one row div; CSS
    // (projects.css) handles the 50/50 split. A "text" row is its own
    // left-heading/right-body two-column block, for explaining a
    // specific image inline rather than only up top.
    const gallery = document.querySelector(".eod-project__gallery");
    if (gallery) {
      gallery.innerHTML = (item.gallery || []).map(function (block) {
        if (block.type === "text") {
          return '<div class="eod-project__gallery-row eod-project__gallery-row--text">' +
            '<h2 class="eod-project__gallery-text-heading">' + block.heading + "</h2>" +
            '<p class="eod-project__gallery-text-body">' + block.body + "</p>" +
          "</div>";
        }
        const imgs = block.src.map(function (src) {
          return '<img class="eod-project__gallery-img" src="' + src + '" alt="" />';
        }).join("");
        return '<div class="eod-project__gallery-row eod-project__gallery-row--' + block.type + '">' + imgs + "</div>";
      }).join("");
      gallery.hidden = !item.gallery || !item.gallery.length;
    }

    const titleEl = document.querySelector(".eod-project__title");
    if (titleEl) titleEl.textContent = item.title;
    document.title = "Evy Diepenbroek — " + item.title;

    const descEl = document.querySelector(".eod-project__description");
    if (descEl) descEl.textContent = item.description || "";

    const deliverablesEl = document.querySelector(".eod-project__deliverables");
    if (deliverablesEl) {
      const has = item.deliverables && item.deliverables.length;
      deliverablesEl.hidden = !has;
      if (has) {
        deliverablesEl.innerHTML = (
          '<h2 class="eod-project__caption">What I delivered:</h2>' +
          '<ul class="eod-project__tags">' +
            item.deliverables.map(function (d) { return "<li>" + d + "</li>"; }).join("") +
          "</ul>"
        );
      }
    }

    // Any vertical/portrait process video gets its own full-bleed,
    // full-black, full-screen section (Evy: "een full screen section
    // die zwart is") — the old text+caption "process" block that
    // used to sit alongside these has since moved into the gallery
    // itself as a plain "text" block (see the gallery map above; Evy:
    // "Delete this and add here a text explain section"), so this is
    // now the only thing item.process still holds.
    const verticalVideosEl = document.querySelector("[data-eod-process-vertical-videos]");
    if (verticalVideosEl) {
      const verticalVideos = (item.process && item.process.videos || []).filter(function (v) { return v && v.vertical; });
      verticalVideosEl.innerHTML = verticalVideos.map(function (v) {
        return (
          '<section class="eod-project__vertical-video-section">' +
            '<video class="eod-project__vertical-video" src="' + v.src + '" controls playsinline></video>' +
          "</section>"
        );
      }).join("");
    }
    // "Look at other projects" itself (the card carousel) is built by
    // project-slider.js, not here — it needs the DOM fully settled
    // (clones, a drag proxy) before the slider math can run, which
    // doesn't fit this function's plain render-and-done shape.
  }

  renderAwards();
  renderCta();
  renderTimeline();
  renderProjectsGrid();
  renderProjectDetail();
})();
