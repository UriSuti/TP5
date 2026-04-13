let formulario = document.getElementById("search-form");
let inputNombre = document.getElementById("pokemon-input");
let divStatus = document.getElementById("status");
let divResultado = document.getElementById("result");

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  let nombre = inputNombre.value.trim().toLowerCase();

  divResultado.innerHTML = "";
  divStatus.textContent = "";
  divStatus.className = "status";

  if (nombre === "") {
    divStatus.textContent = "Ingresá el nombre de un Pokémon.";
    divStatus.className = "status error";
    return;
  }

  divStatus.textContent = "Buscando...";
  divStatus.className = "status loading";

  try {
    let respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);

    if (respuesta.status === 404) {
      divStatus.textContent = "No se encontró ningún Pokémon con ese nombre.";
      divStatus.className = "status error";
      return;
    }

    if (!respuesta.ok) {
      throw new Error("Error al obtener los datos");
    }

    let datos = await respuesta.json();

    let imagen = datos.sprites.other["official-artwork"].front_default;
    if (!imagen) {
      imagen = datos.sprites.front_default;
    }

    let tipos = datos.types
      .map(function (t) {
        return t.type.name;
      })
      .join(", ");
    let peso = (datos.weight / 10).toFixed(1);
    let altura = (datos.height / 10).toFixed(1);

    divStatus.textContent = "";

    divResultado.innerHTML = `
      <article class="pokemon-card">
        ${imagen ? `<img class="pokemon-image" src="${imagen}" alt="${datos.name}" />` : ""}
        <h2 class="pokemon-name">${datos.name}</h2>
        <ul class="info-list">
          <li class="info-item">
            <span class="info-label">Tipo(s)</span>
            <span>${tipos}</span>
          </li>
          <li class="info-item">
            <span class="info-label">Peso</span>
            <span>${peso} kg</span>
          </li>
          <li class="info-item">
            <span class="info-label">Altura</span>
            <span>${altura} m</span>
          </li>
        </ul>
      </article>
    `;
  } catch (error) {
    console.log(error);
    divStatus.textContent =
      "No se pudo conectar con la API. Revisá la conexión e intentá de nuevo.";
    divStatus.className = "status error";
  }
});