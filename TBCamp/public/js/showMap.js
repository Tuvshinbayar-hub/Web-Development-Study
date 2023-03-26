const key = "Sxim0MmX1cOFsGNNYJ49"
var map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`, // stylesheet location
    center: coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

const popup = new maplibregl.Popup({
    offset: 20,
}).setHTML(`<h3>{{{campground.title}}}</h3><br>
            <h6>{{{campground.location}}}</h6>`);

var marker = new maplibregl.Marker()
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);