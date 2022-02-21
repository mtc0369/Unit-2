//declaring a global map variable
var mymap;

//function to create the Leaflet basemap
function createMap() {
    mymap = L.map('mapid', {
        center: [20, 0],
        zoom: 2
    });

    //adding tile layer using only OpenStreet map and avoiding Mapbox
    L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey={apikey}', {
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        apikey: '41071a22bdee4582b8af237baf91198c',
        maxZoom: 22
}).addTo(mymap);

    //calling getData function
    getData();
};
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
    fetch('data/Deadliest_Tornadoes.geojson')
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
