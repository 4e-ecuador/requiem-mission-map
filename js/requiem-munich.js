const map = L.map('map', {minZoom: 3})
    .setView([23.199768, -15.266627], 3);

new L.TileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution: 'Map data (C) <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'}
).addTo(map)

const markers = L.markerClusterGroup({disableClusteringAtZoom: 14})

map.addLayer(markers)

$.get('missions.json', {some_var: ''}, function (data) {
    $('#mission-counter').html(data.length)
    $(data).each(function () {
        let marker =
            new L.Marker(
                new L.LatLng(this.lat, this.lng), {title: this.city}
            )

        marker.bindPopup(
            this.city + ', ' + this.country + '<br>'
            + '<a href="https://ingressmosaik.com/mosaic/' + this.imid + '">IM</a> by ' + this.creator
        )

        markers.addLayer(marker)
    })
}, 'json')

// Logo
const mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];

mapControlsContainer.appendChild(document.getElementById("logoContainer"));
mapControlsContainer.appendChild(document.getElementById("mission-counter"));
