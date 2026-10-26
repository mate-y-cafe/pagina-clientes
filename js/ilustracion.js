// Ilustraciones de Mate & Café. Todo se dibuja en SVG y cambia con las opciones de armador.json
// (mate, bombilla, yerba y extras). Incluye también las escenas de la portada y del kit.

// ---------- Datos ----------
// Forma del cuerpo, ancho de la boca (rx) y colores (claro → oscuro) de cada estilo de mate.
const ESTILOS = {
  calabaza: { cuerpo: "M118 130 C108 178 124 238 180 248 C236 238 252 178 242 130 Z", rx: 62, colores: ["#e6b26b", "#c2823a", "#8a5222", "#52300f"], virola: true },
  algarrobo: { cuerpo: "M120 130 C110 168 120 212 146 232 L150 243 Q180 252 210 243 L214 232 C240 212 250 168 240 130 Z", rx: 60, colores: ["#c99560", "#a06b3d", "#6f4524", "#44280f"], virola: true },
  ceramica: { cuerpo: "M112 130 C106 202 140 244 180 246 C220 244 254 202 248 130 Z", rx: 68, colores: ["#86b896", "#4f8a66", "#2f6046", "#1c3d2c"], virola: false },
  torpedo: { cuerpo: "M128 130 C120 186 140 240 180 252 C220 240 240 186 232 130 Z", rx: 52, colores: ["#e07d55", "#b24f2e", "#80331b", "#4f200f"], virola: true },
};

// Qué estilo dibuja cada opción del armador.
export const ESTILO_DE_MATE = {
  "mate-algarrobo": "algarrobo",
  "mate-torpedo-calabaza": "torpedo",
};

const YERBA = {
  "yerba-organica-suave": { base: "#8ea848", tonos: ["#b9cd7a", "#a4bc5e", "#7f9843", "#cddc95"], palos: false },
  "yerba-serranas": { base: "#566f2a", tonos: ["#7f9e40", "#4a6322", "#6c8b35", "#3a5019"], palos: true },
};

const BOMBILLA = {
  "bombilla-acero": { tubo: ["#f6f8f9", "#aeb6bc", "#6a727a"], boquilla: ["#f6f8f9", "#b9c0c5", "#7b838a"] },
  "bombilla-alpaca": { tubo: ["#f6f1e2", "#cbc3a6", "#8a8266"], boquilla: ["#fbe9a8", "#d9b45a", "#8a6a22"] },
};

// ---------- Utilidades ----------
// Números pseudoaleatorios con semilla: la yerba se ve igual en cada dibujo.
function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;

// Degradado lineal. paradas: [[offset, color, opacidad?], ...]
function grad(id, paradas, vertical = false) {
  const p = paradas.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op != null ? ` stop-opacity="${op}"` : ""}/>`).join("");
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${p}</linearGradient>`;
}

function degradados(p, estilo, bomb) {
  const [c0, c1, c2, c3] = estilo.colores;
  return grad(`${p}cuerpo`, [[0, c1], [0.22, c0], [0.5, c1], [0.82, c2], [1, c3]]) +
    grad(`${p}sombraLado`, [[0, "#000", 0], [0.5, "#000", 0], [1, "#000", 0.38]]) +
    grad(`${p}sombraPie`, [[0, "#000", 0], [0.6, "#000", 0], [1, "#000", 0.3]], true) +
    grad(`${p}met`, [[0, "#80878e"], [0.18, "#f4f6f7"], [0.45, "#c4cacf"], [0.75, "#7d848b"], [1, "#b3babf"]]) +
    grad(`${p}boc`, [[0, "#3a2410"], [1, "#1c0f06"]], true) +
    grad(`${p}tubo`, [[0, bomb.tubo[2]], [0.35, bomb.tubo[0]], [0.7, bomb.tubo[1]], [1, bomb.tubo[2]]]) +
    grad(`${p}pico`, [[0, bomb.boquilla[2]], [0.4, bomb.boquilla[0]], [1, bomb.boquilla[1]]]) +
    grad(`${p}termo`, [[0, "#2a4034"], [0.3, "#6a8a78"], [0.65, "#3e5c4b"], [1, "#22362b"]]) +
    grad(`${p}inox`, [[0, "#737b81"], [0.35, "#f1f3f4"], [0.7, "#a4acb2"], [1, "#6c747a"]]) +
    grad(`${p}porc`, [[0, "#d9d4c8"], [0.4, "#ffffff"], [1, "#cfc9bb"]]) +
    grad(`${p}hoja`, [[0, "#3f6b34"], [1, "#6f9a4e"]]) +
    grad(`${p}bolsa`, [[0, "#2c5a33"], [0.4, "#4f8a45"], [1, "#2a5230"]]) +
    grad(`${p}fondo`, [[0, "#eaf0e0"], [0.55, "#d9e4cc"], [1, "#c6d5b8"]], true) +
    grad(`${p}mesa`, [[0, "#c1915f"], [1, "#8d6039"]], true) +
    `<radialGradient id="${p}luz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<filter id="${p}b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>` +
    `<filter id="${p}b6" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>` +
    `<filter id="${p}b14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>`;
}

// ---------- Piezas (coordenadas propias de cada una) ----------

// Mate: coordenadas nativas (boca en y=130, base en y≈248, centro x=180).
function grupoMate(p, clave, yerbaKey, bombKey) {
  const e = ESTILOS[clave] ?? ESTILOS.algarrobo;
  const y = YERBA[yerbaKey] ?? YERBA["yerba-organica-suave"];
  const L = 180 - e.rx, R = 180 + e.rx;
  let s = `<ellipse cx="180" cy="249" rx="${e.rx + 20}" ry="7" fill="#3d2a20" opacity=".35" filter="url(#${p}b6)"/>` +
    `<path d="${e.cuerpo}" fill="url(#${p}cuerpo)"/>` +
    `<g clip-path="url(#${p}cp)">` +
    `<rect x="90" y="120" width="180" height="140" fill="url(#${p}sombraLado)"/><rect x="90" y="120" width="180" height="140" fill="url(#${p}sombraPie)"/>`;

  if (clave === "algarrobo") {
    s += `<g fill="none" stroke="#3a2210" stroke-linecap="round" opacity=".42">` +
      `<path d="M126 150 Q150 178 136 236" stroke-width="1.4"/><path d="M142 146 Q168 190 156 248" stroke-width="1"/><path d="M160 150 Q184 200 172 252" stroke-width="1.6"/>` +
      `<path d="M182 150 Q200 196 190 252" stroke-width="1"/><path d="M204 150 Q222 194 212 248" stroke-width="1.5"/><path d="M224 152 Q238 190 230 240" stroke-width="1"/></g>` +
      `<ellipse cx="170" cy="222" rx="7" ry="4" fill="none" stroke="#3a2210" stroke-width="1.2" opacity=".4"/>` +
      `<rect x="110" y="226" width="140" height="8" fill="#3d2410" opacity=".35"/>` +
      `<rect x="110" y="226" width="140" height="2" fill="#e8c9a0" opacity=".25"/>`;
  } else if (clave === "calabaza") {
    s += `<g fill="#4a2a0e" opacity=".32"><circle cx="146" cy="196" r="2.2"/><circle cx="206" cy="180" r="2.6"/><circle cx="170" cy="226" r="2"/><circle cx="224" cy="214" r="1.8"/><circle cx="136" cy="160" r="1.8"/><circle cx="190" cy="240" r="2"/><circle cx="160" cy="172" r="1.4"/><circle cx="214" cy="236" r="1.6"/></g>` +
      `<path d="M130 170 Q150 218 182 244" fill="none" stroke="#5a3210" stroke-width="1.2" opacity=".25"/><path d="M226 172 Q214 216 196 242" fill="none" stroke="#5a3210" stroke-width="1.2" opacity=".25"/>`;
  } else if (clave === "ceramica") {
    s += `<path d="M104 128 L256 128 L256 150 Q240 156 226 150 Q214 160 198 152 Q184 162 170 152 Q152 160 140 150 Q122 158 104 150 Z" fill="#1f4631" opacity=".55"/>` +
      `<path d="M128 196 Q150 226 180 232" fill="none" stroke="#c9ead6" stroke-width="1.4" opacity=".28"/>`;
  } else if (clave === "torpedo") {
    s += `<path d="M100 172 Q180 192 260 172 V188 Q180 208 100 188 Z" fill="#f3e5cb" opacity=".95"/>` +
      `<path d="M100 214 Q180 234 260 214 V222 Q180 242 100 222 Z" fill="#f3e5cb" opacity=".95"/>` +
      `<g fill="#7a2c16"><path d="M148 194 l7 5.5 l-7 5.5 l-7 -5.5 Z"/><path d="M180 198 l7 5.5 l-7 5.5 l-7 -5.5 Z"/><path d="M212 194 l7 5.5 l-7 5.5 l-7 -5.5 Z"/></g>` +
      `<g fill="#2f5d2e" opacity=".9"><circle cx="164" cy="199" r="2"/><circle cx="196" cy="203" r="2"/><circle cx="132" cy="194" r="2"/><circle cx="228" cy="194" r="2"/></g>`;
  }
  s += `</g>`;

  // Brillos
  if (clave === "ceramica") {
    s += `<path d="M126 150 C120 186 128 214 146 232" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".38" filter="url(#${p}b2)"/>` +
      `<ellipse cx="134" cy="168" rx="3.2" ry="12" fill="#fff" opacity=".7" transform="rotate(8 134 168)"/>`;
  } else if (clave === "torpedo") {
    s += `<path d="M138 150 C134 190 144 224 160 240" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".3" filter="url(#${p}b2)"/>`;
  } else {
    s += `<path d="M130 158 C126 190 134 218 150 234" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".3" filter="url(#${p}b2)"/>`;
  }

  // Virola de metal en la boca
  if (e.virola) {
    const fina = clave === "torpedo";
    const h = fina ? 16 : 24;
    s += `<path d="M${L} 130 L${L + 3} ${130 + h} Q180 ${130 + h + 16} ${R - 3} ${130 + h} L${R} 130 Q180 148 ${L} 130 Z" fill="url(#${p}met)"/>` +
      `<path d="M${L + 3} ${130 + h} Q180 ${130 + h + 16} ${R - 3} ${130 + h}" fill="none" stroke="#4d545a" stroke-width="1.6" opacity=".55"/>` +
      `<path d="M${L + 8} ${130 + h / 2} Q180 ${130 + h / 2 + 18} ${R - 8} ${130 + h / 2}" fill="none" stroke="#fff" stroke-width="1" opacity=".45"/>`;
  }

  // Boca, yerba y bombilla
  const borde = clave === "ceramica" ? "#b6dcc4" : "#eef1f3";
  s += `<ellipse cx="180" cy="130" rx="${e.rx}" ry="15" fill="url(#${p}boc)" stroke="${borde}" stroke-width="3.4"/>`;

  const A = e.rx - 3;
  s += `<path d="M${L + 3} 130 Q${L + 28} 96 180 99 Q${R - 28} 96 ${R - 3} 130 Q180 148 ${L + 3} 130 Z" fill="${y.base}"/>`;
  const r = azar(clave.length * 97 + yerbaKey.length * 31);
  const top = (x) => 99 + 31 * Math.pow((x - 180) / A, 2);
  const bot = (x) => 130 + 18 * (1 - Math.pow((x - 180) / A, 2));
  for (let i = 0; i < 90; i += 1) {
    const x = 180 + (r() * 2 - 1) * (A - 4);
    const yy = top(x) + r() * Math.max(2, bot(x) - top(x));
    const tono = y.tonos[Math.floor(r() * y.tonos.length)];
    s += `<ellipse cx="${f(x)}" cy="${f(yy)}" rx="${f(1 + r() * 1.7)}" ry="${f(0.5 + r() * 0.8)}" fill="${tono}" opacity="${f(0.55 + r() * 0.4)}" transform="rotate(${Math.floor(r() * 180)} ${f(x)} ${f(yy)})"/>`;
  }
  if (y.palos) {
    for (let i = 0; i < 9; i += 1) {
      const x = 180 + (r() * 2 - 1) * (A - 10);
      const yy = top(x) + 3 + r() * 10;
      const a = r() * 3;
      s += `<path d="M${f(x)} ${f(yy)} l${f(Math.cos(a) * 5)} ${f(Math.sin(a) * 2.4)}" stroke="#d8c38a" stroke-width="1.1" stroke-linecap="round" opacity=".85"/>`;
    }
    [[158, 112], [200, 108], [220, 120], [172, 124], [208, 126], [146, 122]].filter((pt) => pt[0] > L + 8 && pt[0] < R - 8).forEach((pt, i) => {
      s += `<circle cx="${pt[0]}" cy="${pt[1]}" r="1.9" fill="${["#d98a45", "#ecd98a", "#f4ecdc"][i % 3]}"/>`;
    });
  }
  // Zona húmeda junto a la bombilla y brillo de la yerba
  s += `<ellipse cx="192" cy="125" rx="15" ry="4.2" fill="#2a3512" opacity=".5"/>` +
    `<ellipse cx="160" cy="108" rx="16" ry="4" fill="#fff" opacity=".14" filter="url(#${p}b2)"/>`;

  // Bombilla
  s += `<path d="M190 127 L233 57" stroke="#1d1209" stroke-width="7.4" stroke-linecap="round" opacity=".28" transform="translate(2 2)" filter="url(#${p}b2)"/>` +
    `<path d="M190 127 L233 57" stroke="url(#${p}tubo)" stroke-width="5.6" stroke-linecap="round"/>` +
    `<path d="M188.4 124 L231 54.5" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>` +
    `<path d="M193 128.4 L235.6 58.6" stroke="#000" stroke-width="1" stroke-linecap="round" opacity=".18"/>` +
    `<polygon points="229.4,55.5 236.4,59.5 247.4,43.6 237.4,37.4" fill="url(#${p}pico)"/>` +
    `<path d="M237.4 37.4 L247.4 43.6" stroke="#fff" stroke-width="1.2" opacity=".6"/>` +
    `<ellipse cx="232.2" cy="57.2" rx="6.6" ry="2.6" transform="rotate(32 232.2 57.2)" fill="url(#${p}pico)" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`;
  return s;
}

// Termo: origen en el centro de la base.
function grupoTermo(p) {
  return `<ellipse cx="0" cy="0" rx="32" ry="5.5" fill="#3d2a20" opacity=".3" filter="url(#${p}b6)"/>` +
    `<rect x="-22" y="-120" width="44" height="120" rx="9" fill="url(#${p}termo)"/>` +
    `<rect x="-22" y="-62" width="44" height="7" fill="#fff" opacity=".2"/>` +
    `<rect x="-22" y="-14" width="44" height="14" rx="6" fill="#16241c" opacity=".55"/>` +
    `<rect x="-16" y="-112" width="4.5" height="96" rx="2.2" fill="#fff" opacity=".34" filter="url(#${p}b2)"/>` +
    `<rect x="-20" y="-136" width="40" height="20" rx="5" fill="url(#${p}inox)"/>` +
    `<path d="M-20 -128 H20 M-20 -122 H20" stroke="#5a6269" stroke-width=".8" opacity=".6"/>` +
    `<path d="M-6 -136 q6 -6 12 0" stroke="#5a6269" stroke-width="1" fill="none" opacity=".6"/>`;
}

// Taza de café: origen en el centro de la base del plato.
function grupoTaza(p) {
  return `<ellipse cx="0" cy="2" rx="52" ry="8" fill="#3d2a20" opacity=".3" filter="url(#${p}b6)"/>` +
    `<ellipse cx="0" cy="-4" rx="48" ry="9.5" fill="url(#${p}porc)"/><ellipse cx="0" cy="-6" rx="33" ry="5.4" fill="#e9e4d8"/>` +
    `<path d="M26 -46 Q50 -48 46 -28 Q43 -14 24 -18" fill="none" stroke="#d6d0c3" stroke-width="6.5" stroke-linecap="round"/>` +
    `<path d="M26 -46 Q50 -48 46 -28 Q43 -14 24 -18" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>` +
    `<path d="M-30 -50 L-25 -16 Q-22 -5 0 -5 Q22 -5 25 -16 L30 -50 Z" fill="url(#${p}porc)"/>` +
    `<ellipse cx="0" cy="-50" rx="30" ry="7.6" fill="#f7f4ec" stroke="#d3cdbf" stroke-width="1.2"/>` +
    `<ellipse cx="0" cy="-50" rx="25" ry="5.6" fill="#4b2a16"/>` +
    `<ellipse cx="0" cy="-50.4" rx="17" ry="3.3" fill="#8a5a36" opacity=".8"/>` +
    `<path d="M-6 -50.5 q3 -2.8 6 0 q3 -2.8 6 0 q-6 5 -12 0 Z" fill="#f1dcc0" opacity=".85"/>` +
    `<path d="M-22 -44 L-19 -18" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>` +
    `<g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="3" opacity=".7"><path d="M-8 -62 q-7 -10 0 -19 q7 -9 0 -19"/><path d="M8 -64 q-6 -9 0 -17 q6 -8 0 -16" opacity=".7"/></g>`;
}

// Hoja de yerba mate: origen en la base de la hoja.
function grupoHoja(p, x, yy, rot, esc) {
  return `<g transform="translate(${x} ${yy}) rotate(${rot}) scale(${esc})">` +
    `<path d="M0 0 C16 -20 52 -22 78 0 C52 22 16 20 0 0 Z" fill="url(#${p}hoja)"/>` +
    `<path d="M0 0 L74 0" stroke="#d6e6bf" stroke-width="1.6" opacity=".7"/>` +
    `<path d="M20 0 L36 -10 M34 0 L52 -11 M48 0 L62 -8 M20 0 L36 10 M34 0 L52 11 M48 0 L62 8" stroke="#d6e6bf" stroke-width="1" opacity=".45" fill="none"/></g>`;
}

// Bolsa de yerba: origen en el centro de la base.
function grupoBolsa(p) {
  return `<ellipse cx="0" cy="0" rx="42" ry="6" fill="#3d2a20" opacity=".3" filter="url(#${p}b6)"/>` +
    `<path d="M-36 0 L-38 -92 L38 -92 L36 0 Z" fill="url(#${p}bolsa)"/>` +
    `<path d="M-38 -92 L38 -92 L36 -104 L-36 -104 Z" fill="#244a2a"/>` +
    `<path d="M-36 -98 H36" stroke="#6faa63" stroke-width="1" opacity=".6" stroke-dasharray="3 3"/>` +
    `<rect x="-26" y="-76" width="52" height="46" rx="5" fill="#f7f0df"/>` +
    `<path d="M0 -70 c10 -2 14 6 10 12 c-6 -2 -12 -4 -10 -12 Z" fill="#4f8a45"/>` +
    `<text x="0" y="-45" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="12" fill="#2f5d2e">YERBA</text>` +
    `<text x="0" y="-35" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="5.2" fill="#6a4a30" letter-spacing=".8">MATE &amp; CAFÉ</text>` +
    `<rect x="-30" y="-88" width="6" height="84" fill="#fff" opacity=".18"/>`;
}

// Mesa de madera y pared de fondo (se extienden más allá del cuadro para llenar cualquier recorte).
function fondoEscena(p, y0, ancho0, ancho1, alto1) {
  let s = `<rect x="${ancho0}" y="-200" width="${ancho1 - ancho0}" height="${alto1 + 200}" fill="url(#${p}fondo)"/>` +
    `<circle cx="${f(ancho0 + (ancho1 - ancho0) * 0.82)}" cy="${f(y0 * 0.3)}" r="${f(y0 * 0.45)}" fill="url(#${p}luz)" opacity=".7"/>` +
    `<rect x="${ancho0}" y="${y0}" width="${ancho1 - ancho0}" height="${alto1 - y0 + 60}" fill="url(#${p}mesa)"/>` +
    `<rect x="${ancho0}" y="${y0}" width="${ancho1 - ancho0}" height="2.4" fill="#f0d2a8" opacity=".55"/>` +
    `<g fill="none" stroke="#5b3a1e" stroke-width="1" opacity=".18">`;
  for (let i = 1; i <= 5; i += 1) {
    const y = y0 + i * ((alto1 - y0) / 6);
    s += `<path d="M${ancho0} ${f(y)} Q${f((ancho0 + ancho1) / 2)} ${f(y + 5 * (i % 2 ? 1 : -1))} ${ancho1} ${f(y)}"/>`;
  }
  return s + `</g>`;
}

// ---------- Dibujos ----------

// Mate armado. sel: { mate, bombilla, yerba, extras: [] } con ids de armador.json.
// opciones.id evita choques de ids cuando hay varias ilustraciones en la página; opciones.mini recorta solo el mate.
export function dibujarMate(sel, opciones = {}) {
  const p = opciones.id ?? "m";
  const clave = ESTILO_DE_MATE[sel.mate] ?? sel.mate;
  const estilo = ESTILOS[clave] ?? ESTILOS.algarrobo;
  const bombKey = sel.bombilla in BOMBILLA ? sel.bombilla : "bombilla-acero";
  const yerbaKey = sel.yerba in YERBA ? sel.yerba : "yerba-organica-suave";
  const extras = sel.extras ?? [];
  const vb = opciones.mini ? "92 28 176 234" : "0 0 360 280";

  let svg = `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${degradados(p, estilo, BOMBILLA[bombKey])}` +
    `<clipPath id="${p}cp"><path d="${estilo.cuerpo}"/></clipPath></defs>` +
    fondoEscena(p, 246, -300, 660, 280);
  if (extras.includes("acc-termo")) svg += `<g transform="translate(306 248)">${grupoTermo(p)}</g>`;
  svg += grupoMate(p, clave, yerbaKey, bombKey) + `</svg>`;
  return svg;
}

// Portada: mate con taza de café, termo y hojas de yerba.
export function dibujarHero() {
  const p = "h";
  const estilo = ESTILOS.algarrobo;
  return `<svg viewBox="0 0 480 440" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${degradados(p, estilo, BOMBILLA["bombilla-alpaca"])}` +
    `<clipPath id="${p}cp"><path d="${estilo.cuerpo}"/></clipPath></defs>` +
    fondoEscena(p, 338, -200, 700, 440) +
    `<circle cx="392" cy="96" r="120" fill="#fff" opacity=".28" filter="url(#${p}b14)"/>` +
    grupoHoja(p, -10, 70, 24, 1.6) + grupoHoja(p, -20, 150, -8, 1.3) + grupoHoja(p, 500, 40, 160, 1.5) + grupoHoja(p, 500, 130, 198, 1.2) +
    `<g transform="translate(396 352)">${grupoTermo(p)}</g>` +
    `<g transform="translate(96 356) scale(1.12)">${grupoTaza(p)}</g>` +
    `<g fill="#3a2214"><ellipse cx="170" cy="384" rx="6" ry="3.6" transform="rotate(-20 170 384)"/><ellipse cx="184" cy="396" rx="6" ry="3.6" transform="rotate(30 184 396)"/><ellipse cx="338" cy="392" rx="6" ry="3.6" transform="rotate(10 338 392)"/></g>` +
    `<g stroke="#e9cfa8" stroke-width="1" opacity=".7"><path d="M164 384 q6 -1 12 0" transform="rotate(-20 170 384)"/><path d="M178 396 q6 -1 12 0" transform="rotate(30 184 396)"/><path d="M332 392 q6 -1 12 0" transform="rotate(10 338 392)"/></g>` +
    `<g transform="translate(244 356) scale(1.34) translate(-180 -248)">${grupoMate(p, "algarrobo", "yerba-serranas", "bombilla-alpaca")}</g></svg>`;
}

// Cuatro piezas del kit en orden: mate, yerba, bombilla y termo.
export function dibujarKit() {
  const p = "k";
  const estilo = ESTILOS.calabaza;
  const insignia = (x, n) => `<circle cx="${x}" cy="70" r="14" fill="#2f5d2e"/><text x="${x}" y="75" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="900" font-size="14" fill="#fff">${n}</text>`;
  return `<svg viewBox="0 0 1000 340" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${degradados(p, estilo, BOMBILLA["bombilla-alpaca"])}` +
    `<clipPath id="${p}cp"><path d="${estilo.cuerpo}"/></clipPath></defs>` +
    fondoEscena(p, 262, -300, 1300, 340) +
    grupoHoja(p, 60, 150, -14, 1.5) + grupoHoja(p, 900, 70, 196, 1.4) +
    insignia(250, "01") + insignia(410, "02") + insignia(540, "03") + insignia(730, "04") +
    `<g transform="translate(250 288) scale(.9) translate(-180 -248)">${grupoMate(p, "calabaza", "yerba-organica-suave", "bombilla-alpaca")}</g>` +
    `<g transform="translate(410 292) scale(1.05)">${grupoBolsa(p)}</g>` +
    // Bombilla de alpaca apoyada en la mesa
    `<g transform="translate(540 296) rotate(-8)"><ellipse cx="0" cy="8" rx="64" ry="4" fill="#3d2a20" opacity=".3" filter="url(#${p}b6)"/>` +
    `<path d="M-62 0 L50 0" stroke="url(#${p}tubo)" stroke-width="6" stroke-linecap="round"/><path d="M-60 -1.6 L48 -1.6" stroke="#fff" stroke-width="1.3" opacity=".7" stroke-linecap="round"/>` +
    `<polygon points="48,-3.6 48,3.6 70,6 70,-6" fill="url(#${p}pico)"/><ellipse cx="-62" cy="0" rx="5" ry="6.4" fill="url(#${p}tubo)"/></g>` +
    `<g transform="translate(730 294) scale(1.02)">${grupoTermo(p)}</g></svg>`;
}
