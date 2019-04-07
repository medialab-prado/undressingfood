var canvas;
var myMap;
var data;
var dataExports;
var dataImports;
var meteorites;
var isExport = false;
var w = window.innerWidth;
var h = window.innerHeight;
var currentMeteorite = 0;
var key = 'pk.eyJ1IjoiamFuZWJldGE3IiwiYSI6ImNqdHJmM3J2dDBuN3k0M3BjbnUwcmRzd3QifQ.gO1dFOUH5tWI60sK7lXxpQ';
var white;
var orange ;
var numRows;
var options = {
  lat: 20.459060,
  lng: -27.266175,
  zoom: 2.1,


 style: 'mapbox://styles/janebeta7/cjtrghf5y059l1gnvooyvri2o'
}
var importButton;
var exportButton;
var mappa = new Mappa('MapboxGL', key);

function preload() {
  dataImports = loadTable('data/imports.csv', 'csv', 'header');
  dataExports = loadTable('data/export.csv', 'csv', 'header');
//  print(table.getRowCount() + ' numero total');

}

function setup() {
  canvas = createCanvas(w, h).parent('canvasHolder');

  importButton = createButton('Importaciones');
  importButton.position(50, 50);
  importButton.class("button botonimport ");
  importButton.mousePressed(importaciones);

  exportButton = createButton('Exportaciones');
  exportButton.position(200, 50);
  exportButton.class("button  botonexport");
  exportButton.mousePressed(exportaciones);
  var  instructions = createP('Pulsa uno de los botones para ver las exportaciones o importaciones del aguacate');
 instructions.position(50, 15);
 instructions.style('color', 'rgb(255,255,255)');
 instructions.style('font-family', '"Merriweather", serif;');

 instructions.style('font-size', '20px');
 //meteorites = new MeteoriteSystem();
 myMap = mappa.tileMap(options);
 myMap.overlay(canvas);
  meteorites = new MeteoriteSystem();


}
function importaciones(){
clear();isExport = false;
clear();
meteorites.borrar();
  meteorites = new MeteoriteSystem();
numRows = dataImports.getRowCount();
for (var i=0; i<numRows; i++) {

    print("ciudad"+dataImports.getString(i, 'ciudad'));
    var ciudad = dataImports.getString(i, 'ciudad');
    var pais = dataImports.getString(i, 'pais');
    var finlat =dataImports.getString(i, 'reclat');
    var finlong =dataImports.getString(i, 'reclong');
    var latorigen =dataImports.getString(i, 'finlat');
    var  longorigen=dataImports.getString(i, 'finlong');
  /*  print("pais"+dataImports.getString(i, 'pais'));
    print("latorigen"+dataImports.getString(i, 'reclat'));
    print("longorigen"+dataImports.getString(i, 'reclong'));
    print("finlat"+dataImports.getString(i, 'finlat'));
    print("finlong"+dataImports.getString(i, 'finlong'));*/


    meteorites.addMeteorite(ciudad,pais,latorigen,longorigen,finlat,finlong);

  }


}
function exportaciones(){

  const zoom = myMap.zoom();
  // Change the size of an ellipse depending on the map zoom.
  ellipse(20, 20 , zoom, zoom);
  clear();
  meteorites.borrar();
  isExport = true;
    meteorites = new MeteoriteSystem();
  numRows = dataExports.getRowCount();
  for (var i=0; i<numRows; i++) {

      print("ciudad"+dataExports.getString(i, 'ciudad'));
      var ciudad = dataExports.getString(i, 'ciudad');
      var pais = dataExports.getString(i, 'pais');
      var latorigen  =dataExports.getString(i, 'reclat');
      var longorigen =dataExports.getString(i, 'reclong');
      var finlat =dataExports.getString(i, 'finlat');
      var  finlong =dataExports.getString(i, 'finlong');
    /*  print("pais"+dataImports.getString(i, 'pais'));
      print("latorigen"+dataImports.getString(i, 'reclat'));
      print("longorigen"+dataImports.getString(i, 'reclong'));
      print("finlat"+dataImports.getString(i, 'finlat'));
      print("finlong"+dataImports.getString(i, 'finlong'));*/


      meteorites.addMeteorite(ciudad,pais,latorigen,longorigen,finlat,finlong);

    }


}

function draw(){


  /*fill(255);
  ellipse(random(500),random(500),100,100);*/
 meteorites.render();
  meteorites.showLanded();
}


// Meteorite class
var Meteorite = function(ciudad,pais,latorigen,longorigen,finlat,finlong) {


  this.origin = createVector(0, 0);
  this.destination =  createVector(0, 0);
  this.size = 1;
  this.lat = latorigen;
  this.finlat = finlat;
  this.finlong = finlong;
  this.lng = longorigen;
  this.delta = 0;
  this.trail = [];
  this.pais = pais;
  this.ciudad = ciudad;




  this.pixelPosInicio = myMap.latLngToPixel(this.lat, this.lng);
  this.destination.x = this.pixelPosInicio.x;
  this.destination.y = this.pixelPosInicio.y;
  this.pixelPosFinal = myMap.latLngToPixel(this.finlat, this.finlong);
  this.origin.x = this.pixelPosFinal.x;
  this.origin.y = this.pixelPosFinal.y;



  fill(255);
  if (isExport){

    stroke(0, 192, 176);
  }
  else {

    stroke(114,209,201);
  }
  ellipse(this.origin.x,this.origin.y,10,10);
  ellipse(this.destination.x,this.destination.y,10,10);
  this.instructions = createP(ciudad);
 if (isExport) this.instructions.position(this.destination.x-20,this.destination.y);
 else this.instructions.position(this.origin.x-30,this.origin.y);
 if (ciudad == "Berlin") this.instructions.position(this.destination.x-20,this.destination.y-30);

 if (ciudad == "London") this.instructions.position(this.destination.x-30,this.destination.y-30);

 if (ciudad == "Mexico (Distrito Federal)") this.instructions.position(this.origin.x-70,this.origin.y);


this.instructions.style('color', 'rgb(255,255,255)');
 this.instructions.style('font-family', 'Helvetica');
  if (isExport) this.instructions.style('font-size', '20px');
  else
 this.instructions.style('font-size', '25px');
 this.instructions.style('background-color:', 'rgb(255,255,255)');
  this.instructions.class("ciudad");
};
Meteorite.prototype.delete = function() {
this.instructions.hide();
}
Meteorite.prototype.run = function() {
//  clear();
  this.update();
  this.showTrail();
  this.display();
};

Meteorite.prototype.update = function(){
  this.pixelPos = myMap.latLngToPixel(this.lat, this.lng);
  this.destination.x = this.pixelPos.x;
  this.destination.y = this.pixelPos.y;
  this.position = this.origin.lerp(this.destination, this.delta);
  this.delta > 0.15 ? this.delta += 0.05 : this.delta += 0.0001;

};

Meteorite.prototype.display = function() {

noStroke();
if (isExport){
  fill(0, 192, 176);
    stroke(0, 192, 176);
}
else {
  fill(114,209,201);
  stroke(114,209,201);
}

  ellipse(this.position.x, this.position.y, this.size, this.size);
};

Meteorite.prototype.showTrail = function(){
  this.trail.push(this.position.copy())
  this.trail.length > 60 && (this.trail.splice(0, 1));
  for(var i = 0; i < this.trail.length; i++){
      var pos = this.trail[i];
      //fill(255);
      noStroke();
      ellipse(pos.x, pos.y, this.size, this.size);
  }
}

Meteorite.prototype.landed = function(){
  if (this.delta > 1) {
    // Explossion
    for(var e = 11; e > 1; e--){
      fill(lerpColor(orange, white, e/11));
      ellipse(this.position.x, this.position.y, this.size + e , this.size + e);
    }
    return true;
  } else {
    return false;
  }
};

var MeteoriteSystem = function() {
  this.meteorites = [];
  this.landedMeteorites = [];
};

MeteoriteSystem.prototype.addMeteorite = function(ciudad,pais,latorigen,longorigen,finlat,finlong) {
  this.meteorites.push(new Meteorite(ciudad,pais,latorigen,longorigen,finlat,finlong));
};

MeteoriteSystem.prototype.showLanded = function(ciudad,pais,latorigen,longorigen,finlat,finlong) {
  this.landedMeteorites.forEach(function(meteorite){
    var p = myMap.latLngToPixel(meteorite[0], meteorite[1]);
noStroke();
    fill(255, 170, 37, 100);
    ellipse(p.x, p.y, 50,50);

    //poner aqui la ciudad
  })
};

MeteoriteSystem.prototype.borrar = function() {
  for (var i = this.meteorites.length - 1; i >= 0; i--) {

    var m = this.meteorites[i];
    m.delete();
  }
}
MeteoriteSystem.prototype.render = function() {

  for (var i = this.meteorites.length - 1; i >= 0; i--) {

    var m = this.meteorites[i];
    m.run();
    if (m.landed()) {
      this.landedMeteorites.push([m.lat, m.lng, m.size]);
      this.meteorites.splice(i, 1);
    }
  }
};
