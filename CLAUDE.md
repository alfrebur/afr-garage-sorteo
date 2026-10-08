# AFR Garage Sorteo

Landing del sorteo de AFR Garage (Argentina). La gente compra un pack de fotos digitales y cada foto es una chance para el sorteo de una Jeep Cherokee.

Repositorio: https://github.com/alfrebur/afr-garage-sorteo (rama `main`).

Idioma: todo el texto visible va en español rioplatense (vos, comprá, sumá). Responder al dueño del proyecto (Alfre) en español.

## Estado actual

Solo existe el frente, estático, sin servidor ni build.

- `index.html`: página completa.
- `styles.css`: estilos. Tema oscuro, tokens en `:root` (`--ink`, `--panel`, `--red`, `--maroon`, `--teal`). Fuentes de Google: Bebas Neue (títulos), Work Sans (texto), IBM Plex Mono (números y etiquetas).
- `script.js`: tres bloques independientes, JS plano sin dependencias:
  1. cuenta regresiva (fecha fija en `target`);
  2. selección de pack (radios `.chance-radio` con `data-tier` y `data-price`);
  3. checkout: muestra `#checkout-view`, oculta `#top`, y al enviar el formulario solo muestra una nota. No envía ni guarda nada.
- `assets/logo.png`, `assets/jeep-cherokee.webp`.

Secciones de la página: hero con cuenta regresiva, `#packs`, `#como-funciona`, `#transparencia` (incluye lugar para ganadores), `#detalle`, checkout y botón flotante de chat (sin función todavía).

Packs cargados hoy (valores de ejemplo, sin confirmar): 1, 2, 4, 6, 10, 15, 20, 30, 50 y 200 chances, de $10.000 a $300.000 ARS. El de 6 chances está marcado "más elegido".

El checkout pide: DNI, nombre, apellido, fecha de nacimiento, email, WhatsApp, dirección, localidad, provincia y código postal.

Para ver en local: abrir `index.html` o `python3 -m http.server 8000`.

## Qué queremos construir

Un flujo de compra con validación de comprobante de pago, tomando como referencia el asistente de AutoLoop (chat dentro de la web donde el comprador sube foto o PDF del comprobante de transferencia y recibe "Pago confirmado", número de pedido y sus números del sorteo).

Flujo objetivo:

1. El comprador elige pack y completa el checkout. Se crea un **pedido** con número, monto y vencimiento.
2. Se le muestran los datos para transferir. Si el pedido vence, los datos dejan de valer.
3. Sube el comprobante (foto o PDF) por el chat de la web.
4. El sistema valida y, si está bien, asigna números al azar y los envía (pantalla + email).
5. Lo que no cierra va a revisión manual en un panel de administración.

### Validación del comprobante

Principio: **el comprobante no prueba el pago**, una imagen se edita. Lo único que valida es que la plata figure en la cuenta receptora. El comprobante sirve para saber qué movimiento buscar.

1. Extraer con un modelo con visión: número de operación, monto, fecha y hora, CUIT y CBU/CVU de destino, nombre del pagador.
2. Filtros antes de consultar nada:
   - destino = CBU/CVU y CUIT propios;
   - monto = monto del pedido;
   - fecha posterior a la creación del pedido y dentro del plazo;
   - número de operación no usado en otro pedido (fraude más común: mismo comprobante reenviado).
3. Cruzar contra los movimientos reales de la cuenta. Si aparece, confirmar. Si no, dejar pendiente y reintentar unos minutos.
4. Si algo no coincide o es ilegible: revisión manual.

Alternativas que evitan depender del comprobante: checkout de Mercado Pago con aviso automático (tiene comisión) o monto único por pedido (por ejemplo $15.003) para identificar la transferencia sola.

## Decisiones pendientes

No asumir ninguna de estas; preguntar antes de avanzar.

- **Dónde se cobra**: cuenta de Mercado Pago o banco tradicional. Define cómo se hace el paso 3. Si es Mercado Pago, falta confirmar qué endpoint expone las transferencias recibidas por CVU.
- **Dónde corre el servidor** y qué base de datos se usa. Nada elegido.
- **Dónde se publica la página** (hoy solo está en GitHub, sin hosting).
- **Datos reales**: precios y packs, WhatsApp, Instagram, fecha y hora del sorteo, datos del vehículo, cantidad de premios o etapas.
- **Habilitación legal del sorteo**: número y organismo. La página tiene el lugar reservado y no debe publicarse como sorteo oficial sin ese dato.

## Pendientes conocidos del frente

- La cuenta regresiva usa una fecha de ejemplo ya pasada (`2026-09-12T21:00:00-03:00` en `script.js`), por eso muestra ceros.
- "Mis números" y "Ganadores" son enlaces a secciones, sin funcionalidad.
- El botón de chat no abre nada.
- Puede quedar `afr-garage-sorteo.zip` en la raíz del repo: sobra, borrarlo.

## Reglas de trabajo

- Mantener el frente simple: HTML, CSS y JS planos, sin framework, salvo que se decida otra cosa.
- Nunca poner credenciales, tokens ni datos bancarios reales en el repositorio. Van en variables de entorno; `.env` está en `.gitignore`.
- El checkout junta datos personales (DNI, dirección, fecha de nacimiento). No registrarlos en logs ni exponerlos en el frente.
- Las credenciales de la cuenta de cobro solo viven en el servidor, nunca en `script.js`.
- No inventar datos del sorteo (fechas, premios, precios, habilitación). Si falta uno, dejar el marcador y avisar.
