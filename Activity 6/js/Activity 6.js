
//declaring a global map variable
//variables here makes them accessible to all functions below
var mymap;
var minValue;

//function to create the Leaflet basemap
function createMap() {
    mymap = L.map('mapid', {
        center: [10, 0],
        zoom: 2
    });

    //adding tile layer using only OpenStreet map and avoiding Mapbox
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(mymap);

    //calling getData function
    getData(mymap);
};

function calcMinValue(data) {
    var allValues = []; //variable for empty array to hold data values
    //for loop to iterate through the cities array in MegaCities
    for(var city of data.features) {
        //another loop to iterate through each year in the array and retirve pop
        for(var year = 1985; year <= 2015; year +=5) {
            var value = city.properties["Pop_"+ String(year)];
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

//function to calculate the radius of the proportional symbols
function calcPropRadius(attValue) {
    //variable to hold number used in formula below to size Prop sybols evenly
    var minRadius = 5
    //Flannery Appearance Compensation formula held in new variable
    var radius = 1.0083 * Math.pow(attValue/minValue, 0.5715) * minRadius
    //return the radius of each symbol
    //console.log(radius)
    return radius;
};

//Example 2.1 Implemeting popups in a pointToLayer function
function pointToLayer(features, latlng, seqAttributes) {
    //determine which attribute to visulaize with proportional symbols
    //"Pop_2015" replaced with attribute and index, in this case calling on 1985
    var attribute = seqAttributes[0];//because pointTolayer was reconfigured, the new attribute variable can be passed through this function

    //create and style markers
    var options = {
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

    //build the popup content string - City and attribute label in bold
    var popupContent = "<p><b>City:</b> " + features.properties.City + "</p>"//<p><b>" + attribute + ":</b> " + features.properties[attribute] + "</p>";

    //adding formatted attribute data to popup content - string info in bold
    var year = attribute.split("_")[1];
    popupContent += "<p><b>Population in " + year + ":</b> " + features.properties[attribute] + " million</p>";
    
    //bind the popup to the circle marker and create an offset so popup doesn't cover symbol
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
    //console.log(features.properties, attValue);//inspect pop/radius values

    //return the circlemarker with popup to the L.geoJson pointToLayer option
    return layer;
};

/*//add the prop symbol markers to the map
function createPropSymbols(data) {
    //add leaflet geoJSON layer to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(mymap);
};*/

//have to organize the createPropSymbols function differently in order to pass the seqAttributes variable
//need to use ananymous function to call pointToLayer function that now includes the new attribute variable
function createPropSymbols(data, seqAttributes) {
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, seqAttributes);
        }
    }).addTo(mymap);
};

//create function to process data
function processData(data) {
    //create empty array to hold attribute data
    var attributes = [];

    //variable for the properties of the first feature in the dataset - 0 index
    var properties = data.features[0].properties;
    //console.log(data.features[0].properties);

    //loop to push each attribute into the array
    for (var attribute in properties) {
        //only take attributes with population values //indexOf function looks through string and determines if and where a string segment occurs 
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);//if attribute ocurs and is found, it will be added to the list/array.
        };
    };
    //check the result
    console.log(attributes);

    return attributes;
}

//Create sequence controls
//add a paramenter 'attributes' to the function and the callback at the end of script
function createSequenceControls(seqAttributes) {
    //create a slider - range input element - special type of element with multiple manifestations such as check boxes
    var slider = "<input class='range-slider' type='range'></input>";//multiple ways to acomplish but this is easiest method.
    //adds reverse button to panel, left of slider and includes the word, which can be removed if an arrow is in its place.
    document.querySelector("#panel").insertAdjacentHTML('beforeend', '<button class="step" id="reverse">Reverse</button>');
    //adds slider to panel
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

    document.querySelector('.range-slider').max = 6;//direct HTML element representing max value of the slider - set at 6 because index is 0-6
    document.querySelector('.range-slider').min = 0;
    document.querySelector('.range-slider').value = 0;//sets current value
    document.querySelector('.range-slider').step = 1;//tells slider to advance in increments of 1.

    //adds forward button to panel, right of slider and includes the word, which can be removed if an arrow is in its place.
    document.querySelector("#panel").insertAdjacentHTML('beforeend', '<button class="step" id="forward">Forward</button>');

    //Inserting buttons in place of reverse and forward - need to get png from noun project or another source and replace link
    document.querySelector('#reverse').insertAdjacentHTML('beforeend', '<img src="img/reverse.png">');
    document.querySelector('#forward').insertAdjacentHTML('beforeend', '<img src="img/forward.png">');

    //add sequence conrols - click listener for forward and reverse buttons
    //need querySelectorAll to encompase all functions in the class .step
    //forEach loops through each instance of the element
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value;
            //console.log(index);
            //sequence - increment or decrement for the for and rev buttons
            //shorthand if statement, basically creating a continuous loop each way
            if (step.id == 'forward') {
                index++;
                //wraps sequence around to the first attribute once the last attribute is exceeded.
                index = index > 6 ? 0 : index;
            } else if (step.id == 'reverse') {
                index--;
                //wraps sequence around to the last attribute if the first attribute is exceeded.
                index = index < 0 ? 6 : index;
            };

            //updates the slider tool - connects the click loop to the slider, will not work without this. 
            document.querySelector('.range-slider').value = index;

            updatePropSymbols(seqAttributes[index]);//calling updatePropSymbols function

            //console.log(seqAttributes[index]);//will log the index name/label, allows you to directly alter the attribute being selected
        });        
    });

    //add an input listener for the slider tool
    //input is default nomenclature for whenever the slider is being used
    document.querySelector('.range-slider').addEventListener('input', function(){
        //to check if the slider is working by creating shorthand variable with this.value
        var index = this.value;
        
        updatePropSymbols(seqAttributes[index]);//calling updatePropSymbols function
        //console.log(index);
        //sequence
    });
};

function updatePropSymbols(attribute) {
    //.eachLayer iterates through every layer added to the map and provides everthing in that layer with each iteration
    mymap.eachLayer(function(layer) {
        //console.log(layer);//shows all objects including the basemap, which we do not want to iterate through,
        //so we need to find a way to only get the objects we want.
        //the conditional if statement below selects objects by based on if they have features and attributes.
        if (layer.feature && layer.feature.properties[attribute]){
            //console.log(layer)//logs only objects with features and attributes, asks if this conditional exists
            //update the layer style and popup and access feature properties
            //includes all feature properties within 1 data point and holds them in the props variable.
            var props = layer.feature.properties;
            
            //logs values for a particular year in each city
            //props will return the compete object, adding the [attribute] will return the values, 
            //can return any object from the array by entering it in the brackets.
            //console.log(props[attribute]);

            //update each feature symbols radius based on iterated attribute values
            //access existing calcPropRadius function
            //although its same syntax as an array, it is an object, not an array
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //built in function for leaflet that will change the prop symbol radius based on the values
            layer.setRadius(radius);

            //add city popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";

            //add attribute data to string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Population in " + year + ":</b>" + props[attribute] + " million</p>";

            //update popup content
            popup = layer.getPopup();
            popup.setContent(popupContent).update();//actually sets the content and adds it to popup on map

        };
    });
};

/*//function adds circle markers for the cities population values and styles markers
function createPropSymbols(data){
    var attribute = 'Pop_2015';
    var geojsonMarkerOptions = {
        //radius: 8,
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
    
};*/
//onEachFeature from Activity 5 no longer needed
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
//function to retrieve MegaCities data in geoJSON file
//style code in the callback function from Activity 5 removed and assigned to the createPropSymbol function above
//as well as pointToLayer function 
//fewer functions called in the callback compared to Activity 5 as several functions are linked
function getData() {    
    fetch('data/MegaCities.geojson')
        .then(function(response){
            return response.json();
        })
        .then(function(json){                
            //create variable to hold all attributes in the sequence set equal to processdata function
            var seqAttributes = processData(json);
            //callback function calling the calculateMinValue function and
            //assigning the values to the minValue global variable
            minValue = calcMinValue(json);
            //call the createPropSymbols function
            createPropSymbols(json, seqAttributes);
            createSequenceControls(seqAttributes);            
        });
                
};
//loads basemap defined in createMap function and assigned to mymap global variable
document.addEventListener('DOMContentLoaded', createMap);



