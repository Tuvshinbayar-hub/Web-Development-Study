
const key = "Sxim0MmX1cOFsGNNYJ49"
var map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`, // stylesheet location
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});