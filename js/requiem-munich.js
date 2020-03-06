const map = L.map('map', {minZoom: 3})
    .setView([23.199768, -15.266627], 3);

new L.TileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution: 'Map data (C) <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'}
).addTo(map);

const markers = L.markerClusterGroup({disableClusteringAtZoom: 14});
map.addLayer(markers);

let replacements = ['city', 'country', 'imid', 'creator'];
let htmlTemplate = '{{city}}, {{country}}<br />' + 
                   '<a target="_blank" href="https://ingressmosaic.com/mosaic/{{imid}}">IM</a>' + 
                   ' by {{creator}}';
function getHtml(obj) {
    var html = htmlTemplate;
    $(replacements).each(function(i, replacement){
        html = html.replace('{{'+replacement+'}}', obj[replacement].trim());
    });
    return html;
}

$.get('missions.json', {some_var: ''}, function (data) {
    $('#mission-counter').html(data.length);
    $(data).each(function () {
        let marker = new L.Marker(new L.LatLng(this.lat, this.lng), {title: this.city});
        marker.bindPopup(getHtml(this));
        markers.addLayer(marker);
    });
}, 'json');

// Logo
const mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];

mapControlsContainer.appendChild(document.getElementById("logoContainer"));
mapControlsContainer.appendChild(document.getElementById("mission-counter"));
