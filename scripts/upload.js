
// Representa los datos de un Gif
class Gif{
    constructor(id,url){
        this.id= id;
        this.url = url;
    }
}
// Acciones en la interfaz de usuario

function cambioAPrecaptura(){
    // Cambio de iconos
    document.querySelector('.inicio').style.display = 'none';
    document.querySelector('.enCaptura').style.display = 'block';
    document.querySelector('.esperaSubiendo').style.display = 'none';

}
function cambioACapturando(){
    // Camnbio de iconos y pantalla
    document.querySelector('.btn-Capturar').style.display = 'none';
    document.querySelector('.timer').style.display = 'block';
    document.querySelector('.btn-listo').style.display = 'block';
}
function cambioAVista(){
    // Cambio de iconos y pantalla
    document.querySelector('#video').style.display = 'none'
    document.getElementsByClassName('creandoGifosButtons')[1].className = 'creandoGifosButtons vistaCont'
    document.querySelector('.btn-listo').style.display = 'none';
    document.querySelector('.vistaPlay').style.display = 'block';
    document.getElementsByClassName('barraProgreso')[1].style.display = 'grid'
    document.querySelector('.btn-RepetirCaptura').style.display = 'block';
    document.querySelector('.btn-SubirGifo').style.display = 'block';
    document.querySelector('.esperaSubiendo').style.display = 'none'
}
function cambioASubiendo(){
    // Cambio de iconos y pantalla
    document.querySelector('.esperaSubiendo').style.display = 'flex'
    document.querySelector('#gifSubiendo').style.display = 'none'
    document.querySelector('.display').style.display = 'none'
    document.getElementsByClassName('barraProgreso')[0].style.display = 'none';
    document.querySelector('.btn-RepetirCaptura').style.display = 'none';
    document.querySelector('.btn-SubirGifo').style.display = 'none';
    document.querySelector('.vistaPlay').style.display = 'none';
    document.getElementsByClassName('creandoGifosButtons')[1].className = 'creandoGifosButtons';
    document.querySelector('.btn-Cancelar').style.display = 'block';
}
function cambioAExito(gif){
    // Cambio de iconos y pantalla
    document.querySelector('.enCaptura').style.display = 'none';
    document.querySelector('.exito').style.display = 'block';
    agregarGifEnPantallaExito(gif);
    descargarGifo();
}
function vueltaAPrecaptura(){
    // Cambio de iconos y pantalla
    document.querySelector('.timer').style.display = 'none';
    document.querySelector('.btn-Capturar').style.display = 'block';
    document.querySelector('#video').style.display = 'block';
    document.getElementsByClassName('creandoGifosButtons')[1].className = 'creandoGifosButtons';
    document.querySelector('.vistaPlay').style.display = 'none';
    document.getElementsByClassName('barraProgreso')[1].style.display = 'none';
    document.querySelector('.btn-RepetirCaptura').style.display = 'none';
    document.querySelector('.btn-SubirGifo').style.display = 'none';
    
}
function displayGifs(){
    // Desplegar gifs guardados en pantalla
    const gifs =  obtenerGif()
    gifs.forEach((gif)=>{agregarGifEnPantalla(gif)});
}
function agregarGifEnPantallaExito(gif){
    const cont = document.querySelector('.gifoPrevis');
    cont.innerHTML =`
    <img src="${gif.url}"/>
    `
}
function agregarGifEnPantalla(gif){
    const cont = document.querySelector('.misGifosCont')
    const div = document.createElement('div')
    div.className = 'gif_tendencias';
    div.innerHTML = `
    <img src="${gif.url}"/>
    <div class="foot_gif"></div>
    `
    cont.appendChild(div)
}
function informarUrlCopiada(){
    let btn_copiarEnlace = document.querySelector('.btn-copiarExito')
    btn_copiarEnlace.innerText = '¡Enlace Copiado!'
    setTimeout(()=>{
        btn_copiarEnlace.innerText = 'Copiar Enlace Guifo'
    },2000)
    
}


// Acciones al obtener el video
const video = document.getElementById('video');
let recorder; 

async function stopRecordingCallback() {
    video.srcObject = null;
    let blob = await recorder.getBlob();
    const video_url = URL.createObjectURL(blob);

    //Guardando el url del gif grabado en src de un tag img
    let contenedor = document.querySelector("#gif-cont");
    let div = document.createElement('div')
    div.style.height = '100%'
    div.id = 'gifSubiendo'
    div.innerHTML = `<img src="${video_url}" class="display">` 
    contenedor.appendChild(div)
    recorder.stream.stop()
    document.querySelector('.btn-SubirGifo').onclick =  async function obtenerBlob(){        
        subirVideo(blob)
        
    }
}

async function obtenerVideo() {
    //Cambiar al siguente paso
    cambioAPrecaptura();

    let stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
    width: { max: 360 },
    height: {max: 240 }
    }
    });

    video.srcObject = stream;   
    video.play()

};


document.querySelector('.btn-Capturar').onclick= async function grabarVideo(){

    cambioACapturando();

    let stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
        width: { max: 360 },
        height: {max: 240 }
        }
        });
    
    recorder = new RecordRTCPromisesHandler(stream,{
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
        console.log('started')
        },
    });

    await recorder.startRecording();

    recorder.stream = stream;

}

document.querySelector('.btn-listo').onclick = async function() {

    cambioAVista();
    await recorder.stopRecording();
    stopRecordingCallback();

};


function subirVideo(blob){
        
        // Cambio de pantalla y botones
        cambioASubiendo();            

        // Obtener el formato para subir el gif
        let form = new FormData();
        form.append("file", blob, "myGif.gif")
        //posteo de gif capturado
        fetch("http://upload.giphy.com/v1/gifs?api_key=uNch8732T9PG8VQBtWzuHnHx7q2woIsW",{
        method: "POST",
        body: form
        })
        .then(function(response){
            if(response.ok){
                return response.json();
            }else{
                console.log("respuesta de red no OK")
            }
        })
        // Procesar el JSON con ID de gif cargado
        .then((json)=>{guardarDataDeJSON(json)})
}

function guardarDataDeJSON(myJson){
    // Fetch a giphy con id de gif subido para recibir los datos del mismo
    console.log("id de JSON en respuesta al POST", myJson.data.id);
    let response = fetch("http://api.giphy.com/v1/gifs?api_key=uNch8732T9PG8VQBtWzuHnHx7q2woIsW&ids=" + `${myJson.data.id}`)
    response
            .then((response)=> response.json())
            // Guardar en localStorage data de gif recibido
            .then((myjson)=>{agregarGif(myjson)})
}


// Acciones en localStorage

function obtenerGif(){
    //obtener gifs de localStorage
    let gifs;
    if(localStorage.getItem('gifs')===null){
        gifs =[];
    }else{
        gifs = JSON.parse(localStorage.getItem('gifs'))
    }
    return gifs
}
function agregarGif(myJson){
    // Obtengo Id y url de la data del JSON
    let id = myJson.data[0].id
    let url = myJson.data[0].images.original.url
    //Creo un nuevo objeto gif para guardar en local storage
    let gif = new Gif(id,url)
    //Obtengo los gif actualmente guardados
    const gifs = obtenerGif();
    //Agrego el gif a local storage
    gifs.push(gif)
    console.log('array de gif a guardar',gifs)
    localStorage.setItem('gifs', JSON.stringify(gifs))
    // Cambio de pantalla y botones
    cambioAExito(gif);
    //despliego el gif en pantalla
    agregarGifEnPantalla(gif);       
}

function copiarUrlEnPortapapeles(){
    const gifs = obtenerGif();
    const ultimoGif = gifs.pop()
    const urlUltimoGif = ultimoGif.url
    let dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = urlUltimoGif;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    return urlUltimoGif;
}
function descargarGifo(){
   let btnDescargarGifo = document.querySelector('#descargarGif');
   let urlUltimoGif = copiarUrlEnPortapapeles()
   btnDescargarGifo.setAttribute('href',`${urlUltimoGif}`)
}

// Evento Carga de estilos
let linkStyle = document.querySelector(".capturaStyle");

document.addEventListener('DOMContentLoaded', (e)=>{
    const estilo = localStorage.getItem('estilos')
    linkStyle.setAttribute('href', `../${estilo}`)
    // Carga de pagina sin opciones de captura si viene de Mis Gifos
    if (localStorage.getItem('misgifos')){
    document.querySelector('.inicio').style.display = 'none'
    localStorage.removeItem('misgifos');
    }
 })

// Evento display gifs guardados
document.addEventListener('DOMContentLoaded',()=>{
    displayGifs()
})

//Evento click en btn Repetir Captura
document.querySelector('.btn-RepetirCaptura').addEventListener('click', ()=>{

    blob = null;
    obtenerVideo();
    // Vuelta a precaptura
    vueltaAPrecaptura();
    //Condicion cuando se repite grabacion
    if(document.getElementById('gifSubiendo')){
        console.log('ENTRO EN CONDICON BORRAR GIF btn repetir captura')
        document.getElementById('gifSubiendo').remove();
    }
})
// Evento click en btn Cancelar
document.querySelector('.creandoGifosCancelar').addEventListener('click',()=>{
window.location.href = "../../index.html"
});
// Evento click en btn Listo
document.querySelector('.btn-listoExito').addEventListener('click',()=>{
    window.location.href = "../../index.html"
});
// Evento Copiar enlace de guifo
document.querySelector('.btn-copiarExito').addEventListener('click', ()=>{
    copiarUrlEnPortapapeles()
    informarUrlCopiada();
})

// Evento click en btn Comenzar
document.querySelector('.creandoGifosComenzar').addEventListener('click', ()=>{
    obtenerVideo()
})
