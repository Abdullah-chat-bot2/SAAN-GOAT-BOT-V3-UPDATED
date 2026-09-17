const fs = require("fs-extra");

module.exports = {
  config: {
    name: "font",
    aliases: ["fontstyle"],
    version: "5.0",
    author: "Siam Ahmed Saan",
    countDown: 5,
    role: 0,
    shortDescription: "Generate 100 stylish fonts",
    category: "tools",
    guide: "{pn} [text] [style_id] or {pn} list"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    // =========================================================
    // FONT ENGINE
    // =========================================================

    const styles = {

      // 1 - Bold
      1: text => mapChars(text, {
        upper: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙",
        lower: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳"
      }),

      // 2 - Italic
      2: text => mapChars(text, {
        upper: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍",
        lower: "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧"
      }),

      // 3 - Bold Italic
      3: text => mapChars(text, {
        upper: "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁",
        lower: "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛"
      }),

      // 4 - Fraktur
      4: text => mapChars(text, {
        upper: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
        lower: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷"
      }),

      // 5 - Bold Fraktur
      5: text => mapChars(text, {
        upper: "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅",
        lower: "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"
      }),

      // 6 - Double Struck
      6: text => mapChars(text, {
        upper: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
        lower: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫"
      }),

      // 7 - Sans
      7: text => mapChars(text, {
        upper: "𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹",
        lower: "𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓"
      }),

      // 8 - Normal
      8: text => text,

      // 9 - Small Caps
      9: text => smallCaps(text),

      // 10 - Circled
      10: text => circled(text),

      // 11 - Negative Circled
      11: text => negativeCircled(text),

      // 12 - Bold Script
      12: text => mapChars(text, {
        upper: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
        lower: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"
      }),

      // 13 - Monospace
      13: text => mapChars(text, {
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lower: "abcdefghijklmnopqrstuvwxyz"
      }, "𝚨"),

      // 14 - Square
      14: text => square(text),

      // 15 - Black Square
      15: text => blackSquare(text),

      // 16 - Fullwidth
      16: text => fullwidth(text),

      // 17 - Script
      17: text => mapChars(text, {
        upper: "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵",
        lower: "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏"
      }),

      // 18 - Small Caps
      18: text => smallCaps(text),

      // 19 - Greek
      19: text => greek(text),

      // 20 - Pen
      20: text => decorate(text, "✍︎"),

      // 21 - Underline Double
      21: text => combining(text, "\u0333"),

      // 22 - Strike
      22: text => combining(text, "\u0336"),

      // 23 - Tilde Strike
      23: text => combining(text, "\u0334"),

      // 24 - Slash
      24: text => combining(text, "\u0338"),

      // 25 - Underline
      25: text => combining(text, "\u0332"),

      // 26 - Parentheses
      26: text => parenthesized(text),

      // 27 - Reverse
      27: text => reverse(text),

      // 28 - Bracket
      28: text => `[${[...text].join("][")}]`,

      // 29 - Superscript
      29: text => superscript(text),

      // 30 - Subscript
      30: text => subscript(text),

      // 31 - Weird
      31: text => weird(text),

      // 32 - Double Bold
      32: text => mapChars(text, {
        upper: "𝕏𝔸𝕃𝕄𝔸ℕ",
        lower: "𝕩𝕒𝕝𝕞𝕒𝕟"
      }),

      // 33
      33: text => text.toUpperCase().replace(/A/g, "Λ"),

      // 34
      34: text => mapChars(text, {
        upper: "ᗩᗺᑕᗪᗴᖴᘜᕼIᒍKᒪᗰᑎOᑭᑫᖇS丅ᑌᐯᗯ᙭Y乙",
        lower: "ᗩᗺᑕᗪᗴᖴᘜᕼIᒍKᒪᗰᑎOᑭᑫᖇS丅ᑌᐯᗯ᙭Y乙"
      }),

      // 35
      35: text => mapChars(text, {
        upper: "メ丹ㄥ爪丹れ",
        lower: "メ丹ㄥ爪丹れ"
      }),

      // 36 - Cactus
      36: text => decorate(text, "🌵"),

      // 37
      37: text => greek(text),

      // 38 - Cloud
      38: text => decorate(text, "☁"),

      // 39
      39: text => text
        .replace(/a/gi, "Ⱥ")
        .replace(/l/gi, "ł")
        .replace(/m/gi, "M")
        .replace(/n/gi, "n"),

      // 40 - Heart
      40: text => decorate(text, "♥"),

      // 41 - Fullwidth
      41: text => fullwidth(text),

      // 42
      42: text => "ﾒﾑﾚ" + text.toUpperCase() + "刀",

      // 43
      43: text => greek(text),

      // 44
      44: text => combining(text, "\u0346"),

      // 45 - Dot
      45: text => combining(text, "\u0307"),

      // 46 - Dot Below
      46: text => combining(text, "\u0323"),

      // 47 - Double Dot
      47: text => combining(text, "\u0359"),

      // 48 - Diamond
      48: text => decorate(text, "⋄"),

      // 49 - Tilde
      49: text => combining(text, "\u0334"),

      // 50 - Block
      50: text => decorate(text, "█"),

      // 51 - Uppercase Fullwidth
      51: text => fullwidth(text.toUpperCase()),

      // 52 - Normal
      52: text => text,

      // 53 - Normal
      53: text => text,

      // 54 - Fraktur Upper
      54: text => mapChars(text.toUpperCase(), {
        upper: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
        lower: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷"
      }),

      // 55 - Script
      55: text => mapChars(text, {
        upper: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
        lower: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃"
      }),

      // 56 - Dot separator
      56: text => [...text].join("·"),

      // 57 - Arrow
      57: text => decorate(text, "➵"),

      // 58 - Underline brackets
      58: text => `[̲̅${[...text].join("][̲̅")}]`,

      // 59 - Plain name
      59: text => text,

      // 60
      60: text => combining(text, "\u0321"),

      // 61
      61: text => combining(text, "\u033E"),

      // 62
      62: text => text
        .replace(/a/gi, "ค")
        .replace(/l/gi, "ℓ")
        .replace(/m/gi, "๓")
        .replace(/n/gi, "ภ"),

      // 63 - Circle slash
      63: text => combining(text, "\u20E0"),

      // 64 - Circle
      64: text => combining(text, "\u20DF"),

      // 65 - Square
      65: text => square(text),

      // 66
      66: text => combining(text, "\u0488"),

      // 67 - Slash
      67: text => combining(text, "\u0338"),

      // 68
      68: text => combining(text, "\u033E"),

      // 69
      69: text => circled(text),

      // 70
      70: text => `[${[...text].join("][")}]`,

      // 71
      71: text => combining(text, "\u032A"),

      // 72
      72: text => combining(text, "\u034B"),

      // 73
      73: text => text,

      // 74
      74: text => text,

      // 75 - Double
      75: text => mapChars(text, {
        upper: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
        lower: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫"
      }),

      // 76
      76: text => combining(text, "\u034E"),

      // 77
      77: text => combining(text, "\u033D"),

      // 78
      78: text => combining(text, "\u033E"),

      // 79 - Small Caps
      79: text => smallCaps(text),

      // 80
      80: text => combining(text, "\u0359"),

      // 81
      81: text => styles[34](text),

      // 82
      82: text => styles[35](text),

      // 83
      83: text => greek(text),

      // 84
      84: text => greek(text),

      // 85
      85: text => text
        .replace(/a/gi, "λ")
        .replace(/l/gi, "l")
        .replace(/m/gi, "m")
        .replace(/n/gi, "n"),

      // 86
      86: text => combining(text, "\u20DC"),

      // 87
      87: text => combining(text, "\u033E"),

      // 88
      88: text => combining(text, "\u20D8"),

      // 89
      89: text => styles[42](text),

      // 90
      90: text => combining(text, "\u0306"),

      // 91
      91: text => combining(text, "\u0302"),

      // 92
      92: text => combining(text, "\u0303"),

      // 93
      93: text => combining(text, "\u0304"),

      // 94
      94: text => combining(text, "\u030A"),

      // 95
      95: text => combining(text, "\u030B"),

      // 96
      96: text => combining(text, "\u0306"),

      // 97
      97: text => combining(text, "\u030C"),

      // 98
      98: text => combining(text, "\u034D"),

      // 99
      99: text => combining(text, "\u034E"),

      // 100
      100: text => combining(text, "\u0310")
    };

    // =========================================================
    // LIST
    // =========================================================

    if (args[0] && args[0].toLowerCase() === "list") {
      api.setMessageReaction("📜", messageID, () => {}, true);

      const previewText = "Siam Ahmed Saan";

      let listMsg =
        "❖ 𝖥𝖮𝖭𝖳 𝖲𝖳𝖸𝖫𝖨𝖲𝖳 𝖯𝖱𝖤𝖵𝖨𝖤𝖶 ❖\n" +
        "━━━━━━━━━━━━━━━━━━\n";

      for (let i = 1; i <= 100; i++) {
        let preview;

        try {
          preview = styles[i](previewText);
        } catch {
          preview = previewText;
        }

        listMsg += `${i}. ${preview}\n`;
      }

      listMsg +=
        "━━━━━━━━━━━━━━━━━━\n" +
        "𝖴𝗌𝖺𝗀𝖾: /font [text] [id]";

      return api.sendMessage(listMsg, threadID, messageID);
    }

    // =========================================================
    // FONT GENERATOR
    // =========================================================

    if (args.length < 2) {
      return api.sendMessage(
        "╭─❍ 𝖥𝖮𝖭𝖳 𝖲𝖳𝖸𝖫𝖨𝖲𝖳\n" +
        "│\n" +
        "│ 𝖴𝗌𝖺𝗀𝖾:\n" +
        "│ /font [text] [style_id]\n" +
        "│\n" +
        "│ 𝖤𝗑𝖺𝗆𝗉𝗅𝖾:\n" +
        "│ /font Siam Ahmed Saan 15\n" +
        "│\n" +
        "│ 𝖫𝗂𝗌𝗍:\n" +
        "│ /font list\n" +
        "╰───────────⟡",
        threadID,
        messageID
      );
    }

    const styleID = Number(args[args.length - 1]);
    const text = args.slice(0, -1).join(" ");

    if (!text || !Number.isInteger(styleID) || styleID < 1 || styleID > 100) {
      return api.sendMessage(
        "✕ Invalid Style ID!\n\n" +
        "Valid style: 1 - 100\n" +
        "Example: /font Saan 15\n" +
        "List: /font list",
        threadID,
        messageID
      );
    }

    try {
      api.setMessageReaction("✍️", messageID, () => {}, true);

      const result = styles[styleID](text);

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage(result, threadID, messageID);

    } catch (error) {
      console.error("FONT ERROR:", error);

      api.setMessageReaction("❌", messageID, () => {}, true);

      return api.sendMessage(
        "✕ Failed to generate font!",
        threadID,
        messageID
      );
    }
  }
};


// =============================================================
// HELPER FUNCTIONS
// =============================================================

function mapChars(text, sets) {
  const upper = sets.upper || "";
  const lower = sets.lower || "";

  const normalUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const normalLower = "abcdefghijklmnopqrstuvwxyz";

  return [...text].map(char => {
    const upperIndex = normalUpper.indexOf(char);
    if (upperIndex !== -1 && upper[upperIndex]) {
      return upper[upperIndex];
    }

    const lowerIndex = normalLower.indexOf(char);
    if (lowerIndex !== -1 && lower[lowerIndex]) {
      return lower[lowerIndex];
    }

    return char;
  }).join("");
}


// =============================================================
// SMALL CAPS
// =============================================================

function smallCaps(text) {
  const chars = {
    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ꜰ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "ꜱ",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ"
  };

  return [...text]
    .map(c => chars[c.toLowerCase()] || c)
    .join("");
}


// =============================================================
// CIRCLED
// =============================================================

function circled(text) {
  const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const circled = "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ";

  return [...text].map(c => {
    const i = normal.indexOf(c);
    return i !== -1 ? circled[i] : c;
  }).join("");
}


// =============================================================
// NEGATIVE CIRCLED
// =============================================================

function negativeCircled(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const chars = "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩";

  return [...text.toUpperCase()].map(c => {
    const i = normal.indexOf(c);
    return i !== -1 ? chars[i] : c;
  }).join("");
}


// =============================================================
// SQUARE
// =============================================================

function square(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const chars = "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉";

  return [...text.toUpperCase()].map(c => {
    const i = normal.indexOf(c);
    return i !== -1 ? chars[i] : c;
  }).join("");
}


// =============================================================
// BLACK SQUARE
// =============================================================

function blackSquare(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const chars = "🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉";

  return [...text.toUpperCase()].map(c => {
    const i = normal.indexOf(c);
    return i !== -1 ? chars[i] : c;
  }).join("");
}


// =============================================================
// FULLWIDTH
// =============================================================

function fullwidth(text) {
  return [...text].map(c => {
    const code = c.charCodeAt(0);

    if (code >= 33 && code <= 126) {
      return String.fromCharCode(code + 0xfee0);
    }

    if (c === " ") return "　";

    return c;
  }).join("");
}


// =============================================================
// GREEK
// =============================================================

function greek(text) {
  const chars = {
    A: "Α",
    B: "Β",
    C: "Ϲ",
    D: "Δ",
    E: "Ε",
    F: "Ϝ",
    G: "Γ",
    H: "Η",
    I: "Ι",
    J: "Ϳ",
    K: "Κ",
    L: "Λ",
    M: "Μ",
    N: "Ν",
    O: "Ο",
    P: "Ρ",
    Q: "Θ",
    R: "Ρ",
    S: "Σ",
    T: "Τ",
    U: "Υ",
    V: "Ѵ",
    W: "Ω",
    X: "Χ",
    Y: "Υ",
    Z: "Ζ"
  };

  return [...text.toUpperCase()]
    .map(c => chars[c] || c)
    .join("");
}


// =============================================================
// DECORATE
// =============================================================

function decorate(text, symbol) {
  return [...text]
    .map(c => `${symbol}${c}`)
    .join("") + symbol;
}


// =============================================================
// COMBINING
// =============================================================

function combining(text, mark) {
  return [...text]
    .map(c => /[a-zA-Z]/.test(c) ? c + mark : c)
    .join("");
}


// =============================================================
// PARENTHESIZED
// =============================================================

function parenthesized(text) {
  const chars = {
    a: "⒜",
    b: "⒝",
    c: "⒞",
    d: "⒟",
    e: "⒠",
    f: "⒡",
    g: "⒢",
    h: "⒣",
    i: "⒤",
    j: "⒥",
    k: "⒦",
    l: "⒧",
    m: "⒨",
    n: "⒩",
    o: "⒪",
    p: "⒫",
    q: "⒬",
    r: "⒭",
    s: "⒮",
    t: "⒯",
    u: "⒰",
    v: "⒱",
    w: "⒲",
    x: "⒳",
    y: "⒴",
    z: "⒵"
  };

  return [...text]
    .map(c => chars[c.toLowerCase()] || c)
    .join("");
}


// =============================================================
// REVERSE
// =============================================================

function reverse(text) {
  const chars = {
    a: "ɐ",
    b: "q",
    c: "ɔ",
    d: "p",
    e: "ǝ",
    f: "ɟ",
    g: "ƃ",
    h: "ɥ",
    i: "ᴉ",
    j: "ɾ",
    k: "ʞ",
    l: "l",
    m: "ɯ",
    n: "u",
    o: "o",
    p: "d",
    q: "b",
    r: "ɹ",
    s: "s",
    t: "ʇ",
    u: "n",
    v: "ʌ",
    w: "ʍ",
    x: "x",
    y: "ʎ",
    z: "z"
  };

  return [...text]
    .map(c => chars[c.toLowerCase()] || c)
    .reverse()
    .join("");
}


// =============================================================
// SUPERSCRIPT
// =============================================================

function superscript(text) {
  const chars = {
    a: "ᵃ",
    b: "ᵇ",
    c: "ᶜ",
    d: "ᵈ",
    e: "ᵉ",
    f: "ᶠ",
    g: "ᵍ",
    h: "ʰ",
    i: "ⁱ",
    j: "ʲ",
    k: "ᵏ",
    l: "ˡ",
    m: "ᵐ",
    n: "ⁿ",
    o: "ᵒ",
    p: "ᵖ",
    q: "ᑫ",
    r: "ʳ",
    s: "ˢ",
    t: "ᵗ",
    u: "ᵘ",
    v: "ᵛ",
    w: "ʷ",
    x: "ˣ",
    y: "ʸ",
    z: "ᶻ"
  };

  return [...text]
    .map(c => chars[c.toLowerCase()] || c)
    .join("");
}


// =============================================================
// SUBSCRIPT
// =============================================================

function subscript(text) {
  const chars = {
    a: "ₐ",
    e: "ₑ",
    h: "ₕ",
    i: "ᵢ",
    j: "ⱼ",
    k: "ₖ",
    l: "ₗ",
    m: "ₘ",
    n: "ₙ",
    o: "ₒ",
    p: "ₚ",
    r: "ᵣ",
    s: "ₛ",
    t: "ₜ",
    u: "ᵤ",
    v: "ᵥ",
    x: "ₓ"
  };

  return [...text]
    .map(c => chars[c.toLowerCase()] || c)
    .join("");
}


// =============================================================
// WEIRD
// =============================================================

function weird(text) {
  const chars = {
    a: "α",
    b: "ɓ",
    c: "ƈ",
    d: "ɖ",
    e: "ε",
    f: "ƒ",
    g: "ɠ",
    h: "ɧ",
    i: "ι",
    j: "ʝ",
    k: "ƙ",
    l: "ʅ",
    m: "ɱ",
    n: "ɳ",
    o: "σ",
    p: "ρ",
    q: "զ",
    r: "ɾ",
    s: "ʂ",
    t: "ƭ",
    u: "ʉ",
    v: "ʋ",
    w: "ω",
    x: "ҳ",
    y: "ყ",
    z: "ʐ"
  };

  return [...text]
    .map(c => chars[c.toLowerCase()] || c)
    .join("");
      }
