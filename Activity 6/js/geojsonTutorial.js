//setting a variable for the map and initializing with coordinates and zoom value.
var mymap = L.map('mapid').setView([39.75, -104.99], 10);

//adding tile layer using only OpenStreet map and avoiding Mapbox.
//requires 2 parts: the link and the attribution info.
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(mymap);

//using a function that passes styles based on the properties of individual features
//Applies a transparent red layer to N. Dakota and transparent blue layer to Colorado based on the coordinates
//Moved to this location from below because the layer was preventing the popup function from working.
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: '#ff0000'};
            case 'Democrat': return {color: '#0000ff'};
        }
    }
}).addTo(mymap);

//onEach function
function onEachFeature(feature, layer) {
    //if statement to prescribe a popup based on the arguments.
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}
//adding a feature / marker to the map
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
//L.geoJSON(geojsonFeature).addTo(mymap);
//assigning a circle marker with prescribed styles
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
//calling the onEach function and adding to the map, returning a circle marker
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);

//adding an array of geojson objects to the map - adds 2 parallel lines to the map extending NW based on the coordinates
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];
//adding style to all features (lines) in the array
var myStyle = {
    'color': '#ff7800',
    'weight': 5,
    'opacity': 0.65
};
L.geoJSON(myLines, {
    style: myStyle
}).addTo(mymap);

/*//empty GeoJSON layer that features can be added to later using the var name
var myLayer = L.geoJSON().addTo(mymap);
myLayer.addData(geojsonFeature);*/

//Commented out below after copying and rearranging code and putting pieces above

/*//pointToLayer - setting the style of the point feature in the script beginning to a circle
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);

//onEachFeature function
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(mymap);*/

/*//filters - function places markers based on boolean argument, Busch Field shows on map if changed to true
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];
//calling the someFeatures function and adding to map
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(mymap);*/