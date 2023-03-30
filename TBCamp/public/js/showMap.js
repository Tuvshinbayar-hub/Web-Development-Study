const key = process.env.MAPTILER_KEY;
var map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`, // stylesheet location
    center: coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

const popup = new maplibregl.Popup({
    offset: 20,
}).setHTML(`<h4>${title}</h4><br>
            <p>${locationData}</p>`);

var marker = new maplibregl.Marker()
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);