// Cotización en el navegador. Es la misma lógica de VENTAS-ONLINE/lib/pedido.js (cotizar), sin servidor:
// los precios salen del catálogo y del armador, nunca del carrito, y el stock sale de data/stock.json.
import { calcularTotales } from "./precios.js";
import { necesidades, faltantes as calcularFaltantes } from "./stock.js";
import { CONFIG } from "./config.js";

const ENTREGAS = ["envio", "retiro"];

let catalogo = null;

export async function cargarCatalogo() {
  if (catalogo) return catalogo;
  const leer = async (nombre) => {
    const res = await fetch(`data/${nombre}.json`);
    if (!res.ok) throw new Error(`No se pudo leer ${nombre}`);
    return res.json();
  };
  const [productos, armador, stock] = await Promise.all([leer("productos"), leer("armador"), leer("stock")]);
  catalogo = { productos: productos.productos, pasos: armador.pasos, stock: stock.stock };
  return catalogo;
}

function opcionDe(pasoId, opcionId) {
  const paso = catalogo.pasos.find((p) => p.id === pasoId);
  return paso?.opciones.find((o) => o.id === opcionId);
}

export function cotizar({ items, entrega, pago }) {
  const errores = [];
  const lineas = [];

  if (!Array.isArray(items) || items.length === 0) errores.push("El carrito está vacío.");
  if (!ENTREGAS.includes(entrega)) errores.push("Elegí envío o retiro.");

  for (const raw of Array.isArray(items) ? items : []) {
    const cantidad = Number.isInteger(raw?.cantidad) ? raw.cantidad : 0;
    if (cantidad < 1 || cantidad > 99) {
      errores.push("La cantidad de un producto no es válida.");
      continue;
    }

    if (raw.armado) {
      const a = raw.armado;
      const extras = Array.isArray(a.extras) ? a.extras : [];
      const mate = opcionDe("mate", a.mate);
      const bombilla = opcionDe("bombilla", a.bombilla);
      const yerba = opcionDe("yerba", a.yerba);
      const extrasOk = extras.map((id) => opcionDe("extras", id));
      if (!mate || !bombilla || !yerba || extrasOk.some((e) => !e)) {
        errores.push("Hay una opción del armado que ya no está disponible.");
        continue;
      }
      const precio = [mate, bombilla, yerba, ...extrasOk].reduce((s, o) => s + o.precio, 0);
      lineas.push({
        id: "armado",
        nombre: `Kit armado (${mate.nombre} + ${yerba.nombre})`,
        precio,
        cantidad,
        armado: { mate: a.mate, bombilla: a.bombilla, yerba: a.yerba, extras },
      });
    } else {
      const p = catalogo.productos.find((x) => x.id === raw.id && x.activo);
      if (!p) {
        errores.push("Hay un producto que ya no está disponible.");
        continue;
      }
      lineas.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad });
    }
  }

  const mapa = Object.fromEntries(catalogo.productos.map((p) => [p.id, p]));
  const necesidad = necesidades(lineas, mapa);
  const disponible = {};
  for (const id of Object.keys(necesidad)) disponible[id] = catalogo.stock[id] ?? 0;
  const faltantes = calcularFaltantes(necesidad, disponible);

  const totales = calcularTotales(lineas, { entrega, pago: pago ?? "whatsapp" }, CONFIG);
  const totalTransferencia = calcularTotales(lineas, { entrega, pago: "transferencia" }, CONFIG).total;

  return {
    ok: errores.length === 0 && faltantes.length === 0 && lineas.length > 0,
    errores,
    faltantes,
    lineas,
    totales,
    totalTransferencia,
    envioGratisDesde: CONFIG.envio.umbralGratis,
  };
}
