
//declaring a global map variable
var mymap;

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
    getData();
};

function createPropSymbols(data){
    var attribute = 'Pop_2015';
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    L.geoJson(data, {
        pointToLayer: function (features, latlng) {
            var attValue = Number(features.properties[attribute]);
            console.log(features.properties, attValue);
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }        
    }).addTo(mymap);
    
};
/*function getData() {
    $.getJSON('data/MegaCities.geojson', function(response){
        createPropSymbols(response);
    });
};*/
//onEachFeature function to loop through the MegaCities data and add to popups in html string format
function onEachFeature(features, layer) {
    //creation of variable to hold popup content from MegaCities
    var popupContent = "";
    if (features.properties) {
        for (var property in features.properties) {
            popupContent += "<p>" + property + ": " + features.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//getData function to retrieve MegaCities data
//Callback function contains pointToLayer function to assign circles as markers with prescribed style
//onEachFeature added to Callback to get circle markers to retrieve popup data from MegaCities loop
function getData() {    
    fetch('data/MegaCities.geojson')
        .then(function(response){
            return response.json();
        })
        .then(function(json){                
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: '#ff7800',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };            
            L.geoJson(json, {                                
                onEachFeature: onEachFeature,
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);                    
                }
            }).addTo(mymap);            
        });
                
};

document.addEventListener('DOMContentLoaded', createMap)



