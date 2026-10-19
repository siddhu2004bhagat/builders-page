/* ==========================================================
   EDIT THIS FILE to change site content.
   - photo: put a real photo in /assets/team/ and set e.g. "assets/team/raja.jpg".
            Portrait 3:4, dark background, works best. null = cinematic monogram card.
   - videos/insta/blog: swap the placeholder links + titles for real ones.
   ========================================================== */
window.BUILDERS = {
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
    // Orders Raja is pushing to each person (shown on the command network)
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
    { id: "raja", name: "Er. Raja Singh", short: "Raja", role: "Team Lead & Manager", line: "Owns the 60M mission. Picks the idea, sets the deadline, drives all seven of us.", photo: null, accent: "#ff7a1a" },
    { id: "ratnam", name: "Ratnam Kalra", short: "Ratnam", role: "Script Writer", line: "Finds the story in a pile of wires. Writes the hook that stops your thumb.", photo: null, accent: "#f3ede2" },
    { id: "sudhanshu", name: "Sudhanshu Kumar Jaiswal", short: "Sudhanshu", role: "Engineer", line: "Electronics, firmware and 3 AM debugging sessions.", photo: null, accent: "#4fd1ff" },
    { id: "aryan", name: "Aryan Sagar", short: "Aryan", role: "Engineer", line: "Mechanics and fabrication. Makes it actually move.", photo: null, accent: "#5cf2a2" },
    { id: "prateek", name: "Prateek", short: "Prateek", role: "Video Editor", line: "Story cut, pacing and sound. Turns 40 hours into 40 seconds.", photo: null, accent: "#a78bfa" },
    { id: "virendra", name: "Virendra", short: "Virendra", role: "Video Editor", line: "Colour, motion graphics and the thumbnail you clicked.", photo: null, accent: "#ff5c8a" },
    { id: "sahil", name: "Sahil", short: "Sahil", role: "Producer", line: "Calls 20 vendors before lunch. Finds the part nobody stocks.", photo: null, accent: "#ffd23f" },
  ],

  // Swap `url` for real YouTube links and `thumb` for real thumbnails, e.g.
  // "https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg"
  videos: [
    { title: "We Built a Robot That Makes Chai", views: "1.2M views", date: "3 days ago", url: "#", thumb: "assets/img/robot-arm.jpg", ttl: "Robot<br>Chaiwala" },
    { title: "72 Hours to Build a Flying Car (Kind Of)", views: "860K views", date: "2 weeks ago", url: "#", thumb: "assets/img/soldering-magnifier.jpg", ttl: "72 Hour<br>Build" },
    { title: "Can a ₹500 Drone Beat a ₹50,000 One?", views: "2.4M views", date: "1 month ago", url: "#", thumb: "assets/img/chip-macro.jpg", ttl: "₹500 vs<br>₹50K" },
  ],

  insta: [
    { img: "assets/img/solder-bench.jpg", likes: "48.2K", url: "#" },
    { img: "assets/img/market-shop.jpg", likes: "31.0K", url: "#" },
    { img: "assets/img/robot-arm.jpg", likes: "22.7K", url: "#" },
    { img: "assets/img/edit-laptop.jpg", likes: "19.4K", url: "#" },
    { img: "assets/img/market-aerial.jpg", likes: "56.1K", url: "#" },
    { img: "assets/img/chip-macro.jpg", likes: "27.9K", url: "#" },
  ],

  blog: [
    { tag: "Behind the build", title: "How we wired 40 servos without frying the board (twice)", excerpt: "Power budgeting, cheap buck converters, and the one capacitor that saved the shoot.", date: "Oct 2026", read: "6 min", url: "#" },
    { tag: "Story", title: "From whiteboard scribble to 1M views: our script process", excerpt: "Ratnam breaks down the hook-struggle-payoff structure behind every Builders.mu video.", date: "Sep 2026", read: "4 min", url: "#" },
    { tag: "Sourcing", title: "The Sahil guide to finding any part in 24 hours", excerpt: "Which markets, which vendors, and what to say on the phone so they actually call back.", date: "Aug 2026", read: "5 min", url: "#" },
  ],

  community: [
    { title: "YouTube", sub: "Subscribers", num: 250, suffix: "K+", color: "#ff3b3b", url: "youtube" },
    { title: "Instagram", sub: "Followers", num: 480, suffix: "K+", color: "#ff5c8a", url: "instagram" },
    { title: "Discord", sub: "Builders in the server", num: 12, suffix: "K+", color: "#7c8cff", url: "#" },
    { title: "Projects", sub: "Things built so far", num: 60, suffix: "+", color: "#ff7a1a", url: "#" },
  ],
};
