// Mate & Café: navegación, tienda, armador, carrito, compra, menú y contacto.
// La lógica de precios, stock y carrito es la de VENTAS-ONLINE; reservas e invitaciones, la de sus repos.
import { CONFIG, SITIO } from "./config.js";
import { leerCarrito, guardarCarrito, vaciarCarrito, agregarItem } from "./carrito.js";
import { cargarCatalogo, cotizar } from "./cotizar.js";
import { MC_DATA } from "./datos.js";
import { iniciarReservas } from "./reservas.js";
import { iniciarInvitacion } from "./invitacion.js";
import { dibujarMate, dibujarHero, dibujarKit } from "./ilustracion.js";
import { iniciarPersonalizador } from "./personalizador.js";

const $ = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Ícono y descripción de cada producto (de VENTAS-ONLINE/index.html).
const VISUAL = {
  "mate-algarrobo": ["🧉", "Tallado a mano, virolado en alpaca."],
  "mate-calabaza": ["🍐", "Curado tradicional, listo para usar."],
  "yerba-organica-suave": ["🌿", "Sin palo, cultivo orgánico certificado."],
  "yerba-palo-tradicional": ["🍃", "Blend clásico de larga estacionada."],
  "acc-termo": ["🧴", "Mantiene la temperatura 12+ horas."],
  "acc-bombilla-alpaca": ["🥄", "Pico curvo, filtro removible."],
};

const VISTAS = ["inicio", "tienda", "armar", "menu", "reservas", "invitar", "carrito", "compra"];
let cat = null;
let items = leerCarrito();
let entrega = "envio";
let cotizacion = null;

try { entrega = sessionStorage.getItem("mc_entrega") || "envio"; } catch { /* sin sessionStorage */ }

// ---------- Navegación ----------
function mostrarVista() {
  const nombre = location.hash.replace("#", "");
  const vista = VISTAS.includes(nombre) ? nombre : "inicio";
  VISTAS.forEach((v) => { $("v-" + v).hidden = v !== vista; });
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const activo = a.dataset.nav === vista || (vista === "compra" && a.dataset.nav === "carrito");
    if (activo) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  if (cat && vista === "carrito") renderCarrito();
  if (cat && vista === "compra") renderCompra();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", mostrarVista);

function ir(nombre) {
  if (location.hash === "#" + nombre) mostrarVista(); else location.hash = nombre;
}

function actualizarContador() {
  const total = items.reduce((s, i) => s + i.cantidad, 0);
  $("contador").textContent = total;
  $("contador").hidden = total === 0;
}

// ---------- Tienda ----------
function renderCatalogo(filtro = "Todos") {
  const lista = cat.productos.filter((p) => p.activo && (filtro === "Todos" || p.categoria === filtro));
  $("catalogo").innerHTML = lista.map((p) => {
    const [icono, desc] = VISUAL[p.id] ?? ["🧉", ""];
    const stock = cat.stock[p.id] ?? 0;
    return `
      <article class="producto">
        <div class="producto-icono" aria-hidden="true">${icono}</div>
        <span class="chip">${esc(p.categoria)}</span>
        <h3>${esc(p.nombre)}</h3>
        <p class="desc">${esc(desc)}</p>
        <div class="producto-pie">
          <strong class="precio">${fmt(p.precio)}</strong>
          <button type="button" class="btn solid chico" data-id="${esc(p.id)}" data-nombre="${esc(p.nombre)}" ${stock < 1 ? "disabled" : ""}>${stock < 1 ? "Sin stock" : "+ Agregar"}</button>
        </div>
      </article>`;
  }).join("");
}

function iniciarTienda() {
  const categorias = ["Todos", ...new Set(cat.productos.filter((p) => p.activo).map((p) => p.categoria))];
  $("filtros").innerHTML = categorias.map((c, i) => `<button type="button" class="filtro" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  $("filtros").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-cat]");
    if (!b) return;
    $("filtros").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderCatalogo(b.dataset.cat);
  });
  $("catalogo").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-id]");
    if (!b || b.disabled) return;
    items = agregarItem({ id: b.dataset.id, nombre: b.dataset.nombre });
    actualizarContador();
    const antes = b.textContent;
    b.textContent = "Agregado ✓";
    setTimeout(() => { b.textContent = antes; }, 1200);
  });
  renderCatalogo();
}

// ---------- Carrito ----------
function pagoSeleccionado() {
  return document.querySelector('#v-compra input[name="pago"]:checked')?.value ?? "whatsapp";
}

function recotizar(pago) {
  cotizacion = cotizar({ items, entrega, pago: pago ?? "whatsapp" });
  return cotizacion;
}

function precioUnitario(item) {
  const todas = cat.pasos.flatMap((p) => p.opciones);
  if (item.armado) {
    const { mate, bombilla, yerba, extras = [] } = item.armado;
    return [mate, bombilla, yerba, ...extras].reduce((s, id) => s + (todas.find((o) => o.id === id)?.precio ?? 0), 0);
  }
  return cat.productos.find((p) => p.id === item.id)?.precio ?? 0;
}

function renderCarrito() {
  const hay = items.length > 0;
  $("carrito-vacio").hidden = hay;
  $("carrito-contenido").hidden = !hay;
  document.querySelectorAll('input[name="entrega"]').forEach((r) => { r.checked = r.value === entrega; });
  if (!hay) return;

  const c = recotizar();
  const faltan = new Set(c.faltantes.map((f) => f.id));
  $("lineas").innerHTML = items.map((item, i) => {
    const sinStock = !item.armado && faltan.has(item.id);
    return `
      <div class="linea ${sinStock ? "sin-stock" : ""}" data-i="${i}">
        <div>
          <div class="linea-nombre">${esc(item.nombre)}</div>
          <div class="nota">${fmt(precioUnitario(item))} c/u</div>
          ${sinStock ? '<p class="aviso-stock">Sin stock suficiente</p>' : ""}
        </div>
        <div class="controles">
          <button type="button" class="sec" data-accion="menos" aria-label="Restar uno">−</button>
          <span class="cantidad">${item.cantidad}</span>
          <button type="button" class="sec" data-accion="mas" aria-label="Sumar uno">+</button>
          <button type="button" class="sec" data-accion="quitar">Quitar</button>
        </div>
      </div>`;
  }).join("");

  const t = c.totales;
  $("subtotal").textContent = fmt(t.subtotal);
  $("envio").textContent = entrega === "retiro" ? "Retiro sin costo" : t.envio === 0 ? "Gratis" : fmt(t.envio);
  $("total").textContent = fmt(t.total);
  $("aviso-envio").textContent = entrega === "retiro"
    ? "Retirás en el local, sin costo de envío."
    : t.envio > 0 ? `Envío gratis desde ${fmt(c.envioGratisDesde)} de compra.` : "¡Tenés envío gratis!";
  $("aviso-transferencia").textContent = `Pagando por transferencia tenés ${CONFIG.transferenciaPct} % de descuento sobre productos: ${fmt(c.totalTransferencia)} en total.`;

  const hayFaltantes = c.faltantes.length > 0;
  $("error-stock").hidden = !hayFaltantes;
  $("error-general").hidden = c.errores.length === 0;
  $("error-general").textContent = c.errores.join(" ");
  $("seguir").disabled = !c.ok;
}

function iniciarCarrito() {
  $("lineas").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-accion]");
    if (!b) return;
    const i = Number(b.closest(".linea").dataset.i);
    const item = items[i];
    if (!item) return;
    if (b.dataset.accion === "quitar") items.splice(i, 1);
    else if (b.dataset.accion === "mas") item.cantidad = Math.min(99, item.cantidad + 1);
    else item.cantidad = Math.max(1, item.cantidad - 1);
    guardarCarrito(items);
    actualizarContador();
    renderCarrito();
  });
  document.querySelectorAll('input[name="entrega"]').forEach((r) => r.addEventListener("change", () => {
    entrega = r.value;
    try { sessionStorage.setItem("mc_entrega", entrega); } catch { /* sin sessionStorage */ }
    renderCarrito();
  }));
  $("seguir").addEventListener("click", () => {
    try { sessionStorage.setItem("mc_entrega", entrega); } catch { /* sin sessionStorage */ }
    ir("compra");
  });
}

// ---------- Compra ----------
function mostrarErrorCompra(msg) {
  $("error").textContent = msg;
  $("error").hidden = !msg;
}

function pintarResumen() {
  const pago = pagoSeleccionado();
  $("bloque-direccion").hidden = entrega !== "envio";
  document.querySelectorAll('#v-compra input[name="entrega-c"]').forEach((r) => { r.checked = r.value === entrega; });
  const c = recotizar(pago);
  const t = c.totales;
  const descuento = pago === "transferencia" ? Math.round(t.subtotal * CONFIG.transferenciaPct / 100) : 0;
  $("resumen-lineas").innerHTML = c.lineas.map((l) => `<p>${l.cantidad} × ${esc(l.nombre)}</p>`).join("");
  $("r-subtotal").textContent = fmt(t.subtotal);
  $("r-descuento").textContent = descuento ? `− ${fmt(descuento)}` : "$0";
  $("r-envio").textContent = t.envio === 0 ? (entrega === "retiro" ? "Retiro" : "Gratis") : fmt(t.envio);
  $("r-total").textContent = fmt(t.total);
  $("enviar").disabled = !c.ok;
  mostrarErrorCompra(c.ok ? "" : c.errores.join(" ") || (c.faltantes.length ? "Hay productos sin stock suficiente. Volvé al carrito." : "Tu carrito está vacío."));
}

function renderCompra() {
  $("instrucciones-transferencia").hidden = true;
  $("pedido-enviado").hidden = true;
  $("form").hidden = false;
  pintarResumen();
}

function datosComprador() {
  const fd = new FormData($("form"));
  return {
    nombre: (fd.get("nombre") ?? "").toString().trim(),
    telefono: (fd.get("telefono") ?? "").toString().trim(),
    email: (fd.get("email") ?? "").toString().trim(),
    direccion: entrega === "envio" ? (fd.get("direccion") ?? "").toString().trim() : "",
  };
}

function textoPedido(c, comprador, pago) {
  const lineas = c.lineas.map((l) => `- ${l.cantidad} x ${l.nombre}`).join("\n");
  const ent = entrega === "envio" ? `Envío a ${comprador.direccion}` : "Retiro en el local";
  const total = pago === "transferencia" ? c.totalTransferencia : c.totales.total;
  return `Hola! Quiero hacer este pedido:\n${lineas}\n${ent}\nTotal: ${fmt(total)}\nNombre: ${comprador.nombre}\nTeléfono: ${comprador.telefono}`;
}

const linkWhatsApp = (texto) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

function iniciarCompra() {
  document.querySelectorAll('#v-compra input[name="entrega-c"]').forEach((r) => r.addEventListener("change", () => {
    entrega = r.value;
    try { sessionStorage.setItem("mc_entrega", entrega); } catch { /* sin sessionStorage */ }
    $("instrucciones-transferencia").hidden = true;
    pintarResumen();
  }));
  document.querySelectorAll('#v-compra input[name="pago"]').forEach((r) => r.addEventListener("change", () => {
    $("instrucciones-transferencia").hidden = true;
    pintarResumen();
  }));

  $("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const pago = pagoSeleccionado();
    const c = recotizar(pago);
    if (!c.ok) return;
    const comprador = datosComprador();
    if (!comprador.nombre || !comprador.telefono) return mostrarErrorCompra("Completá nombre y teléfono.");
    if (entrega === "envio" && !comprador.direccion) return mostrarErrorCompra("Para envío a domicilio falta la dirección.");
    mostrarErrorCompra("");

    const texto = textoPedido(c, comprador, pago);
    if (pago === "transferencia") {
      $("alias").textContent = CONFIG.alias;
      $("monto").textContent = fmt(c.totalTransferencia);
      $("wa-transferencia").href = linkWhatsApp(texto);
      $("instrucciones-transferencia").hidden = false;
      $("instrucciones-transferencia").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // Coordinar por WhatsApp
    $("wa-pedido").href = linkWhatsApp(texto);
    $("form").hidden = true;
    $("pedido-enviado").hidden = false;
    $("wa-pedido").focus();
  });

  $("vaciar").addEventListener("click", () => {
    vaciarCarrito();
    items = [];
    actualizarContador();
    ir("inicio");
  });
}

// ---------- Menú ----------
function iniciarMenu() {
  $("menu-lista").innerHTML = MC_DATA.menu.map((seccion) => `
    <section class="menu-seccion">
      <h2><span aria-hidden="true">${esc(seccion.icono)}</span> ${esc(seccion.titulo)}</h2>
      <ul class="menu-items">
        ${seccion.items.map((it) => `
          <li><div><strong>${esc(it.nombre)}</strong><span class="nota">${esc(it.desc)}</span></div><span class="precio">${fmt(it.precio)}</span></li>`).join("")}
      </ul>
    </section>`).join("");
}

// ---------- Inicio y contacto ----------
function iniciarInicio() {
  $("direccion").textContent = SITIO.DIRECCION;
  $("localidad").textContent = SITIO.LOCALIDAD;
  $("maps-link").href = SITIO.MAPS_URL;
  $("horarios").innerHTML = SITIO.HORARIOS.map((h) => `<li><span>${esc(h.dias)}</span><strong>${esc(h.horas)}</strong></li>`).join("");
  const input = $("nombre-wa");
  const actualizar = () => {
    const nombre = input.value.trim();
    const texto = nombre ? `Hola Mate & Café! Soy ${nombre}.` : "Hola Mate & Café!";
    $("wa-link").href = linkWhatsApp(texto);
  };
  input.addEventListener("input", actualizar);
  actualizar();
}

// ---------- Arranque ----------
async function arrancar() {
  $("hero-art").innerHTML = dibujarHero();
  $("kit-banner").innerHTML = dibujarKit();
  $("banner-ilus").innerHTML = dibujarMate({ mate: "mate-algarrobo", bombilla: "bombilla-alpaca", yerba: "yerba-serranas", extras: [] }, { id: "ban" });
  iniciarInicio();
  iniciarMenu();
  iniciarReservas();
  iniciarInvitacion();
  iniciarPersonalizador();
  iniciarCarrito();
  iniciarCompra();
  actualizarContador();
  mostrarVista();
  try {
    cat = await cargarCatalogo();
    iniciarTienda();
    if (location.hash === "#carrito") renderCarrito();
    if (location.hash === "#compra") renderCompra();
  } catch {
    $("catalogo").innerHTML = '<p class="error">No pudimos cargar el catálogo. Recargá la página.</p>';
  }
}
arrancar();
