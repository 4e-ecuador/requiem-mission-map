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
let chartData = {};

function getHtml(obj) {
    let html = htmlTemplate;
    $(replacements).each(function (i, replacement) {
        html = html.replace('{{' + replacement + '}}', obj[replacement]);
    });
    return html;
}

$.get('missions.json', {some_var: ''}, function (data) {
    let chartInfo = [];
    $('#mission-counter').html(data.length);
    $(data).each(function () {
        let marker = new L.Marker(new L.LatLng(this.lat, this.lng), {title: this.city});
        marker.bindPopup(getHtml(this));
        markers.addLayer(marker);
        if (chartInfo[this.country] === undefined) {
            chartInfo[this.country] = 1;
        } else {
            chartInfo[this.country]++;
        }
    });
    const sortable = [];
    for (const key in chartInfo) {
        sortable.push([key, chartInfo[key]]);
    }
    sortable.sort(function (a, b) {
        return a[1] - b[1];
    });

    chartData['labels'] = []
    chartData['data'] = []
    for (const key in sortable) {
        chartData['labels'].push(sortable[key][0]+' ('+sortable[key][1]+')')
        chartData['data'].push(sortable[key][1]);
    }
}, 'json');

$('#btn-chart').on("click", function () {
    const ctx = document.getElementById('myChart').getContext('2d');
    let data = {
        datasets: [{
            data: chartData['data']
        }],
        labels: chartData['labels']
    };
    let options = {
        plugins: {
            colorschemes: {
                scheme: 'brewer.YlGn9'
            }
        }
    }
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });

    $('#chartModal').modal()
})

// Logo
const mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];

mapControlsContainer.appendChild(document.getElementById("logoContainer"));
mapControlsContainer.appendChild(document.getElementById("mission-counter"));
mapControlsContainer.appendChild(document.getElementById("controls-container"));
