const map = L.map('map', {minZoom: 3})
    .setView([23.199768, -15.266627], 3);

new L.TileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution: 'Map data (C) <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'}
).addTo(map);

var myIcon = L.icon({
    iconUrl:      'img/my-icon.png',
    iconSize:     [22, 36],
    iconAnchor:   [11, 36],
    popupAnchor:  [0, -18],
});

const markers = L.markerClusterGroup({disableClusteringAtZoom: 14});
map.addLayer(markers);

let replacements = ['city', 'country', 'imid', 'creator'];
let htmlTemplate = '{{city}}, {{country}}<br />' + 
                   '<a target="_blank" href="https://ingressmosaic.com/mosaic/{{imid}}">IM</a>' + 
                   ' by {{creator}}';
function getHtml(obj) {
    var html = htmlTemplate;
    $(replacements).each(function(i, replacement){
        html = html.replace('{{'+replacement+'}}', obj[replacement]);
    });
    return html;
}

$.get('missions.json', {some_var: '120'}, function (data) {
    $('#mission-counter').html(data.length);
    $(data).each(function () {
        let marker = new L.Marker(new L.LatLng(this.lat, this.lng), {title: this.city, icon: myIcon});
        marker.bindPopup(getHtml(this));
        markers.addLayer(marker);
    });
}, 'json');

// Logo
const mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];

mapControlsContainer.appendChild(document.getElementById("logoContainer"));
mapControlsContainer.appendChild(document.getElementById("mission-counter"));

$('.logo-image').on('click', function(){
    var newSrc = $(this).prop('src').replace('01', '06');
    if(newSrc == $(this).prop('src')) {
        newSrc = $(this).prop('src').replace('06', '01');
    }
    $(this).prop('src', newSrc);
});
