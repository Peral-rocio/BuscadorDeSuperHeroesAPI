import { fetchHeroes } from "./api.js";


/* CREACION DE TARJETAS HEROES, MUESTRA EN NAVEGADOR*/

function crearCardHero(hero) {
   const card = document.createElement("div");
   card.classList.add("card-heroes");

   card.innerHTML += `
     <div class="heroes-imagen-contenedor">
       <img src="${hero.images.lg}" alt="${hero.name}" />
     </div>
    <div class="heroes-info">
      <h3>${hero.name}</h3>
      <p>Power: ${hero.powerstats.power}</p>
     </div>
   `;
   return card;
 }

export async function mostrarHeroes() {
  const heroesGrid = document.getElementById("heroesGrid");
  const loader = document.querySelector(".loader");

  const heroes = await fetchHeroes();

  loader.style.display = "none";

  heroes.forEach(hero => {
    const card = crearCardHero(hero);
    heroesGrid.appendChild(card);
  });
}


//CAMBIO DE TEMA: MODO OSCURO MODO CLARO//

const $botonTema = document.getElementById("btnCambiar-Tema")
const $tituloTema= document.querySelector("h1")

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