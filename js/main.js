///Conexion con la base Local, Validación de IndexedDB en los navegadores
let DB = window.indexedDB;
let DBTransaction = window.IDBTransaction;
let DBKRange = window.IDBKeyRange;

//Conexion a la base de registro

  const DataBase = function(DataBaseIndex, DataBaseTransaction, DataBaseKey){
    DataBaseIndex = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    DataBaseTransaction = window.IDBTransaction || window.mozIDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    DataBaseKey = window.IDBKeyRange || window.mozIDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  }
  DataBase(DB, DBTransaction, DBKRange);

  if (!window.indexedDB){//avisa de no ser compatible con el navegador.
    alert("Tu navegador no soporta IndexedDB");
  }
//La variables mas abajo llamadas tx hacen referencia a nombre "transaccion"

//fin.
let dataBase;
let dataArr = new Array();
let activitiesArr = new Array();
let req = window.indexedDB.open("actividades",1);

//funcion fecha del mes
const dateYear = function(y, month, d, h, m, s, t, id){

  document.getElementById("year").value = this.year = typeof y === 'undefined'? "" : y;
  document.getElementById("month").value = this.month = typeof month === 'undefined'? "" : month+1;
  document.getElementById("day").value = this.day = typeof d === 'undefined'? "" : d;
  document.getElementById("hour").value = this.hour = typeof h === 'undefined'? "" : h;
  document.getElementById("minutes").value = this.min = typeof m === 'undefined' ? "" : m;
  document.getElementById("seconds").value = this.seconds = typeof s === 'undefined' ? "" : s;
  document.getElementById("timestamp").value = this.timestamp = typeof t === 'undefined' ? "" : t;
  document.getElementById("id").value = this.id = typeof id === 'undefined' ? NaN : id;
}

const borrar = function(e){
  console.log("Borra",e);
  let id = e.target.id;
  let key = Number(id.substr(1));
  console.info(id, key);
  if (confirm("¿Seguro que desea borrar la actividad con el ID "+key+"?")) {
    let tx = dataBase.transaction("activity", "readwrite");
    let objectStore = tx.objectStore("activity");
    let req = objectStore.delete(key);
    
    req.onsuccess = function(e){
      alert("Se borró la ID "+key+" exitosamente");
      buscar();
    }
  }
}

const modificar = function(e){
  let id = e.target.id;
  let key = Number(id.substr(1));

  let tx = dataBase.transaction(["activity"], "readonly");
  let objectStore = tx.objectStore("activity");
  let req = objectStore.get(key);

  req.onerror = function(e){
    console.warn(e);
    alert("No se pudieron leer los datos de la Key "+key);
  }

  req.onsuccess = function(e){
    if (req.result) {
      dateYear(req.result.year, req.result.month-1, req.result.day, req.result.hour, req.result.minutes, req.result.seconds, req.result.timestamp, req.result.id);
      document.getElementById("activities").value = req.result.activity;
      document.getElementById("observation").value = req.result.observation;
   
    } else {
      alert("No se pudieron leer los datos de la Key "+key);
    }
  }
}

const despliegaTable = function(dataArr){
  let cadena = `<table border='1'>
                <tr>
                  <th>id</th>
                  <th>Hora</th>
                  <th>Actividad</th>
                  <th>Observación</th>
                  <th>Duración</th>
                  <th>Modificar</th>
                  <th>Borrar</th>
                <tr>
                `;
  //recorrer el array
  for (let i = 0; i < dataArr.length; i++) {
    let date = `${dataArr[i].day}/${dataArr[i].month}/${dataArr[i].year} | ${dataArr[i].hour}:${dataArr[i].minutes}:${dataArr[i].seconds}`;
    id = dataArr[i].id;
    cadena += `
              <tr>
                <td>${id}</td>
                <td>${date}</td>
                <td>${dataArr[i].activity}</td>
                <td>${dataArr[i].observation}</td>
                <td>${dataArr[i].duration}</td>
                <td><button id="m${id}">Modificar</button></td>
                <td><button id="b${id}">Borrar</button></td>
              </tr>
              `;
    
  }
  cadena += "</table>";
  document.getElementById("salida").innerHTML = cadena;
  for (let i = 0; i < dataArr.length; i++) {
    id = dataArr[i].id;
    document.getElementById("m"+id).onclick = modificar;
    document.getElementById("b"+id).onclick = borrar;
    
  }
}

const tiempoTranscurrrido = function(time){
  console.log(time);

  time = Math.floor(time / 1000);
  let min = 60;
  let hour = (60 * min);
  let day = (24 * hour);
  let cadena = "";

  let resto = (time % day);
  let days = Math.floor(time / day);
  if (days > 0) cadena += days+" days, ";
  
  time = resto;
  resto = (time % hour);
  let hours = Math.floor(time / hour);
  if (hours > 0) cadena += hours+" horas, ";
  
  time = resto;
  resto = time % min;
  let minutes = Math.floor(time / min);
  if(minutes > 0) cadena += minutes+" min, ";

  let seconds = resto;
  if(seconds > 0) cadena += seconds+" seg.";
  
  console.log(cadena);
  return cadena;

}

const generatedList = function(dataArr){
  activitiesArr = [];
  for (let i = 0; i < dataArr.length; i++) {
    let find = activitiesArr.indexOf(dataArr[i].activity);
    
    if (find === -1) {
      activitiesArr.push(dataArr[i].activity);
    } 
  }
  //Limpiar el listado
  let list = document.getElementById("list");
  while(list.childElementCount > 0){
    list.removeChild(list.firstElementChild);
  }  
  //Aplicarlo en cadena
  let cadena = "";
  for (let i = 0; i < activitiesArr.length; i++) {
    let actividad = activitiesArr[i];
    cadena += `<option value="${actividad}">`;
  }
  list.innerHTML = cadena;
}

const recalcula = function(dataArr){
  let duration = 0;

  for (let i = 0; i < dataArr.length; i++) {
    let sig = i+1;
    if (sig === dataArr.length) {
      break;      
    }
    duration = tiempoTranscurrrido(dataArr[sig].timestamp - dataArr[i].timestamp);
    dataArr[i].duration = duration;
  }
  
}

function buscar(){
  //limpiar el Array
  dataArr = [];
  let filtro = null;
  let asc = "next";

  //Leemos el cursor
  let objectStore = dataBase.transaction("activity").objectStore("activity");
  objectStore.openCursor(filtro,asc).onsuccess = function(e){
    let cursor = e.target.result;
    if (cursor) {
      dataArr.push(cursor.value);
      cursor.continue();
    } else{
      recalcula(dataArr);
      generatedList(dataArr);
      despliegaTable(dataArr);
    }
  }
}

const update = function(){
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours % 12;
  hours = hours ? hours : 12;
 
  dateYear(date.getFullYear(),date.getMonth(), date.getDate(), hours, minutes, date.getSeconds(), Date.now());
 
}

const deleteRegistry = function(){
  if(confirm(`¿Seguro que desea borrar toda la informacion?\nUna vez realizado no podremos recuperar la misma.`));
  let objectStore = dataBase.transaction("activity", "readwrite").objectStore("activity");
  let req = objectStore.clear();

  req.onsuccess = function(e){
    buscar();
    alert("Se eliminaron todas las actividades.");
  }

  req.onerror = function(e){
    alert("Error al intentar eliminar las actividades.");
    console.warn(e);
  }
}

const save = function(){
  let timestamp = document.getElementById("timestamp").value;
  let year = document.getElementById("year").value;
  let month = document.getElementById("month").value;
  let day = document.getElementById("day").value;
  let hour = document.getElementById("hour").value;
  let min = document.getElementById("minutes").value;
  let seg = document.getElementById("seconds").value;
  let id = Number(document.getElementById("id").value);

  let activity = document.getElementById("activities").value;
  let observation = document.getElementById("observation").value;

  let duration = "En curso";

  //validations
  if (timestamp === "") {
    alert("Los campos de la fecha no deben estar vacíos.");
  } else if (activity === "") {
    alert("Los campos de actividad no deben estar vacíos.");
  } else {
    let tx = dataBase.transaction(["activity"], "readwrite");
    let objectStore = tx.objectStore("activity");
    
    //Si el ID es vacio lo guarda como un dato nuevo, de lo contrario, si posee un ID modificaria los datos.
    if (Number.isNaN(id)) {
      req = objectStore.add({year:year, month:month, day:day, hour:hour, minutes:min, seconds:seg, activity:activity, observation:observation, timestamp:timestamp, duration:duration});

      req.onsuccess = function(e){
        console.info(e);
        dateYear();
        document.getElementById("activities").value = "";
        document.getElementById("observation").value ="";
        buscar();
        alert("Se guardo la información satisfactoriamente.");
      }
  
      req.onerror = function(e){
        console.warn(e);
        alert("Error al insertar la información.");
      }

    }else{
      req = objectStore.put({id:id, year:year, month:month, day:day, hour:hour, minutes:min, seconds:seg, activity:activity, observation:observation, timestamp:timestamp, duration:duration});

      req.onsuccess = function(e){
        console.info(e);
        dateYear();
        document.getElementById("activities").value = "";
        document.getElementById("observation").value ="";
        buscar();
        alert("Información modificada satisfactoriamente.");
      }
  
      req.onerror = function(e){
        console.warn(e);
        alert("Error al intentar modificar la información.");
      }
    }
  }
}

req.onblocked = (e) => alert("Cierre los TABS con la misma página, ya que se han aplicado nuevos cambios a la base de datos y necesita actualizarlo.");

req.onerror = (e) => console.info("Error al abrir la base de datos.",e);

req.onsuccess = function(e){
  dataBase = req.result;
  console.info("success", dataBase);
  buscar();
}

req.onupgradeneeded = function(e){
  dataBase = e.target.result;
  let version = dataBase.version;
  if (version === 1) {
    let opciones = {keyPath:"id", autoIncrement:true};
    let objectStore = dataBase.createObjectStore("activity", opciones);
    objectStore.createIndex("by_activity", "activity", {unique:false});
  }
}