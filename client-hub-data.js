/* Client hub — sample data for the clickable prototype.
   Everything here is fictional. Once the real backend is connected,
   this file is replaced by data loaded for the logged-in client;
   the shape below is the shape the hub screens expect. */
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
      nextDate: "To be confirmed",
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
      feedback: []
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
      feedback: [
        {
          id: "campaign-r1",
          round: "01",
          title: "Campaign directions",
          state: "awaiting",
          due: "24 Oct 2026",
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
      started: "3 Mar 2026",
      completed: "12 Jun 2026",
      nextStep: "Delivered",
      update: {
        date: "12 Jun 2026",
        text: "Everything has been delivered. The print files went to the printer and your final files are below."
      },
      stages: [
        { title: "Briefing", state: "completed", date: "10 Mar" },
        { title: "Concepts", state: "completed", date: "4 Apr" },
        { title: "Feedback & refinement", state: "completed", date: "16 May" },
        { title: "Print preparation", state: "completed", date: "2 Jun" },
        { title: "Final delivery", state: "completed", date: "12 Jun" }
      ],
      files: [
        { name: "Packaging — print files", kind: "ZIP", size: "212 MB", stage: "Final delivery", approved: true },
        { name: "Packaging mockups", kind: "ZIP", size: "48 MB", stage: "Final delivery", approved: true }
      ],
      feedback: [
        { id: "packaging-r1", round: "01", title: "Packaging concepts", state: "approved", choice: "I'm happy with this direction", date: "16 May 2026" }
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
