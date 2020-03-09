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
let chartData = {};

function getHtml(obj) {
    let html = htmlTemplate;
    $(replacements).each(function (i, replacement) {
        html = html.replace('{{' + replacement + '}}', obj[replacement]);
    });
    return html;
}

function roundOneDecimal(num) {
    return (Math.round(num * 10) / 10);
}

$.get('missions.json', {some_var: '120'}, function (data) {
    let chartInfo = [];
    $('#mission-counter').html(data.length);
    $(data).each(function () {
        let marker = new L.Marker(new L.LatLng(this.lat, this.lng), {title: this.city, icon: myIcon});
        marker.bindPopup(getHtml(this));
        markers.addLayer(marker);
        if (chartInfo[this.country] === undefined) {
            chartInfo[this.country] = 1;
        } else {
            chartInfo[this.country]++;
        }
    });
    const sortable = [];
    let percentBase = data.length > 0 ? (100 / data.length) : 1;
    for (const key in chartInfo) {
        sortable.push([key, chartInfo[key], roundOneDecimal(percentBase * chartInfo[key]) + '%']);
    }
    sortable.sort(function (a, b) {
        return b[1] - a[1];
    });

    chartData['labels'] = []
    chartData['data'] = []
    for (const key in sortable) {
        chartData['labels'].push(sortable[key][0]+' ('+sortable[key][1]+', '+sortable[key][2]+')')
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

$('#logoContainer').on('click', function(){
    var newSrc = $(this).prop('src').replace('01', '06');
    if(newSrc == $(this).prop('src')) {
        newSrc = $(this).prop('src').replace('06', '01');
    }
    $(this).prop('src', newSrc);
});
