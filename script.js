const form = document.getElementById("search-form");
const input = document.getElementById("pokemon-input");
const statusElement = document.getElementById("status");
const resultElement = document.getElementById("result");

function setStatus(message, type = "") {
  statusElement.textContent = message;
  statusElement.className = `status ${type}`.trim();
}

function clearResult() {
  resultElement.innerHTML = "";
}

function normalizePokemonName(value) {
  return value.trim().toLowerCase();
}

function validatePokemonName(name) {
  if (!name) {
    throw new Error("Ingresá el nombre de un Pokémon.");
  }
}

function formatTypes(types) {
  return types.map((item) => item.type.name).join(", ");
}

function formatMeasure(value) {
  return (value / 10).toFixed(1);
}

function getPokemonImage(sprites) {
  return (
    sprites.other?.["official-artwork"]?.front_default ||
    sprites.front_default ||
    ""
  );
}

function renderPokemon(pokemon) {
  const image = getPokemonImage(pokemon.sprites);

  resultElement.innerHTML = `
    <article class="pokemon-card">
      ${
        image
          ? `<img class="pokemon-image" src="${image}" alt="${pokemon.name}" />`
          : ""
      }
      <h2 class="pokemon-name">${pokemon.name}</h2>
      <ul class="info-list">
        <li class="info-item">
          <span class="info-label">Tipo(s)</span>
          <span>${formatTypes(pokemon.types)}</span>
        </li>
        <li class="info-item">
          <span class="info-label">Peso</span>
          <span>${formatMeasure(pokemon.weight)} kg</span>
        </li>
        <li class="info-item">
          <span class="info-label">Altura</span>
          <span>${formatMeasure(pokemon.height)} m</span>
        </li>
      </ul>
    </article>
  `;
}

async function fetchPokemon(name) {
  let response;

  try {
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  } catch (error) {
    throw new Error("No se pudo conectar con la PokéAPI. Intentá nuevamente.");
  }

  if (response.status === 404) {
    throw new Error("No se encontró ningún Pokémon con ese nombre.");
  }

  if (!response.ok) {
    throw new Error("Ocurrió un error al consultar la información del Pokémon.");
  }

  return response.json();
}

async function handleSearch(event) {
  event.preventDefault();

  const pokemonName = normalizePokemonName(input.value);

  clearResult();

  try {
    validatePokemonName(pokemonName);
    setStatus("Buscando Pokémon...", "loading");

    const pokemon = await fetchPokemon(pokemonName);

    setStatus("");
    renderPokemon(pokemon);
  } catch (error) {
    setStatus(error.message || "Ocurrió un error inesperado.", "error");
  }
}

form.addEventListener("submit", handleSearch);
