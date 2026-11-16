// Fast marked-18.1.3-compatible Markdown renderer (from scratch).
// Single-pass scanner, direct-to-HTML emission, no token tree.
// parse(markdown) returns exactly marked 18.1.3's HTML (default options).

const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00A0',
  copy: '\u00A9', reg: '\u00AE', trade: '\u2122', hellip: '\u2026',
  mdash: '\u2014', ndash: '\u2013', lsquo: '\u2018', rsquo: '\u2019',
  sbquo: '\u201A', ldquo: '\u201C', rdquo: '\u201D', bdquo: '\u201E',
  laquo: '\u00AB', raquo: '\u00BB', ouml: '\u00F6', auml: '\u00E4',
  uuml: '\u00FC', euml: '\u00EB', iuml: '\u00EF', yuml: '\u00FF',
  AElig: '\u00C6', aelig: '\u00E6', Ouml: '\u00D6', Auml: '\u00C4',
  Uuml: '\u00DC', Euml: '\u00CB', Iuml: '\u00CF', szlig: '\u00DF',
  agrave: '\u00E0', aacute: '\u00E1', acirc: '\u00E2', atilde: '\u00E3',
  aring: '\u00E5', aogon: '\u0105', ccedil: '\u00E7', egrave: '\u00E8',
  eacute: '\u00E9', ecirc: '\u00EA', igrave: '\u00EC', iacute: '\u00ED',
  icirc: '\u00EE', ntilde: '\u00F1', ograve: '\u00F2', oacute: '\u00F3',
  ocirc: '\u00F4', otilde: '\u00F5', oslash: '\u00F8', ugrave: '\u00F9',
  uacute: '\u00FA', ucirc: '\u00FB', yacute: '\u00FD', thorn: '\u00FE',
  yuml2: '\u00FF', Agrave: '\u00C0', Aacute: '\u00C1', Acirc: '\u00C2',
  Atilde: '\u00C3', Aring: '\u00C5', Ccedil: '\u00C7', Egrave: '\u00C8',
  Eacute: '\u00C9', Ecirc: '\u00CA', Igrave: '\u00CC', Iacute: '\u00CD',
  Icirc: '\u00CE', Ntilde: '\u00D1', Ograve: '\u00D2', Oacute: '\u00D3',
  Ocirc: '\u00D4', Otilde: '\u00D5', Oslash: '\u00D8', Ugrave: '\u00D9',
  Uacute: '\u00DA', Ucirc: '\u00DB', Yacute: '\u00DD', THORN: '\u00DE',
  Dcaron: '\u010E', dcaron: '\u010F', frac34: '\u00BE', frac12: '\u00BD',
  frac14: '\u00BC', frac14_: '\u00BC', middot: '\u00B7', bull: '\u2022',
  dagger: '\u2020', Dagger: '\u2021', permil: '\u2030', prime: '\u2032',
  Prime: '\u2033', euro: '\u20AC', pound: '\u00A3', yen: '\u00A5',
  cent: '\u00A2', curren: '\u00A4', sect: '\u00A7', para: '\u00B6',
  deg: '\u00B0', plusmn: '\u00B1', sup2: '\u00B2', sup3: '\u00B3',
  acute: '\u00B4', micro: '\u00B5', sup1: '\u00B9', ordf: '\u00AA',
  ordm: '\u00BA', iexcl: '\u00A1', iquest: '\u00BF', shy: '\u00AD',
  times: '\u00D7', divide: '\u00F7', minus: '\u2212', lowast: '\u2217',
  radic: '\u221A', infin: '\u221E', ne: '\u2260', le: '\u2264',
  ge: '\u2265', alpha: '\u03B1', beta: '\u03B2', gamma: '\u03B3',
  delta: '\u03B4', epsilon: '\u03B5', zeta: '\u03B6', eta: '\u03B7',
  theta: '\u03B8', iota: '\u03B9', kappa: '\u03BA', lambda: '\u03BB',
  mu: '\u03BC', nu: '\u03BD', xi: '\u03BE', pi: '\u03C0', rho: '\u03C1',
  sigma: '\u03C3', tau: '\u03C4', upsilon: '\u03C5', phi: '\u03C6',
  chi: '\u03C7', psi: '\u03C8', omega: '\u03C9',
  Alpha: '\u0391', Beta: '\u0392', Gamma: '\u0393', Delta: '\u0394',
  Epsilon: '\u0395', Zeta: '\u0396', Eta: '\u0397', Theta: '\u0398',
  Iota: '\u0399', Kappa: '\u039A', Lambda: '\u039B', Mu: '\u039C',
  Nu: '\u039D', Xi: '\u039E', Pi: '\u03A0', Rho: '\u03A1', Sigma: '\u03A3',
  Tau: '\u03A4', Upsilon: '\u03A5', Phi: '\u03A6', Chi: '\u03A7',
  Psi: '\u03A8', Omega: '\u03A9',
  HilbertSpace: '\u210B', DifferentialD: '\u2146',
  ClockwiseContourIntegral: '\u2232', ngE: '\u2267\u0338',
 larr: '\u2190', uarr: '\u2191', rarr: '\u2192', darr: '\u2193',
  harr: '\u2194', crarr: '\u21B5', lArr: '\u21D0', uArr: '\u21D1',
  rArr: '\u21D2', dArr: '\u21D3', hArr: '\u21D4', forall: '\u2200',
  part: '\u2202', exist: '\u2203', empty: '\u2205', nabla: '\u2207',
  isin: '\u2208', notin: '\u2209', ni: '\u220B', prod: '\u220F',
  sum: '\u2211', lowast2: '\u2217', and: '\u2227', or: '\u2228',
  cap: '\u2229', cup: '\u222A', int: '\u222B', there4: '\u2234',
  sim: '\u223C', cong: '\u2245', asymp: '\u2248', neq: '\u2260',
  equiv: '\u2261', leq: '\u2264', geq: '\u2265', sub: '\u2282',
  sup: '\u2283', nsub: '\u2284', sube: '\u2286', supe: '\u2287',
  oplus: '\u2295', otimes: '\u2297', perp: '\u22A5', sdot: '\u22C5',
  lceil: '\u2308', rceil: '\u2309', lfloor: '\u230A', rfloor: '\u230B',
  lang: '\u27E8', rang: '\u27E9', spades: '\u2660', clubs: '\u2663',
  hearts: '\u2665', diams: '\u2666', ensp: '\u2002', emsp: '\u2003',
  thinsp: '\u2009', zwnj: '\u200C', zwj: '\u200D', lrm: '\u200E',
  rlm: '\u200F', ndash2: '\u2013', lsquor: '\u201A', rsquor: '\u2019'
};
delete ENT.yuml2; delete ENT.lowast2; delete ENT.ndash2;

// Decode a NUMERIC character reference at s[i] === '&'. Returns
// [decoded, nextIndex] or null (named entities are NOT decoded by marked).
function decodeNumericEntity(s, i) {
  if (s[i + 1] !== '#') return null;
  const n = s.length;
  let j = i + 2, hex = false, digits = 0;
  if (j < n && (s[j] === 'x' || s[j] === 'X')) { hex = true; j++; }
  const start = j;
  while (j < n) {
    const ch = s.charCodeAt(j);
    if (hex ? (ch >= 48 && ch <= 57) || (ch >= 65 && ch <= 70) || (ch >= 97 && ch <= 102)
            : (ch >= 48 && ch <= 57)) { j++; digits++; }
    else break;
  }
  if (digits === 0 || digits > (hex ? 6 : 7) || j >= n || s[j] !== ';') return null;
  let num = hex ? parseInt(s.slice(start, j), 16) : parseInt(s.slice(start, j), 10);
  if (!num || num > 0x10FFFF || (num >= 0xD800 && num <= 0xDFFF)) num = 0xFFFD;
  return [String.fromCodePoint(num), j + 1];
}

// Decode one entity starting at s[i] === '&'. Returns [decoded, nextIndex]
// or null when not a valid entity reference.
function decodeEntity(s, i) {
  const n = s.length;
  if (i + 1 >= n) return null;
  const c = s[i + 1];
  if (c === '#') {
    let j = i + 2, hex = false, num = 0, digits = 0;
    if (j < n && (s[j] === 'x' || s[j] === 'X')) { hex = true; j++; }
    const start = j;
    while (j < n) {
      const ch = s.charCodeAt(j);
      if (hex ? (ch >= 48 && ch <= 57) || (ch >= 65 && ch <= 70) || (ch >= 97 && ch <= 102)
              : (ch >= 48 && ch <= 57)) { j++; digits++; }
      else break;
    }
    if (digits === 0 || j >= n || s[j] !== ';') return null;
    const txt = s.slice(start, j);
    num = hex ? parseInt(txt, 16) : parseInt(txt, 10);
    if (!num || num > 0x10FFFF || (num >= 0xD800 && num <= 0xDFFF)) num = 0xFFFD;
    return [String.fromCodePoint(num), j + 1];
  }
  let j = i + 1;
  while (j < n && j - i <= 32) {
    const ch = s.charCodeAt(j);
    if ((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || (ch >= 48 && ch <= 57)) j++;
    else break;
  }
  if (j < n && s[j] === ';') {
    const name = s.slice(i + 1, j);
    const v = ENT[name];
    if (v !== undefined) return [v, j + 1];
  }
  return null;
}

// Fast HTML escaping. esc(): full (& < > " '); escNoEncode(): leaves & alone
// when it starts a valid entity reference (used for attributes).
const ESC_RE = /[&<>"']/g;
const ESC_NOENC_RE = /[<>"']|&(?!(?:#\d{1,7}|#[Xx][0-9a-fA-F]{1,6}|[A-Za-z][A-Za-z0-9]{0,31});)/g;
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(s) {
  if (!ESC_RE.test(s)) return s;
  ESC_RE.lastIndex = 0;
  return s.replace(ESC_RE, ch => ESC_MAP[ch]);
}
function escNoEnc(s) {
  if (!ESC_NOENC_RE.test(s)) return s;
  ESC_NOENC_RE.lastIndex = 0;
  return s.replace(ESC_NOENC_RE, ch => ESC_MAP[ch]);
}

// marked's cleanUrl: encodeURI, then restore literal % signs; null on throw.
function cleanUrl(href) {
  try {
    return encodeURI(href).replace(/%25/g, '%');
  } catch (e) { return null; }
}

function normalizeLabel(s) {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

// Resolve backslash escapes (backslash + ASCII punctuation -> the punctuation).
function unescapeStr(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && i + 1 < s.length && isPunct(s[i + 1])) { out += s[i + 1]; i++; }
    else out += s[i];
  }
  return out;
}

// ASCII punctuation (for backslash escapes and emphasis rules).
function isPunct(ch) {
  const c = ch.charCodeAt(0);
  return (c >= 33 && c <= 47) || (c >= 58 && c <= 64) ||
         (c >= 91 && c <= 96) || (c >= 123 && c <= 126);
}
// Unicode punctuation for emphasis flanking: ASCII punctuation plus
// Unicode categories P (punctuation) and S (symbol) — so $, £, € count.
const UNI_PUNCT = /[\p{P}\p{S}]/u;
function isUniPunct(ch) {
  return isPunct(ch) || UNI_PUNCT.test(ch);
}

function isSpace(ch) {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f' || ch === '\v';
}
function isWhite(ch) { return ch === ' ' || ch === '\n' || ch === '\t'; }

// ---- Inline scanner ----
// Nodes: {t:'x', s} text | {t:'c', s} code span | {t:'h', s} raw html
//   {t:'b'} hard break | {t:'d', ch, len, open, close, ot, ct, used} delimiter
//   {t:'a', href, title} link open | {t:'A'} link close
//   {t:'i', href, title, alt} image (alt = rendered text, tags stripped)
const SPECIAL = new Set([92, 96, 42, 95, 91, 93, 33, 60, 38, 126]); // \ ` * _ [ ] ! < & ~
function nextSpecial(s, i) {
  const n = s.length;
  while (i < n) {
    if (SPECIAL.has(s.charCodeAt(i))) return i;
    i++;
  }
  return n;
}
function isFlank(c) { return c !== undefined && !isSpace(c); }

function scanInline(str, refs) {
  const nodes = [], delims = [];
  const n = str.length;
  let p = 0;
  const pushText = (t) => {
    if (!t) return;
    const last = nodes[nodes.length - 1];
    if (last && last.t === 'x') last.s += t; else nodes.push({ t: 'x', s: t });
  };
  while (p < n) {
    const ch = str[p], cc = str.charCodeAt(p);
    if (cc === 92) { // backslash
      const nx = str[p + 1];
      if (nx === '\n') { nodes.push({ t: 'b' }); p += 2; continue; }
      if (nx !== undefined && isPunct(nx)) { nodes.push({ t: 'e', s: nx }); p += 2; continue; }
      pushText('\\'); p++; continue;
    }
    if (cc === 96) { // code span
      let q = p, run = 0;
      while (q < n && str[q] === '`') { q++; run++; }
      let close = -1, r = q;
      while (r < n) {
        if (str[r] === '`') {
          let e = r, len = 0;
          while (e < n && str[e] === '`') { e++; len++; }
          if (len === run) { close = r; break; }
          r = e;
        } else r++;
      }
      if (close === -1) { pushText('`'.repeat(run)); p = q; continue; }
      let content = str.slice(q, close);
      content = content.replace(/\n/g, ' ');
      if (content.length >= 2 && content[0] === ' ' && content[content.length - 1] === ' ' && /[^ ]/.test(content)) {
        content = content.slice(1, -1);
      }
      nodes.push({ t: 'c', s: content });
      p = close + run;
      continue;
    }
    if (cc === 38) { // & : numeric refs decode; named refs pass through verbatim
      const d = decodeNumericEntity(str, p);
      if (d) { nodes.push({ t: 'e', s: d[0] }); p = d[1]; continue; }
      pushText('&'); p++; continue;
    }
    if (cc === 60) { // < : autolink or raw html tag
      const al = scanAutolink(str, p);
      if (al) {
        nodes.push({ t: 'a', href: al.href, title: null });
        pushText(al.text);
        nodes.push({ t: 'A' });
        p = al.end; continue;
      }
      const tag = scanHtmlTag(str, p);
      if (tag) { nodes.push({ t: 'h', s: tag }); p += tag.length; continue; }
      pushText('<'); p++; continue;
    }
    if (cc === 42 || cc === 95 || cc === 126) { // * _ ~ delimiter run
      let q = p, len = 0;
      while (q < n && str.charCodeAt(q) === cc) { q++; len++; }
      const prev = p > 0 ? str[p - 1] : undefined;
      const next = q < n ? str[q] : undefined;
      const prevWs = prev === undefined || isSpace(prev);
      const nextWs = next === undefined || isSpace(next);
      const prevP = prev !== undefined && isUniPunct(prev);
      const nextP = next !== undefined && isUniPunct(next);
      const leftFlank = !nextWs && (!nextP || prevWs || prevP);
      const rightFlank = !prevWs && (!prevP || nextWs || nextP);
      let canOpen, canClose;
      if (cc === 95) {
        canOpen = leftFlank && (!rightFlank || prevP);
        canClose = rightFlank && (!leftFlank || nextP);
      } else {
        canOpen = leftFlank; canClose = rightFlank;
      }
      if (cc === 126 && len < 2) { pushText('~'); p++; continue; }
      const node = { t: 'd', ch, len, open: canOpen, close: canClose, ot: [], ct: [], used: 0 };
      nodes.push(node);
      delims.push(node);
      p = q; continue;
    }
    if (cc === 33 && str[p + 1] !== '[') { pushText('!'); p++; continue; }
    if (cc === 91 || (cc === 33 && str[p + 1] === '[')) { // [ or ![
      const isImg = cc === 33;      const res = tryLink(str, isImg ? p + 1 : p, refs, isImg);
      if (res) {
        if (isImg) {
          nodes.push({ t: 'i', href: res.href, title: res.title, alt: res.alt });
        } else {
          nodes.push({ t: 'a', href: res.href, title: res.title });
          for (const nd of res.nodes) nodes.push(nd);
          for (const d of res.delims) delims.push(d);
          nodes.push({ t: 'A' });
        }
        p = res.end; continue;
      }
      pushText(isImg ? '![' : '['); p += isImg ? 2 : 1; continue;
    }
    if (cc === 93) { pushText(']'); p++; continue; }
    if (cc === 10) { // newline: hard break if 2+ trailing spaces
      let sp = 0, k = nodes.length - 1;
      const last = nodes[k];
      if (last && last.t === 'x') {
        const m = / +$/.exec(last.s);
        if (m && m[0].length >= 2) {
          last.s = last.s.slice(0, -m[0].length);
          if (!last.s) nodes.pop();
          nodes.push({ t: 'b' }); p++; continue;
        }
      }
      pushText('\n'); p++; continue;
    }
    // plain text run up to next special char
    const end = nextSpecial(str, p);
    emitTextWithAutolinks(str.slice(p, end), p, nodes, str);
    p = end;
  }
  return { nodes, delims };
}

// Scan a plain-text chunk for GFM extended autolinks (www., scheme://, email).
const EXT_RE = /(?:[A-Za-z][A-Za-z0-9+.-]{1,31}:\/\/[^\s<>\[\]]+|www\.[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+|[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+)/g;
function emitTextWithAutolinks(chunk, chunkStart, nodes, full) {
  if (!chunk) return;
  const pushText = (t) => {
    if (!t) return;
    const last = nodes[nodes.length - 1];
    if (last && last.t === 'x') last.s += t; else nodes.push({ t: 'x', s: t });
  };
  EXT_RE.lastIndex = 0;
  let m, last = 0;
  while ((m = EXT_RE.exec(chunk)) !== null) {
    const cand = m[0];
    const absStart = chunkStart + m.index;
    const prev = absStart > 0 ? full[absStart - 1] : undefined;
    const prevOk = prev === undefined || isSpace(prev) || '*_~([<!>,;:'.includes(prev);
    if (!prevOk) continue;
    // strip trailing punctuation: ?!.,:;*_~'" and unbalanced )
    let end = cand.length;
    let opens = 0;
    for (let i = 0; i < cand.length; i++) {
      if (cand[i] === '(') opens++;
      else if (cand[i] === ')') opens--;
    }
    while (end > 0) {
      const c = cand[end - 1];
      if ('?!.,:;*_~\'"'.includes(c)) { end--; continue; }
      if (c === ')' && opens < 0) { end--; opens++; continue; }
      break;
    }
    const text = cand.slice(0, end);
    if (!text) continue;
    let href = null, ok = false;
    if (text.startsWith('www.')) {
      if (text.indexOf('.', 4) > 4) { href = cleanUrl('http://' + text); ok = href !== null; }
    } else if (text.includes('://')) {
      href = cleanUrl(text); ok = href !== null;
    } else if (text.includes('@')) {
      const at = text.lastIndexOf('@');
      const domain = text.slice(at + 1);
      const tld = domain.split('.').pop();
      if (domain.includes('.') && tld.length >= 2 && /^[A-Za-z]+$/.test(tld)) {
        href = cleanUrl('mailto:' + text); ok = href !== null;
      }
    }
    if (!ok) continue;
    pushText(chunk.slice(last, m.index));
    nodes.push({ t: 'a', href, title: null });
    pushText(text);
    nodes.push({ t: 'A' });
    last = m.index + end;
    EXT_RE.lastIndex = last;
  }
  pushText(chunk.slice(last));
}

// <scheme:...> or <email> autolink. Returns {t:'a', href, title, end} or null.
function scanAutolink(s, p) {
  const n = s.length;
  let j = p + 1;
  if (j < n && s[j] === ' ') return null;
  while (j < n && s[j] !== '>' && s[j] !== ' ' && s[j] !== '\n' && s[j] !== '<') j++;
  if (j >= n || s[j] !== '>') return null;
  const inner = s.slice(p + 1, j);
  if (!inner) return null;
  if (/^[A-Za-z][A-Za-z0-9+.-]{1,31}:/.test(inner)) {
    return { href: cleanUrl(inner), text: inner, end: j + 1 };
  }
  if (/^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(inner)) {
    return { href: 'mailto:' + inner, text: inner, end: j + 1 };
  }
  return null;
}

// Raw inline HTML tag starting at s[p] === '<'. Returns the tag string or null.
function scanHtmlTag(s, p) {
  const n = s.length;
  if (s.startsWith('<!--', p)) {
    const e = s.indexOf('-->', p + 4);
    if (e !== -1) return s.slice(p, e + 3);
    return null;
  }
  if (s.startsWith('<?', p)) {
    const e = s.indexOf('?>', p + 2);
    if (e !== -1) return s.slice(p, e + 2);
    return null;
  }
  if (s.startsWith('<!', p)) {
    if (s.startsWith('<!', p) && /^<![A-Za-z]/.test(s.slice(p, p + 10))) {
      const e = s.indexOf('>', p + 2);
      if (e !== -1) return s.slice(p, e + 1);
    }
    if (s.startsWith('<![CDATA[', p)) {
      const e = s.indexOf(']]>', p + 9);
      if (e !== -1) return s.slice(p, e + 3);
    }
    return null;
  }
  const m = /^<\/?[A-Za-z][A-Za-z0-9-]*(?:\s+[^<>]*)?\/?>/.exec(s.slice(p));
  if (m) {
    // attribute values must be valid: quoted or unquoted without spaces/<=>/`
    const tag = m[0];
    if (/=\s*["'][^"']*$/.test(tag)) return null;
    return tag;
  }
  return null;
}

// ---- Links ----
function findMatchingBracket(s, p) {
  const n = s.length;
  let depth = 1, i = p + 1;
  while (i < n) {
    const c = s[i];
    if (c === '\\' && i + 1 < n) { i += 2; continue; }
    if (c === '`') {
      let q = i, run = 0;
      while (q < n && s[q] === '`') { q++; run++; }
      let r = q, closed = false;
      while (r < n) {
        if (s[r] === '`') {
          let e = r, len = 0;
          while (e < n && s[e] === '`') { e++; len++; }
          if (len === run) { i = e; closed = true; break; }
          r = e;
        } else r++;
      }
      if (!closed) i = q;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return i; }
    i++;
  }
  return -1;
}

// Parse a link destination at s[p]. Returns {dest, end} or null.
function parseLinkDest(s, p) {
  const n = s.length;
  if (p >= n) return null;
  if (s[p] === '<') {
    let i = p + 1, out = '';
    while (i < n) {
      const c = s[i];
      if (c === '\n' || c === '<') return null;
      if (c === '>') return { dest: out, end: i + 1 };
      if (c === '\\' && i + 1 < n && isPunct(s[i + 1])) { out += s[i + 1]; i += 2; continue; }
      out += c; i++;
    }
    return null;
  }
  let i = p, out = '', depth = 0;
  while (i < n) {
    const c = s[i];
    if (c === ' ' || c === '\n' || c === '\t' || c.charCodeAt(0) < 32) break;
    if (c === '\\' && i + 1 < n && isPunct(s[i + 1])) { out += s[i + 1]; i += 2; continue; }
    if (c === '(') depth++;
    else if (c === ')') {
      if (depth === 0) break;
      depth--;
    }
    out += c; i++;
  }
  return out ? { dest: out, end: i } : null;
}

// Parse a link title at s[p] ('"' or '\'' or '('). Returns {title, end} or null.
function parseLinkTitle(s, p) {
  const n = s.length;
  const q = s[p];
  if (q === '"' || q === "'") {
    let i = p + 1, out = '';
    while (i < n) {
      const c = s[i];
      if (c === q) return { title: out, end: i + 1 };
      if (c === '\\' && i + 1 < n && isPunct(s[i + 1])) { out += s[i + 1]; i += 2; continue; }
      out += c; i++;
    }
    return null;
  }
  if (q === '(') {
    let i = p + 1, out = '';
    while (i < n) {
      const c = s[i];
      if (c === ')') return { title: out, end: i + 1 };
      if (c === '(') return null;
      if (c === '\\' && i + 1 < n && isPunct(s[i + 1])) { out += s[i + 1]; i += 2; continue; }
      out += c; i++;
    }
    return null;
  }
  return null;
}

function skipWs(s, i) {
  let nl = 0;
  while (i < s.length && isSpace(s[i])) { if (s[i] === '\n') nl++; i++; }
  return { i, nl };
}

function tryLink(s, p, refs, isImg) {
  const close = findMatchingBracket(s, p);
  if (close === -1) return null;
  const content = s.slice(p + 1, close);
  let j = close + 1, href = null, title = null;
  if (s[j] === '(') {
    let k = skipWs(s, j + 1);
    if (k.nl > 1) return null;
    const dest = parseLinkDest(s, k.i);
    if (!dest) return null;
    k = skipWs(s, dest.end);
    if (k.nl > 1) return null;
    if (k.i < s.length && (s[k.i] === '"' || s[k.i] === "'" || s[k.i] === '(')) {
      if (k.i === dest.end) return null; // title needs whitespace after the destination
      const t = parseLinkTitle(s, k.i);
      if (!t) return null;
      title = t.title;
      const k2 = skipWs(s, t.end);
      if (k2.nl > 1 || s[k2.i] !== ')') return null;
      j = k2.i + 1;
    } else {
      if (s[k.i] !== ')') return null;
      j = k.i + 1;
    }
    href = cleanUrl(dest.dest);
    if (href === null) return null;
  } else if (s[j] === '[') {
    const lc = s.indexOf(']', j + 1);
    if (lc === -1) return null;
    let label = s.slice(j + 1, lc);
    if (!label) label = content;
    const ref = refs.get(normalizeLabel(unescapeStr(label)));
    if (!ref || ref.href === null) return null;
    href = ref.href; title = ref.title;
    j = lc + 1;
  } else {
    const ref = refs.get(normalizeLabel(unescapeStr(content)));
    if (!ref || ref.href === null) return null;
    href = ref.href; title = ref.title;
    j = close + 1;
  }
  const inner = scanInline(content, refs);
  if (!isImg) {
    for (const nd of inner.nodes) if (nd.t === 'a' || nd.t === 'i') return null;
    return { href, title, nodes: inner.nodes, delims: inner.delims, end: j };
  }
  resolveEmphasis(inner.delims);
  const alt = renderNodes(inner.nodes).replace(/<[^>]*>/g, '');
  return { href, title, alt, end: j };
}

// ---- Emphasis resolution ----
let matchOrder = 0;
function resolveEmphasis(delims) {
  for (let ci = 0; ci < delims.length; ci++) {
    const closer = delims[ci];
    if (!closer.close || closer.len === 0) continue;
    for (let oi = ci - 1; oi >= 0; oi--) {
      const opener = delims[oi];
      if (opener.ch !== closer.ch || !opener.open || opener.len === 0) continue;
      const oLen = opener.len + opener.used, cLen = closer.len + closer.used;
      if ((opener.open && opener.close) || (closer.open && closer.close)) {
        const sum = oLen + cLen;
        if (sum % 3 === 0 && !(oLen % 3 === 0 && cLen % 3 === 0)) continue;
      }
      let use;
      if (closer.ch === '~') {
        if (opener.len < 2 || closer.len < 2) continue;
        use = 2;
      } else {
        use = (opener.len >= 2 && closer.len >= 2) ? 2 : 1;
      }
      const tag = closer.ch === '~' ? 'del' : (use === 2 ? 'strong' : 'em');
      const ord = matchOrder++;
      opener.ot.push({ tag, ci, ord });
      closer.ct.push({ tag, oi, ord });
      opener.used += use; closer.used += use;
      opener.len -= use; closer.len -= use;
      if (closer.len === 0) break;
    }
  }
}

// ---- Rendering ----
function renderNodes(nodes) {
  const out = [];
  for (const nd of nodes) {
    switch (nd.t) {
      case 'x': out.push(escNoEnc(nd.s)); break;
      case 'e': out.push(esc(nd.s)); break;
      case 'c': out.push('<code>' + esc(nd.s) + '</code>'); break;
      case 'h': out.push(nd.s); break;
      case 'b': out.push('<br>'); break;
      case 'd': {
        nd.ct.sort((a, b) => (b.oi - a.oi) || (b.ord - a.ord));
        for (const m of nd.ct) out.push('</' + m.tag + '>');
        if (nd.len > 0) out.push(nd.ch.repeat(nd.len));
        nd.ot.sort((a, b) => (b.ci - a.ci) || (a.ord - b.ord));
        for (const m of nd.ot) out.push('<' + m.tag + '>');
        break;
      }
      case 'a':
        out.push('<a href="' + escNoEnc(nd.href) + '"' +
          (nd.title != null ? ' title="' + escNoEnc(nd.title) + '"' : '') + '>');
        break;
      case 'A': out.push('</a>'); break;
      case 'i':
        out.push('<img src="' + escNoEnc(nd.href) + '" alt="' + escNoEnc(nd.alt) + '"' +
          (nd.title != null ? ' title="' + escNoEnc(nd.title) + '"' : '') + '>');
        break;
    }
  }
  return out.join('');
}

function renderInline(str, refs) {
  const { nodes, delims } = scanInline(str, refs);
  resolveEmphasis(delims);
  return renderNodes(nodes);
}

// ---- Block parser ----
// Block records: {t:'para', text} {t:'h', level, text} {t:'code', lang, text}
//   {t:'html', text} {t:'hr'} {t:'quote', blocks} {t:'list', ordered, start, items, tight}
//   {t:'table', align, head, rows}  (head/rows: arrays of cell-text arrays)

function lineIndent(line) {
  let col = 0, i = 0;
  const n = line.length;
  while (i < n) {
    const c = line[i];
    if (c === ' ') { col++; i++; }
    else if (c === '\t') { col += 4 - (col % 4); i++; }
    else break;
  }
  return { indent: col, cs: i };
}

// Remove `cols` columns of indent from line (a straddling tab becomes spaces).
// `startCol` is the absolute column the line starts at (for tab stops).
function stripCols(line, cols, startCol) {
  let col = startCol || 0, i = 0;
  const n = line.length;
  while (i < n && col < (startCol || 0) + cols) {
    const c = line[i];
    if (c === ' ') { col++; i++; }
    else if (c === '\t') {
      const w = 4 - (col % 4);
      if (col + w <= (startCol || 0) + cols) { col += w; i++; }
      else return ' '.repeat(col + w - ((startCol || 0) + cols)) + line.slice(i + 1);
    } else break;
  }
  return line.slice(i);
}

function isBlank(line) {
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c !== ' ' && c !== '\t') return false;
  }
  return true;
}

const BLOCK_TAGS = new Set(('address article aside base basefont blockquote body caption center col colgroup dd details dialog dir div dl dt fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html iframe legend li link main menu menuitem meta nav noframes ol optgroup option p param section source summary table tbody td tfoot th thead title tr track ul').split(' '));

// Parse one link reference definition at text[i]. Returns {label, href, title, end} or null.
function parseRefDef(text, i, refs) {
  const n = text.length;
  let j = i, sp = 0;
  while (j < n && (text[j] === ' ' || text[j] === '\t')) { j++; sp++; }
  if (sp > 3 || text[j] !== '[') return null;
  let k = j + 1, depth = 0, label = '';
  while (k < n) {
    const c = text[k];
    if (c === '\\' && k + 1 < n && isPunct(text[k + 1])) { label += text[k + 1]; k += 2; continue; }
    if (c === '[') depth++;
    else if (c === ']') {
      if (depth === 0) break;
      depth--;
    }
    label += c; k++;
  }
  if (k >= n || !label || text[k] !== ']' || text[k + 1] !== ':') return null;
  const norm = normalizeLabel(label);
  if (!norm) return null;
  k += 2;
  let w = skipWs(text, k);
  if (w.nl > 1) return null;
  k = w.i;
  const dest = parseLinkDest(text, k);
  if (!dest) return null;
  k = dest.end;
  let title = null;
  // After the destination: spaces/tabs, then an optional title, then EOL.
  // The title may also sit on the next line (one newline only).
  let jj = k;
  while (jj < n && (text[jj] === ' ' || text[jj] === '\t')) jj++;
  if (jj < n && (text[jj] === '"' || text[jj] === "'" || text[jj] === '(')) {
    if (jj === k) return null; // title needs whitespace after the destination
    const t = parseLinkTitle(text, jj);
    if (!t) return null;
    title = t.title;
    k = t.end;
    while (k < n && (text[k] === ' ' || text[k] === '\t')) k++;
    if (k < n && text[k] !== '\n') return null;
    if (k < n) k++;
    return { label: norm, href: cleanUrl(dest.dest), title, end: k };
  }
  if (jj < n && text[jj] === '\n') {
    // End of the destination line; a title may follow on the next line.
    // If that title does not parse cleanly, the definition still stands
    // without it (unlike a same-line title, which must be valid).
    let m = jj + 1;
    while (m < n && (text[m] === ' ' || text[m] === '\t')) m++;
    if (m < n && (text[m] === '"' || text[m] === "'" || text[m] === '(')) {
      const t = parseLinkTitle(text, m);
      if (t) {
        title = t.title;
        k = t.end;
        while (k < n && (text[k] === ' ' || text[k] === '\t')) k++;
        if (k >= n || text[k] === '\n') {
          if (k < n) k++;
          return { label: norm, href: cleanUrl(dest.dest), title, end: k };
        }
      }
    }
    return { label: norm, href: cleanUrl(dest.dest), title, end: jj + 1 };
  }
  if (jj >= n) return { label: norm, href: cleanUrl(dest.dest), title, end: jj };
  return null;
}

// Extract leading reference definitions from paragraph text. Returns remaining text.
function extractRefs(text, refs) {
  let i = 0;
  for (;;) {
    const r = parseRefDef(text, i, refs);
    if (!r) break;
    if (!refs.has(r.label)) refs.set(r.label, { href: r.href, title: r.title });
    i = r.end;
  }
  return text.slice(i);
}

function flushPara(paraLines, refs) {
  const text = extractRefs(paraLines.join('\n'), refs);
  if (!text.trim()) return null;
  return { t: 'para', text };
}

function atxHeading(rest) {
  if (rest[0] !== '#') return null;
  let i = 0;
  while (i < rest.length && rest[i] === '#') i++;
  if (i > 6) return null;
  if (i < rest.length && rest[i] !== ' ' && rest[i] !== '\t') return null;
  let content = rest.slice(i).replace(/^[ \t]+/, '').replace(/[ \t]+$/, '');
  if (/^#+$/.test(content)) content = '';
  else content = content.replace(/[ \t]+#+$/, '');
  return { level: i, text: content };
}

function fenceStart(rest) {
  if (rest[0] !== '`' && rest[0] !== '~') return null;
  const ch = rest[0];
  let i = 0;
  while (i < rest.length && rest[i] === ch) i++;
  if (i < 3) return null;
  const info = rest.slice(i);
  if (ch === '`' && info.includes('`')) return null;
  return { ch, len: i, info: info.trim() };
}

function fenceEnd(line, f) {
  const { indent, cs } = lineIndent(line);
  if (indent > 3) return false;
  const rest = line.slice(cs);
  if (!rest || rest[0] !== f.ch) return false;
  let i = 0;
  while (i < rest.length && rest[i] === f.ch) i++;
  if (i < f.len) return false;
  return /^[ \t]*$/.test(rest.slice(i));
}

function htmlBlockStart(rest, paraOpen) {
  const m = /^<([A-Za-z][A-Za-z0-9-]*)/.exec(rest) || /^<\/([A-Za-z][A-Za-z0-9-]*)/.exec(rest);
  const lower = rest.toLowerCase();
  for (const tag of ['script', 'pre', 'style', 'textarea']) {
    if (lower.startsWith('<' + tag)) {
      const after = rest.slice(1 + tag.length);
      if (after === '' || after[0] === ' ' || after[0] === '\t' || after[0] === '\n' || after[0] === '>' || after.startsWith('/>')) {
        return { type: 1, endRe: new RegExp('</' + tag, 'i') };
      }
    }
  }
  if (rest.startsWith('<!--')) return { type: 2, endStr: '-->' };
  if (rest.startsWith('<?')) return { type: 3, endStr: '?>' };
  if (/^<![A-Za-z]/.test(rest)) return { type: 4, endStr: '>' };
  if (rest.startsWith('<![CDATA[')) return { type: 5, endStr: ']]>' };
  if (m) {
    const tag = m[1].toLowerCase();
    const afterTag = rest.slice(m[0].length);
    const ok = afterTag === '' || afterTag[0] === ' ' || afterTag[0] === '\t' || afterTag[0] === '\n' || afterTag[0] === '>' || afterTag.startsWith('/>');
    if (ok && BLOCK_TAGS.has(tag)) return { type: 6, endBlank: true };
    if (ok && !paraOpen) {
      // type 7: complete open/close tag, alone on the line (only whitespace after)
      const full = /^<\/?[A-Za-z][A-Za-z0-9-]*(?:\s+[^<>]*)?\/?>[ \t]*$/.exec(rest);
      if (full) return { type: 7, endBlank: true };
    }
  }
  return null;
}

function isThematicBreak(rest) {
  const m = /^([*_-])([ \t]*\1){2,}[ \t]*$/.exec(rest);
  return !!m;
}

// Can this line start a block that interrupts a paragraph? (for lazy-continuation checks)
function isInterruptStart(rest, indent) {
  if (indent > 3) return false;
  if (atxHeading(rest)) return true;
  if (fenceStart(rest)) return true;
  if (isThematicBreak(rest)) return true;
  if (listMarker(rest)) return true;
  const hb = htmlBlockStart(rest, true);
  return !!hb && hb.type <= 6;
}

function listMarker(rest) {
  const b = /^([-+*])([ \t]+|$)/.exec(rest);
  if (b) return { bullet: b[1], ordered: false, start: 1, markerLen: 1, after: b[2] };
  const o = /^(\d{1,9})([.)])([ \t]+|$)/.exec(rest);
  if (o) return { bullet: null, ordered: true, start: parseInt(o[1], 10), markerLen: o[1].length + 1, after: o[3], delim: o[2] };
  return null;
}

// Split a table row line into cells (respects \| escapes).
function splitRow(line) {
  const cells = [];
  let cur = '', i = 0;
  const n = line.length;
  while (i < n) {
    const c = line[i];
    if (c === '\\' && i + 1 < n && line[i + 1] === '|') { cur += '|'; i += 2; continue; }
    if (c === '|') { cells.push(cur); cur = ''; i++; continue; }
    cur += c; i++;
  }
  cells.push(cur);
  return cells;
}
function parseDelimRow(line) {
  let cells = splitRow(line.trim());
  if (cells.length && cells[0].trim() === '') cells.shift();
  if (cells.length && cells[cells.length - 1].trim() === '') cells.pop();
  if (!cells.length) return null;
  const align = [];
  for (const cell of cells) {
    const c = cell.trim();
    const m = /^(:?)-+(:?)$/.exec(c);
    if (!m) return null;
    align.push(m[1] && m[2] ? 'center' : m[1] ? 'left' : m[2] ? 'right' : null);
  }
  return align;
}
function parseTableRow(line, ncols) {
  let cells = splitRow(line.trim());
  if (cells.length && cells[0].trim() === '') cells.shift();
  if (cells.length && cells[cells.length - 1].trim() === '') cells.pop();
  cells = cells.map(c => c.trim());
  while (cells.length < ncols) cells.push('');
  return cells.slice(0, ncols);
}

// Turn a paragraph (header + delimiter row + rows) into a table block, if it is one.
function postTables(blocks) {
  for (let b = 0; b < blocks.length; b++) {
    const blk = blocks[b];
    if (blk.t !== 'para') continue;
    const lines = blk.text.split('\n');
    if (lines.length < 2) continue;
    if (lineIndent(lines[1]).indent > 3) continue;
    const align = parseDelimRow(lines[1]);
    if (!align) continue;
    const head = parseTableRow(lines[0], align.length);
    if (head.length !== align.length) continue;
    const rows = [];
    for (let r = 2; r < lines.length; r++) rows.push(parseTableRow(lines[r], align.length));
    blocks[b] = { t: 'table', align, head, rows };
  }
  return blocks;
}

function parseQuote(lines, i, end, refs) {
  const qlines = [];
  let j = i;
  while (j < end) {
    const line = lines[j];
    if (isBlank(line)) { qlines.push(''); j++; continue; }
    const { indent, cs } = lineIndent(line);
    const rest = line.slice(cs);
    if (indent <= 3 && rest[0] === '>') {
      let after = rest.slice(1);
      if (after[0] === ' ') after = after.slice(1);
      qlines.push(after);
      j++;
      continue;
    }
    if (qlines.length && !isBlank(qlines[qlines.length - 1]) && !isInterruptStart(rest, indent)) {
      qlines.push(line);
      j++;
      continue;
    }
    break;
  }
  while (qlines.length && isBlank(qlines[qlines.length - 1])) qlines.pop();
  const blocks = parseBlocks(qlines, 0, qlines.length, refs);
  return { block: { t: 'quote', blocks }, next: j };
}

function parseBlocks(lines, start, end, refs, top) {
  const blocks = [];
  let para = null;
  const flush = () => {
    if (para) {
      const b = flushPara(para, refs);
      if (b) blocks.push(b);
      para = null;
    }
  };
  let i = start;
  while (i < end) {
    const line = lines[i];
    if (isBlank(line)) { flush(); i++; continue; }
    const { indent, cs } = lineIndent(line);
    const rest = line.slice(cs);
    // setext heading (but not if the paragraph is a table in progress)
    if (para && indent <= 3) {
      const isTable = para.length >= 2 && parseDelimRow(para[1]);
      if (!isTable && (/^=+[ \t]*$/.test(rest) || /^-+[ \t]*$/.test(rest))) {
        const text = extractRefs(para.join('\n'), refs);
        const t = text.trim();
        if (t) {
          blocks.push({ t: 'h', level: rest[0] === '=' ? 1 : 2, text: t });
          para = null; i++; continue;
        }
        // Paragraph was only reference definitions: no heading; the
        // setext line becomes ordinary content (fall through).
        para = null;
      }
    }
    if (indent <= 3) {
      const atx = atxHeading(rest);
      if (atx) { flush(); blocks.push({ t: 'h', level: atx.level, text: atx.text }); i++; continue; }
      const f = fenceStart(rest);
      if (f) {
        flush();
        const content = [];
        i++;
        while (i < end && !fenceEnd(lines[i], f)) { content.push(stripCols(lines[i], indent)); i++; }
        if (i < end) i++;
        const lang = f.info ? unescapeStr(f.info.split(/\s+/)[0]) : null;
        blocks.push({ t: 'code', lang, text: content.length ? content.join('\n') + '\n' : '' });
        continue;
      }
      const hb = htmlBlockStart(rest, !!para);
      if (hb) {
        flush();
        const content = [line];
        i++;
        let endedAtBlank = false;
        if (hb.endRe || hb.endStr) {
          // The first line itself may contain the end marker (type 1/2/3/4/5).
          let hit = hb.endRe ? hb.endRe.test(line) : line.includes(hb.endStr);
          while (!hit && i < end) {
            content.push(lines[i]);
            hit = hb.endRe ? hb.endRe.test(lines[i]) : lines[i].includes(hb.endStr);
            i++;
            if (hit) break;
          }
        } else {
          while (i < end && !isBlank(lines[i])) { content.push(lines[i]); i++; }
          endedAtBlank = i < end;
        }
        // Trailing newline: dropped when the block ends at a blank line, or
        // when it runs to the end of a sub-document (quote/list item).
        const nextBlank = i < end && isBlank(lines[i]);
        const trailing = (nextBlank || (!top && i >= end)) ? '' : '\n';
        blocks.push({ t: 'html', text: content.join('\n') + trailing });
        continue;
      }
      if (isThematicBreak(rest)) { flush(); blocks.push({ t: 'hr' }); i++; continue; }
      const lm = listMarker(rest);
      if (lm) {
        const afterText = rest.slice(lm.markerLen);
        const emptyItem = /^[ \t]*$/.test(afterText);
        const canInterrupt = !para || (lm.ordered ? (lm.start === 1 && !emptyItem) : !emptyItem);
        if (canInterrupt) {
          flush();
          const r = parseList(lines, i, end, refs);
          blocks.push(r.block);
          i = r.next;
          continue;
        }
      }
      if (rest[0] === '>') {
        flush();
        const r = parseQuote(lines, i, end, refs);
        blocks.push(r.block);
        i = r.next;
        continue;
      }
    }
    if (indent >= 4 && !para) {
      const content = [];
      while (i < end) {
        const l = lines[i];
        if (isBlank(l)) {
          let j = i + 1;
          while (j < end && isBlank(lines[j])) j++;
          if (j < end && lineIndent(lines[j]).indent >= 4) {
            while (i < j) { content.push(stripCols(lines[i], 4)); i++; }
            continue;
          }
          break;
        }
        if (lineIndent(l).indent < 4) break;
        content.push(stripCols(l, 4));
        i++;
      }
      while (content.length && content[content.length - 1] === '') content.pop();
      blocks.push({ t: 'code', lang: null, text: content.length ? content.join('\n') + '\n' : '' });
      continue;
    }
    if (!para) para = [];
    para.push(line);
    i++;
  }
  flush();
  return postTables(blocks);
}

function parseList(lines, i, end, refs) {
  const first = lines[i];
  const { indent: listIndent, cs } = lineIndent(first);
  const rest = first.slice(cs);
  const lm0 = listMarker(rest);
  const ordered = lm0.ordered;
  const bullet = lm0.bullet, delim = lm0.delim;
  // content indent (columns from line start)
  const markerCols = listIndent + lm0.markerLen;
  let sp = 0, k = lm0.markerLen;
  while (k < rest.length && (rest[k] === ' ' || rest[k] === '\t')) {
    if (rest[k] === ' ') sp++;
    else sp += 4 - ((markerCols + sp) % 4);
    k++;
  }
  const hasContent = k < rest.length;
  const contentIndent = hasContent ? (sp <= 4 ? markerCols + sp : markerCols + 1) : markerCols + 1;
  const firstContentCol = hasContent ? markerCols + sp : contentIndent;
  let curCC = contentIndent; // content indent of the current (last) item
  const items = [];
  let loose = false;
  let j = i;
  let cur = null; // {lines, checked, seenContent, blankAfter}
  const pushItem = () => {
    if (!cur) return;
    while (cur.lines.length && isBlank(cur.lines[cur.lines.length - 1])) cur.lines.pop();
    items.push(cur);
    cur = null;
  };
  const startItem = (line, markerLen, contentIndent, markerIndent) => {
    curCC = contentIndent;
    cur = { lines: [], checked: null, seenContent: false, blankAfter: false };
    const { cs } = lineIndent(line);
    const after = line.slice(cs + markerLen);
    const content = stripCols(after, contentIndent - markerLen, markerIndent + markerLen);
    if (content !== '') {
      const cb = /^\[( |x|X)\] (.*)$/.exec(content) || /^\[( |x|X)\]$/.exec(content);
      if (cb) {
        cur.checked = cb[1] !== ' ';
        cur.lines.push(cb[2] !== undefined ? cb[2] : '');
      } else {
        cur.lines.push(content);
      }
      cur.seenContent = true;
    }
  };
  startItem(first, lm0.markerLen, contentIndent, listIndent);
  j = i + 1;
  while (j < end) {
    const line = lines[j];
    if (isBlank(line)) {
      if (cur.seenContent) cur.blankAfter = true;
      cur.lines.push('');
      j++;
      continue;
    }
    const li = lineIndent(line);
    const r = line.slice(li.cs);
    // a thematic break at the list's own indent ends the list
    // (but a setext-like --- / === line is a lazy continuation)
    if (li.indent === listIndent && isThematicBreak(r) && !/^[-=]+[ \t]*$/.test(r)) break;
    // A new item joins this list if its marker is at most 3 spaces in and
    // indented less than the current item's content indent.
    const lm = li.indent <= 3 ? listMarker(r) : null;
    const sameList = lm && li.indent < curCC && (ordered ? (lm.ordered && lm.delim === delim) : (!lm.ordered && lm.bullet === bullet));
    if (sameList) {
      if (cur.blankAfter) loose = true;
      pushItem();
      const mc = li.indent + lm.markerLen;
      let s2 = 0, k2 = lm.markerLen;
      while (k2 < r.length && (r[k2] === ' ' || r[k2] === '\t')) {
        if (r[k2] === ' ') s2++;
        else s2 += 4 - ((mc + s2) % 4);
        k2++;
      }
      const hc = k2 < r.length;
      const cc = hc ? (s2 <= 4 ? mc + s2 : mc + 1) : mc + 1;
      startItem(line, lm.markerLen, cc, li.indent);
      j++;
      continue;
    }
    if (li.indent >= curCC) {
      if (cur.blankAfter) loose = true;
      cur.lines.push(stripCols(line, curCC));
      cur.seenContent = true;
      cur.blankAfter = false;
      j++;
      continue;
    }
    // lazy continuation: only if item has content and line is not a block start
    // (a pure === run is lazy text; a thematic break ends the list)
    if (cur.seenContent && !cur.blankAfter) {
      const eqLike = /^=+[ \t]*$/.test(r);
      if (eqLike || !isInterruptStart(r, li.indent)) {
        cur.lines.push(line);
        j++;
        continue;
      }
    }
    break;
  }
  pushItem();
  const outItems = items.map(it => {
    const blocks = parseBlocks(it.lines, 0, it.lines.length, refs);
    let checked = it.checked;
    if (checked !== null && (!blocks.length || blocks[0].t !== 'para')) checked = null;
    return { blocks, checked };
  });
  return { block: { t: 'list', ordered, start: lm0.start, items: outItems, tight: !loose }, next: j };
}

function renderBlocks(blocks, refs, tight) {
  const out = [];
  for (const b of blocks) {
    switch (b.t) {
      case 'para':
        if (tight) out.push(renderInline(b.text, refs));
        else out.push('<p>' + renderInline(b.text, refs) + '</p>\n');
        break;
      case 'h':
        out.push('<h' + b.level + '>' + renderInline(b.text, refs) + '</h' + b.level + '>\n');
        break;
      case 'code':
        if (b.lang) out.push('<pre><code class="language-' + escNoEnc(b.lang) + '">' + esc(b.text) + '</code></pre>\n');
        else out.push('<pre><code>' + esc(b.text) + '</code></pre>\n');
        break;
      case 'html': out.push(b.text); break;
      case 'hr': out.push('<hr>\n'); break;
      case 'quote':
        out.push('<blockquote>\n' + renderBlocks(b.blocks, refs, false) + '</blockquote>\n');
        break;
      case 'list': {
        out.push(b.ordered ? (b.start !== 1 ? '<ol start="' + b.start + '">\n' : '<ol>\n') : '<ul>\n');
        for (const it of b.items) out.push(renderItem(it, b.tight, refs));
        out.push(b.ordered ? '</ol>\n' : '</ul>\n');
        break;
      }
      case 'table': {
        out.push('<table>\n<thead>\n<tr>\n');
        for (let c = 0; c < b.head.length; c++) {
          const a = b.align[c];
          out.push('<th' + (a ? ' align="' + a + '"' : '') + '>' + renderInline(b.head[c], refs) + '</th>\n');
        }
        out.push('</tr>\n</thead>\n<tbody>');
        for (const row of b.rows) {
          out.push('<tr>\n');
          for (let c = 0; c < row.length; c++) {
            const a = b.align[c];
            out.push('<td' + (a ? ' align="' + a + '"' : '') + '>' + renderInline(row[c], refs) + '</td>\n');
          }
          out.push('</tr>\n');
        }
        out.push('</tbody></table>\n');
        break;
      }
    }
  }
  return out.join('');
}

function renderItem(item, tight, refs) {
  const blocks = item.blocks;
  if (!blocks.length) return '<li></li>\n';
  const cb = item.checked === null ? '' :
    (item.checked ? '<input checked="" disabled="" type="checkbox"> ' : '<input disabled="" type="checkbox"> ');
  let out = '<li>';
  if (blocks[0].t === 'para') {
    if (tight) out += cb + renderInline(blocks[0].text, refs);
    else out += '<p>' + cb + renderInline(blocks[0].text, refs) + '</p>\n';
    out += renderBlocks(blocks.slice(1), refs, tight);
  } else {
    out += renderBlocks(blocks, refs, tight);
  }
  return out + '</li>\n';
}

export function parse(md) {
  const refs = new Map();
  const text = md.replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  const blocks = parseBlocks(lines, 0, lines.length, refs, true);
  return renderBlocks(blocks, refs, false);
}
