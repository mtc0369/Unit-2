//declaring a global map variables so they are accessible throughout
var mymap;
var minValue;

//function to create the Leaflet basemap
function createMap() {
    mymap = L.map('mapid').setView([39, -89], 5.2);
    mymap.setMaxBounds([
        [38, -130],
        [38, -60]
    ]);  

    //adding tile layer using only OpenStreet map and avoiding Mapbox
    L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey={apikey}', {
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        apikey: '41071a22bdee4582b8af237baf91198c',
        maxZoom: 22
    }).addTo(mymap);

    //calling getData function
    getData(mymap);
};

function calculateMinValue(data) {
    var allValues = []; //variable for empty array to hold data values
    //for loop to iterate through the array in Deadliest Tornadoes geojson
    for(var state of data.features) {
        //another loop to iterate through each year in the array and retirve pop
        for(var year = 2010; year <= 2020; year +=1) {
            var value = state.properties[String(year)+" Deaths"];
            //console.log(value)
            //push the population values to the empty array above
            allValues.push(value);
            
        }
    }
    //call on global variable created at the top of script to return the minimum
    //for the new allValues array
    var minValue = Math.min(...allValues)
    return minValue;
    
};
//returns either infinity or not a number
//function to calculate the radius of the proportional symbols
function calcPropRadius(attValue) {
    //variable to hold number used in formula below to size Prop sybols evenly
    var minRadius = 5
    //Flannery Appearance Compensation formula held in new variable
    var radius = 1.0083 * Math.pow(attValue/minValue, 0.5715) * minRadius
    console.log(radius)
    //return the radius of each symbol
    return radius;
};
//function adds circle markers for the cities population values and styles markers
function createPropSymbols(data){
    var attribute = '2010 Deaths';
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    //adding geoJSON layer to the map, determining each features value and radius
    L.geoJson(data, {
        pointToLayer: function (features, latlng) {
            var attValue = Number(features.properties[attribute]);//forces value to be read as numeric
            //gives prop symbol a radius by taking the values obtained in the calcPropRadius function above
            geojsonMarkerOptions.radius = calcPropRadius(attValue);
            console.log(features.properties, attValue);//inspect pop/radius values
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }        
    }).addTo(mymap);
    
};

/*//onEachFeature function to loop through the MegaCities data and add to popups in html string format
function onEachFeature(features, layer) {
    //creation of variable to hold popup content from MegaCities
    var popupContent = "";
    if (features.properties) {
        for (var property in features.properties) {
            popupContent += "<p>" + property + ": " + features.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};*/

//getData function to retrieve data from Deadliest Tornadoes geoJSON
//Callback function contains pointToLayer function to assign circles as markers with prescribed style
//onEachFeature added to Callback to get circle markers to retrieve popup data from MegaCities loop
function getData() {
    fetch('data/Deadliest_Tornadoes.geojson')
        .then(function(response){
            return response.json();
        })
        .then(function(json){                
            minValue = calculateMinValue(json);
            createPropSymbols(json);            
        });        
};
//loads basemap defined in createMap function and assigned to mymap global variable
document.addEventListener('DOMContentLoaded', createMap);
