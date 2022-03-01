//declaring a global map variable
var mymap;
var minValue;

//function to create the Leaflet basemap
function createMap() {
    mymap = L.map('mapid', {
        center: [20, 0],
        zoom: 2
    });

    //adding tile layer using only OpenStreet map and avoiding Mapbox
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(mymap);

    //calling getData function
    getData(mymap);
};
//Example 2.1 Implemeting popups in a pointToLayer function
function pointToLayer(features, latlng) {
    //determine which attribute to visulaize with proportional symbols
    var attribute = "Pop_2015";

    //create and style markers
    var options = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    //determine the feature values for the attribute
    var attValue = Number(features.properties[attribute]);//forces value to be read as numeric

    //assign circle markers a radius based on the values
    options.radius = calcPropRadius(attValue);

    //create circle marker layer and assign it to new variable
    var layer = L.circleMarker(latlng, options);

    //build the popup content string
    var popupContent = "<p><b>City:</b> " + features.properties.City + "</p><p><b>" + attribute + ":</b> " + features.properties[attribute] + "</p>";
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circlemarker with popup to the L.geoJson pointToLayer option
    return layer;
};

//add the prop symbol markers to the map
function createPropSymbols(data, mymap) {
    //add leaflet geoJSON layer to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(mymap);
};
/*function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var city of data.features){
        //loop through each year
        for(var year = 1985; year <= 2015; year+=5){
              //get population for current year
              var value = city.properties["Pop_"+ String(year)];
              //add value to array
              allValues.push(value);
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
};
//Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    var attribute = "Pop_2015"
    //create marker options
    var geojsonMarkerOptions = {
        radius: 10,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //examine the attribute value to check that it is correct
            console.log(feature.properties, attValue);
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(mymap);
};*/

//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            //minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
        })
};

document.addEventListener('DOMContentLoaded', createMap)

/*//declare map variable globally so all functions have access
var map;
var minValue;

//step 1 create map
function createMap(){

    //create the map
    map = L.map('mapid', {
        center: [0, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for(var city of data.features){
        //loop through each year
        for(var year = 1985; year <= 2015; year+=5){
              //get population for current year
              var value = city.properties["Pop_"+ String(year)];
              //add value to array
              allValues.push(value);
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
};

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2015";

    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};


//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
        })
};

document.addEventListener('DOMContentLoaded',createMap)*/

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2015";

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};