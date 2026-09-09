// Confusable-character (homoglyph) data, derived from Unicode's official
// confusables.txt (UTS #39 / Unicode Security Mechanisms), filtered to entries
// whose confusable-skeleton target is a single ASCII a-z0-9 character — i.e.
// non-Latin letters/digits that render as a Latin letter or digit and could be
// used to spoof a domain name (IDN homograph attacks). Excludes symbol blocks
// (Mathematical Alphanumeric Symbols, Enclosed Alphanumerics) that IDNA does
// not allow in real hostnames, so this list stays focused on the actual
// threat model rather than mirroring the full confusables.txt.
//
// Some visually-similar letters (Cyrillic 'к' vs Latin 'k') are intentionally
// absent: Unicode's own skeleton algorithm maps them to a different Latin
// look-alike character (here, 'ĸ' LATIN SMALL LETTER KRA) rather than ASCII,
// so they don't fit this single-hop-to-ASCII table. See SIDE-26 for context.
//
// Source: https://www.unicode.org/Public/security/latest/confusables.txt
// Loaded before typosquatting-detector.js — see manifest.json.
const CONFUSABLES_MAP_RAW = {"2":["𜳲","🯲","Ꝛ","Ƨ","Ϩ","Ꙅ","ᒿ","ꛯ"],"3":["३","૩","𜳳","🯳","Ɜ","Ȝ","Ʒ","Ꝫ","Ⲝ","Ⳅ","Ⳍ","З","Ӡ","𖼻","𑣊"],"4":["𜳴","🯴","Ꮞ","𑢯"],"5":["𜳵","🯵","Ƽ","𑢻"],"6":["𜳶","🯶","ⳓ","Ⳓ","Ϭ","Ⳝ","б","Ꮾ","𑣕"],"7":["𜳷","🯷","𐓒","𑣆"],"8":["৪","੪","𞣋","𜳸","🯸","ȣ","Ȣ","𐌚"],"9":["੧","୨","৭","൭","𜳹","🯹","Ꝯ","ⳋ","Ⳋ","𑣌","𑢬","𑣖"],"a":["ａ","ɑ","α","а"],"b":["Ƅ","Ь","Ꮟ","ᑲ","ᖯ"],"c":["ｃ","ⅽ","ᴄ","ϲ","ⲥ","с","င","ၚ","ꮯ","𐐽"],"d":["ⅾ","ⅆ","ԁ","Ꮷ","ᑯ","ꓒ"],"e":["ｅ","ℯ","ⅇ","ꬲ","е","ҽ"],"f":["ꬵ","ꞙ","ƒ","ſ","ẝ","ք"],"g":["ｇ","ℊ","ɡ","ᶃ","ƍ","ց"],"h":["ｈ","ℎ","һ","հ","Ꮒ"],"i":["ｉ","ⅰ","ℹ","ⅈ","ı","ɪ","ɩ","ι","ι","ͺ","ⲓ","і","ꙇ","ւ","ꭵ","Ꭵ","𑣃"],"j":["ｊ","ⅉ","ϳ","ј"],"l":["١","۱","𐌠","𞣇","𜳱","🯱","Ｉ","Ⅰ","ℐ","ℑ","Ɩ","ｌ","ⅼ","ℓ","ǀ","Ι","Ⲓ","І","ӏ","Ӏ","ו","ן","ا","𞸀","𞺀","ﺎ","ﺍ","ߊ","ⵏ","ᛁ","ꓲ","𖼨","𐊊","𐌉"],"n":["ո","ռ"],"o":["०","০","੦","૦","୦","௦","౦","൦","๐","໐","၀","០","𑓐","٥","۵","ｏ","ℴ","ᴏ","ᴑ","ꬽ","ο","σ","ⲟ","ϭ","о","ჿ","օ","ס","ه","𞸤","𞹤","𞺄","ﻫ","ﻬ","ﻪ","ﻩ","ھ","ﮬ","ﮭ","ﮫ","ﮪ","ہ","ﮨ","ﮩ","ﮧ","ﮦ","ە","ഠ","ဝ","𐓪","𑣈","𑣗","𐐬"],"p":["ｐ","þ","ƿ","ρ","ϱ","ϸ","ⲣ","ⳏ","р"],"q":["ԛ","գ","զ"],"r":["ꭇ","ꭈ","ᴦ","ⲅ","г","ꮁ"],"s":["ｓ","ꜱ","ƽ","ѕ","ട","ꮪ","𑣁","𐑈"],"u":["ꞟ","ᴜ","ꭎ","ꭒ","ʋ","υ","ս","𐓶","𑣘"],"v":["ｖ","ⅴ","ᴠ","ν","ѵ","ט","𑜆","ꮩ","𑣀"],"w":["ɯ","ᴡ","ⲽ","ѡ","ш","ԝ","ա","𑜊","𑜎","𑜏","ꮃ"],"x":["ｘ","ⅹ","х","ᕁ","ᕽ"],"y":["ɣ","ᶌ","ｙ","ʏ","ỿ","ꭚ","γ","ℽ","ⲩ","у","ү","ყ","𑣜"],"z":["ᴢ","ꮓ","𑣄"]};

window.CONFUSABLES_MAP_RAW = CONFUSABLES_MAP_RAW;
