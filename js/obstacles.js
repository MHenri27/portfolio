// obstacles on the road
// off: distance from the road center
// side: alternates between left and right
// flat: lies on the road and follows its angle
// dodge: [sideways amount, reach] car steers away
// lift: [height, reach] car hops (or dips when negative)
// skid: [angle, reach] car slides
// hit: car knocks it over
// to add one, add an entry here and put its name in sequence
const OBSTACLES = {
  cone: {
    off: 0,
    hit: true,
    draw: () =>
      `<g class="cone"><rect x="-6" y="-6" width="12" height="12" fill="#241b1b"/><polygon fill="#d94657" points="${octagon(0, 0, 5)}"/><polygon fill="#faf6f0" points="${octagon(0, 0, 2.4)}"/></g>`,
  },
  rock: {
    off: 8,
    side: true,
    dodge: [12, 48],
    draw: () =>
      `<polygon fill="#7b6b6b" points="-9,-3 -5,-8 3,-9 9,-4 8,4 2,8 -6,7"/><polygon fill="#a08f8f" points="-5,-8 3,-9 0,0"/><polygon fill="#5f5151" points="9,-4 8,4 0,0"/>`,
  },
  bump: {
    off: 0,
    flat: true,
    lift: [9, 26],
    draw: () =>
      `<rect x="-17" y="-4" width="34" height="8" fill="#241b1b"/><g fill="#faf6f0"><rect x="-14" y="-4" width="4.5" height="8"/><rect x="-6" y="-4" width="4.5" height="8"/><rect x="2" y="-4" width="4.5" height="8"/><rect x="10" y="-4" width="4.5" height="8"/></g>`,
  },
  pothole: {
    off: 6,
    side: true,
    lift: [-2, 16],
    draw: () =>
      `<ellipse rx="9" ry="6" fill="#5b4636"/><ellipse rx="6" ry="3.5" fill="#3f3024"/>`,
  },
  oil: {
    off: 5,
    side: true,
    skid: [26, 42],
    draw: () =>
      `<polygon fill="#2b2320" points="-11,-2 -7,-8 2,-9 10,-5 11,3 5,8 -5,7"/><polygon fill="#5b4f52" points="-7,-8 2,-9 -1,-2"/><polygon fill="#faf6f0" opacity="0.55" points="-4,-6 0,-7 -1,-5"/>`,
  },
  puddle: {
    off: 4,
    side: true,
    lift: [-1.5, 18],
    skid: [9, 26],
    draw: () =>
      `<polygon fill="#6c9db2" points="-10,-1 -6,-7 3,-7 10,-2 9,5 0,8 -8,6"/><polygon fill="#8fb8c8" points="-6,-7 3,-7 0,0"/><polygon fill="#faf6f0" opacity="0.6" points="-3,-5 1,-5.5 0,-3.5"/>`,
  },
  log: {
    off: 8,
    side: true,
    dodge: [14, 54],
    draw: () =>
      `<g transform="rotate(-14)"><rect x="-13" y="-3.5" width="26" height="7" fill="#7a5a3c"/><rect x="-13" y="-3.5" width="26" height="2.6" fill="#96714d"/><polygon fill="#b98f66" points="${octagon(-13, 0, 3.6)}"/><polygon fill="#96714d" points="${octagon(-13, 0, 1.8)}"/><polygon fill="#b98f66" points="${octagon(13, 0, 3.6)}"/><polygon fill="#96714d" points="${octagon(13, 0, 1.8)}"/></g>`,
  },
  truck: {
    off: 12,
    side: true,
    dodge: [12, 62],
    draw: () =>
      `<polygon fill="#241b1b" opacity="0.18" points="-8,-16 12,-16 12,20 -8,20"/><rect x="-10" y="-18" width="20" height="26" fill="#faf6f0"/><rect x="-10" y="-18" width="10" height="26" fill="#fff" opacity="0.5"/><rect x="0" y="-18" width="10" height="26" fill="#000" opacity="0.06"/><rect x="-10" y="-8" width="20" height="4" fill="#d94657"/><polygon fill="#1f4d67" points="-10,8 10,8 9,19 -9,19"/><polygon fill="#dbe8ee" points="-8,10 8,10 7,14 -7,14"/><polygon fill="#faf6f0" points="-8,18 -4,18 -4,19 -7,19"/>`,
  },
  works: {
    off: 10,
    side: true,
    dodge: [14, 50],
    draw: () =>
      `<rect x="-9" y="3" width="2.5" height="5" fill="#241b1b"/><rect x="6.5" y="3" width="2.5" height="5" fill="#241b1b"/><rect x="-11" y="-3" width="22" height="6" fill="#faf6f0"/><rect x="-11" y="-3" width="4" height="6" fill="#d94657"/><rect x="-3" y="-3" width="4" height="6" fill="#d94657"/><rect x="5" y="-3" width="4" height="6" fill="#d94657"/>`,
  },
  manhole: {
    off: 0,
    lift: [2.5, 14],
    draw: () =>
      `<polygon fill="#4a3b34" points="${octagon(0, 0, 6.5)}"/><polygon fill="#6b5b53" points="${octagon(0, 0, 5)}"/><rect x="-4" y="-0.6" width="8" height="1.2" fill="#8e7a74"/><rect x="-0.6" y="-4" width="1.2" height="8" fill="#8e7a74"/>`,
  },
  banana: {
    off: 4,
    side: true,
    skid: [34, 34],
    draw: () =>
      `<polygon fill="#e2a63b" points="-8,2 -5,-3 1,-6 7,-5 4,-2 0,0 -3,4"/><polygon fill="#c48a25" points="-5,-3 1,-6 0,-2"/><polygon fill="#3f3024" points="7,-5 8.5,-5.5 6.5,-3.5"/>`,
  },
  hay: {
    off: 9,
    side: true,
    dodge: [13, 50],
    draw: () =>
      `<g transform="rotate(-8)"><rect x="-10" y="-7" width="20" height="14" fill="#d9b45a"/><rect x="-10" y="-7" width="20" height="5" fill="#ecc978"/><rect x="-10" y="3" width="20" height="4" fill="#b8923c"/><rect x="-4" y="-7" width="1.6" height="14" fill="#8a6a2e"/><rect x="3" y="-7" width="1.6" height="14" fill="#8a6a2e"/></g>`,
  },
  sheep: {
    off: 8,
    side: true,
    dodge: [12, 44],
    draw: () =>
      `<polygon fill="#e9ded4" points="${octagon(1, 1, 6.5)}"/><polygon fill="#faf6f0" points="${octagon(0, 0, 6.5)}"/><polygon fill="#faf6f0" points="${octagon(-4, -3, 3.4)}"/><polygon fill="#faf6f0" points="${octagon(4, -3, 3.4)}"/><polygon fill="#3f3024" points="${octagon(0, 7.5, 2.9)}"/>`,
  },
  crate: {
    off: 8,
    side: true,
    dodge: [12, 44],
    draw: () =>
      `<g transform="rotate(16)"><rect x="-7" y="-7" width="14" height="14" fill="#a37a4a"/><rect x="-7" y="-7" width="14" height="3" fill="#c39a63"/><line x1="-6" y1="-6" x2="6" y2="6" stroke="#6b4f3a" stroke-width="1.6"/><line x1="6" y1="-6" x2="-6" y2="6" stroke="#6b4f3a" stroke-width="1.6"/></g>`,
  },
  tire: {
    off: 7,
    side: true,
    dodge: [11, 40],
    draw: () =>
      `<polygon fill="#241b1b" points="${octagon(0, 0, 7.5)}"/><polygon fill="#d4ab7f" points="${octagon(0, 0, 3.4)}"/><polygon fill="#5b4f52" points="${octagon(0, 0, 6)}" opacity="0.35"/>`,
  },
  gravel: {
    off: 0,
    skid: [13, 42],
    draw: () =>
      [
        [-12, -4, 2],
        [-6, 3, 1.6],
        [0, -5, 2.2],
        [6, 2, 1.7],
        [12, -3, 2],
        [-2, 6, 1.5],
        [9, 7, 1.4],
        [-9, 8, 1.5],
        [3, -1, 1.3],
      ]
        .map(
          ([x, y, r], i) =>
            `<polygon fill="${i % 2 ? "#8e7a74" : "#6f6060"}" points="${octagon(x, y, r)}"/>`,
        )
        .join(""),
  },
  crack: {
    off: 3,
    flat: true,
    lift: [1.5, 12],
    draw: () =>
      `<polyline points="-14,-3 -7,1 -3,-2 4,3 10,0 15,4" fill="none" stroke="#5b4636" stroke-width="1.7" stroke-linejoin="round"/><polyline points="-3,-2 -1,-7" fill="none" stroke="#5b4636" stroke-width="1.2"/><polyline points="4,3 6,8" fill="none" stroke="#5b4636" stroke-width="1.2"/>`,
  },
  cart: {
    off: 9,
    side: true,
    dodge: [13, 46],
    draw: () =>
      `<g transform="rotate(24)"><rect x="-7" y="-2" width="14" height="14" fill="#b8c2c7"/><g stroke="#5d6a70" stroke-width="1"><line x1="-7" y1="3" x2="7" y2="3"/><line x1="-7" y1="7" x2="7" y2="7"/><line x1="-2.5" y1="-2" x2="-2.5" y2="12"/><line x1="2.5" y1="-2" x2="2.5" y2="12"/></g><rect x="-8" y="-6" width="16" height="2.4" fill="#241b1b"/><rect x="-8" y="-6" width="2.4" height="8" fill="#241b1b"/><rect x="5.6" y="-6" width="2.4" height="8" fill="#241b1b"/><g fill="#241b1b"><rect x="-9" y="10" width="3" height="3"/><rect x="6" y="10" width="3" height="3"/></g></g>`,
  },
  stalled: {
    off: 12,
    side: true,
    dodge: [12, 62],
    draw: () =>
      `<polygon fill="#d94657" points="0,-33 -5,-25 5,-25"/><polygon fill="#faf6f0" points="0,-30 -2.4,-26 2.4,-26"/><g transform="rotate(-11)"><g fill="#241b1b"><rect x="-12" y="-14" width="3" height="7"/><rect x="9" y="-14" width="3" height="7"/><rect x="-12" y="7" width="3" height="7"/><rect x="9" y="7" width="3" height="7"/></g><polygon fill="#7b6b6b" points="-9,-19 9,-19 10,-8 10,12 8,19 -8,19 -10,12 -10,-8"/><polygon fill="#fff" opacity="0.2" points="0,19 -8,19 -10,12 0,8"/><polygon fill="#000" opacity="0.14" points="0,19 8,19 10,12 0,8"/><polygon fill="#dbe8ee" points="-8,1 8,1 7,7 -7,7"/><polygon fill="#c3d4dc" points="-7,-9 7,-9 8,-13 -8,-13"/><polygon fill="#a08f8f" points="-8,-8 8,-8 8,0 -8,0"/></g>`,
  },
  crossing: {
    off: 0,
    flat: true,
    walker: true,
    draw: (id) =>
      `${[...Array(6)].map((_, i) => `<rect x="${-15 + i * 6}" y="-7" width="4" height="14" fill="#faf6f0"/>`).join("")}<g id="${id}"><polygon fill="#1f4d67" points="-1.6,-5 -3,-2 -3,2 -1.6,5 1.6,5 3,2 3,-2 1.6,-5"/><polygon fill="#c98f6b" points="${octagon(0, 0, 2.6)}"/></g>`,
  },
};
const SEQUENCE = [
  "cone",
  "rock",
  "bump",
  "oil",
  "crossing",
  "hay",
  "log",
  "puddle",
  "banana",
  "truck",
  "gravel",
  "manhole",
  "sheep",
  "works",
  "crate",
  "pothole",
  "cart",
  "cone",
  "crack",
  "stalled",
  "tire",
  "bump",
  "rock",
  "gravel",
  "oil",
  "crossing",
  "hay",
  "banana",
  "sheep",
  "cart",
];
