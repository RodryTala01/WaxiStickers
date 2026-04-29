# Conexión con Google Sheets

La web pública solo lee productos y registra pedidos. La carga de productos queda dentro de Google Sheets y Drive, para que no exista un panel público que pueda usar cualquiera.

## Hojas

- `PRODUCTOS`: catálogo visible en la web.
- `PRECIOS`: precios base, tamaños, laminados y precios fijos.
- `PEDIDOS`: una fila por producto comprado.
- `CONFIG`: WhatsApp e Instagram visibles en la web.

## Primer uso

1. Crear un Google Sheet.
2. Abrir `Extensiones > Apps Script`.
3. Pegar el contenido de `apps-script.gs`.
4. Completar `IMAGE_FOLDER_ID` con el ID de la carpeta privada de Drive donde vas a subir imágenes.
5. Ejecutar `setupSheets()` una vez desde Apps Script.
6. Publicar como Web App con acceso de lectura pública para que el catálogo pueda leer productos y guardar pedidos.
7. Pegar la URL del Web App en `STORE_CONFIG.googleSheets.appsScriptUrl` dentro de `catalogo.js`.

## Carga De Productos

Los productos se cargan editando la hoja `PRODUCTOS`, no desde la web pública.

Columnas:

`id,nombre,categoria,subcategoria,imagen1,imagen2,activo,orden,destacado,tipoPrecio,precioFijo,descripcion`

Para stickers usar `tipoPrecio=sticker`. Para productos de precio único usar `tipoPrecio=fijo` y completar `precioFijo`, o cargar el precio en `PRECIOS`.

La página `stickers.html` muestra los productos del Sheet que sean stickers. Si `tipoPrecio` está como `sticker` o vacío, la web los toma como stickers.

La columna `categoria` queda libre para ordenar diseños, por ejemplo `Musica`, `Series`, `Animales` o `Logos`. No hace falta poner `Stickers` como categoría.

Las páginas de personalizados, imanes y extras son fichas informativas fijas desde el código. No se llenan con productos del Sheet.

## Carga Masiva De Imágenes

1. Subir todas las imágenes a la carpeta de Drive indicada en `IMAGE_FOLDER_ID`.
2. Nombrarlas con el `id` o el `nombre` del producto:
   `producto-id-1.jpg` para `imagen1`.
   `producto-id-2.jpg` para `imagen2`.
3. En el Google Sheet, usar el menú `Catálogo > Sincronizar imágenes desde Drive`.

El script ignora mayúsculas, espacios, guiones y acentos. Por ejemplo, si el producto se llama `Logo Soda Stereo`, sirven `Logo-Soda-Stereo-1.png` y `Logo-Soda-Stereo-2.png`.

El script hace públicas esas imágenes con enlace, completa las columnas `imagen1` y `imagen2`, y la web las toma desde el Sheet.

Para que las imágenes se vean bien en la página, el enlace que queda en el Sheet usa este formato:

`https://drive.google.com/thumbnail?id=ID_DEL_ARCHIVO&sz=w1000`

Si ya tenés links viejos de Drive en `imagen1` o `imagen2`, la web también intenta convertirlos automáticamente al cargar el catálogo.

## Rendimiento Con Muchos Stickers

La web muestra los productos por tandas de 24 y carga imágenes de forma diferida, así no intenta dibujar 1000 stickers de una sola vez.

Si el catálogo supera varios miles de productos, la mejor alternativa es cambiar Apps Script a paginación desde servidor: que el Sheet devuelva solo la página actual, por ejemplo 24 o 48 productos por pedido, junto con los filtros necesarios.

También conviene subir imágenes ya optimizadas para web. Las fotos muy grandes suelen pesar más que toda la información del Sheet y son lo que más demora la carga.
