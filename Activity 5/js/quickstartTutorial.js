//initializing the map with coordinates and zoom value.
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

/*//adding tile layer to the map from Mapbox with public access token
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibXRjMDM2OSIsImEiOiJja3p2bHd4bGs0OTB2Mm5wYWwwdWI5ZXhsIn0.YRAyYzQIX5wL9tDfpJdXaA'
}).addTo(mymap);*/

//adding tile layer using only OpenStreet map and avoiding Mapbox
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

//adding a generic / default marker to the map.
var marker = L.marker([51.5, -0.09]).addTo(mymap);
//adding a circle marker to the map and setting colors, opacity, and size
var circle = L.circle([51.508, -0.11], {
    color: 'purple',
    fillColor: '#f03',
    fillOpacity: 0.25,
    radius: 350
}).addTo(mymap);
//adding a polygon to the map by specifying coordiantes of vertices.
var polygon = L.polygon([
    [51.509, -0.08],
    [51.508, -0.11],
    [51.5, -0.09],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

//adding popups to the map
//attaching popup to the marker that appears when page loads (only for markers)
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
//attaching a popup to the circle, activate when clicked.
circle.bindPopup("I am a circle.");
//attaching popup to the polygon, activate when clicked.
polygon.bindPopup("I am a polygon.");
//Using popups as layers, this code only displays popup at specified coordinates when page loads
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    //.addTo(mymap);//uising addTo will display this popup and the marker popup on opening
    .openOn(mymap);//closes the marker popup and will only display this one

//Events - popups
/*//function that provides the lat lng coordinates for a point click on the map, this does not work within the polygon or circle shapes with these settings
function onMapClick(e) {
    alert('You clicked the map at ' + e.latlng);
}
mymap.on('click', onMapClick);*/

//adding popup window that provides lat lng rather than an alert window
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent('You clicked the map at ' + e.latlng.toString())//still works without adding '.toString()'
        .openOn(mymap);
}
mymap.on('click', onMapClick);