/*----------------- VARIALE -------------------*/

/* COMMON variable */

let selectedPlayer = "";
let selectedPlayerid = 0;

let speed_limit = 90;
let time_limit = 60;

let MAX_X = 65408;
let MAX_Y = 65344;

let s = 256;

let players = [];
let playerid = [198153, 17095, 692781, 1702890, 3407980, 3039723];

let trajectId = [];
let TimeBetweenPoint = 60; //temps en seconde in game

/* URL variable */

let cdn = "https://cdn.jsdelivr.net/gh/victorsmits/Fet-Tiles"
let playersURL = "https://fet-parser.herokuapp.com/players";
let trajectsURL = "https://fet-parser.herokuapp.com/trajects/";
let trajectURL = "https://fet-parser.herokuapp.com/traject/";


/* ZOOM variable */

let minZoom = 0;
let maxZoom = 9


/* JQUERY variable */

let playerSelector = $("#playerSelector");
let openGraph = $("#openGraph");
let graphModal = $("#exampleModal");
let trajectSelector = $("#trajectSelector");
let MapId = $("#map");
let filtreSpeed = $("#filtreSpeed");
let filtreDistance = $("#filtreDistance");
let speed_limit_input = $("#speed_limit_input");


/* EU variable */

const EU = {
    x: 27557,
    y: 40629,
    ParisInGame: {
        x: -30139,
        y: 5874
    },

    CalaisInGame: {
        x: -29997,
        y: -4699
    },

    ParisOnMap: {
        lat: 20886,
        long: 41920
    },

    CalaisOnMap: {
        lat: 20916,
        long: 39578
    }
};


/* UK variable */

const UK = {
    x: 27559,
    y: 40616,
    LondonInGame: {
        x: -37967,
        y: -11130
    },

    ManchesterInGame: {
        x: -45321,
        y: -28013
    },

    LondonOnMap: {
        lat: 19149,
        long: 38153
    },

    ManchesterOnMap: {
        lat: 17515,
        long: 34408
    }

};

/* Speed variable */
let lastcoor = [0, 0]


/*----------------- Tooltip -------------------*/

openGraph.tooltip({show: {effect: "blind"}});


/*----------------- PROJECTION -------------------*/

let CustomProjection = {
    project: function (latlng) {
        return new L.Point(latlng.lat, latlng.lng);
    },

    unproject: function (point) {
        return new L.LatLng(point.x, point.y);
    },

    bounds: L.bounds([0, 0], [MAX_X, MAX_Y])
};


/*----------------- CRS -------------------*/

let CustomCRS = L.extend({}, L.CRS, {
    projection: CustomProjection,
    transformation: new L.Transformation(1.0 / s, 0, 1.0 / s, 0),

    scale: function (zoom) {
        return Math.pow(2, zoom);
    },

    distance: function (latlng1, latlng2) {
        let dx = latlng2.lng - latlng1.lng,
            dy = latlng2.lat - latlng1.lat;

        return Math.sqrt(dx * dx + dy * dy);
    },

    infinite: false
});


/*----------------- MAP -------------------*/

let map = L.map('map', {
    attributionControl: false,
    crs: CustomCRS,
    center: [EU.ParisOnMap.lat, EU.ParisOnMap.long],
    zoom: 3,
});

map.zoomControl.setPosition('topright');


/*----------------- LAYER -------------------*/

let transparency = L.tileLayer(cdn + '/transparency/{z}/{x}/{y}.png', {
    minZoom: minZoom,
    maxZoom: 9,
    tileSize: 256,
    continuousWorld: false
})

let road = L.tileLayer(cdn + '/Road/{z}/{x}/{y}.png', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    tileSize: 256,
    continuousWorld: false
})

let city = L.tileLayer(cdn + '/Cityname/{z}/{x}/{y}.png', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    tileSize: 256,
    continuousWorld: false
})

let ferry = L.tileLayer(cdn + '/ferry/{z}/{x}/{y}.png', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    tileSize: 256,
    continuousWorld: false
})

let mapinfo = L.tileLayer(cdn + '/overlay/{z}/{x}/{y}.png', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    tileSize: 256,
    continuousWorld: false
})

let circleMarker = L.layerGroup().addTo(map);
let lineMarker = L.layerGroup().addTo(map);
let pointMarker = L.layerGroup().addTo(map);


let baseGroup = {
    "White": road,
    "Black": transparency
}

let overlay = {
    "ferry": ferry,
    "city": city,
    "POI": mapinfo,
    "Circles": circleMarker,
    "Lines": lineMarker,
    "Points": pointMarker
}

L.control.layers(baseGroup, overlay).addTo(map);

let results = new L.LayerGroup([road, ferry, city, mapinfo]).addTo(map);


/* MAIN LOOP */

run();
setInterval(run, 1000);


/* JQUERY Interaction */

playerSelector.change(function () {
    let val = $(this).val()
    if (val !== "-") {
        getTrajects(val);
        trajectSelector.prop("disabled", false);

        filtreSpeed.html('<i class="fas fa-filter"> Speed</i>')
        filtreSpeed.prop('disabled', false);
        filtreDistance.html('<i class="fas fa-filter"> Distance</i>')
        filtreDistance.prop('disabled', false);
    } else {
        trajectSelector.prop("disabled", true);
        filtreSpeed.prop('disabled', true);
        filtreDistance.prop('disabled', true);
    }
})

trajectSelector.change(function () {
    getTraject($(this).val());
})

openGraph.click(function () {
    graphModal.show();
})

filtreSpeed.click(function () {
    filtreSpeedTraject();
})

filtreDistance.click(function () {
    filtreDistanceTraject();
})

speed_limit_input.prop("value", speed_limit)

speed_limit_input.change(e => {
    speed_limit = $(speed_limit_input).val()
})

/*----------------- FUNCTION -------------------*/


/* MAIN */

function run() {
    getPlayers();
}


/* Calcul coord */

function calculatePixelCoordinate(x, y, pointsPerPixel, x0, y0) {
    return [
        (x / pointsPerPixel + x0) | 0,
        (y / pointsPerPixel + y0) | 0
    ];
}

function calculatePixelCoordinateEu(x, y) {
    x = x + (x * 0.0024298) + 33.6856566;
    y = y + (y * 0.0023384) - 47.1583332;

    return calculatePixelCoordinate(x, y, s / 56.6, EU.x, EU.y);
}

function calculatePixelCoordinateUk(x, y) {
    x = x + (x * 0.0001243) + 30.8274705;
    y = y + (y * 0.0000635) + 7.1212997;

    return calculatePixelCoordinate(x, y, (s / 35.25) * 0.621371, UK.x, UK.y);
}

function game_coord_to_pixels(x, y) {
    // I suppose either x,y are both positive, or they are both negative.
    if (x < 0) {
        return calculatePixelCoordinateUk(x, y);
    } else {
        return calculatePixelCoordinateEu(x, y);
    }
}

/* Loader */

function loadPlayer(item) {
    if (item === '#playerSelector') {
        players.forEach(player => {
            if (!checkIfExist(player.id)) {
                $(new Option(player.name, player.id)).appendTo(item);
            }
        })
    }
}

function loadTrajects(trajects) {
    trajectId = []
    $('#trajectSelector').empty()
    $(new Option("–- Select Traject --", "--")).appendTo('#trajectSelector');
    trajects.forEach(traject => {
        console.log(traject)
        trajectId.push(traject.id);
        $(new Option(`${traject.source} -> ${traject.destination}`, traject.id)).appendTo('#trajectSelector');
    })
}


/* REQUEST */

function getJSON(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}

function getPlayers() {
    getJSON(`${playersURL}`, (err, json) => {
        if (json != null) {
            players = json;
            update();
        }
    })
}

function getTrajects(playerId) {
    getJSON(`${trajectsURL}${playerId}`, (err, json) => {
        if (json != null) {
            loadTrajects(json);
        }
    })
}

function getTraject(trajectId) {
    getJSON(`${trajectURL}${trajectId}`, (err, json) => {
        let color = "green";
        if (json != null) {

            let rawPoints = json.points
            let mapPoints = rawPoints.map(point => game_coord_to_pixels(point.x, point.y))

            map.flyTo(new L.latLng(mapPoints[0]), 5)

            for (let i = 0; i < mapPoints.length; i++) {
                if (i < mapPoints.length - 1) {
                    let line_color = "green"
                    if (getDepacementVit(rawPoints[i].x, rawPoints[i].y, rawPoints[i + 1].x,
                        rawPoints[i + 1].y, TimeBetweenPoint, speed_limit)[0]) line_color = "red";

                    lineMarker.addLayer(L.polyline([mapPoints[i], mapPoints[i + 1]],
                        {color: line_color}).addTo(map))
                }
                let marker_color;

                if (rawPoints[i].speed >= speed_limit) marker_color = "red"; else marker_color = "green"

                pointMarker.addLayer(L.marker(mapPoints[i])
                    .setIcon(new L.icon({
                        iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${marker_color}.png`,
                        iconAnchor: [12, 41],
                    }))
                    .addTo(map)
                    .bindTooltip(`${rawPoints[i].speed}km/h`))

                chartData.push({
                    speed_limit: speed_limit,
                    speed: rawPoints[i].speed,
                    pin: i
                });
                cercleVit(rawPoints[i].x, rawPoints[i].y, TimeBetweenPoint, speed_limit, i);
            }
        }
        openGraph.prop('disabled', false);
        chart.data = chartData
    })
}

/* UPDATE */

function update() {
    loadPlayer('#playerSelector');
}

function checkIfExist(val) {
    return $('#playerSelector option').map(function() {
        return this.value === `${val}`
    }).get().some(v => v);
}

/* ADMIN MAP */

function cercleVit(x, y, t, v, i) {
    if (i != 0) {
        let ret = getDepacementVit(lastcoor[0], lastcoor[1], x, y, t, v);
        if (ret[0] === 1) {
            let tmp1 = game_coord_to_pixels(x, y);
            let tmp2 = game_coord_to_pixels((x + ret[1]), y);
            let rayon = tmp2[0] - tmp1[0];

            circleMarker.addLayer(
                L.circle(tmp1, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: rayon
                }).addTo(map)
            )
        }
    }
    lastcoor = [x, y];
}

/*-- Return 1 si depasement de vitesse, 0 sinon --*/

/*--- t en seconde et limitation en km/h---*/
function getDepacementVit(x1, y1, x2, y2, t, limitation) {
    let Dmax = limitation * t / 3.6;
    let dxCarre = Math.pow((x2 - x1), 2);
    let dyCarre = Math.pow((y2 - y1), 2);
    let D = Math.pow((dxCarre + dyCarre), 1 / 2);
    if (D > Dmax) {
        return [1, Dmax];
    } else {
        return [0, 0];
    }
}

function filtreSpeedTraject() {


    filtreSpeed.html('<div class="spinner-border" role="status" style="width: 24px; height:24px"><span class="sr-only">Loading...</span></div>')
    filtreSpeed.prop('disabled', true);

    if (filtreDistance[0].disabled) {
        $(`#trajectSelector option[value=${"--"}]`).text("–- Select Over Speed & Distance Traject --")
    } else {
        $(`#trajectSelector option[value=${"--"}]`).text("–- Select Over Speed Traject --")
    }
    trajectSelector.prop('disabled', true);

    for (let i = 0; i < trajectId.length; i++) {
        getJSON(`${trajectURL}${trajectId[i]}`, (err, json) => {
            if (json != null) {
                let tooFast = false;
                for(let i = 0; i < json.points.length - 1; i++) {
                    if (json.points[i].speed < speed_limit){
                        tooFast = true;
                        break;
                    }
                }
                if (!tooFast) {
                    $(`#trajectSelector option[value=${trajectId[i]}]`).remove();
                }
            }
        })
    }

    filtreSpeed.html('<i class="fas fa-check"> Speed</i>')
    setTimeout(() => filtreSpeed.html('<i class="fas fa-filter"> Speed</i>'), 2000)
    trajectSelector.prop('disabled', false);
}

function filtreDistanceTraject() {


    filtreDistance.html('<div class="spinner-border" role="status" style="width: 24px; height:24px"><span class="sr-only">Loading...</span></div>')
    filtreDistance.prop('disabled', true);

    if (filtreSpeed[0].disabled) {
        $(`#trajectSelector option[value=${"--"}]`).text("–- Select Over Speed & Distance Traject --")
    } else {
        $(`#trajectSelector option[value=${"--"}]`).text("–- Select Over Distance Traject --")
    }

    trajectSelector.prop('disabled', true);

    for (let i = 0; i < trajectId.length; i++) {
        getJSON(`${trajectURL}${trajectId[i]}`, (err, json) => {
            if (json != null) {
                let tooFast = false;
                for(let i = 0; i < json.points.length-1; i++) {
					if (getDepacementVit(json.points[i].x, json.points[i].y, json.points[i+1].x, json.points[i+1].y, TimeBetweenPoint, speed_limit)[0]){
						tooFast = true;
                        break;
                    }
                }
                if (!tooFast) {
                    $(`#trajectSelector option[value=${trajectId[i]}]`).remove();
                }
            }
        })
    }

    filtreDistance.html('<i class="fas fa-check"> Distance</i>')
    setTimeout(() => filtreDistance.html('<i class="fas fa-filter"> Distance</i>'), 2000)
    trajectSelector.prop('disabled', false);
}

