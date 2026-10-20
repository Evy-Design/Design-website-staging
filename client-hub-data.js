/* Client hub — sample data for the clickable prototype.
   Everything here is fictional. Once the real backend is connected,
   this file is replaced by data loaded for the logged-in client;
   the shape below is the shape the hub screens expect.

   Feedback rounds: Evy picks a method per round.
     method "online"  -> the client gives feedback in the hub before `due`.
     method "meeting" -> feedback happens in a call/meeting; Evy writes
                         the notes and the client confirms them.
   project.feedbackRounds = how many rounds are included in the project.

   Final files stay online for `filesStoredMonths` (default 1) after the
   project's `completed` date (YYYY-MM-DD). After that they are removed;
   the client can ask Evy for them again. */
window.EOD_HUB_DATA = {
  client: {
    name: "Sanne",
    company: "Nord Studio",
    email: "sanne@nordstudio.example"
  },

  projects: [
    {
      id: "brand-identity",
      number: "01",
      title: "Brand identity",
      type: "Visual identity",
      summary: "A visual identity for Nord Studio's launch: logo, colours, typography and the first set of applications.",
      status: "in-progress",
      started: "2 Sep 2026",
      nextStep: "First design presentation",
      nextDate: "Meeting on Wed 28 Oct, 14:00",
      update: {
        date: "17 Oct 2026",
        text: "The first concepts are coming together. I'm preparing three directions to present, each with a short explanation of the thinking behind it."
      },
      stages: [
        { title: "Discovery & briefing", state: "completed", note: "We aligned on your goals, audience and direction.", date: "9 Sep" },
        { title: "Creative exploration", state: "completed", note: "Initial concepts were explored and narrowed down.", date: "3 Oct" },
        { title: "Design presentation", state: "current", note: "The first concepts are being prepared for you.", date: "Expected late October" },
        { title: "Feedback & refinement", state: "upcoming", note: "We'll collect your feedback and refine the chosen direction." },
        { title: "Final delivery", state: "upcoming", note: "Your approved files and deliverables will be available here." }
      ],
      files: [
        { name: "Project brief", kind: "PDF", size: "1.2 MB", stage: "Discovery & briefing", approved: true },
        { name: "Moodboard", kind: "PDF", size: "8.4 MB", stage: "Creative exploration", approved: false }
      ],
      feedbackRounds: 3,
      feedback: [
        {
          id: "brand-r1",
          round: "01",
          title: "First design presentation",
          method: "meeting",
          state: "scheduled",
          question: "I'll present three directions in a call and we'll talk them through together. You don't need to prepare anything, just bring your first impressions.",
          meeting: {
            start: "2026-10-28T14:00:00",
            end: "2026-10-28T15:00:00",
            where: "Video call · Google Meet",
            link: "https://meet.google.com/"
          },
          // Filled in by Evy after the meeting (used by the prototype's "skip ahead").
          draftNotes: {
            summary: "We went through the three directions together. Direction 2, the precise wordmark with the open n, felt most like Nord Studio.",
            agreed: [
              "Continue with direction 2.",
              "Try the wordmark slightly heavier, so it holds up small on the label.",
              "Keep Fjord blue as the accent colour; drop the green."
            ],
            next: "I'll refine direction 2 and share the updated version here."
          },
          concepts: []
        }
      ]
    },
    {
      id: "campaign-design",
      number: "02",
      title: "Campaign design",
      type: "Print & digital",
      summary: "A launch campaign across posters, social media and a printed invitation.",
      status: "feedback",
      started: "22 Sep 2026",
      nextStep: "Review the latest designs",
      nextDate: "Feedback by 24 Oct",
      update: {
        date: "18 Oct 2026",
        text: "The campaign designs are ready for you. Take your time to look at them. Your feedback decides which direction we develop further."
      },
      stages: [
        { title: "Briefing", state: "completed", note: "We defined the message, channels and timing.", date: "25 Sep" },
        { title: "Concepts", state: "completed", note: "Two campaign directions were developed.", date: "14 Oct" },
        { title: "Your feedback", state: "waiting", note: "I'm waiting for your thoughts on the two directions.", date: "By 24 Oct" },
        { title: "Refinement", state: "upcoming", note: "I'll develop the chosen direction across all formats." },
        { title: "Final files", state: "upcoming", note: "Print-ready and digital files, ready to use." }
      ],
      files: [
        { name: "Campaign brief", kind: "PDF", size: "0.9 MB", stage: "Briefing", approved: true },
        { name: "Campaign concepts — round 01", kind: "PDF", size: "14.2 MB", stage: "Concepts", approved: false }
      ],
      feedbackRounds: 2,
      feedback: [
        {
          id: "campaign-r1",
          round: "01",
          title: "Campaign directions",
          action: "Review your campaign designs",
          method: "online",
          state: "awaiting",
          due: "2026-10-24",
          question: "Please review both directions and let me know which one feels closest to the launch you have in mind.",
          concepts: [
            { label: "Direction A", name: "Quiet confidence", tone: "light" },
            { label: "Direction B", name: "Bold invitation", tone: "dark" }
          ]
        }
      ]
    },
    {
      id: "packaging",
      number: "03",
      title: "Packaging",
      type: "Packaging design",
      summary: "Packaging for the first product line, in three sizes.",
      status: "completed",
      started: "4 Aug 2026",
      completed: "2026-10-02",
      filesStoredMonths: 1,
      nextStep: "Delivered",
      update: {
        date: "2 Oct 2026",
        text: "Everything has been delivered. The print files went to the printer and your final files are below."
      },
      stages: [
        { title: "Briefing", state: "completed", date: "11 Aug" },
        { title: "Concepts", state: "completed", date: "25 Aug" },
        { title: "Feedback & refinement", state: "completed", date: "16 Sep" },
        { title: "Print preparation", state: "completed", date: "26 Sep" },
        { title: "Final delivery", state: "completed", date: "2 Oct" }
      ],
      files: [
        { name: "Packaging — print files", kind: "ZIP", size: "212 MB", stage: "Final delivery", approved: true },
        { name: "Packaging mockups", kind: "ZIP", size: "48 MB", stage: "Final delivery", approved: true }
      ],
      feedbackRounds: 2,
      feedback: [
        {
          id: "packaging-r1",
          round: "01",
          title: "Packaging concepts",
          method: "online",
          state: "completed",
          choice: "Concept B: I'd like some changes",
          comment: "Love the paper texture. Could the product name be larger on the small box?",
          date: "28 Aug 2026",
          concepts: []
        },
        {
          id: "packaging-r2",
          round: "02",
          title: "Refined packaging",
          method: "meeting",
          state: "approved",
          question: "We reviewed the refined packaging together at the studio.",
          meeting: { start: "2026-09-16T10:00:00", end: "2026-09-16T11:00:00", where: "Nord Studio, Utrecht" },
          notes: {
            summary: "The refined packaging works across all three sizes. Only small text corrections were left.",
            agreed: [
              "Approve the design for all three sizes.",
              "Correct the Dutch ingredients text on the large box.",
              "Print on uncoated stock, as tested."
            ],
            next: "I'll prepare the print files and send them to the printer.",
            written: "16 Sep 2026",
            confirmed: "17 Sep 2026"
          },
          concepts: []
        }
      ]
    }
  ],

  designHub: {
    tagline: "Calm, considered, made to last.",
    story: "Nord Studio makes furniture for slow living. The identity is built on restraint: a precise wordmark, a quiet palette and generous space.",
    logos: [
      { name: "Primary logo", variant: "dark" },
      { name: "Primary logo — reversed", variant: "light" },
      { name: "Icon", variant: "icon" }
    ],
    colors: [
      { name: "Nord Black", hex: "#141414", rgb: "20 20 20", ink: "light" },
      { name: "Stone", hex: "#E7E3DC", rgb: "231 227 220", ink: "dark" },
      { name: "Fjord", hex: "#3E5C76", rgb: "62 92 118", ink: "light" },
      { name: "Paper", hex: "#FAFAF7", rgb: "250 250 247", ink: "dark" }
    ],
    typography: [
      { role: "Headings", family: "PP Mori", weight: "Regular 400" },
      { role: "Body", family: "PP Mori", weight: "Regular 400 / Semibold 600" }
    ],
    files: [
      { name: "Logo package", kind: "ZIP", size: "18 MB", formats: "SVG · PNG · PDF" },
      { name: "Brand guidelines", kind: "PDF", size: "6.1 MB", formats: "PDF" },
      { name: "Colour swatches", kind: "ASE", size: "12 KB", formats: "ASE · CSS" }
    ],
    share: {
      enabled: true,
      link: "evydiepenbroek.nl/brand/nord-studio-7f3k",
      sections: { overview: true, logos: true, colors: true, typography: true, files: false }
    }
  }
};
