/*----------------- VARIALE -------------------*/

/* COMMON variable */

let selectedPlayer = "";
let selectedPlayerid = 0;


let MAX_X = 65408;
let MAX_Y = 65344;

let s = 256;

let mapMarkers = {};
let playerid = [198153, 17095, 692781, 1702890, 3407980, 3039723];


/* URL variable */

let cdn = "https://cdn.jsdelivr.net/gh/victorsmits/Fet-Tiles"
let idURL = "";
let url = "https://fet-parser.herokuapp.com/position";


/* ZOOM variable */

let minZoom = 0;
let maxZoom = 9


/* JQUERY variable */

let playerSelector = $("#playerSelector");
let openPicker = $("#openPicker");
let TeamSelector = $("#TeamSelector");
let searchForm = $("#searchForm");
let picker = $("#picker");
let MapId = $("#map");
let search = $("#search");


/* custom icon */

let iconSize = [100, 100];

let customPopup = {
    'className': 'customPopup'
};


/* colorPicker variable */

let colorPicker = new iro.ColorPicker("#picker", {
    // Set the size of the color picker
    width: 100,
    // Set the initial color to pure red
    color: "#484e65"
});


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


/*----------------- Tooltip -------------------*/

openPicker.tooltip({show: {effect: "blind"}});


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

let popup = L.popup();

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


/* MAIN LOOP */

run();

setInterval(run, 5000);


/* JQUERY Interaction */

// search.autocomplete({
//     source: ["test", "victor"],
//     minLength: 2,
//     delay: 100
// })

searchForm.submit(function (e) {
    e.preventDefault();
    let value = $('#search').val()

    for (let elem in mapMarkers) {
        if (elem === value) {
            lookAt(mapMarkers[elem]["Id"])
        }
    }
});

playerSelector.change(function () {
    let val = $(this).val()
    if (val !== "-") {
        lookAt(val);
        selectPlayerChanged(val);
    }
})

TeamSelector.change(function () {
    TeamSelection($(this).val());
})

openPicker.click(function () {
    picker.show();
})

/*----------------- FUNCTION -------------------*/


/* MAIN */

function run() {
    getPosition()
    // getCurrentTraject()
    loadPlayer('#playerSelector');
    loadPlayer('#data');
    loadTeam();
}


/*--- Click event---*/

function onClickMarker(e) {
    setTimeout(() => selectPlayerChanged($('#selectPlayer').text()), 200);

}

function onMapClick(e) {
    popup.setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
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


/* Move */

function lookAt(id) {
    if (id !== "-") {
        getJSON(`${url}/${id}`, (err, json) => {
            let truck = json.response
            map.flyTo(new L.latLng(game_coord_to_pixels(truck.x, truck.y)), 5)
        })
    }
}


/* Loader */

function loadPlayer(item) {
    if (item === '#playerSelector') {
        $(item).empty();
        $(new Option("–- Select Player --", "–-")).appendTo(item);
        for (let elem in mapMarkers) {
            let marker = mapMarkers[elem]
            if (checkIfExist(item, elem)) {
                $(new Option(marker["Name"], elem)).appendTo(item);
            }
        }
    } else {
        $(item).empty();
        for (let elem in mapMarkers) {
            let marker = mapMarkers[elem]
            if (!checkIfExist(item, marker["Name"])) {
                $(new Option(elem, marker["Name"])).appendTo(item);
            }
        }
    }
}

function loadTeam() {
    $('#TeamSelector').empty()
    $(new Option("All team", "all")).appendTo('#TeamSelector');
    for (let elem in mapMarkers) {
        let marker = mapMarkers[elem]
        $(new Option(marker["Team"], marker["Team"])).appendTo('#TeamSelector');
    }
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

function getPosition() {
    // updateIDList()
    for (let i = 0; i < playerid.length; i++) {
        getJSON(`${url}/${playerid[i]}`, (err, json) => {
            if (json != null) {
                let truck = json.response
                if (truck.online) {
                    if (playerid[i] in mapMarkers && mapMarkers[playerid[i]]["marker"] !== undefined) {
                        mapMarkers[playerid[i]]["marker"].setLatLng(
                            new L.latLng(game_coord_to_pixels(truck.x, truck.y)));
                    } else {

                        const popup = `${truck.name}<div id='selectPlayer' style='display: none'>${truck.mp_id}</div>`
                        mapMarkers[playerid[i]] = {
                            marker: L.marker(game_coord_to_pixels(truck.x, truck.y),
                                {icon: getTeamIcon("Volvo")})
                                .bindPopup(popup, customPopup)
                                .addTo(map)
                                .on('click', onClickMarker),
                            // Team: truck.team,
                            Name: truck.name
                        }
                    }
                } else if ((!truck.online) && playerid[i] in mapMarkers && (mapMarkers[playerid[i]]["marker"] !== undefined)) {
                    mapMarkers[playerid[i]]["marker"].remove();
                    mapMarkers[playerid[i]] = undefined
                }
            }
        })
    }
    return true
}

function getCurrentTraject() {
    if (playerid.length === 0) {
        /* getJSON(urlTraject + playerid[i], (err, json) => {
             let traject = json.response
             if (traject.online) {
                 DashboardCompute(traject);
                 DashboardRender(traject);
             }
         })*/
    }

    /* Debug */
    let tmp = JSON.parse(debug);
    let traject = tmp[0];
    if (traject.online === 1) {
        traject = DashboardCompute(traject);
        DashboardRender(traject);
    }
}


/* UPDATE */

function updateIDList() {
    playerid = []
    getJSON(idURL, (err, json) => {
        if (json.response != null) {
            for (let elem of json.response) {
                playerid.push(elem.id)
            }
        } else {
            console.log(json)
        }
    })
}

function checkIfExist(ID, val) {
    let IsExists = false;
    $('#playerSelector option').each(function () {
        if (this.value === val)
            IsExists = true;
    });
    return IsExists;
}

function colorUpdate() {
    let hex = colorPicker.color.hexString;
    console.log(hex)
    MapId.css("background-color", hex.toString());
    openPicker.css("background-color", hex.toString());
}


/*--- fonction de mise à jour du joueurs suivi ---*/

function selectPlayerChanged(val) {
    selectedPlayerid = val;
    selectedPlayer = mapMarkers[selectedPlayerid]["Name"];
    getCurrentTraject();
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
    let iconUrl = cdn + "/";

    switch (team) {
        case "Volvo":
            iconUrl += 'img/volvo.png';
            break;

        case "Mercedes-Benz":
            iconUrl += 'img/mercedes.png';
            break;

        case "Scania":
            iconUrl += 'img/scania.png';
            break;

        case "MAN":
            iconUrl += 'img/man.png';
            break;

        case "Renault Trucks":
            iconUrl += 'img/renault.png';
            break;

        case "Iveco":
            iconUrl += 'img/iveco.png';
            break;

        case "DAF":
            iconUrl += 'img/daf.png';
            break;

        default:
            break;
    }

    return L.icon({
        iconUrl,
        iconSize: iconSize,
        iconAnchor: [50, 94],
        popupAnchor: [0, 10]
    });
}
