mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v11', // style URL
    center: castle.geometry.coordinates, // starting position [lng, lat]
    zoom: 15, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: 'black', rotation: 45 })
    .setLngLat(castle.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${castle.title}</h3><p>${castle.location}</p>`
            )
    )
    .addTo(map)
