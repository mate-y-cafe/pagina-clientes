// Personalizador "Diseñá tu mate" con vista 3D. Es el código de la rama personalizador-mate-3d de dise-atumate
// (index.html), pasado a módulo: mismo catálogo, mismo dibujo y misma vista 3D (Three.js), sin accesorios.
// Si Three.js no carga o el navegador no tiene WebGL, se muestra el dibujo SVG.
import { CONFIG } from "./config.js";

const THREE = window.THREE;
const fmt = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  // ---------- Diseñá tu mate ----------
  // Catálogo del personalizador. "rec" marca lo recomendado para cada uso.
  // Precios de referencia: revisar antes de publicar.
  const USOS = [
    { id: 'diario', nombre: 'Para mi uso diario', desc: 'Lo cebo todos los días: prioriza limpieza, durabilidad y comodidad.' },
    { id: 'recuerdo', nombre: 'Para regalar o de recuerdo', desc: 'Prioriza el grabado, la presentación y las piezas de colección.' },
  ];

  const DISENO = {
    mate: [
      { id: 'calabaza',  nombre: 'Calabaza imperial',       desc: 'Curada a mano. El sabor más clásico y redondo.', cuidado: 'Necesita curado antes del primer uso. Lavar con agua tibia, sin detergente fuerte, y dejar secar.', rec: ['diario'], precio: 9800, color: '#3B2A1E' },
      { id: 'algarrobo', nombre: 'Camionero de algarrobo',  desc: 'Madera dura argentina, boca ancha y muy duradero.', cuidado: 'Madera: no dejar con agua ni lavar en lavavajillas. Secar al aire.', rec: ['recuerdo'], precio: 18500, color: '#6B3A22' },
      { id: 'torpedo',   nombre: 'Torpedo de acero',        desc: 'Cero curado, cero mantenimiento. Ideal para la oficina.', cuidado: 'Acero inoxidable: se lava con agua y esponja, no necesita curado.', rec: ['diario'], precio: 14700, color: '#B8BEC2' },
      { id: 'ceramica',  nombre: 'Cerámica esmaltada',      desc: 'Neutro en sabor y fácil de lavar. Colores de autor.', cuidado: 'Esmalte pintado a mano: lavar a mano y evitar golpes en el borde.', rec: ['recuerdo'], precio: 12300, color: '#2E6B6A' },
    ],
    yerba: [
      { id: 'suave',    nombre: 'Serrana suave',           desc: 'Barbacuá liviano, poco polvo. Para tardes largas.', perfil: 'Liviana, para el día a día', rec: ['diario'], precio: 4200, color: '#8BA870' },
      { id: 'ahumada',  nombre: 'Barbacuá ahumada',        desc: 'Secado a leña, cuerpo intenso y final largo.', perfil: 'Intensa, para quien ya toma mate', rec: [], precio: 4200, color: '#3F4D2B' },
      { id: 'citrica',  nombre: 'Cítrica del litoral',     desc: 'Con peperina y cáscara de naranja. Fresca.', perfil: 'Fresca y aromática', rec: ['recuerdo'], precio: 4500, color: '#8FA64F' },
      { id: 'guarana',  nombre: 'Despertar con guaraná',   desc: 'Más energía, ideal para arrancar el día.', perfil: 'Con energía para la mañana', rec: ['diario'], precio: 4100, color: '#5E6F3F' },
    ],
    bombilla: [
      { id: 'alpaca',     nombre: 'Alpaca pico de loro',   desc: 'La clásica. Filtro de resorte, fácil de limpiar.', rec: ['diario'], precio: 7300, color: '#B9BEC1' },
      { id: 'desarmable', nombre: 'Acero desarmable',      desc: 'Se abre en dos: la más higiénica del mostrador.', rec: ['diario'], precio: 5500, color: '#8A8F92' },
      { id: 'bambu',      nombre: 'Bambú artesanal',       desc: 'No transmite calor. Sabor suave y muy liviana.', rec: [], precio: 4800, color: '#D6C29B' },
      { id: 'cincelada',  nombre: 'Alpaca cincelada',      desc: 'Trabajada a mano, pieza de colección.', rec: ['recuerdo'], precio: 11200, color: '#D9C48A' },
    ],
  };

  const diseno = { uso: 'diario', mate: 'calabaza', yerba: 'suave', bombilla: 'alpaca' };
  const buscarItem = (grupo, id) => DISENO[grupo].find(it => it.id === id);

  const esRecomendado = (it, uso) => (it.rec || []).includes(uso);

  function opcionHTML(grupo, it, seleccionado) {
    const badge = esRecomendado(it, diseno.uso) ? '<span class="badge-rec">Recomendado</span>' : '';
    return `
      <button type="button" class="opt ${seleccionado ? 'is-selected' : ''}" aria-pressed="${seleccionado}" data-grupo="${grupo}" data-id="${it.id}">
        ${it.color ? `<span class="swatch" style="background:${it.color}"></span>` : ''}
        <span class="opt-texto">
          ${badge}
          <span class="opt-nombre">${it.nombre}</span>
          <span class="opt-desc">${it.desc}</span>
          ${it.perfil ? `<span class="opt-perfil">${it.perfil}</span>` : ''}
          ${it.precio ? `<span class="opt-precio">${fmt(it.precio)}</span>` : ''}
        </span>
        <span class="check">✓</span>
      </button>`;
  }

  function elegirDiseno(grupo, id) {
    diseno[grupo] = id;
    renderDiseno();
  }

  // Los recomendados para el uso elegido aparecen primero
  const ordenar = (lista, uso) => [...lista].sort((a, b) => esRecomendado(b, uso) - esRecomendado(a, uso));

  function renderDiseno() {
    document.getElementById('opts-uso').innerHTML =
      USOS.map(u => opcionHTML('uso', u, diseno.uso === u.id)).join('');
    ['mate', 'yerba', 'bombilla'].forEach(grupo => {
      document.getElementById(`opts-${grupo}`).innerHTML =
        ordenar(DISENO[grupo], diseno.uso).map(it => opcionHTML(grupo, it, diseno[grupo] === it.id)).join('');
    });
    // Textos que cambian según el uso
    const recuerdo = diseno.uso === 'recuerdo';
    document.getElementById('lbl-grabado-extra').textContent =
      recuerdo ? '(nombre, fecha o frase, hasta 14 caracteres)' : '(opcional, hasta 14 caracteres)';
    document.getElementById('f-grabado').placeholder = recuerdo ? 'Ej: Para Ana · 2026' : 'Ej: Ana, Mate de Lucas';
    document.getElementById('lbl-nota').textContent = recuerdo ? 'Mensaje para la tarjeta' : 'Nota para quien arma el mate';
    document.getElementById('f-nota').placeholder = recuerdo ? 'Ej: Feliz cumpleaños, un abrazo' : 'Ej: que la bombilla sea más angosta';
    actualizarPreview();
  }

  function calcularTotal() {
    const elegidos = [
      buscarItem('mate', diseno.mate),
      buscarItem('yerba', diseno.yerba),
      buscarItem('bombilla', diseno.bombilla),
    ];
    return elegidos.reduce((s, it) => s + it.precio, 0);
  }

  // ---------- Dibujo del mate (SVG) ----------
  const escHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Aclara (amt > 0) u oscurece (amt < 0) un color hex
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const mezclar = v => Math.round(v + ((amt < 0 ? 0 : 255) - v) * Math.abs(amt));
    return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(v => mezclar(v).toString(16).padStart(2, '0')).join('');
  }

  // Forma de cada mate: contorno del cuerpo y boca (centro en x=130, base en y=292)
  // Forma de cada mate según su descripción del catálogo (centro x=130, base y=292)
  const FORMAS_MATE = {
    // Calabaza curada a mano: pera irregular con boca chica
    calabaza:  { cuerpo: 'M80,104 C74,118 66,130 64,160 C60,192 56,222 60,244 C66,274 96,292 130,292 C164,292 194,274 200,244 C204,222 200,192 196,160 C194,130 186,118 180,104 Z', boca: { cy: 104, rx: 44, ry: 11 } },
    // Camionero de algarrobo: boca ancha y base casi plana
    algarrobo: { cuerpo: 'M68,108 L56,240 C54,274 82,292 130,292 C178,292 206,274 204,240 L192,108 Z', boca: { cy: 108, rx: 64, ry: 15 } },
    // Torpedo de acero: afinado arriba, panza redonda abajo
    torpedo:   { cuerpo: 'M86,88 C82,120 78,170 80,214 C82,258 102,292 130,292 C158,292 178,258 180,214 C182,170 178,120 174,88 Z', boca: { cy: 88, rx: 44, ry: 10 } },
    // Cerámica esmaltada: redonda, con pie
    ceramica:  { cuerpo: 'M78,102 C62,124 58,176 60,214 C63,262 94,292 130,292 C166,292 197,262 200,214 C202,176 198,124 182,102 Z', boca: { cy: 102, rx: 48, ry: 12 } },
  };

  // Bolitas de yerba según el blend: suave (poco polvo), ahumada (oscura), cítrica (cáscara de naranja), guaraná
  const YERBA_BOLITAS = {
    suave:   { color: '#E4EFC6', n: 26, r: 0.7 },
    ahumada: { color: '#161c12', n: 46, r: 1.1 },
    citrica: { color: '#F0A93B', n: 18, r: 1.5 },
    guarana: { color: '#7b4a26', n: 30, r: 1.1 },
  };

  function svgYerba(yerba, b) {
    const d = YERBA_BOLITAS[yerba.id];
    let out = '';
    for (let i = 0; i < d.n; i++) {
      // Distribución uniforme dentro de la boca (ángulo dorado)
      const r = Math.sqrt((i + 0.5) / d.n) * 0.9;
      const a = i * 2.399;
      const x = (130 + Math.cos(a) * (b.rx - 7.5) * r).toFixed(1);
      const y = (b.cy + 1.5 + Math.sin(a) * (b.ry - 4.5) * r).toFixed(1);
      out += `<circle cx="${x}" cy="${y}" r="${d.r}" fill="${d.color}" opacity=".85"/>`;
    }
    return out;
  }

  function svgBombilla(id, color, x, y, L) {
    const tubo = 'url(#pv-tubo)';
    const filtro = (c, cy = 8) => `<ellipse cx="0" cy="${cy}" rx="7.5" ry="10" fill="${shade(c, -0.3)}"/>`;
    let piezas = '';
    if (id === 'alpaca') {
      // Pico de loro: caño con el pico curvo arriba y filtro de resorte abajo (aros visibles)
      piezas = `
        <path d="M-3,${-L + 4} Q-3,${-L - 8} -15,${-L - 6}" fill="none" stroke="${tubo}" stroke-width="5" stroke-linecap="round"/>
        <rect x="-3" y="${-L}" width="6" height="${L}" rx="3" fill="${tubo}"/>
        ${filtro(color)}
        <path d="M-6.5,4 Q0,7 6.5,4 M-6.5,9 Q0,12 6.5,9 M-6.5,14 Q0,17 6.5,14" fill="none" stroke="${shade(color, -0.6)}" stroke-width="0.9"/>`;
    } else if (id === 'desarmable') {
      // Acero desarmable: dos mitades, junta y rosca visibles, con filtro removible
      piezas = `
        <rect x="-3.5" y="${-L}" width="7" height="${L * 0.5}" rx="2" fill="${tubo}"/>
        <rect x="-4.5" y="${-L * 0.5 - 2}" width="9" height="4" rx="1.5" fill="#4d5357"/>
        <rect x="-3.5" y="${-L * 0.5 + 2}" width="7" height="${L * 0.5 - 2}" rx="2" fill="${shade(color, -0.12)}"/>
        <rect x="-4" y="-9" width="8" height="7" rx="1.5" fill="#5f6569"/>
        ${filtro(color, 6)}`;
    } else if (id === 'bambu') {
      // Bambú: caña natural con nudos y filtro de caña abajo
      let nudos = '';
      for (let yy = -L + 12; yy < -6; yy += 16) nudos += `<rect x="-4" y="${yy}" width="8" height="2.2" rx="1" fill="#7a5f40"/>`;
      piezas = `
        <rect x="-3.8" y="${-L}" width="7.6" height="${L}" rx="3.5" fill="${tubo}"/>
        ${nudos}
        <ellipse cx="0" cy="8" rx="6" ry="9" fill="#a8895f"/>`;
    } else {
      // Alpaca cincelada: caño con grabado fino de líneas y filtro abajo
      piezas = `
        <rect x="-3" y="${-L}" width="6" height="${L}" rx="3" fill="${tubo}"/>
        <rect x="-3" y="${-L}" width="6" height="${L}" rx="3" fill="url(#pv-cincel)"/>
        ${filtro(color)}
        <path d="M-6,4 Q0,0 6,4" fill="none" stroke="#6b5438" stroke-width="0.8"/>`;
    }
    return `<g transform="translate(${x} ${y}) rotate(16)">${piezas}</g>`;
  }

  function svgPreview(mate, yerba, bombilla, grabado) {
    const f = FORMAS_MATE[mate.id];
    const c = mate.color;
    const b = f.boca;
    const cuerpo = f.cuerpo;

    // Detalles según la descripción de cada mate
    let detalle = '';
    let fondo = `url(#pv-cuerpo)`;
    let pie = '';
    let aro = '';
    if (mate.id === 'calabaza') {
      // Curada a mano: manchas oscuras irregulares y grietas finas del curado
      for (let i = 0; i < 10; i++) {
        detalle += `<ellipse cx="${70 + ((i * 37) % 110)}" cy="${120 + ((i * 53) % 150)}" rx="${4 + (i % 4) * 2}" ry="${3 + (i % 3) * 2}" fill="#000" opacity=".16"/>`;
      }
      detalle += `<path d="M92,150 Q96,134 88,118 M172,200 Q168,180 176,164 M120,230 Q126,250 118,266" fill="none" stroke="#000" stroke-width="0.8" opacity=".35"/>`;
      aro = `<ellipse cx="130" cy="${b.cy}" rx="${b.rx + 1}" ry="${b.ry + 1}" fill="none" stroke="url(#pv-metal)" stroke-width="2"/>`;
    } else if (mate.id === 'algarrobo') {
      // Madera dura argentina: veta irregular y virola de alpaca en la boca ancha
      for (let i = 0; i < 14; i++) {
        const x = 58 + i * 11 + Math.sin(i * 2.3) * 3;
        detalle += `<path d="M${x},100 C${x + 5 + Math.sin(i) * 3},160 ${x - 4},220 ${x + 3},300" fill="none" stroke="${shade(c, -0.4)}" stroke-width="${0.6 + (i % 3) * 0.4}" opacity="${0.25 + (i % 4) * 0.08}"/>`;
      }
      detalle += `<path d="M52,116 Q130,128 208,116 L208,128 Q130,140 52,128 Z" fill="url(#pv-metal)"/>`;
      aro = `<ellipse cx="130" cy="${b.cy}" rx="${b.rx + 1}" ry="${b.ry + 1}" fill="none" stroke="url(#pv-metal)" stroke-width="2.5"/>`;
    } else if (mate.id === 'torpedo') {
      // Acero pulido, cero curado: el brillo sale del degradado metálico
      fondo = `url(#pv-acero)`;
      detalle = `<path d="M118,110 L118,300" stroke="#fff" stroke-width="3" opacity=".25"/>`;
      aro = `<ellipse cx="130" cy="${b.cy}" rx="${b.rx + 1}" ry="${b.ry + 1}" fill="none" stroke="#f4f7f8" stroke-width="2.2"/>`;
    } else {
      // Esmaltada, colores de autor: onda pintada a mano y pie de cerámica
      detalle = `<path d="${cuerpo}" fill="url(#pv-onda)"/>`;
      pie = `<path d="M96,290 Q130,300 164,290 L162,297 Q130,305 98,297 Z" fill="${shade(c, -0.45)}"/>`;
    }

    const L = b.cy - 4;
    const bomb = svgBombilla(bombilla.id, bombilla.color, 130 + 16, b.cy + 4, L);

    return `
    <svg viewBox="0 0 310 320" role="img" aria-label="Vista previa de tu mate">
      <defs>
        <linearGradient id="pv-cuerpo" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="${shade(c, -0.45)}"/>
          <stop offset="0.28" stop-color="${c}"/>
          <stop offset="0.5" stop-color="${shade(c, 0.12)}"/>
          <stop offset="0.78" stop-color="${c}"/>
          <stop offset="1" stop-color="${shade(c, -0.5)}"/>
        </linearGradient>
        <linearGradient id="pv-acero" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#4f575c"/><stop offset="0.16" stop-color="#dfe5e8"/>
          <stop offset="0.32" stop-color="#9aa3a8"/><stop offset="0.5" stop-color="#f5f8f9"/>
          <stop offset="0.7" stop-color="#8a9399"/><stop offset="0.86" stop-color="#c9d0d4"/>
          <stop offset="1" stop-color="#3f474c"/>
        </linearGradient>
        <linearGradient id="pv-tubo" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="${shade(bombilla.color, -0.35)}"/>
          <stop offset="0.45" stop-color="${shade(bombilla.color, 0.25)}"/>
          <stop offset="1" stop-color="${shade(bombilla.color, -0.4)}"/>
        </linearGradient>
        <linearGradient id="pv-steel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#6b7276"/><stop offset="0.42" stop-color="#e9edef"/>
          <stop offset="0.7" stop-color="#9aa1a5"/><stop offset="1" stop-color="#5d6468"/>
        </linearGradient>
        <linearGradient id="pv-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#7d8488"/><stop offset="0.4" stop-color="#eef2f4"/>
          <stop offset="0.75" stop-color="#8f969a"/><stop offset="1" stop-color="#5c6265"/>
        </linearGradient>
        <linearGradient id="pv-cuero" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#5e3a20"/><stop offset="0.4" stop-color="#9a6238"/><stop offset="1" stop-color="#6e4327"/>
        </linearGradient>
        <radialGradient id="pv-yerba-g" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stop-color="${shade(yerba.color, 0.12)}"/>
          <stop offset="0.55" stop-color="${yerba.color}"/>
          <stop offset="1" stop-color="${shade(yerba.color, -0.45)}"/>
        </radialGradient>
        <radialGradient id="pv-sombra">
          <stop offset="0" stop-color="#000" stop-opacity="0.5"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
        <filter id="pv-grano" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="3" result="ruido"/>
          <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 1.6" result="puntos"/>
          <feComposite in="puntos" in2="SourceGraphic" operator="in"/>
        </filter>
        <pattern id="pv-onda" width="40" height="28" patternUnits="userSpaceOnUse">
          <path d="M0,14 Q10,6 20,14 T40,14" fill="none" stroke="#F6E7C8" stroke-width="2" opacity=".85"/>
          <circle cx="20" cy="0" r="2" fill="#F6E7C8" opacity=".8"/>
          <circle cx="20" cy="28" r="2" fill="#F6E7C8" opacity=".8"/>
        </pattern>
        <pattern id="pv-cincel" width="3" height="6" patternUnits="userSpaceOnUse">
          <path d="M0,0 L3,6" stroke="#6b5438" stroke-width="0.7" opacity="0.55"/>
        </pattern>
        <clipPath id="pv-clip"><path d="${cuerpo}"/></clipPath>
      </defs>

      <ellipse cx="130" cy="296" rx="90" ry="10" fill="url(#pv-sombra)"/>
      <path d="${cuerpo}" fill="${fondo}"/>
      <path d="${cuerpo}" fill="#000" filter="url(#pv-grano)" opacity="${mate.id === 'torpedo' ? 0 : 0.12}"/>
      <g clip-path="url(#pv-clip)">
        ${detalle}
        <ellipse cx="130" cy="${b.cy + 12}" rx="${b.rx + 4}" ry="${b.ry + 4}" fill="#000" opacity=".22"/>
      </g>
      <path d="${cuerpo}" fill="none" stroke="${shade(c, -0.5)}" stroke-width="1" opacity=".55"/>
      <ellipse cx="${130 - b.rx * 0.6}" cy="${b.cy + 80}" rx="7" ry="36" fill="#fff" opacity=".18"/>
      ${pie}

      <ellipse cx="130" cy="${b.cy}" rx="${b.rx}" ry="${b.ry}" fill="${shade(c, -0.2)}" stroke="${shade(c, -0.5)}" stroke-width="1.2"/>
      <ellipse cx="130" cy="${b.cy + 1}" rx="${b.rx - 6}" ry="${b.ry - 3}" fill="#1e140e"/>
      <ellipse cx="130" cy="${b.cy + 1.5}" rx="${b.rx - 7.5}" ry="${b.ry - 4.5}" fill="url(#pv-yerba-g)"/>
      ${svgYerba(yerba, b)}
      ${aro}

      ${bomb}
      <text x="130" y="240" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="13" fill="#FDFBF7" stroke="rgba(0,0,0,0.35)" stroke-width="0.4">${escHTML(grabado)}</text>
    </svg>`;
  }

  // ---------- Vista 3D del mate (Three.js) ----------
  // Perfil del cuerpo en unidades 3D (radio, altura), de la base a la boca. Sale de las mismas formas que FORMAS_MATE.
  // Puntos de control del perfil; la curva los une con una línea suave (sin facetas)
  const CONTROL_MATE = {
    // Calabaza: base ancha, panza redonda y cuello que se cierra hacia la boca
    calabaza:  [[0, 0], [0.3, 0], [0.56, 0.06], [0.68, 0.26], [0.74, 0.58], [0.7, 0.92], [0.6, 1.22], [0.5, 1.5], [0.45, 1.74], [0.44, 1.88]],
    // Algarrobo: cuerpo casi recto, base plana y boca ancha con borde
    algarrobo: [[0, 0], [0.5, 0], [0.68, 0.06], [0.74, 0.24], [0.72, 0.7], [0.68, 1.2], [0.66, 1.66], [0.65, 1.86]],
    // Torpedo: cono de bala, boca angosta y panza en la base
    torpedo:   [[0, 0], [0.2, 0], [0.34, 0.1], [0.44, 0.36], [0.5, 0.8], [0.5, 1.25], [0.47, 1.6], [0.43, 1.9], [0.42, 2.02]],
    // Cerámica: redonda, con pie y borde levemente vuelto
    ceramica:  [[0, 0], [0.42, 0], [0.5, 0.04], [0.6, 0.2], [0.68, 0.6], [0.72, 1.0], [0.7, 1.4], [0.62, 1.72], [0.52, 1.9], [0.5, 1.93]],
  };
  const PERFIL_MATE = {};
  if (THREE) Object.keys(CONTROL_MATE).forEach(id => {
    const curva = new THREE.SplineCurve(CONTROL_MATE[id].map(([r, y]) => new THREE.Vector2(r, y)));
    PERFIL_MATE[id] = curva.getPoints(48).map(p => [p.x, p.y]);
  });

  // Radio del perfil a una altura dada (interpola entre puntos)
  function radioEnAltura(perfil, y) {
    for (let i = 1; i < perfil.length; i++) {
      const [r1, y1] = perfil[i - 1], [r2, y2] = perfil[i];
      if (y <= y2) return r1 + (r2 - r1) * ((y - y1) / ((y2 - y1) || 1));
    }
    return perfil[perfil.length - 1][0];
  }

  const Vista3D = (() => {
    let renderer = null, escena, camara, modelo, contenedor, entorno;
    let arrastrando = false, ultimoX = 0, ultimoY = 0, pausa = 0, soporta = null;
    // Órbita de la cámara alrededor del mate: giro horizontal (yaw), inclinación (pitch) y distancia (radio)
    let yaw = 0, pitch = 0.15, radio = 8.5;
    const CENTRO = THREE ? new THREE.Vector3(0, 1.45, 0) : null;

    // Se prueba una sola vez: crear contextos WebGL en cada cambio gasta recursos
    const disponible = () => {
      if (soporta === null) {
        soporta = false;
        if (window.THREE) {
          try {
            const c = document.createElement('canvas');
            soporta = !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
          } catch (err) { soporta = false; }
        }
      }
      return soporta;
    };

    // Entorno de estudio: softboxes y una ventana lateral que se reflejan en el metal, la cerámica y el barniz
    function crearEntorno(pmrem) {
      const estudio = new THREE.Scene();
      estudio.background = new THREE.Color(0x2e2c2a);
      const luz = (ancho, alto, pos, color, intensidad) => {
        const panel = new THREE.Mesh(
          new THREE.PlaneGeometry(ancho, alto),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensidad), side: THREE.DoubleSide })
        );
        panel.position.set(...pos);
        panel.lookAt(0, 0, 0);
        estudio.add(panel);
      };
      luz(6, 3, [0, 4, 5], '#ffffff', 2.2);
      luz(3, 6, [-6, 1, 0], '#f2efe9', 1.4);
      luz(3, 6, [6, 0, -2], '#e9e6e1', 0.6);
      luz(10, 2, [0, -3, 0], '#6e6a66', 0.5);
      return pmrem.fromScene(estudio, 0.03).texture;
    }

    // Con color = true la textura se trata como color sRGB; los mapas de relieve quedan en lineal
    function lienzoCon(dibujar, ancho, alto, color) {
      const cv = document.createElement('canvas');
      cv.width = ancho; cv.height = alto;
      dibujar(cv.getContext('2d'), ancho, alto);
      const t = new THREE.CanvasTexture(cv);
      if (color) t.encoding = THREE.sRGBEncoding;
      return t;
    }

    const materialMetal = color => new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: 0.25, envMap: entorno, envMapIntensity: 1.2 });

    function materialBombilla(color, madera) {
      return madera
        ? new THREE.MeshStandardMaterial({ color, roughness: 0.75 })
        : new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.25, envMap: entorno, envMapIntensity: 1 });
    }

    // Textura del cuerpo: la U recorre el contorno y la V, la altura (veta vertical = grano de la madera)
    function texturaCuerpo(id, color) {
      return lienzoCon((g, w, h) => {
        g.fillStyle = color; g.fillRect(0, 0, w, h);
        if (id === 'calabaza') {
          for (let i = 0; i < 90; i++) {
            g.fillStyle = `rgba(0,0,0,${0.05 + (i % 5) * 0.03})`;
            g.beginPath();
            g.ellipse((i * 137) % w, (i * 211) % h, 6 + (i % 7) * 4, 4 + (i % 5) * 3, 0, 0, Math.PI * 2);
            g.fill();
          }
        } else if (id === 'algarrobo') {
          for (let x = 0; x < w; x += 3) {
            g.strokeStyle = `rgba(40,20,10,${0.03 + ((x * 7) % 11) / 140})`;
            g.lineWidth = 1 + (x % 9) / 8;
            g.beginPath(); g.moveTo(x, 0);
            for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y / 40 + x) * 4, y);
            g.stroke();
          }
        } else if (id === 'ceramica') {
          g.strokeStyle = 'rgba(246,231,200,.55)'; g.lineWidth = 4;
          for (let y = 32; y < h; y += 64) {
            g.beginPath();
            for (let x = 0; x <= w; x += 4) g.lineTo(x, y + Math.sin((x / w) * Math.PI * 16) * 10);
            g.stroke();
          }
        }
      }, 512, 512, true);
    }

    // Ruido de rugosidad: superficie irregular en vez de brillo uniforme
    function texturaRuido(intensidad) {
      return lienzoCon((g, w, h) => {
        const img = g.createImageData(w, h);
        for (let i = 0; i < img.data.length; i += 4) {
          const v = 128 + (Math.random() - 0.5) * intensidad;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
          img.data[i + 3] = 255;
        }
        g.putImageData(img, 0, 0);
      }, 256, 256);
    }

    // Polvo de yerba: color del blend con granos más claros y más oscuros
    function texturaPolvo(color) {
      return lienzoCon((g, w, h) => {
        g.fillStyle = color; g.fillRect(0, 0, w, h);
        for (let i = 0; i < 2500; i++) {
          g.fillStyle = i % 2 ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.22)';
          g.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
      }, 256, 256, true);
    }

    // Relieve en escala de grises: poros de la calabaza y veta del algarrobo
    function texturaRelieve(id) {
      return lienzoCon((g, w, h) => {
        g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
        if (id === 'calabaza') {
          // Posiciones pseudoaleatorias (no lineales) para que los poros no formen líneas
          const azar = n => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
          for (let i = 0; i < 1400; i++) {
            g.fillStyle = i % 2 ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.3)';
            g.fillRect(azar(i) * w, azar(i + 5000) * h, 1 + (i % 3), 1 + (i % 2));
          }
        } else if (id === 'algarrobo') {
          for (let x = 0; x < w; x += 2) {
            g.fillStyle = `rgba(0,0,0,${0.05 + ((x * 13) % 7) / 40})`;
            g.fillRect(x, 0, 1, h);
          }
        }
      }, 512, 512);
    }

    // Materiales con barniz o metal según el mate: calabaza mate, algarrobo barnizado, acero pulido y esmalte brillante
    function materialCuerpo(mate) {
      // Acero cepillado: metal con rugosidad irregular, sin tinte de color
      if (mate.id === 'torpedo') return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(mate.color).multiplyScalar(1.15), metalness: 1, roughness: 0.3, roughnessMap: texturaRuido(60), clearcoat: 0.3, clearcoatRoughness: 0.2, envMap: entorno, envMapIntensity: 0.9 });
      // Esmalte: brillo de barniz con micro-rayas de la pintura a mano
      if (mate.id === 'ceramica') return new THREE.MeshPhysicalMaterial({ map: texturaCuerpo(mate.id, mate.color), roughness: 0.16, roughnessMap: texturaRuido(30), clearcoat: 1, clearcoatRoughness: 0.06, envMap: entorno, envMapIntensity: 0.8 });
      // Madera barnizada: veta, relieve y brillo parejo del barniz
      if (mate.id === 'algarrobo') return new THREE.MeshPhysicalMaterial({ map: texturaCuerpo(mate.id, mate.color), bumpMap: texturaRelieve(mate.id), bumpScale: 0.3, roughness: 0.45, roughnessMap: texturaRuido(50), clearcoat: 0.5, clearcoatRoughness: 0.25, envMap: entorno, envMapIntensity: 0.6 });
      // Calabaza curada: superficie mate, con poros y una leve pelusa de luz
      return new THREE.MeshPhysicalMaterial({ map: texturaCuerpo(mate.id, mate.color), bumpMap: texturaRelieve(mate.id), bumpScale: 0.35, roughness: 0.8, roughnessMap: texturaRuido(40), sheen: new THREE.Color(0xffe9cf).multiplyScalar(0.3), envMap: entorno, envMapIntensity: 0.45 });
    }

    // Yerba: base de color del blend y bolitas (InstancedMesh) con la distribución dorada del SVG
    function construirYerba(yerba, rBoca, yBoca) {
      const d = YERBA_BOLITAS[yerba.id];
      const grupo = new THREE.Group();

      // Yerba apenas abombada: casquete de esfera con el borde apoyado en la boca
      const R = rBoca - 0.01, casquete = Math.PI / 7;
      const base = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 8, 0, Math.PI * 2, 0, casquete), new THREE.MeshStandardMaterial({ map: texturaPolvo(yerba.color), roughness: 0.95, side: THREE.DoubleSide }));
      base.position.y = yBoca - R * Math.cos(casquete) + 0.002;
      grupo.add(base);

      const bolitas = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ roughness: 0.9 }), d.n);
      const m = new THREE.Object3D();
      const color = new THREE.Color(d.color);
      for (let i = 0; i < d.n; i++) {
        const r = Math.sqrt((i + 0.5) / d.n) * (rBoca - 0.1);
        const a = i * 2.399;
        const s = d.r * 0.02;
        m.position.set(Math.cos(a) * r, yBoca + 0.03 + s * 0.5, Math.sin(a) * r);
        m.scale.set(s, s * 0.8, s);
        m.updateMatrix();
        bolitas.setMatrixAt(i, m.matrix);
        bolitas.setColorAt(i, color);
      }
      bolitas.instanceMatrix.needsUpdate = true;
      bolitas.instanceColor.needsUpdate = true;
      grupo.add(bolitas);
      return grupo;
    }

    // Bombilla: caño inclinado sobre la boca, con filtro dentro de la yerba
    function construirBombilla(bombilla, yBoca) {
      const madera = bombilla.id === 'bambu';
      const grupo = new THREE.Group();
      grupo.position.set(0.16, yBoca + 0.03, 0);
      grupo.rotation.z = -0.28;
      const L = 1.0;
      const materialTubo = materialBombilla(bombilla.color, madera);
      let tubo;
      if (bombilla.id === 'alpaca') {
        // Pico de loro: el caño sube recto y se curva hacia afuera arriba
        const camino = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, L * 0.7, 0),
          new THREE.Vector3(0.01, L, 0), new THREE.Vector3(0.12, L + 0.05, 0),
        ]);
        tubo = new THREE.Mesh(new THREE.TubeGeometry(camino, 32, 0.028, 14, false), materialTubo);
      } else {
        tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, L, 16), materialTubo);
        tubo.position.y = L / 2;
      }
      const filtro = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 14),
        materialBombilla(madera ? '#a8895f' : new THREE.Color(bombilla.color).multiplyScalar(0.7), madera)
      );
      filtro.scale.set(0.075, 0.1, 0.075);
      filtro.position.y = 0.02;
      grupo.add(tubo, filtro);
      return grupo;
    }

    // Grabado: franja curva pegada al cuerpo, con el texto dibujado en canvas
    function construirGrabado(texto, perfil) {
      const y = 0.56, h = 0.16, r = radioEnAltura(perfil, y) + 0.006;
      const tex = lienzoCon((g, w, hh) => {
        g.textAlign = 'center'; g.textBaseline = 'middle';
        let tam = 76;
        g.font = `bold ${tam}px Fraunces, serif`;
        const ancho = g.measureText(texto).width;
        if (ancho > w * 0.9) { tam = Math.floor(tam * (w * 0.9) / ancho); g.font = `bold ${tam}px Fraunces, serif`; }
        g.lineWidth = 6; g.strokeStyle = 'rgba(0,0,0,.35)'; g.fillStyle = '#FDFBF7';
        g.strokeText(texto, w / 2, hh / 2);
        g.fillText(texto, w / 2, hh / 2);
      }, 1024, 256, true);
      const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
      const franja = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64, 1, true, -0.45, 0.9), mat);
      franja.position.y = y;
      return franja;
    }

    function construirMate(mate, yerba, bombilla, grabado) {
      const perfil = PERFIL_MATE[mate.id];
      const [rBoca, yBoca] = perfil[perfil.length - 1];
      const puntos = perfil.map(([r, y]) => new THREE.Vector2(r, y));
      // Sin tapa: la boca queda abierta y la yerba la cubre (ver construirYerba)

      const grupo = new THREE.Group();
      grupo.add(new THREE.Mesh(new THREE.LatheGeometry(puntos, 96), materialCuerpo(mate)));

      if (mate.id !== 'ceramica') {
        // Virola de metal en el borde de la boca
        const aro = new THREE.Mesh(new THREE.TorusGeometry(rBoca + 0.004, 0.014, 12, 72), materialMetal('#d6dcdf'));
        aro.rotation.x = Math.PI / 2;
        aro.position.y = yBoca;
        grupo.add(aro);
      }
      if (mate.id === 'algarrobo') {
        // Banda de alpaca a mitad del cuerpo
        const y = 1.64, r = radioEnAltura(perfil, y) + 0.01;
        const banda = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.1, 72, 1, true), materialMetal('#d6dcdf'));
        banda.position.y = y;
        grupo.add(banda);
      }

      if (mate.id === 'calabaza' || mate.id === 'ceramica') {
        // Labio redondeado en la boca, como en las piezas hechas a mano
        const labio = new THREE.Mesh(new THREE.TorusGeometry(rBoca - 0.004, 0.024, 16, 72), materialCuerpo(mate));
        labio.rotation.x = Math.PI / 2;
        labio.position.y = yBoca - 0.005;
        grupo.add(labio);
      }
      if (mate.id === 'ceramica') {
        // Pie oscuro en la base, con el mismo tono del esmalte
        const pie = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.4, 0.07, 48), new THREE.MeshStandardMaterial({ color: new THREE.Color(mate.color).multiplyScalar(0.55), roughness: 0.7 }));
        pie.position.y = 0.02;
        grupo.add(pie);
      }

      grupo.add(construirYerba(yerba, rBoca, yBoca));
      grupo.add(construirBombilla(bombilla, yBoca));
      if (grabado) grupo.add(construirGrabado(grabado, perfil));

      grupo.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      return grupo;
    }

    // Zoom: la cámara se acerca o aleja sobre el mismo eje, con límites para no entrar al mate
    function zoom(delta) {
      radio = Math.min(14, Math.max(4.5, radio + delta));
      actualizarCamara();
    }

    // Coloca la cámara en la órbita (yaw, pitch, radio) y la apunta al centro del mate
    function actualizarCamara() {
      camara.position.set(
        CENTRO.x + radio * Math.cos(pitch) * Math.sin(yaw),
        CENTRO.y + radio * Math.sin(pitch),
        CENTRO.z + radio * Math.cos(pitch) * Math.cos(yaw)
      );
      camara.lookAt(CENTRO);
    }

    // Vista ampliada: el mismo canvas ocupa la pantalla; ResizeObserver ajusta el tamaño
    let ampliado = false;
    function alternarAmpliado() {
      ampliado = !ampliado;
      // Se mueve a <body>: el panel sticky con backdrop-filter sería el bloque de referencia del position: fixed
      // Estilos en línea: no dependen de que el CDN de Tailwind genere las clases a tiempo
      if (ampliado) {
        document.body.appendChild(contenedor);
        contenedor.style.cssText = 'position:fixed;inset:0;z-index:80;padding:16px;height:auto;background:#2b211a';
        radio = 7.4; // más cerca: en pantalla completa el mate tiene que llenar el espacio, sin cortar el sorbete
        // Con el dedo en pantalla completa el gesto gira el mate en las dos direcciones
        contenedor.querySelector('canvas').style.touchAction = 'none';
      } else {
        document.getElementById('pv-stage').appendChild(contenedor);
        contenedor.style.cssText = '';
        radio = 8.5;
        contenedor.querySelector('canvas').style.touchAction = 'pan-y';
      }
      actualizarCamara();
      contenedor.querySelector('[data-accion="ampliar"]').textContent = ampliado ? 'Cerrar' : 'Ampliar';
    }

    function iniciar() {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const lienzo = renderer.domElement;
      // pan-y: el dedo sigue bajando la página al pasar por el mate; el giro horizontal queda para el canvas
      lienzo.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;outline:none';
      contenedor.appendChild(lienzo);

      const controles = document.createElement('div');
      controles.className = 'pv-controles';
      controles.innerHTML = `
        <button type="button" data-accion="menos" class="pv-btn" aria-label="Alejar">−</button>
        <button type="button" data-accion="mas" class="pv-btn" aria-label="Acercar">+</button>
        <button type="button" data-accion="ampliar" class="pv-btn pv-btn-txt" aria-label="Ampliar">Ampliar</button>`;
      controles.addEventListener('click', e => {
        const accion = e.target.closest('[data-accion]');
        if (!accion) return;
        if (accion.dataset.accion === 'mas') zoom(-1);
        else if (accion.dataset.accion === 'menos') zoom(1);
        else alternarAmpliado();
      });
      contenedor.appendChild(controles);

      const pmrem = new THREE.PMREMGenerator(renderer);
      entorno = crearEntorno(pmrem);
      pmrem.dispose();
      window.addEventListener('keydown', e => { if (e.key === 'Escape' && ampliado) alternarAmpliado(); });
      escena = new THREE.Scene();
      camara = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      actualizarCamara();

      escena.add(new THREE.HemisphereLight(0xfff6e8, 0x4a3828, 0.9));
      const sol = new THREE.DirectionalLight(0xffffff, 1.1);
      sol.position.set(2, 8, 3.5); // más alto: la sombra queda corta y debajo del mate
      sol.castShadow = true;
      sol.shadow.mapSize.set(2048, 2048);
      Object.assign(sol.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 });
      sol.shadow.camera.updateProjectionMatrix();
      sol.shadow.bias = -0.0005;
      escena.add(sol);
      const relleno = new THREE.DirectionalLight(0xffe2c0, 0.35);
      relleno.position.set(-4, 2, -2);
      escena.add(relleno);
      // Contraluz cálido: marca el borde del mate y lo separa del fondo
      const contraluz = new THREE.DirectionalLight(0xffd9b0, 0.6);
      contraluz.position.set(-3, 4, -4);
      escena.add(contraluz);

      // Piso que solo muestra la sombra del mate
      const piso = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.ShadowMaterial({ opacity: 0.28 }));
      piso.rotation.x = -Math.PI / 2;
      piso.receiveShadow = true;
      escena.add(piso);

      modelo = new THREE.Group();
      escena.add(modelo);

      // Arrastrar para girar; sin tocar, el mate gira solo despacio
      lienzo.addEventListener('pointerdown', e => {
        arrastrando = true; ultimoX = e.clientX; ultimoY = e.clientY;
        lienzo.setPointerCapture(e.pointerId);
        lienzo.style.cursor = 'grabbing';
      });
      lienzo.addEventListener('pointermove', e => {
        if (!arrastrando) return;
        yaw += (e.clientX - ultimoX) * 0.01;
        // Arrastrar hacia abajo mira el mate desde arriba; el tope evita pasar por debajo del piso
        pitch = Math.min(1.1, Math.max(-0.2, pitch + (e.clientY - ultimoY) * 0.008));
        ultimoX = e.clientX; ultimoY = e.clientY;
        actualizarCamara();
      });
      const soltar = () => { arrastrando = false; pausa = performance.now(); lienzo.style.cursor = 'grab'; };
      lienzo.addEventListener('pointerup', soltar);
      lienzo.addEventListener('pointercancel', soltar);
      lienzo.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY > 0 ? 0.4 : -0.4); }, { passive: false });

      new ResizeObserver(() => {
        const w = contenedor.clientWidth, h = contenedor.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camara.aspect = w / h;
        camara.updateProjectionMatrix();
      }).observe(contenedor);

      const bucle = t => {
        requestAnimationFrame(bucle);
        if (!arrastrando && t - pausa > 1500) {
          yaw += 0.004;
          actualizarCamara();
        }
        renderer.render(escena, camara);
      };
      requestAnimationFrame(bucle);
    }

    return {
      disponible,
      actualizar(mate, yerba, bombilla, grabado) {
        if (!renderer) {
          contenedor = document.createElement('div');
          contenedor.className = 'pv-lienzo';
          document.getElementById('pv-stage').replaceChildren(contenedor);
          iniciar();
        }
        // Se libera lo anterior antes de armar el mate nuevo
        modelo.traverse(o => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            ['map', 'bumpMap', 'roughnessMap'].forEach(k => { if (o.material[k]) o.material[k].dispose(); });
            o.material.dispose();
          }
        });
        modelo.clear();
        modelo.add(construirMate(mate, yerba, bombilla, grabado));
      },
    };
  })();

  function actualizarPreview() {
    const mate = buscarItem('mate', diseno.mate);
    const yerba = buscarItem('yerba', diseno.yerba);
    const bombilla = buscarItem('bombilla', diseno.bombilla);
    const grabado = document.getElementById('f-grabado').value.trim();

    if (Vista3D.disponible()) Vista3D.actualizar(mate, yerba, bombilla, grabado);
    else document.getElementById('pv-stage').innerHTML = svgPreview(mate, yerba, bombilla, grabado);
    document.getElementById('pv-caption').innerHTML =
      `<b>${mate.nombre}:</b> ${mate.cuidado}<br><b>${yerba.nombre}:</b> ${yerba.perfil}`;
    document.getElementById('pv-resumen').textContent =
      `${mate.nombre} · ${yerba.nombre} · ${bombilla.nombre}`;

    const filas = [
      ['Uso', USOS.find(u => u.id === diseno.uso).nombre],
      ['Mate', mate.nombre],
      ['Yerba', yerba.nombre],
      ['Bombilla', bombilla.nombre],
      ['Grabado', grabado || 'Sin grabado'],
    ];
    document.getElementById('pv-lista').innerHTML = filas.map(([k, v]) =>
      `<li><span>${k}</span><b>${v}</b></li>`
    ).join('');
    document.getElementById('pv-total').innerText = fmt(calcularTotal());
  }

  // Pedido: se guarda en Firestore si la config está cargada (ver pedidos.html de dise-atumate).
  // Pegá acá la config de tu proyecto Firebase. Mientras sea null, el pedido se confirma por WhatsApp.
  const FIREBASE_CONFIG = null;
  let db = null;
  try {
    if (FIREBASE_CONFIG && window.firebase) {
      window.firebase.initializeApp(FIREBASE_CONFIG);
      db = window.firebase.firestore();
    }
  } catch (err) {
    console.error('No se pudo iniciar Firebase', err);
  }

  function armarPedido() {
    const valor = id => document.getElementById(id).value.trim();
    const mate = buscarItem('mate', diseno.mate);
    const yerba = buscarItem('yerba', diseno.yerba);
    const bombilla = buscarItem('bombilla', diseno.bombilla);
    return {
      codigo: 'MC-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      estado: 'nuevo',
      cliente: { nombre: valor('f-nombre'), telefono: valor('f-telefono') },
      diseno: {
        uso: USOS.find(u => u.id === diseno.uso).nombre,
        mate: mate.nombre,
        yerba: yerba.nombre,
        bombilla: bombilla.nombre,
        grabado: valor('f-grabado'),
        nota: valor('f-nota'),
      },
      total: calcularTotal(),
      creado: new Date().toISOString(),
    };
  }

  function textoPedido(p) {
    const lineas = [
      `Hola MATE & CAFÉ! Hice mi pedido ${p.codigo}:`,
      `- Uso: ${p.diseno.uso}`,
      `- Mate: ${p.diseno.mate}`,
      `- Yerba: ${p.diseno.yerba}`,
      `- Bombilla: ${p.diseno.bombilla}`,
      `- Grabado: ${p.diseno.grabado || 'sin grabado'}`,
    ];
    if (p.diseno.nota) lineas.push(`- Nota: ${p.diseno.nota}`);
    lineas.push(`- Total estimado: ${fmt(p.total)}`, `- A nombre de: ${p.cliente.nombre}`);
    return lineas.join('\n');
  }

  function mostrarConfirmacion(pedido, guardado) {
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(textoPedido(pedido))}`;
    const aviso = guardado
      ? `Recibimos tu pedido. Mostrá el código <b>${pedido.codigo}</b> en caja al retirar.`
      : `Tu pedido tiene el código <b>${pedido.codigo}</b>. Mandalo por WhatsApp y lo confirmamos.`;
    const caja = document.getElementById('pedido-confirmacion');
    caja.innerHTML = `
      <p>${aviso}</p>
      <a href="${link}" target="_blank" rel="noopener" class="btn solid chico">📱 Enviar por WhatsApp</a>`;
    caja.hidden = false;
    caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function enviarPedido(ev) {
    ev.preventDefault();
    const boton = document.getElementById('btn-enviar');
    const pedido = armarPedido();

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    let guardado = false;
    if (db) {
      try {
        await db.collection('pedidos').doc(pedido.codigo).set(pedido);
        guardado = true;
      } catch (err) {
        console.error('Error al guardar el pedido', err);
      }
    }
    mostrarConfirmacion(pedido, guardado);
    boton.disabled = false;
    boton.textContent = '📨 Enviar pedido al cajero';
  }

export function iniciarPersonalizador() {
    const vista = document.getElementById('v-armar');
    vista.addEventListener('click', e => {
      const b = e.target.closest('button.opt[data-grupo]');
      if (b) elegirDiseno(b.dataset.grupo, b.dataset.id);
    });
    document.getElementById('f-grabado').addEventListener('input', actualizarPreview);
    document.getElementById('pedido-form').addEventListener('submit', enviarPedido);
    renderDiseno();
  }
