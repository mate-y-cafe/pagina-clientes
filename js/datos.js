// Menú (de cafeteria.html) y tienda (de mate.html) en una sola fuente.
// Precios en pesos enteros. Si cambian en esas páginas, actualizalos acá.
export const MC_DATA = {
  menu: [
    {
      titulo: 'Café de Especialidad',
      icono: '☕',
      items: [
        { nombre: 'Espresso de origen', desc: 'Grano single origin, tueste claro', precio: 2200 },
        { nombre: 'Flat White', desc: 'Doble shot, leche vaporizada sedosa', precio: 3100 },
        { nombre: 'Cold Brew 12hs', desc: 'Extracción en frío, notas dulces', precio: 3400 },
        { nombre: 'Té de hebras premium', desc: 'Selección orgánica, blend de la casa', precio: 2600 },
        { nombre: 'Chocolate Caliente Artesanal', desc: 'Cacao 70%, espuma de leche', precio: 3300 }
      ]
    },
    {
      titulo: 'Pastelería & Salados',
      icono: '🥐',
      items: [
        { nombre: 'Medialunas de manteca (x2)', desc: 'Horneadas todas las mañanas', precio: 1900 },
        { nombre: 'Tostado de jamón crudo y queso', desc: 'Pan de campo, rúcula', precio: 4500 },
        { nombre: 'Scon de queso y romero', desc: 'Recién horneado', precio: 2100 },
        { nombre: 'Budín de naranja y almendras', desc: 'Porción casera', precio: 2800 },
        { nombre: 'Cheesecake de frutos rojos', desc: 'Porción individual', precio: 3900 },
        { nombre: 'Tabla de fiambres & quesos', desc: 'Ideal para compartir', precio: 8500 }
      ]
    }
  ],
  tienda: [
    { cat: 'Mates', nombre: 'Mate Imperial de Algarrobo', desc: 'Tallado a mano, virolado en alpaca.', precio: 18500 },
    { cat: 'Mates', nombre: 'Mate Calabaza Curado', desc: 'Curado tradicional, listo para usar.', precio: 9800 },
    { cat: 'Mates', nombre: 'Mate de Cerámica Artesanal', desc: 'Esmaltado y pintado a mano.', precio: 12300 },
    { cat: 'Mates', nombre: 'Mate Torpedo Pintado a Mano', desc: 'Diseño exclusivo de artistas locales.', precio: 14700 },
    { cat: 'Yerbas', nombre: 'Yerba Orgánica Suave', desc: 'Sin palo, cultivo orgánico certificado.', precio: 4200 },
    { cat: 'Yerbas', nombre: 'Yerba con Palo Tradicional', desc: 'Blend clásico de larga estacionada.', precio: 3600 },
    { cat: 'Yerbas', nombre: 'Yerba Saborizada Cítrica', desc: 'Notas de limón y pomelo rosado.', precio: 4500 },
    { cat: 'Yerbas', nombre: 'Yerba con Hierbas Serranas', desc: 'Peperina, poleo y cedrón.', precio: 4100 },
    { cat: 'Termos', nombre: 'Termo Acero Inoxidable 1L', desc: 'Mantiene la temperatura 12+ horas.', precio: 22900 },
    { cat: 'Termos', nombre: 'Matera de Cuero con Termo', desc: 'Set completo para llevar a todos lados.', precio: 34900 },
    { cat: 'Bombillas', nombre: 'Bombilla de Alpaca Clásica', desc: 'Pico curvo, filtro removible.', precio: 7300 },
    { cat: 'Bombillas', nombre: 'Bombilla de Autor Grabada', desc: 'Edición limitada, grabado artesanal.', precio: 11200 }
  ]
};
