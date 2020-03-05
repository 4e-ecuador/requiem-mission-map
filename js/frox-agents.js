var map = L.map('agentmap', {minZoom: 3})
    .setView([23.199768, -15.266627], 3)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZWxrdWt1IiwiYSI6ImNqOG84cjduZTAwaWsycHBjc2piMHUzZWgifQ.GZUAkk3TMgehR5TZzxhHZQ'
}).addTo(map);

const markers = L.markerClusterGroup({disableClusteringAtZoom: 14})

map.addLayer(markers)

$.get('missions.json', {some_var: ''}, function (data) {
    $(data).each(function () {
        let marker =
            new L.Marker(
                new L.LatLng(this.lat, this.lng), {title: this.name}
            )

        marker.bindPopup(
            this.name +'<br>'
            +'<a href="https://ingressmosaik.com/mosaic/'+this.imid+'">IM</a>'
        )

        markers.addLayer(marker)
    })
}, 'json')


//initialize Leaflet List Markers
// var list = new L.Control.ListMarkers({layer: markers, itemIcon: null});
//
// list.on('item-click', function (e) {
//     e.layer.openPopup()
// });
//
// map.addControl(list);

// Logo
var mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];
var logoContainer = document.getElementById("logoContainer");

mapControlsContainer.appendChild(logoContainer);
