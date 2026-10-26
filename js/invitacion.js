// Invitación online. Es la lógica de Invitacion-online/crear-invitacion.html: validaciones, texto y envío por WhatsApp.
// El link con el panel de invitación vive en otro sitio, así que acá se comparte el texto completo.
const $ = (id) => document.getElementById(id);

function fmtFecha(v) {
  const p = v.split("-");
  const d = new Date(+p[0], +p[1] - 1, +p[2]);
  const s = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function iniciarInvitacion() {
  const form = $("inv-form");
  const errorEl = $("inv-error");
  const resultado = $("inv-resultado");
  const estado = $("inv-estado");

  const hoy = new Date();
  const iso = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  form.date.min = iso;
  form.date.value = iso;

  let textoActual = "";

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    errorEl.textContent = "";

    const host = form.host.value.trim();
    const guest = form.guest.value.trim();
    const occasion = form.occasion.value.trim() || "Mateada de bienvenida";
    const date = form.date.value;
    const time = form.time.value || "17:00";
    const party = parseInt(form.party.value, 10);
    const msg = form.msg.value.trim();

    const falla = (m) => { errorEl.textContent = m; };
    if (!host) return falla("Poné tu nombre.");
    if (!guest) return falla("Poné el nombre de tu amigo.");
    if (!date) return falla("Elegí una fecha.");
    if (date < iso) return falla("La fecha no puede ser anterior a hoy.");
    if (!(party >= 1 && party <= 20)) return falla("La cantidad de personas tiene que estar entre 1 y 20.");

    const resumen = `${guest}, te invita ${host} a ${occasion.toLowerCase()} el ${fmtFecha(date)} a las ${time} hs.`;
    $("inv-resumen").textContent = resumen;
    $("inv-tarjeta-para").textContent = guest;
    $("inv-tarjeta-ocasion").textContent = occasion;
    $("inv-tarjeta-cuando").textContent = `${fmtFecha(date)} · ${time} hs`;
    $("inv-tarjeta-quien").textContent = `${host} · ${party} ${party === 1 ? "persona" : "personas"}`;
    $("inv-tarjeta-msg").textContent = msg;
    $("inv-tarjeta-msg").hidden = !msg;

    textoActual = `Hola ${guest}! ${host} te invita a ${occasion.toLowerCase()} en MATE & CAFÉ, el ${fmtFecha(date)} a las ${time} hs.` +
      (msg ? ` ${msg}` : "");
    $("inv-texto").value = textoActual;
    $("inv-wa").href = "https://wa.me/?text=" + encodeURIComponent(textoActual);

    estado.textContent = "";
    resultado.hidden = false;
    resultado.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("inv-copiar").addEventListener("click", () => {
    const campo = $("inv-texto");
    if (!campo.value) return;
    campo.select();
    let copiado = false;
    try { copiado = document.execCommand("copy"); } catch { copiado = false; }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(campo.value).then(
        () => { estado.textContent = "Texto copiado."; },
        () => { estado.textContent = copiado ? "Texto copiado." : "No pude copiar. Seleccionalo y copialo a mano."; },
      );
    } else {
      estado.textContent = copiado ? "Texto copiado." : "No pude copiar. Seleccionalo y copialo a mano.";
    }
  });
}
