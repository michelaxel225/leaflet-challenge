 //query url 
let query_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//creating the map 
let myMap = L.map("map", {
    center: [38, -37],
    zoom: 2
});

//add title layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);



// Getting our GeoJSON data 
d3.json(query_url).then(function(data){

//create markers for magnitude 
    function marker(magnitude){
      
        if (magnitude === 0){
            return 1;
        }
      
        return magnitude * 20000;
    };

     function color(depth){
            switch (true) {
              case depth > 90:
                return "red";
              case depth > 70:
                return "orangered";
              case depth > 50:
                return "orange";
              case depth > 30:
                return "gold";
              case depth > 10:
                return "yellow";
              default:
                return "lightgreen";
        }
    }

  
    for (let i = 0; i < data.features.length; i++) {
        let feature = data.features[i]
        // console.log(feature);

        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
            fillOpacity: 0.5,
            color: "white",
            fillColor: color(feature.geometry.coordinates[2]),
            radius: marker(feature.properties.mag),
            stoke: true,
            weight: 1
        }).bindPopup(`<h2>Where: ${feature.properties.place}</h2><h3>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</h3>`).addTo(myMap);
    }
    
});

//legend 

let legend = L.control({position: "bottomright"})
legend.onAdd= function(){
    let div = L.DomUtil.create('div', 'info legend');
    let limits = ['-10-10', '10-30','30-50','50-70','70-90','90+'];
    let colors=['lightgreen"',"yellow","gold","orange", 'orangered','red'];
    for (let i=0; i<limits.length; i++) {
        div.innerHTML+= `<p style="background-color:${colors[i]}" > ${limits[i]} </p>`
    }
    return div
};

legend.addTo(myMap)