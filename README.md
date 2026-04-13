# Mini Pokédex — TP 5

Aplicación web que permite buscar un Pokémon por nombre y consultar sus datos principales, consumiendo la API pública [PokéAPI](https://pokeapi.co/).

---

## Endpoints utilizados

### `GET https://pokeapi.co/api/v2/pokemon/{nombre}`

Devuelve información detallada de un Pokémon a partir de su nombre (en minúsculas).

**Datos utilizados de la respuesta:**

| Campo | Descripción |
|---|---|
| `sprites.other["official-artwork"].front_default` | Imagen oficial del Pokémon |
| `sprites.front_default` | Imagen de respaldo si no hay artwork oficial |
| `types[].type.name` | Tipo(s) del Pokémon (ej: `fire`, `flying`) |
| `weight` | Peso en hectogramos (se convierte a kg dividiendo por 10) |
| `height` | Altura en decímetros (se convierte a metros dividiendo por 10) |

**Ejemplo de request:**
```
GET https://pokeapi.co/api/v2/pokemon/pikachu
```

**Códigos de respuesta manejados:**
- `200 OK` → se procesan y muestran los datos
- `404 Not Found` → se informa que el Pokémon no existe
- Otros errores de red → se muestra un mensaje de error genérico

---

## Estructura del proyecto

```
tp5-pokedex/
├── index.html      # Estructura HTML de la aplicación
├── styles.css      # Estilos visuales
└── script.js       # Lógica de búsqueda y manipulación del DOM
```

### `index.html`
Contiene el layout principal: un formulario de búsqueda con un `<input>` de texto y un botón, un `<div>` para mensajes de estado (`#status`) y una sección `<section>` para mostrar el resultado (`#result`). Ambas áreas tienen `aria-live="polite"` para accesibilidad.

### `styles.css`
Define los estilos de la tarjeta principal, el formulario, los estados de carga/error y la tarjeta de resultado del Pokémon.

### `script.js`
Contiene toda la lógica de la aplicación:
- Captura el evento `submit` del formulario
- Valida que el campo no esté vacío
- Realiza el `fetch` a la PokéAPI de forma asíncrona
- Maneja los distintos estados (cargando, éxito, error 404, error de red)
- Construye e inyecta el HTML del resultado en el DOM

---

## Decisiones tomadas

**Uso de `async/await` con `try/catch`**  
Se eligió esta sintaxis sobre `.then()/.catch()` por ser más legible y fácil de mantener, especialmente al encadenar múltiples operaciones asíncronas.

**Manejo diferenciado del error 404**  
Se separó el caso `404` del bloque `catch` general porque es un error esperado y predecible (el Pokémon no existe), mientras que el `catch` queda reservado para errores de red o problemas de conectividad. Esto permite mostrar mensajes más precisos al usuario.

**Imagen con fallback**  
Se intenta usar el artwork oficial (`official-artwork`) por tener mayor calidad visual. Si ese campo es `null`, se usa el sprite estándar (`front_default`) como respaldo.

**Conversión de unidades**  
La PokéAPI devuelve el peso en hectogramos y la altura en decímetros. Se convierten a kilogramos y metros respectivamente para mostrar valores más familiares al usuario.

**Normalización del input**  
El nombre ingresado se convierte a minúsculas con `.toLowerCase()` y se le eliminan espacios con `.trim()` antes de enviarlo a la API, ya que la PokéAPI es sensible a las mayúsculas.

**Limpieza del resultado anterior**  
Antes de cada búsqueda nueva se vacían tanto `#status` como `#result`, para evitar que queden datos desactualizados visibles mientras se carga la respuesta.

---

## Dificultades encontradas

**Formato de los datos de la API**  
Los valores de peso y altura no vienen en las unidades que se esperarían (kg y m), sino en hectogramos y decímetros. Fue necesario revisar la documentación de PokéAPI para entender la conversión correcta.

**Disponibilidad de las imágenes**  
No todos los Pokémon tienen artwork oficial. Al asumir que ese campo siempre estaría disponible, algunos resultados mostraban una imagen rota. Se resolvió agregando la comprobación con fallback al sprite estándar.

**Distinguir errores de red de errores de la API**  
Un error 404 no lanza una excepción en `fetch`, por lo que si no se verifica `respuesta.status` antes de llamar a `.json()`, la aplicación puede comportarse de forma inesperada. Fue necesario agregar la validación explícita del status code antes de procesar la respuesta.

**Estructura anidada del JSON**  
El acceso a `datos.sprites.other["official-artwork"].front_default` requirió explorar la respuesta completa de la API (usando `console.log(datos)` durante el desarrollo) para entender la jerarquía de objetos y llegar al campo correcto.
