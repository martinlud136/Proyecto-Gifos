// funcionalidad de boton buscar
let btn_buscar = document.getElementById("btn_buscar");
let valorBusqueda;

btn_buscar.addEventListener("click", buscarResultados);

async function buscarResultados(){
    valorBusqueda = document.getElementById("imput_text").value
    console.log(valorBusqueda)
    //busqueda en la API de giphy
    const response = await fetch("https://api.giphy.com/v1/gifs/search?q=" + valorBusqueda + "&api_key=uNch8732T9PG8VQBtWzuHnHx7q2woIsW&limit=12&lang=es")
    const data = await response.json();
    //se oculta la seccion sugerimos al realizar la busqueda
    let sugerimosContainer = document.getElementsByClassName("sugerimosContainer")[0]
    sugerimosContainer.style = "display : none";
    //se imprimen los resultados de la busqueda en la seccion tendencias que cambia su nombre
    let img_busqueda = document.getElementsByClassName("img_busqueda");
    for( let a = 0 ; a < img_busqueda.length; a++){ 
        if(data.data[a]){
            img_busqueda[a].src = data.data[a].images.fixed_height.url;
        }                 
    }

    let resultados = document.getElementById("resultadosBusqueda");
    resultados.innerText = "Resultados de la búsqueda";
    let margenSup = document.getElementsByClassName("tendenciasContainer")[0]
    margenSup.style = "margin-top: 64px";
    //Se esconden las sugerencias luego del click en buscar
    const lista = document.getElementsByClassName("listaSugeridaContent")[0]
    lista.style = "display : none;"
    // Almacenamiento y despliegue de valores de búsqueda
    agregarBusquedas(valorBusqueda);
    desplegarBusquedas(valorBusqueda);
    document.getElementById("imput_text").value = ''
}
// funcionalidad de resultado similar de busqueda
let imput_text = document.getElementById("imput_text")

imput_text.addEventListener("input", async function(){
    let response = await fetch("https://api.giphy.com/v1/gifs/search?q=" + imput_text.value + "&api_key=uNch8732T9PG8VQBtWzuHnHx7q2woIsW&limit=12")
    let data = await response.json();
    const lista = document.getElementsByClassName("listaSugeridaContent")[0]
// impresiones de resultados de busqueda en HTML y condicion si el valor ingresado es 0    
    if (imput_text.value.length === 0){ 
        lista.style = "display : none;"
    } else {
        lista.style = "display : grid; z-index :1;";
        let resultado = document.getElementsByClassName("resultado")
        for(let i = 0; i <= 3; i++ ){
            resultado[i].innerText = data.data[i].title
        }
    }
});


// funcionalidad al seleccionar un boton de sugerencias

let sugerencia1 = document.getElementById("btn-Sug1")
const resultado = document.getElementsByClassName("resultado")

sugerencia1.addEventListener("click", function(){
    let valorSugerencia1 = resultado[0].innerText;
    imput_text.value = valorSugerencia1;
    imput_text.focus();

    const lista = document.getElementsByClassName("listaSugeridaContent")[0]
    lista.style = "display : none";
})

// funcionalidad sugerencias 2
let sugerencia2 = document.getElementById("btn-Sug2")
const resultado2 = document.getElementsByClassName("resultado")

sugerencia2.addEventListener("click", function(){
    let valorSugerencia2 = resultado2[1].innerText;
    imput_text.value = valorSugerencia2;
    imput_text.focus();

    const lista = document.getElementsByClassName("listaSugeridaContent")[0]
    lista.style = "display : none";
})

// funcionalidad sugerencias 3
let sugerencia3 = document.getElementById("btn-Sug3")
const resultado3 = document.getElementsByClassName("resultado")

sugerencia3.addEventListener("click", function(){
    let valorSugerencia3 = resultado3[2].innerText;
    imput_text.value = valorSugerencia3;
    imput_text.focus();

    const lista = document.getElementsByClassName("listaSugeridaContent")[0]
    lista.style = "display : none";
})
//Obtener busquedas de localStorage
function obtenerBusquedas(){
    let busquedas;
    if(localStorage.getItem('busquedas')=== null){
        busquedas = []
    }else{
        busquedas = JSON.parse(localStorage.getItem('busquedas'))
        if(busquedas.length > 10){
            busquedas.pop()
        }
    }
    return busquedas
}
// Añadir las busquedas a localStorage
function agregarBusquedas(busqueda){
    let busquedas = obtenerBusquedas();
    busquedas.unshift(busqueda)
    localStorage.setItem('busquedas', JSON.stringify(busquedas));
}
//Carga de botones con los resultados de búsquedas anteriores
function desplegarBusquedas(busqueda){
    let container = document.querySelector('.resultadoBusquedaContent')
    let lista = document.createElement('li')
    lista.innerHTML = `
    <button class="resultadoBusqueda">#${busqueda}</button>
    `
    container.insertBefore(lista, lista.nextSibling)
}
// Carga de busquedas guardadas
document.addEventListener('DOMContentLoaded', ()=>{
    let busquedas = obtenerBusquedas();
    busquedas.forEach((busqueda)=>{
        desplegarBusquedas(busqueda)
    })
})
// Evento click en alguna busqueda anterior
document.querySelector('.resultadoBusquedaContent').addEventListener('click',(e)=>{
    if(e.target.classList.contains('resultadoBusqueda')){
       let valorBusqueda = e.target.textContent
       imput_text.value = valorBusqueda.slice(1);;
       imput_text.focus();
       buscarResultados()
    }
})

//Carga de los Gifts tendencias
const imagenes = document.getElementsByClassName("img_busqueda");
const imagenesArr = [...imagenes]

let dataTendencias;
async function cargaTendencias(){
    try{
        const response = await fetch("https://api.giphy.com/v1/gifs/trending?api_key=uNch8732T9PG8VQBtWzuHnHx7q2woIsW&limit=12&lang=es")
        dataTendencias = await response.json();
        //Ajuste de ancho de columnas
        ajusteAncho();
        for( let a = 0 ; a < imagenesArr.length; a++){       
            imagenesArr[a].src = dataTendencias.data[a].images.fixed_height.url;    
        }
    } catch (err){
        console.log("no se pudieron cargar las imagenes " + err);
        
    }
}
//Ajuste ancho de columnas
function ajusteAncho(){
   let anchoGifADesplegar = dataTendencias.data[4].images.fixed_height.width
    if(anchoGifADesplegar > 350){
        document.getElementsByClassName('gif_tendencias')[4].style.gridColumn = '1/3';
        document.getElementsByClassName('img_busqueda')[4].style.width = '100%'
        document.getElementsByClassName('gif_tendencias')[5].style.display = 'none'
    }
}
// Carga de los Gifts sugerimos
const imagenesSugerimos = document.getElementsByClassName("gif_sugerimos");
const imagenesSugerimosArr = [...imagenesSugerimos]
let dataSugerimos;

async function cargaSugerimos(){
    try{
        const response = await fetch("https://api.giphy.com/v1/gifs/trending?api_key=uNch8732T9PG8VQBtWzuHnHx7q2woIsW&limit=17&lang=es")
        dataSugerimos = await response.json();
        //Cambio de titulos en sugerencias
        cambioTitulos();
        for(let a = 0 ; a < 4; a++){
            for(let i = 13 ; i <= 17; i++){
                if((a + 13) === i){
                    imagenesSugerimosArr[a].src = dataSugerimos.data[i].images.fixed_height.url;
                }
            }
        }
    }catch(err){
        console.log("no se pudieron cargar las imagenes " + err);
    }
}
//Cambio de titulos en sugerencias
let hashSugerencias = document.getElementsByClassName('hash');
function cambioTitulos(){
    for(let i = 0;i < 4; i++){
        hashSugerencias[i].innerText = `#${dataSugerimos.data[i].slug.split('-',1)}`
    }
}
// Funcionalidad en btn Ver mas
let btnVermas = document.getElementsByClassName('sugerimosContainer')[0];
btnVermas.addEventListener('click',(e)=>{
    if(e.target.classList.contains('gif_vermas')){
       
        let hashtag = e.target.parentElement.previousElementSibling.firstElementChild.textContent
        let hashtag1 = hashtag.slice(1);
        imput_text.value = hashtag1
        imput_text.focus();
        buscarResultados();
   }
});

// funcionalidad day-nigth
let btn_elegirTema = document.querySelector(".btn_elegirtema");
let btn_dropContent = document.querySelector(".btn_dropContent")


// boton desplegable
btn_elegirTema.addEventListener("click", function(e){
    e.stopPropagation()
    btn_dropContent.classList.toggle("mostrar_dropContent");
})


let day = document.querySelector(".day");
let nigth = document.querySelector(".night")
let linkStyle = document.getElementById("cambiarStyle")

//Carga del estilo guardado
document.addEventListener('DOMContentLoaded', (e)=>{
    if(localStorage.getItem('estilos')){
        const estilo = localStorage.getItem('estilos')
        linkStyle.setAttribute('href', `./styles/${estilo}`)
    } else{
        localStorage.setItem('estilos', 'styles.css')
    }
})

//funcion estilo day
day.addEventListener("click", function(){
    if(linkStyle.attributes[2].nodeValue === "./styles/styles.css"){

    }else{
        linkStyle.setAttribute("href","./styles/styles.css" );
        localStorage.setItem('estilos', 'styles.css')
    }
})

//funcion estilo night
nigth.addEventListener("click", function(){
    if(linkStyle.attributes[2].nodeValue === "./styles/stylesNight.css"){
        
    }else{
        linkStyle.setAttribute("href", "./styles/stylesNight.css");
        localStorage.setItem('estilos', 'stylesNight.css')
    }
})

// esconder btn-dropdown de estilos al hacer click en cualquier lugar de la ventana
window.onclick = function(event) {
    if (!event.target.matches('.btn_elegirtema')) {
        if(btn_dropContent.classList.contains("mostrar_dropContent")){
            btn_dropContent.classList.remove("mostrar_dropContent");
        }   
    }
  }
// Evento click en btn Mis Guifos
document.querySelector('.enlace_misGuifos').addEventListener('click',()=>{
    window.location.href = "./styles/capturaGifos/capturaGifos.html";
    localStorage.setItem('misgifos', 'display')
    document.querySelector('.inicio').style.display = 'none'

});

// Evento click en btn Crear Gifos
document.querySelector('.btn_creargifos').addEventListener('click',()=>{
    window.location.href = "./styles/capturaGifos/capturaGifos.html";
    document.querySelector('.inicio').style.display = 'block'
});
