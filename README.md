# Mate & Café · Página de clientes

Sitio estático de Mate & Café: boutique online, armador de kits "Armá tu Mate", carrito y compra,
menú del local, reservas e invitaciones.

## Cómo está hecho

- `index.html`: una sola página con vistas (`#inicio`, `#tienda`, `#armar`, `#menu`, `#reservas`, `#invitar`, `#carrito`, `#compra`).
- `js/`: lógica del sitio. Reutiliza el código de los repositorios de la organización:
  - `VENTAS-ONLINE`: `carrito.js`, `precios.js`, `stock.js` y los datos de `data/`. `cotizar.js` es la cotización de `lib/pedido.js` ejecutada en el navegador.
  - `Invitacion-online`: configuración, menú (`datos.js`) y la creación de invitaciones (`invitacion.js`).
  - `sistemareservas`: `reservas.js`.
- `js/ilustracion.js`: ilustraciones SVG del mate, que cambian con cada opción del armador.
- `data/`: catálogo, opciones del armador y stock de ejemplo.

## Para completar antes de publicar

- `js/config.js`: `alias` y `whatsapp` son PLACEHOLDER. Hasta cambiarlos, los pedidos van a un número de ejemplo.
- `data/stock.json`: stock de ejemplo.
- Mercado Pago está desactivado: necesita el servidor de `VENTAS-ONLINE` (`api/crear-preferencia`) con su clave.
- Las reservas se guardan solo en el navegador de quien reserva.

## Probar en local

```bash
python -m http.server 8000
```

y abrir http://localhost:8000
