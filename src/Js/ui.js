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
  if (appState.setPage(appState.currentPage - 1)) {
    render();
  }
});

btnSig.addEventListener("click", () => {
  if (appState.setPage(appState.currentPage + 1)) {
    render();
  }
});


//evento filtro

btnBuscar.addEventListener("click", () => {
  appState.setFilter("search", inputBuscador.value);
  appState.setFilter("gender", filtroGenero.value);
  appState.setFilter("alignment", filtroAlignment.value);
  appState.setFilter("order", filtroOrden.value);

  render();
})


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




