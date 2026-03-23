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