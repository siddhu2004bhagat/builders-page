/* ==========================================================
   EDIT THIS FILE to change site content.
   - photo: a real photo in /assets/team/ (portrait 3:4). null = monogram card.
   - look: colours for the illustrated character in the chapter animations.
   - videos: pulled from the YouTube channel feed; refresh with
     https://www.youtube.com/feeds/videos.xml?channel_id=UCEUt8X6MfdD8DuT5P2_fYPA
   ========================================================== */
window.BUILDERS = {
  brand: { line: "Just ship it.", about: "Building cool stuff @ Masters' Union" },

  socials: {
    youtube: "https://www.youtube.com/@buildersmu",
    instagram: "https://www.instagram.com/builders.mu/",
    linkedin: "https://linkedin.com/company/builders-mu",
    email: "hello@builders.mu.com",
  },

  // Raja's quarter goal. Dates are local time.
  mission: {
    target: 60000000,
    label: "Q4 2026",
    start: "2026-10-01T00:00:00+05:30",
    end: "2026-12-31T23:59:59+05:30",
    directives: {
      ratnam: "3 hooks by Friday. Every one under 5 seconds.",
      sudhanshu: "Firmware v2 tonight. No excuses.",
      aryan: "Arm v4 printed and mounted by noon.",
      prateek: "Rough cut Wednesday. Retention > 60%.",
      virendra: "Thumbnail A/B. Two options, best CTR wins.",
      sahil: "40 servos. Today. Find them.",
    },
  },

  team: [
    { id: "raja", name: "Er. Raja Singh", short: "Raja", role: "Team Lead & Manager", line: "Runs the team. Picks the idea, sets the deadline, keeps all seven of us shipping.", photo: "assets/team/raja.jpg", accent: "#ff7a1a",
      look: { skin: "#C98F68", hair: "#141414", shirt: "#1a1a1e", beard: true, glasses: true, style: "side" } },
    { id: "ratnam", name: "Ratnam Kalra", short: "Ratnam", role: "Script Writer", line: "Finds the story in a pile of wires. Writes the hook that stops your thumb.", photo: "assets/team/ratnam.jpg", accent: "#f3ede2",
      look: { skin: "#C08562", hair: "#161210", shirt: "#1f5a45", beard: true, glasses: true, style: "curly" } },
    { id: "sudhanshu", name: "Sudhanshu Kumar Jaiswal", short: "Sudhanshu", role: "Engineer", line: "Electronics, firmware and 3 AM debugging sessions.", photo: null, accent: "#4fd1ff",
      look: { skin: "#C68B59", hair: "#111", shirt: "#4fd1ff", beard: false, glasses: true, style: "spiky" } },
    { id: "aryan", name: "Aryan Sagar", short: "Aryan", role: "Engineer", line: "Mechanics and fabrication. Makes it actually move.", photo: null, accent: "#5cf2a2",
      look: { skin: "#BF8456", hair: "#1c1410", shirt: "#5cf2a2", beard: true, glasses: false, style: "short" } },
    { id: "prateek", name: "Prateek", short: "Prateek", role: "Video Editor", line: "Story cut, pacing and sound. Turns 40 hours into 40 seconds.", photo: null, accent: "#a78bfa",
      look: { skin: "#C98F60", hair: "#0f0f0f", shirt: "#a78bfa", beard: false, glasses: false, style: "cap", headphones: true } },
    { id: "virendra", name: "Virendra", short: "Virendra", role: "Video Editor", line: "Colour, motion graphics and the thumbnail you clicked.", photo: null, accent: "#ff5c8a",
      look: { skin: "#D9A273", hair: "#241612", shirt: "#ff5c8a", beard: false, glasses: false, style: "short", headphones: true } },
    { id: "sahil", name: "Sahil", short: "Sahil", role: "Producer", line: "Calls 20 vendors before lunch. Finds the part nobody stocks.", photo: null, accent: "#ffd23f",
      look: { skin: "#B5764A", hair: "#121212", shirt: "#ffd23f", beard: true, glasses: false, style: "short" } },
  ],

  // Real channel numbers (Oct 2026). Update as you grow.
  stats: [
    { title: "YouTube", sub: "Subscribers", num: 39.8, dec: 1, suffix: "K", color: "#ff3b3b", url: "youtube" },
    { title: "Instagram", sub: "Followers", num: 53, suffix: "K", color: "#ff5c8a", url: "instagram" },
    { title: "Videos", sub: "Uploaded on YouTube", num: 68, suffix: "", color: "#ff7a1a", url: "youtube" },
    { title: "Posts", sub: "On Instagram", num: 99, suffix: "", color: "#a78bfa", url: "instagram" },
  ],

  // Latest Shorts from the channel feed (views as of Oct 2026)
  videos: [
    { id: "kEENsn8oQ74", title: "CUTEST 3D PRINT EVER!!!", date: "2026-09-29", views: 8503 },
    { id: "HWEwOQJFFdE", title: "Avg diet coke paglu be like....", date: "2026-09-28", views: 8161 },
    { id: "dN7OeuvwzQ8", title: "Nothing can beat an Engineer!!", date: "2026-09-25", views: 1807 },
    { id: "SZKjkGObIF4", title: "This is PEAK LAZY ENGINEERING 😭🤣", date: "2026-09-24", views: 30707 },
    { id: "3G27HWanUxo", title: "The most engineered knife EVER!!", date: "2026-09-23", views: 288123 },
    { id: "-rYPV7E_0_8", title: "This Dustbin shoots INVISIBLE AIR BULLETS!", date: "2026-09-21", views: 8436 },
    { id: "Eif15J0e9T4", title: "Day 4 of fixing my life with a 2 kodi ka tech!!!", date: "2026-09-20", views: 10909 },
    { id: "qNRr1cg-tjs", title: "Day 3 of fixing my life with a 2 kodi ka tech!!", date: "2026-09-19", views: 25981 },
    { id: "HOt_iKfyoFQ", title: "Day 2 of fixing my life with a 2 kodi ka tech!!!", date: "2026-09-18", views: 6396 },
    { id: "JoTC1WIKQxg", title: "Day 1 of fixing my life with a 2 kodi ka tech!!", date: "2026-09-17", views: 160613 },
    { id: "gvQlI_AUGwk", title: "We made Shinchan do WHAT?! 💀", date: "2026-09-15", views: 16417 },
    { id: "R13O5KwB-t8", title: "When your glasses need glasses", date: "2026-09-09", views: 13731 },
    { id: "QeAZCQPaZlA", title: "What if Pokémon were REAL?!", date: "2026-09-09", views: 8311 },
    { id: "bEwVPmMExCA", title: "Normal backpack ❌", date: "2026-09-08", views: 28925 },
    { id: "eKvGJBWouW0", title: "We made an ETHANOL EXTRACTOR!", date: "2026-09-07", views: 4345 },
  ],

  // Placeholder posts — replace with real ones (or remove the section)
  blog: [
    { tag: "Behind the build", title: "The most engineered knife: what went into 288K views", excerpt: "The build, the three failed versions, and why the hook landed.", date: "Oct 2026", read: "6 min", url: "#" },
    { tag: "Story", title: "From whiteboard scribble to Short: our script process", excerpt: "Ratnam breaks down the hook-struggle-payoff structure behind every Builders.mu video.", date: "Sep 2026", read: "4 min", url: "#" },
    { tag: "Sourcing", title: "The Sahil guide to finding any part in 24 hours", excerpt: "Which markets, which vendors, and what to say on the phone so they actually call back.", date: "Aug 2026", read: "5 min", url: "#" },
  ],
};
