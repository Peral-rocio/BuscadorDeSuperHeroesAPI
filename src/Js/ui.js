import { fetchHeroes } from "./api.js";
import { createAppState } from "./state.js";


const appState = createAppState(20);

const heroesGrid = document.getElementById("heroesGrid");
const btnAnt = document.getElementById("btn-Ant");
const btnSig = document.getElementById("btn-sig");
const btnPrimero = document.getElementById("btn-primerapag");
const btnFinal= document.getElementById("btn-finalpag");
const pagInfo = document.getElementById("pagInfo");

const inputBuscador = document.getElementById("buscardor");
const filtroGenero = document.getElementById("genero-filtros");
const filtroOrden = document.getElementById("orden-filtros");
const filtroAlignment = document.getElementById("alignment-Filtro");
const btnBuscar = document.getElementById("btn-buscar");


/* CREACION DE TARJETAS HEROES, MUESTRA EN NAVEGADOR*/

function crearCardHero(hero) {
   const card = document.createElement("div");
   card.classList.add("card-heroes");

   card.innerHTML = `
     <div class="heroes-imagen-contenedor">
       <img src="${hero.images.lg}" alt="${hero.name}" />
     </div>
    <div class="heroes-info">
      <h3>${hero.name}</h3>
      <p>${hero.biography.publisher}</p>
      <button class="button-info"> Info </button>
     </div>
   `;

     const btnInfo = card.querySelector(".button-info");
  btnInfo.addEventListener("click", () => {
    abrirModal(hero);
  });


   return card;
 }

//RENDERIZADO//

function render() {
  heroesGrid.innerHTML = "";

  const heroes = appState.getPaginatedHeroes();

  if (heroes.length === 0) {
    heroesGrid.innerHTML = `<p class="NotFound"> No se encontró el personaje</p>`;
  } else {
    heroes.forEach(hero => {
      const card = crearCardHero(hero);
      heroesGrid.appendChild(card);
    });
  }

  renderPagination();
}

//PAGINACION//
function renderPagination() {
  const current = appState.currentPage;
  const total = appState.getTotalPages();

  pagInfo.textContent = `Página ${current} de ${total}`;

  btnPrimero.disabled = current===1;
  btnAnt.disabled = current === 1;
  btnSig.disabled = current === total;
  btnFinal.disabled = current === total;
 
}

//Eventos botones

btnPrimero.addEventListener("click", () => {
  appState.setPage(1);
  render();
})

btnFinal.addEventListener("click", () =>{
  appState.setPage(appState.getTotalPages());
  render();
})

btnAnt.addEventListener("click", () => {
appState.setPage(appState.currentPage - 1) 
    render();
});

btnSig.addEventListener("click", () => {
  appState.setPage(appState.currentPage + 1) 
    render();
});


//evento filtro

btnBuscar.addEventListener("click", () => {
  appState.setFilter("search", inputBuscador.value);
  appState.setFilter("gender", filtroGenero.value);
  appState.setFilter("alignment", filtroAlignment.value);
  appState.setFilter("order", filtroOrden.value);

  render();
})

/* MODAL DE LAS CARD  */ 
let modalElemento = null;

// Inicializa modal y eventos
export function verModal(heroModal, btnCerrarId) {
  modalElemento = document.getElementById(heroModal);
  const btnCerrar = document.getElementById(btnCerrarId);

  if (!modalElemento || !btnCerrar) return;

  // Click en la X
  btnCerrar.addEventListener("click", CerrarModal);

  // Click fuera del contenido
  modalElemento.addEventListener("click", (e) => {
    if (e.target === modalElemento) CerrarModal();
  });

  // Presionar Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalElemento.classList.contains("active")) {
      CerrarModal();
    }
  });
}

verModal ("heroModal", "CerrarModalBtn");

// Cierra el modal
export function CerrarModal() {
  if (modalElemento) {
    modalElemento.classList.remove("active");
  }
}

// Abre el modal y rellena con datos del héroe
export function abrirModal(hero) {
  if (!modalElemento) return;
  const modalBody = document.getElementById("modalBody");
  if (!modalBody) return;

  const imgUrl =
    hero.images?.lg ||
    hero.images?.md ||
    "https://via.placeholder.com/600x800?text=No+Image";

  const stats = hero.powerstats || {};
  const getStat = (val) => (val && val !== "null" ? parseInt(val) : 0);

  modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-image">
        <img src="${imgUrl}" alt="${hero.name}">
      </div>
      <div class="modal-details">
        <h2>${hero.name}</h2>
        <div class="real-name">${hero.biography?.fullName || "Nombre Desconocido"}</div>

        <div class="stats-section">
          ${["intelligence","strength","speed","durability","power","combat"]
            .map(stat => {
              const val = getStat(stats[stat]);
              return `
                <div class="stat-row">
                  <div class="stat-label">
                    <span>${stat.toUpperCase()}</span>
                    <span style="color: ${getStatColor(val)}; font-weight: bold;">${val}</span>
                  </div>
                </div>
              `;
            }).join("")}
        </div>

        <div class="info-cards">
          <div class="info-card"><h4>Género/Gender:</h4><p>${hero.appearance?.gender || "-"}</p></div>
          <div class="info-card"><h4>Raza/Race:</h4><p>${hero.appearance?.race || "-"}</p></div>
          <div class="info-card"><h4>Alineación/Alignment:</h4>
            <p style="text-transform: capitalize; color: ${
              hero.biography?.alignment === "good" ? "var(--good-color)" :
              hero.biography?.alignment === "bad" ? "var(--bad-color)" : "var(--neutral-color)"
            };">${hero.biography?.alignment || "-"}</p>
          </div>
          <div class="info-card"><h4>Editorial</h4><p>${hero.biography?.publisher || "-"}</p></div>
          <div class="info-card" style="grid-column: 1 / -1;">
            <h4>Lugar de Nacimiento/Birthplace:</h4>
            <p>${hero.biography?.placeOfBirth === "-" ? "Desconocido" : hero.biography?.placeOfBirth || "Desconocido"}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Animación de las barras
  setTimeout(() => {
    const bars = modalBody.querySelectorAll(".stat-bar-fill");
    bars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = "0";
      setTimeout(() => { bar.style.width = width; }, 50);
    });
  }, 10);

  modalElemento.classList.add("active");
}
// Función auxiliar para color de stats
function getStatColor(val) {
  if (val <= 30) return "red";
  if (val <= 70) return "orange";
  return "green";
}





//CAMBIO DE TEMA: MODO OSCURO MODO CLARO//

const $botonTema = document.getElementById("btnCambiar-Tema")

$botonTema.addEventListener("click", () => {
 if(document.body.classList.contains("modo-Oscuro")){
    document.body.classList.add("modo-Claro")
    document.body.classList.remove("modo-Oscuro")

    $botonTema.textContent="🌞"
 }
 else{
    document.body.classList.add("modo-Oscuro")
    document.body.classList.remove("modo-Claro")

    $botonTema.textContent="🌙"
 }
})


/*MOSTRAR/OCULTAR LOADER "CARGANDO..."*/ 

export function showLoader(show) {
  const loader = document.querySelector(".loader");
  const grid = document.getElementById("heroesGrid");
  if (show) {
    loader.style.display = "flex";
    grid.style.display = "none";
  } else {
    loader.style.display = "none";
    grid.style.display = "grid";
  }
}


//iniciacion y ejecucion de la app//

export async function init() {
  showLoader(true);
  const heroes = await fetchHeroes();
  appState.setHeroes(heroes);
  showLoader(false);
  render();
}

init();




