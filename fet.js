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
let maxZoom = 9

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
showTab('_maps');

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
//
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


let baseGroup = {
    "road": road,
    "zoom L9": transparency
}

let overlay = {
    "ferry": ferry,
    "city": city,
	"POI": mapinfo,
}

L.control.layers(baseGroup, overlay).addTo(map);

let results = new L.LayerGroup([road, ferry, city, mapinfo]).addTo(map);
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
	x = x + (x * 0.0024298) + 33.6856566;
	y = y + (y * 0.0023384) - 47.1583332 ;
	
    return calculatePixelCoordinate(x, y, s / 56.6, EU.x, EU.y);
}

function calculatePixelCoordinateUk(x, y) {
	x = x + (x * 0.0001243) + 30.8274705 ;
	y = y + (y * 0.0000635) + 7.1212997 ;
	
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


// Ajout test dam
Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data) {
    
    // Process DOM changes here now that we have data. We should only do this once.
    if (!g_processedDomChanges) {
        processDomChanges(data);
    }

    // Logic consistent between ETS2 and ATS
    data.truckSpeedRounded = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));
	
    data.currentFuelPercentage = (data.truck.fuel / data.truck.fuelCapacity) * 100;
    data.scsTruckDamage = getDamagePercentage(data);
    data.scsTruckDamageRounded = Math.floor(data.scsTruckDamage);
    data.wearTrailerRounded = Math.floor(data.trailer.wear * 100);
    var tons = (data.trailer.mass / 1000.0).toFixed(2);
    if (tons.substr(tons.length - 2) === "00") {
        tons = parseInt(tons);
    }
    data.trailerMassTons = data.trailer.attached ? (tons + ' t') : '';

    // ETS2-specific logic
    data.isWorldOfTrucksContract = isWorldOfTrucksContract(data);
	data.jobIncome = getEts2JobIncome(data.job.income);
	
	$('#_map').find('._no-map').hide();

    // return changed data to the core for rendering
    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data) {

    // data - same data object as in the filter function
    $('.fillingIcon.truckDamage .top').css('height', (100 - data.scsTruckDamage) + '%');
    $('.fillingIcon.trailerDamage .top').css('height', (100 - data.trailer.wear * 100) + '%');
    $('.fillingIcon.fuel .top').css('height', (100 - data.currentFuelPercentage) + '%');

    // Process DOM for job
    if (data.trailer.attached) {
        $('.hasJob').show();
        $('.noJob').hide();
    } else {
        $('.hasJob').hide();
        $('.noJob').show();
    }

    // Process map location only if the map has been rendered
    if (g_map) {

    }

    // Set the current game attribute for any properties that are game-specific
    $('.game-specific').attr('data-game-name', data.game.gameName);

    return data;
}

function getEts2JobIncome(income) {
    /*
        See https://github.com/mike-koch/ets2-mobile-route-advisor/wiki/Side-Notes#currency-code-multipliers
        for more information.
    */

    var code = buildCurrencyCode(1, '', '&euro;', '');

    return formatIncome(income, code);
}

function buildCurrencyCode(multiplier, symbolOne, symbolTwo, symbolThree) {
    return {
        "multiplier": multiplier,
        "symbolOne": symbolOne,
        "symbolTwo": symbolTwo,
        "symbolThree": symbolThree
    };
}

function formatIncome(income, currencyCode) {
    /* Taken directly from economy_data.sii:
          - {0} First prefix (no currency codes currently use this)
          - {1} Second prefix (such as euro, pound, dollar, etc)
          - {2} The actual income, already converted into the proper currency
          - {3} Third prefix (such as CHF, Ft, or kr)
    */
    var incomeFormat = "{0}{1} {2}.- {3}";
    income *= currencyCode.multiplier;

    return incomeFormat.replace('{0}', currencyCode.symbolOne)
        .replace('{1}', currencyCode.symbolTwo)
        .replace('{2}', income)
        .replace('{3}', currencyCode.symbolThree);
}

function getDamagePercentage(data) {
    // Return the max value of all damage percentages.
    return Math.max(data.truck.wearEngine,
                    data.truck.wearTransmission,
                    data.truck.wearCabin,
                    data.truck.wearChassis,
                    data.truck.wearWheels) * 100;
}

function showTab(tabName) {
    $('._active_tab').removeClass('_active_tab');
    $('#' + tabName).addClass('_active_tab');

    $('._active_tab_button').removeClass('_active_tab_button');
    $('#' + tabName + '_button').addClass('_active_tab_button');
}

// Wrapper function to set an item to local storage.
function setLocalStorageItem(key, value) {
    if (typeof(Storage) !== "undefined" && localStorage != null) {
        localStorage.setItem(key, value);
    }
}

// Wrapper function to get an item from local storage, or default if local storage is not supported.
function getLocalStorageItem(key, defaultValue) {
    if (typeof(Storage) !== "undefined" && localStorage != null) {
        return localStorage.getItem(key);
    }

    return defaultValue;
}

// Wrapper function to remove an item from local storage
function removeLocalStorageItem(key) {
    if (typeof(Storage) !== "undefined" && localStorage != null) {
        return localStorage.removeItem(key);
    }
}

function processDomChanges(data) {

	$('.speedUnits').text('km/h');
	$('.distanceUnits').text('km');
	$('.truckSpeedRoundedKmhMph').addClass('truckSpeedRounded').removeClass('truckSpeedRoundedKmhMph');
	$('.speedLimitRoundedKmhMph').addClass('navigation-speedLimit').removeClass('speedLimitRoundedKmhMph');
	$('.navigationEstimatedDistanceKmMi').addClass('navigation-estimatedDistanceKmRounded').removeClass('navigationEstimatedDistanceKmMi');

    $('.trailerMassKgOrT').addClass('trailerMassTons').removeClass('trailerMassKgOrT');

    g_processedDomChanges = true;
}

// Global vars

// Checked if we have processed the DOM changes already.
var g_processedDomChanges;

var g_map;

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
