// Configuración de la tienda (de VENTAS-ONLINE/tienda/js/config.js). Los valores marcados PLACEHOLDER son provisorios.

export const CONFIG = {
  // Envío a domicilio (PLACEHOLDER)
  envio: {
    costo: 5000,              // ARS
    umbralGratis: 80000,      // ARS de subtotal a partir del cual el envío es gratis (PLACEHOLDER)
  },
  // Descuento por transferencia, solo sobre productos (PLACEHOLDER)
  transferenciaPct: 10,
  // Datos de pago y contacto (PLACEHOLDER)
  alias: "PLACEHOLDER.ALIAS",
  whatsapp: "5491100000000",
  direccionLocal: "PLACEHOLDER: dirección del local",
};

// Datos del local (de Invitacion-online/js/config.js).
export const SITIO = {
  DIRECCION: "Av. Yerba Mate 1801",
  LOCALIDAD: "Palermo, CABA, Argentina",
  MAPS_URL: "https://www.google.com/maps/search/?api=1&query=Av.%20Yerba%20Mate%201801%2C%20Palermo%2C%20CABA",
  HORARIOS: [
    { dias: "Lunes a Viernes", horas: "8:00 – 21:00" },
    { dias: "Sábados", horas: "9:00 – 22:00" },
    { dias: "Domingos", horas: "9:00 – 20:00" },
  ],
};
