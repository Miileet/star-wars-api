const tbody = document.getElementById("tbody");
const anterior = document.getElementById("anterior");
const siguiente = document.getElementById("siguiente");
const ficha = document.getElementById("ficha");

let previous = null;
let next = null;
let arrayPersonajes = [];

const API_URL = "https://www.swapi.tech/api";

window.addEventListener("load", () => {
  mostrarPersonajes(API_URL + "/films");
});

anterior.onclick = () => {
  if (!previous) return;
  mostrarPersonajes(previous);
};

siguiente.onclick = () => {
  if (!next) return;
  mostrarPersonajes(next);
};

async function mostrarPersonajes(ruta) {
  showSpinner(tbody);
  const response = await fetch(ruta);
  const json = await response.json();
  previous = json.previous;
  next = json.next;

  /**
   * @type { {uid: string, name: string, url: string}[] }
   * @type { {uid: string, properties: {name: string, url: string}}[] }
   */

  arrayPersonajes = json.result || json.results;

  mostrarArray();
}

function mostrarArray() {
  tbody.replaceChildren();

  arrayPersonajes.forEach((pj) => {
    const tr = document.createElement("tr");

    const idEl = document.createElement("td");
    idEl.textContent = pj.uid;

    const nameEl = document.createElement("td");
    nameEl.textContent = pj.films || pj.properties.films;

    const urlEl = document.createElement("td");
    const fichaBtn = document.createElement("button");

    urlEl.append(fichaBtn);
    fichaBtn.classList.add("btn", "btn-warning");
    fichaBtn.textContent = "Show info";

    fichaBtn.onclick = () => verFicha(pj.uid);

    tr.append(idEl, nameEl, urlEl);
    tbody.appendChild(tr);
  });
}

function showSpinner(elemento) {
  elemento.replaceChildren();
  elemento.insertAdjacentHTML(
    "afterbegin",
    `<tr>
    <td colspan="3">
    <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
    </div>
    </td>
    </tr>`,
  );
}

async function verFicha(id) {
  showSpinner(ficha);
  const response = await fetch(API_URL + "/films/" + id);
  const json = await response.json();

  const { title, release_date, producer, opening_crawl, director } =
    json.result.properties;

  ficha.replaceChildren();

  ficha.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="card" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">Name: ${name}</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Titulo: ${title}</li>
            <li class="list-group-item">Fecha de lanzamiento: ${release_date}</li>
            <li class="list-group-item">Productor: ${producer}</li>
            <li class="list-group-item">Resumen: ${opening_crawl}</li>
            <li class="list-group-item">director: ${director}</li>
          </ul>
        </div>
    `,
  );
}
