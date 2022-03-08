
//declaring a global map variable
//variables here makes them accessible to all functions below
var mymap;
var dataStats = {};

//Example 1.4, THIS IS REFERENCE TO OBJECTS PROPERTY - passed under pointToLayer function
function PopupContent(properties, attribute){
    this.properties = properties;
    this.attribute = attribute;
    this.year = attribute.split("_")[1];
    this.population = this.properties[attribute];
    this.formatted = "<p><b>City:</b> " + this.properties.City + "</p><p><b>Population in " + this.year + ":</b> " + this.properties[attribute] + " million</p>";
};

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

function calcStats(data) {
    var allValues = []; //variable for empty array to hold data values
    //for loop to iterate through the cities array in MegaCities
    for(var city of data.features) {
        //another loop to iterate through each year in the array and retirve pop
        for(var year = 1985; year <= 2015; year +=5) {
            var value = city.properties["Pop_"+ String(year)];
            
            allValues.push(value);
        }
    }
    //get min, max, mean stats for the array
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    //Calculate meanValue
    var sum = allValues.reduce(function(a,b){
        return a+b;
    });
    dataStats.mean = sum / allValues.length;
    
    //var minValue = dataStats.min//Math.min(...allValues)
    //return minValue;
};

//function to calculate the radius of the proportional symbols
function calcPropRadius(attValue) {
    //variable to hold number used in formula below to size Prop sybols evenly
    var minRadius = 5
    //Flannery Appearance Compensation formula held in new variable
    var radius = 1.0083 * Math.pow(attValue/dataStats.min, 0.5715) * minRadius
    //return the radius of each symbol
    //console.log(radius)
    return radius;
};

//Implemeting popups in a pointToLayer function
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

    //Example 1.4, creating new object called Popupontent - holds data from MegaCities in object form
    var popup = new PopupContent(features.properties, attribute);

    layer.bindPopup(popup.formatted, {
        offset: new L.Point(0,-options.radius)
    });
    
    return layer;
};

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
    //console.log(attributes);

    return attributes;
}

//Create sequence controls
//add a paramenter 'attributes' to the function and the callback at the end of script
function createSequenceControls(seqAttributes) {
    //replaces several DOM elements from earlier script and places the slider on bottom left corner of map.
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function () {
            //creating the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create range input element - slider, combine elements
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="reverse"><img src="img/arrow_reverse.png"></button>');
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">');            
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="forward"><img src="img/arrow_forward.png"></button>');
            //...initialize other DOM elements

            //disable default mouse controls for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });

    mymap.addControl(new SequenceControl());//add listeners after adding control    

    document.querySelector('.range-slider').max = 6;//direct HTML element representing max value of the slider - set at 6 because index is 0-6
    document.querySelector('.range-slider').min = 0;
    document.querySelector('.range-slider').value = 0;//sets current value
    document.querySelector('.range-slider').step = 1;//tells slider to advance in increments of 1.    

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

            //update each feature symbols radius based on iterated attribute values
            //access existing calcPropRadius function
            //although its same syntax as an array, it is an object, not an array
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //built in function for leaflet that will change the prop symbol radius based on the values
            //layer.setRadius(radius);

            //Example 1.4, creating new object called Popupontent - holds data from MegaCities in object form
            var popupContent = new PopupContent(props, attribute);
            //update popup content
            popup = layer.getPopup();
            popup.setContent(popupContent.formatted).update();                        

        };
    });
    updateLegend(attribute);
};

function getCircleValues(attribute) {
    var min = Infinity, max = -Infinity;

    mymap.eachLayer(function(layer){
        if (layer.feature) {
            var attributeValue = Number(layer.feature.properties[attribute]);

            if (attributeValue < min) {
                min = attributeValue;
            }
            if (attributeValue > max) {
                max = attributeValue;
            }
        }
    });
    var mean = (max + min) / 2;

    return {
        max: max,
        mean: mean,
        min: min,
    };
};

function updateLegend(attribute) {
    //create content for legend
    var year = attribute.split("_")[1];
    //replace legend content
    document.querySelector("span.year").innerHTML = year;
  
    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(attribute);
  
    for (var i in circleValues) {
      //get the radius
      var radius = calcPropRadius(circleValues[i]);
  
      document.querySelector("#" + i).setAttribute("cy", 59 - radius);
      document.querySelector("#" + i).setAttribute("r", radius)
  
      document.querySelector("#" + i + "-text").textContent = Math.round(circleValues[i] * 100) / 100 + " million";  
      
    }
};

//Example 2.7 creating legend controls
function createLegend() {
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        onAdd: function() {
            //create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //SCRITP FOR LEGEND HERE
            container.innerHTML = '<p class="temporalLegend"><h3><b>Population in <span class="year">1980</span><b></p>';

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';
            
            //add legend svg to container
            //container.innerHTML += svg;
            
            //array of circle names to base loop on
            var circles = ["max", "mean", "min"];

            //Step 2: loop to add each circle and text to svg string
            for (var i=0; i<circles.length; i++){
                //Step 3: assign the r and cy attributes  
                var radius = calcPropRadius(dataStats[circles[i]]);
                //console.log(radius);  
                var cy = 59 - radius;
                //console.log(cy);
                
                //circle string
                svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="30"/>';
                //spaces the text nxt to circles
                var textY = i * 20 + 20;

                //text string
                svg +='<text id="' + circles[i] + '-text" x="65" y="' + textY + '">' + Math.round(dataStats[circles[i]] * 100) / 100 + " million" + "</text>";
            };

            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            container.insertAdjacentHTML('beforeend',svg);

            return container;
        }
    });
    
    mymap.addControl(new LegendControl());
};

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
            //minValue = calcStats(json);
            //calling renamed function
            calcStats(json);
            //call the createPropSymbols function
            createPropSymbols(json, seqAttributes);
            createSequenceControls(seqAttributes);
            createLegend(seqAttributes);            
        });
                
};
//loads basemap defined in createMap function and assigned to mymap global variable
document.addEventListener('DOMContentLoaded', createMap);



