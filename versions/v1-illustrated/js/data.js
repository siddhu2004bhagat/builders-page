/* ==========================================================
   EDIT THIS FILE to change site content.
   - photo: put a real photo in /assets/team/ and set e.g. "assets/team/raja.jpg".
            Leave null to use the illustrated avatar.
   - videos/insta/blog: swap the placeholder links + titles for real ones.
   ========================================================== */
window.BUILDERS = {
  socials: {
    youtube: "https://www.youtube.com/@buildersmu",
    instagram: "https://www.instagram.com/builders.mu/",
    linkedin: "https://linkedin.com/company/builders-mu",
    email: "hello@builders.mu.com",
  },

  team: [
    { id: "raja", name: "Er. Raja Singh", role: "Team Lead", line: "Picks the crazy idea. Draws the plan. Keeps everyone shipping.",
      photo: null, look: { skin: "#B97A4E", hair: "#141414", shirt: "#ff7a1a", beard: true, glasses: false, style: "side" } },
    { id: "ratnam", name: "Ratnam Kalra", role: "Script Writer", line: "Turns a pile of wires into a story you can't skip.",
      photo: null, look: { skin: "#D29A6C", hair: "#2a1a10", shirt: "#f3ede2", beard: false, glasses: true, style: "curly" } },
    { id: "sudhanshu", name: "Sudhanshu Kumar Jaiswal", role: "Engineer", line: "Firmware, circuits and 3 AM debugging sessions.",
      photo: null, look: { skin: "#C68B59", hair: "#111", shirt: "#4fd1ff", beard: false, glasses: true, style: "spiky" } },
    { id: "aryan", name: "Aryan Sagar", role: "Engineer", line: "Mechanics, fabrication, and making it actually move.",
      photo: null, look: { skin: "#BF8456", hair: "#1c1410", shirt: "#5cf2a2", beard: true, glasses: false, style: "short" } },
    { id: "prateek", name: "Prateek", role: "Video Editor", line: "Cuts, pacing, sound — makes 40 hours feel like 40 seconds.",
      photo: null, look: { skin: "#C98F60", hair: "#0f0f0f", shirt: "#a78bfa", beard: false, glasses: false, style: "cap", headphones: true } },
    { id: "virendra", name: "Virendra", role: "Video Editor", line: "Colour, motion graphics and the thumbnail you clicked.",
      photo: null, look: { skin: "#D9A273", hair: "#241612", shirt: "#ff5c8a", beard: false, glasses: false, style: "long", headphones: true } },
    { id: "sahil", name: "Sahil", role: "Producer", line: "Calls 20 vendors before lunch. Finds the part nobody stocks.",
      photo: null, look: { skin: "#B5764A", hair: "#121212", shirt: "#ffd23f", beard: true, glasses: false, style: "short" } },
  ],

  // Swap `url` for real YouTube links and `thumb` for real thumbnail URLs (or keep the generated art).
  videos: [
    { title: "We Built a Robot That Makes Chai", tag: "Latest upload", views: "1.2M views", date: "3 days ago", url: "#", thumb: null, bg: "linear-gradient(135deg,#ff7a1a,#7a2b00)", ttl: "Robot<br>Chaiwala" },
    { title: "72 Hours to Build a Flying Car (Kind Of)", tag: "Build", views: "860K views", date: "2 weeks ago", url: "#", thumb: null, bg: "linear-gradient(135deg,#4fd1ff,#06324a)", ttl: "Flying<br>Car?!" },
    { title: "Can a ₹500 Drone Beat a ₹50,000 One?", tag: "Challenge", views: "2.4M views", date: "1 month ago", url: "#", thumb: null, bg: "linear-gradient(135deg,#a78bfa,#2b1460)", ttl: "₹500 vs<br>₹50K" },
  ],

  insta: [
    { emoji: "🤖", likes: "48.2K", bg: "#2b1a0e", url: "#" },
    { emoji: "⚡", likes: "31.0K", bg: "#0e2430", url: "#" },
    { emoji: "🔧", likes: "22.7K", bg: "#1f1230", url: "#" },
    { emoji: "🎬", likes: "19.4K", bg: "#301222", url: "#" },
    { emoji: "🛵", likes: "56.1K", bg: "#2e2a0c", url: "#" },
    { emoji: "☕", likes: "27.9K", bg: "#10291c", url: "#" },
  ],

  blog: [
    { tag: "Behind the build", title: "How we wired 40 servos without frying the board (twice)", excerpt: "Power budgeting, cheap buck converters, and the one capacitor that saved the shoot.", date: "Oct 2026", read: "6 min", url: "#" },
    { tag: "Story", title: "From whiteboard scribble to 1M views: our script process", excerpt: "Ratnam breaks down the hook-build-payoff structure behind every Builders.mu video.", date: "Sep 2026", read: "4 min", url: "#" },
    { tag: "Sourcing", title: "The Sahil guide to finding any part in 24 hours", excerpt: "Which markets, which vendors, and what to say on the phone so they actually call back.", date: "Aug 2026", read: "5 min", url: "#" },
  ],

  community: [
    { title: "YouTube", sub: "Subscribers", num: 250, suffix: "K+", color: "#ff3b3b", url: "youtube" },
    { title: "Instagram", sub: "Followers", num: 480, suffix: "K+", color: "#ff5c8a", url: "instagram" },
    { title: "Discord", sub: "Builders in the server", num: 12, suffix: "K+", color: "#7c8cff", url: "#" },
    { title: "Projects", sub: "Things built so far", num: 60, suffix: "+", color: "#ff7a1a", url: "#" },
  ],
};
