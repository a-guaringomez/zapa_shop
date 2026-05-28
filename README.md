# ZapaShop - Tienda Virtual de Zapatos

Aplicación web SPA (Single Page Application) de una tienda virtual de zapatos, completamente funcional del lado del cliente. Desarrollada con HTML5, CSS3, JavaScript Vanilla (ES Modules) y Bootstrap 5.

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Animaciones, variables, gradientes, diseño responsive
- **JavaScript Vanilla (ES Modules)** - Lógica modular del lado del cliente (ES6+)
- **Bootstrap 5.3** - Componentes UI (Navbar, Cards, Offcanvas, Modal, Toast, Badge)
- **Bootstrap Icons** - Iconografía moderna
- **Google Fonts (Poppins)** - Tipografía moderna
- **localStorage** - Persistencia de datos en el navegador

## Estructura del Proyecto

```
tienda-zapatos/
│
├── index.html              # Página principal SPA
├── css/
│   └── styles.css          # Estilos personalizados
├── js/
│   ├── app.js              # Entry point (ES Module): inicialización y event delegation
│   ├── data/
│   │   └── productos.js    # Catálogo de 12 productos + función obtenerProducto()
│   ├── state/
│   │   └── carrito.js      # Estado del carrito: CRUD, persistencia localStorage, totales
│   ├── ui/
│   │   ├── renderizador.js # Renderizado dinámico: productos grid, carrito, totales, badge
│   │   └── modales.js      # Selector de talla, factura, toast, formulario checkout
│   └── utils/
│       └── formateo.js     # formatearCOP(), imgFallback() para imágenes rotas
├── vercel.json             # Configuración para despliegue en Vercel
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Documentación del proyecto
```

### Descripción de Módulos

| Módulo | Exportaciones principales | Responsabilidad |
|---|---|---|
| `js/data/productos.js` | `productos[]`, `obtenerProducto(id)` | Catálogo inmutable de productos |
| `js/state/carrito.js` | `cargarCarrito()`, `getCarrito()`, `agregarAlCarrito()`, `incrementarCantidad()`, `decrementarCantidad()`, `eliminarDelCarrito()`, `vaciarCarrito()`, `calcularTotales()` | Estado del carrito con persistencia localStorage |
| `js/utils/formateo.js` | `formatearCOP(monto)`, `imgFallback(img)` | Formateo moneda COP y fallback de imágenes |
| `js/ui/renderizador.js` | `setBusqueda()`, `renderizarProductos(filtro?)`, `renderizarCarrito()`, `renderizarTotales()`, `actualizarBadge()` | Renderizado dinámico del DOM |
| `js/ui/modales.js` | `abrirSelectorTalla(id)`, `generarFactura(datos)`, `mostrarToast(mensaje)`, `configurarModalTalla()` | Interacciones de modales y notificaciones |
| `js/app.js` | `init()` | Entry point: configura event listeners, inicializa estado y renderiza |

## Convenciones

- **module** (`type="module"`) — sin bundler, imports nativos del navegador.
- **Event delegation** — los clics en botones dinámicos (`[data-producto-id]`, `[data-accion]`) se manejan desde el contenedor padre.
- **Compatibilidad** — `window.imgFallback` se expone globalmente para el atributo `onerror` en las `<img>`.
- **Nombres** — los módulos usan kebab-case para archivos y camelCase para funciones.

## Cómo Ejecutar

1. **Servidor local** (necesario por CORS de módulos ES):
   ```bash
   npx serve .
   ```
2. **VS Code + Live Server** — Abre el proyecto y haz clic en "Go Live".
3. **No funciona** abriendo `index.html` directo desde el explorador de archivos (los módulos ES requieren un servidor HTTP).

## Funcionalidades

### Catálogo de Productos
- 12 productos divididos en 3 categorías: Deportivos, Casuales y Formales
- Tarjetas con gradientes personalizados, iconos y precios en COP
- Animaciones hover y fade-in

### Filtros por Categoría
- Botones de filtro: Todos, Deportivos, Casuales, Formales
- Búsqueda por nombre o descripción
- Renderizado dinámico del catálogo

### Carrito de Compras (Offcanvas)
- Agregar productos con selección de talla y cantidad
- Incrementar / decrementar cantidades
- Eliminar productos individuales
- Vaciar carrito completo
- Badge dinámico con contador

### Cálculo de Totales
- Subtotal por producto y general
- IVA del 19% (Colombia)
- Total a pagar
- Formato moneda COP con Intl.NumberFormat

### Generación de Factura
- Modal con formulario de datos del cliente
- Validación visual Bootstrap
- Factura con número consecutivo, fecha, datos del cliente y tabla de productos
- Impresión y exportación a PDF desde el navegador

### Persistencia
- Carrito guardado en localStorage (clave: `zapashop_carrito`)
- Los datos persisten al recargar la página

### Diseño Responsive
- Adaptable a celulares, tablets y escritorio
- Menú colapsable en móviles
- Grid de productos adaptativo

## Despliegue en Vercel

El proyecto incluye `vercel.json` para despliegue directo:

```bash
npm i -g vercel
vercel
```

O conecta el repositorio directamente desde [vercel.com](https://vercel.com).

## Autor

**ZapaShop** - Tienda virtual de zapatos
Desarrollado como proyecto front-end SPA con tecnologías web estándar.

---

&copy; 2026 ZapaShop. Todos los derechos reservados.
