# Mate & Café · Página de clientes

Sitio estático de Mate & Café: boutique online, personalizador 3D "Diseñá tu mate", carrito y compra,
menú del local, reservas e invitaciones.

## Cómo está hecho

- `index.html`: una sola página con vistas (`#inicio`, `#tienda`, `#armar`, `#menu`, `#reservas`, `#invitar`, `#carrito`, `#compra`).
- `js/`: lógica del sitio. Reutiliza el código de los repositorios de la organización:
  - `VENTAS-ONLINE`: `carrito.js`, `precios.js`, `stock.js` y los datos de `data/`. `cotizar.js` es la cotización de `lib/pedido.js` ejecutada en el navegador.
  - `Invitacion-online`: configuración, menú (`datos.js`) y la creación de invitaciones (`invitacion.js`).
  - `sistemareservas`: `reservas.js`.
- `js/personalizador.js`: personalizador "Diseñá tu mate" con vista 3D (Three.js), del código de la rama `personalizador-mate-3d` de `dise-atumate`. Sin accesorios. Si no hay WebGL, muestra un dibujo SVG.
- `js/ilustracion.js`: ilustraciones SVG de la portada y el banner.
- `data/`: catálogo, opciones del armador y stock de ejemplo.

## Para completar antes de publicar

- `js/config.js`: `alias` y `whatsapp` son PLACEHOLDER. Hasta cambiarlos, los pedidos van a un número de ejemplo.
- `data/stock.json`: stock de ejemplo.
- Mercado Pago está desactivado: necesita el servidor de `VENTAS-ONLINE` (`api/crear-preferencia`) con su clave.
- Las reservas se guardan solo en el navegador de quien reserva.
- Los pedidos del personalizador no se guardan en ningún sistema: `FIREBASE_CONFIG` en `js/personalizador.js` es `null`, así que el pedido se confirma por WhatsApp. Para que lleguen a `pedidos.html` (dise-atumate) hay que pegar la configuración de Firebase.

## Probar en local

```bash
python -m http.server 8000
```

y abrir http://localhost:8000
