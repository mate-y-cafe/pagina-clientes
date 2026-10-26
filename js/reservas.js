// Reservas. Es la lógica de sistemareservas/y.js: horarios cada 30 minutos de 08:00 a 20:00,
// mesa asignada según la cantidad de personas y confirmación en un modal.
// Se agrega: no ofrecer horarios que ya pasaron hoy y guardar las reservas en este dispositivo.
const CLAVE = "mc_reservas";
const $ = (id) => document.getElementById(id);

const MESAS = {
  "1": "Mesa Individual (Pequeña)",
  "2": "Mesa Estándar para Pareja",
  "4": "Mesa Mediana Familiar",
  "6": "Mesa Grande / Combinada (6+ personas)",
};

function hoyLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function leer() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardar(lista) {
  try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch { /* sin storage: la reserva igual se confirma */ }
}

export function iniciarReservas() {
  const timeSelect = $("timeSlot");
  const dateInput = $("reservationDate");
  const personButtons = document.querySelectorAll(".person-btn");
  const tableInfo = $("tableInfo");
  const form = $("reservationForm");
  const modal = $("confirmationModal");
  const error = $("reservationError");
  let selectedPersons = "1";

  const hoy = hoyLocal();
  dateInput.value = hoy;
  dateInput.min = hoy;

  // Horarios de 08:00 a 20:00 cada 30 minutos. Hoy solo los que todavía no pasaron.
  function cargarHorarios() {
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const esHoy = dateInput.value === hoy;
    timeSelect.innerHTML = '<option value="" disabled selected>Seleccioná un horario</option>';
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 0) break;
        if (esHoy && hour * 60 + minute <= minutosAhora) continue;
        const texto = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        const option = document.createElement("option");
        option.value = texto;
        option.textContent = texto;
        timeSelect.appendChild(option);
      }
    }
    if (timeSelect.options.length === 1) {
      const option = document.createElement("option");
      option.disabled = true;
      option.textContent = "No quedan horarios hoy: elegí otro día";
      timeSelect.appendChild(option);
    }
  }
  cargarHorarios();
  dateInput.addEventListener("change", cargarHorarios);

  function mostrarMesa() {
    tableInfo.innerHTML = `Mesa asignada: <strong>${esc(MESAS[selectedPersons])}</strong>`;
  }

  personButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      personButtons.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      selectedPersons = btn.getAttribute("data-persons");
      mostrarMesa();
    });
  });

  function pintarLista() {
    const lista = leer();
    const cont = $("misReservas");
    cont.hidden = lista.length === 0;
    $("misReservasLista").innerHTML = lista.map((r, i) => `
      <li>
        <span><strong>${esc(r.fecha)}</strong> · ${esc(r.hora)} hs · ${esc(r.personas)} persona(s)<br><small>${esc(r.mesa)}</small></span>
        <button type="button" class="link-btn" data-i="${i}">Cancelar</button>
      </li>`).join("");
  }

  $("misReservasLista").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    const lista = leer();
    lista.splice(Number(b.dataset.i), 1);
    guardar(lista);
    pintarLista();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("clientName").value.trim();
    const phone = $("clientPhone").value.trim();
    const time = timeSelect.value;
    const date = dateInput.value;

    let msg = "";
    if (!name) msg = "Completá tu nombre y apellido.";
    else if (phone.replace(/\D/g, "").length < 8) msg = "Poné un teléfono de contacto válido.";
    else if (!date || date < hoy) msg = "Elegí una fecha desde hoy.";
    else if (!time) msg = "Seleccioná un horario.";
    error.textContent = msg;
    if (msg) return;

    guardar([...leer(), { nombre: name, telefono: phone, fecha: date, hora: time, personas: selectedPersons, mesa: MESAS[selectedPersons] }]);
    pintarLista();
    $("modalText").innerHTML = `¡Gracias <strong>${esc(name)}</strong>!<br>Tu reserva para <strong>${esc(selectedPersons)} persona(s)</strong> el día <strong>${esc(date)}</strong> a las <strong>${esc(time)} hs</strong> ha sido registrada con éxito en <strong>Mate y Café</strong>.`;
    modal.hidden = false;
    $("closeModalBtn").focus();
  });

  function cerrar() {
    modal.hidden = true;
    form.reset();
    personButtons.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
    personButtons[0].classList.add("active");
    personButtons[0].setAttribute("aria-pressed", "true");
    selectedPersons = "1";
    mostrarMesa();
    dateInput.value = hoy;
    cargarHorarios();
  }
  $("closeModalBtn").addEventListener("click", cerrar);
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });

  mostrarMesa();
  pintarLista();
}
