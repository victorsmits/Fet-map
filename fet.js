/*----------------- VARIALE -------------------*/

let MAX_X = 65408;
let MAX_Y = 65344;

let cdn = "https://cdn.jsdelivr.net/gh/victorsmits/Fet-Tiles"
let idURL = "";
let url = "https://api.truckyapp.com/v3/map/online?playerID=";

let s = 256;
let markerset = false;

let mapMarkers = {};
let playerid = [198153, 17095, 692781];

let minZoom = 0;
let maxZoom = 8

let colorPicker = new iro.ColorPicker("#picker", {
    // Set the size of the color picker
    width: 100,
    // Set the initial color to pure red
    color: "#484e65"
});

//Size of the icon
let iconSize = [100, 100];

var customPopup =
    {
    'className' : 'customPopup'
    }


// EU
const EU = {
    x: 27557,
    y: 40629
};

ParisInGame = {
    x: -30139,
    y: 5874
}

CalaisInGame = {
    x: -29997,
    y: -4699
}

ParisOnMap = {
    lat: 20886,
    long: 41920
}

CalaisOnMap = {
    lat: 20916,
    long: 39578
}

// UK

const UK = {
    x: 27559,
    y: 40616
};

LondonInGame = {
    x: -37967,
    y: -11130
}

ManchesterInGame = {
    x: -45321,
    y: -28013
}

LondonOnMap = {
    lat: 19149,
    long: 38153
}

ManchesterOnMap = {
    lat: 17515,
    long: 34408
}

/*----------------- Index -------------------*/

$( "#openPicker" ).tooltip({ show: { effect: "blind" } });

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
    // Why 128? Because 7 is the maximum zoom level (i.e. 1:1 scale), and pow(2, 7) = 128.
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
    center: [ParisOnMap.lat, ParisOnMap.long],
    zoom: 3,
});

map.on('click', onMapClick);

let popup = L.popup();

map.zoomControl.setPosition('topright');

/*----------------- LAYER -------------------*/

// let background = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//     attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
//     minZoom: minZoom,
//     maxZoom: maxZoom,
//
// })

// let background = L.tileLayer(cdn + '/background/{z}/{y}/{x}.png', {
//     minZoom: minZoom,
//     maxZoom: maxZoom,
//     tileSize: 256,
//     continuousWorld: false
// })

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

let results = new L.LayerGroup([road, ferry, city]).addTo(map);
/*----------------- CALL -------------------*/

/* POSITION LOOP */
getPosition()

setInterval(getPosition, 15000)

/* INTERACTION */

let form = document.getElementById("form");
if (form != null) {
    function handleForm(event) {
        event.preventDefault();
    }

    form.addEventListener('submit', handleForm);
}

$('#playerSelector').change(function () {
    let val = $(this).val()
    if (val !== "-") {
        lookat(val);
    }
})

$('#TeamSelector').change(function () {
    TeamSelection($(this).val());
})

$('#form').submit(function () {
    console.log($(this))
    let value = $('#search').val()

    for (let elem of playeNames) {
        if (elem.name === value) {
            lookat(elem.key)
        }
    }
})

$('#openPicker').click(function () {
    $("#picker").show();
})

/*----------------- FUNCTION -------------------*/

function onMapClick(e) {
    popup.setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

function calculatePixelCoordinate(x, y, pointsPerPixel, x0, y0) {
    return [
        (x / pointsPerPixel + x0) | 0,
        (y / pointsPerPixel + y0) | 0
    ];
}

function calculatePixelCoordinateEu(x, y) {
    return calculatePixelCoordinate(x, y, s / 56.6, EU.x, EU.y);
}

function calculatePixelCoordinateUk(x, y) {
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

function lookat(id) {
    if (id !== "-") {
        getJSON(url + id, (err, json) => {
            let truck = json.response
            map.flyTo(new L.latLng(game_coord_to_pixels(truck.x, truck.y)), 4)
        })

    }

}

function loadPlayer() {
    $('#playerSelector').empty()
    getPosition()
    $(new Option("–- Select Player --", "–-")).appendTo('#playerSelector');
    for (let elem in mapMarkers) {
        let marker = mapMarkers[elem]
        $(new Option(marker["Name"], marker["Id"])).appendTo('#playerSelector');
    }
}

function loadTeam() {
    $('#TeamSelector').empty()
    getPosition()
    $(new Option("All team", "all")).appendTo('#TeamSelector');
    for (let elem in mapMarkers) {
        let marker = mapMarkers[elem]
        $(new Option(marker["Team"], marker["Team"])).appendTo('#TeamSelector');
    }
}

function getJSON(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}

function getPosition() {
    if (playerid.length === 0) {
        getJSON(idURL, (err, json) => {
            if (json != null) {
                for (let elem of json) {
                    playerid.push(elem.id)
                }
            } else {
                console.log(json)
            }
        })
    } else {
        for (let i = 0; i < playerid.length; i++) {
            // getJSON(idURL, (err, json) => {
            //     if (json != null) {
            //         for (let elem of json) {
            //             playerid.push(elem.id)
            //         }
            //     } else {
            //         console.log(json)
            //     }
            // })

            getJSON(url + playerid[i], (err, json) => {
                let truck = json.response
                if (truck.online) {
                    if (truck.name in mapMarkers && mapMarkers[truck.name] !== undefined) {
                        mapMarkers[truck.name]["marker"].setLatLng(
                            new L.latLng(game_coord_to_pixels(truck.x, truck.y)));
                    } else {
                        
                        mapMarkers[truck.name] = {
                            
                            marker: L.marker(game_coord_to_pixels(truck.x, truck.y), {icon: getTeamIcon("Volvo")}).bindPopup(truck.name, customPopup).addTo(map),
                            // Team: truck.team,
                            Id: playerid[i],
                            Name: truck.name
                        }
                    }
                }
            })
        }

    }
    // setTimeout(getJSON, 1000);
}

function colorUpdate() {
    let hex = colorPicker.color.hexString;
    console.log(hex)
    $("#map").css("background-color", hex.toString());
    $("#openPicker").css("background-color", hex.toString());
}

function TeamSelection(val) {
    if (val === 'all') {
        getPosition()
    } else {
        getPosition();
        for (let player in mapMarkers) {
            let marker = mapMarkers[player];
            if (marker["Team"] !== val) {
                marker["marker"].remove();
            }
        }
    }
}

function getTeamIcon(team) {
    let iconUrl = "";

    switch (team) {
        case "Volvo":
            iconUrl = 'img/volvo.png';
            break;

        case "Mercedes-Benz":
            iconUrl = 'img/mercedes.png';
            break;

        case "Scania":
            iconUrl = 'img/scania.png';
            break;

        case "MAN":
            iconUrl = 'img/man.png';
            break;

        case "Renault Trucks":
            iconUrl = 'img/renault.png';
            break;

        case "Iveco":
            iconUrl = 'img/iveco.png';
            break;

        case "DAF":
            iconUrl = 'img/daf.png';
            break;
    
        default:
            break;
    }

    return L.icon({
        iconUrl,
        iconSize: iconSize,
        iconAnchor:   [50, 94],
        popupAnchor: [0, 10]
    });
}

/*----------------- Marker Test -------------------*/
// L.marker(game_coord_to_pixels(3000, 3000), {icon: getTeamIcon("Volvo")}).addTo(map)
// L.marker(game_coord_to_pixels(6000, 3000), {icon: getTeamIcon("Mercedes-Benz")}).addTo(map)
// L.marker(game_coord_to_pixels(9000, 3000), {icon: getTeamIcon("Scania")}).addTo(map)
// L.marker(game_coord_to_pixels(12000, 3000), {icon: getTeamIcon("MAN")}).addTo(map)
// L.marker(game_coord_to_pixels(15000, 3000), {icon: getTeamIcon("Renault Trucks")}).addTo(map)
// L.marker(game_coord_to_pixels(18000, 3000), {icon: getTeamIcon("Iveco")}).addTo(map)
// L.marker(game_coord_to_pixels(21000, 3000), {icon: getTeamIcon("DAF")}).addTo(map)



/* DEBUG
// EU TEST
// v = game_coord_to_pixels(CalaisInGame.x, CalaisInGame.y)
// P = game_coord_to_pixels(ParisInGame.x, ParisInGame.y)
//
// L.marker(v).bindPopup('Calais').addTo(map);
// L.marker(P).bindPopup('paris').addTo(map);
//
// console.log("correction x : " + ((ParisOnMap.lat - P[0]) + UK.x))
// console.log("correction y : " + ((ParisOnMap.long - P[1]) + UK.y))
// L.marker([ParisOnMap.lat, ParisOnMap.long]).bindPopup('Paris goal').addTo(map);
// L.marker([CalaisOnMap.lat, CalaisOnMap.long]).bindPopup('Calais goal').addTo(map);

// UK TEST
//
// Lon = game_coord_to_pixels(LondonInGame.x, LondonInGame.y)
// Man = game_coord_to_pixels(ManchesterInGame.x, ManchesterInGame.y)
//
// L.marker(Lon).bindPopup('London').addTo(map);
// L.marker(Man).bindPopup('Manchester').addTo(map);
// L.marker([LondonOnMap.lat, LondonOnMap.long]).bindPopup('London goal').addTo(map);
// L.marker([ManchesterOnMap.lat, ManchesterOnMap.long]).bindPopup('Manchester goal').addTo(map);
//
// console.log(Man)
//
// console.log("correction x : " + ((ManchesterOnMap.lat - Man[0]) + UK.x))
// console.log("correction y : " + ((ManchesterOnMap.long - Man[1]) + UK.y))

// // DEBUGGING CODE BELOW!
// var marker1 = L.marker([0, 0]).bindPopup('marker1').addTo(map);
// var marker2 = L.marker([1, 1]).bindPopup('marker2').addTo(map);
// var marker3 = L.marker([256, 256]).bindPopup('marker3').addTo(map);
// var marker4 = L.marker([MAX_X / 2, MAX_Y / 2]).bindPopup('marker4').addTo(map);
// var marker5 = L.marker([MAX_X / 1, MAX_Y / 2]).bindPopup('marker5').addTo(map);
// var marker6 = L.marker([MAX_X / 2, MAX_Y / 1]).bindPopup('marker6').addTo(map);
// var marker7 = L.marker([MAX_X / 1, MAX_Y / 1]).bindPopup('marker7').addTo(map);

// For version 1.0
// https://github.com/Leaflet/Leaflet/issues/3736
// var DebugLayer = L.GridLayer.extend({
//     createTile: function (coords) {
//         // create a <canvas> element for drawing
//         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
//
//         // setup tile width and height according to the options
//         var size = this.getTileSize();
//         tile.width = size.x;
//         tile.height = size.y;
//
//         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
//         var context = tile.getContext('2d');
//
//         context.beginPath();
//         context.rect(0, 0, 256, 256);
//         context.lineWidth = 2;
//         context.strokeStyle = 'white';
//         context.stroke();
//
//         context.font = "20px Arial";
//         context.fillStyle = 'white';
//         context.fillText(coords.x + " / " + coords.y + " / " + coords.z, 80, 140);
//
//         // return the tile so it can be rendered on screen
//         return tile;
//     }
// });
//
// new DebugLayer().addTo(map);
//
// //
// //
// // // For versions earlier than 1.0
// // // https://github.com/Leaflet/Leaflet/issues/2776
// let debugLayer = L.tileLayer.canvas({
//     minZoom: 0,
//     maxZoom: 7,
//     continuousWorld: true,
// });
//
// debugLayer.drawTile = function (canvas, point, zoom) {
//     var context = canvas.getContext('2d');
//
//     context.beginPath();
//     context.rect(0, 0, 256, 256);
//     context.lineWidth = 2;
//     context.strokeStyle = 'white';
//     context.stroke();
//
//     context.font = "20px Arial";
//     context.fillStyle = 'white';
//     context.fillText(point.x + " / " + point.y + " / " + zoom, 80, 140);
// }
// debugLayer.addTo(map);
*/
