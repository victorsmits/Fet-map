/*----------------- VARIALE -------------------*/
/* COMMON variable */

let selectedPlayer = "";
let selectedPlayerid = 0;


let MAX_X = 65408;
let MAX_Y = 65344;

let s = 256;

let mapMarkers = {};
let playerid = [198153, 17095, 692781, 1702890, 3407980];


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

/*------ Affichage de la carte par defaut ------*/

showTab('_maps');
$('.speedUnits').text('km/h');
$('.distanceUnits').text('km');
$('.noCruiseControl').show();
$('.speedUnits').text('km/h');

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

let results = new L.LayerGroup([road, ferry, city]).addTo(map);

/* Run LOOP */

run();

setInterval(run, 1000);

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
        //selectPlayerChanged(val);

    }
})

TeamSelector.change(function () {
    TeamSelection($(this).val());
})

openPicker.click(function () {
    picker.show();
})


/*----------------- FUNCTION -------------------*/

function run() {
    getPosition()
    getCurrentTraject()

    loadPlayer('#playerSelector');
    loadPlayer('#data');

    loadTeam();
}

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

function lookAt(id) {
    if (id !== "-") {
        getJSON(`${url}/${id}`, (err, json) => {
            let truck = json.response
            map.flyTo(new L.latLng(game_coord_to_pixels(truck.x, truck.y)), 5)
        })
    }
}

function loadPlayer(item) {
    if (item === '#playerSelector') {
        $(item).empty();
        $(new Option("–- Select Player --", "–-")).appendTo(item);

        for (let elem in mapMarkers) {
            let marker = mapMarkers[elem]
            $(new Option(marker["Name"], elem)).appendTo(item);
        }
    } else {
        $(item).empty();
        for (let elem in mapMarkers) {
            let marker = mapMarkers[elem]
            $(new Option(elem, marker["Name"])).appendTo(item);
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
                                {icon: getTeamIcon("Volvo")}).bindPopup(popup, customPopup).addTo(map).on('click', onClickMarker()),
                            // Team: truck.team,
                            Name: truck.name
                        }
                    }
                }
            }
        })
    }
    return true
}

function colorUpdate() {
    let hex = colorPicker.color.hexString;
    console.log(hex)
    MapId.css("background-color", hex.toString());
    openPicker.css("background-color", hex.toString());
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


/*--- fonction event sur les click des marqueurs sur la carte ---*/
function onClickMarker(e) {
    //selectPlayerChanged($('#selectPlayer').text());
}


/*--- requete vers API pour les info mission ---*/
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
    //debug
    let tmp = JSON.parse(debug);
    let traject = tmp[0];
    if (traject.online === 1) {
        traject = DashboardCompute(traject);
        DashboardRender(traject);
    }
}

/*--- traitements des info mission ---*/
function DashboardCompute(data) {

    // Logic consistent between ETS2 and ATS
    data.truckSpeedRounded = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));

    data.currentFuelPercentage = (data.truck.fuel / data.truck.fuelCapacity) * 100;
    data.scsTruckDamage = getDamagePercentage(data);
    data.scsTruckDamageRounded = Math.floor(data.scsTruckDamage);
    data.wearTrailerRounded = Math.floor(data.trailer.wear * 100);
    data.wearCargoRounded = Math.floor(data.cargo.wear * 100);
    var tons = (data.trailer.mass / 1000.0).toFixed(2);
    if (tons.substr(tons.length - 2) === "00") {
        tons = parseInt(tons);
    }
    data.trailerMassTons = data.trailer.attached ? (tons + ' t') : '';

    data.jobIncome = getEts2JobIncome(data.job.income);


    // return changed data to the core for rendering
    return data;
};

/*--- Affichage des info mission ---*/
function DashboardRender(data) {

    // data - same data object as in the filter function
    $('.fillingIcon.truckDamage .top').css('height', (100 - data.scsTruckDamage) + '%');
    $('.fillingIcon.trailerDamage .top').css('height', (100 - data.trailer.wear * 100) + '%');
    $('.fillingIcon.cargoDamage .top').css('height', (100 - data.trailer.wear * 100) + '%');
    $('.fillingIcon.fuel .top').css('height', (100 - data.currentFuelPercentage) + '%');

    $('.truckSpeedRoundedKmhMph').text(data.truckSpeedRounded);
    $('.game-time').text(selectedPlayer);
    $('.scsTruckDamageRounded').text(data.scsTruckDamageRounded);
    $('.wearTrailerRounded').text(data.wearTrailerRounded);
    $('.wearCargoRounded').text(data.wearCargoRounded);
    $('.trailer-name').text('poisson');
    $('.trailerMassKgOrT').text(data.trailerMassTons);
    $('.job-destinationCity').text(data.job.destCity);
    $('.job-destinationCompany').text(data.job.destCompany);
    $('.jobIncome').text(data.jobIncome);

    // Process DOM for job
    if (data.trailer.attached) {
        $('.hasJob').show();
        $('.noJob').hide();
    } else {
        $('.hasJob').hide();
        $('.noJob').show();
    }

    // Set the current game attribute for any properties that are game-specific
    // $('.game-specific').attr('data-game-name', data.game.gameName);

    return data;
}

/*--- fonction de mise à jour du joueurs suivi ---*/
function selectPlayerChanged(val) {
    selectedPlayerid = val;
    selectedPlayer = mapMarkers[selectedPlayerid]["Name"];
    getCurrentTraject();
}

/*---- Mise en forme des revenues de la mission ----*/
function getEts2JobIncome(income) {

    var code = buildCurrencyCode(1, '', '€', '');

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
    var incomeFormat = "{0}{1} {2} {3}";
    income *= currencyCode.multiplier;

    return incomeFormat.replace('{0}', currencyCode.symbolOne)
        .replace('{1}', currencyCode.symbolTwo)
        .replace('{2}', income)
        .replace('{3}', currencyCode.symbolThree);
}

/*--- calcul des pourcentage de degats du camion ---*/
function getDamagePercentage(data) {
    // Return the max value of all damage percentages.
    return Math.max(data.truck.wearEngine,
        data.truck.wearTransmission,
        data.truck.wearCabin,
        data.truck.wearChassis,
        data.truck.wearWheels) * 100;
}

/*--- affichage de la tab que l'on souhaite ---*/
function showTab(tabName) {

    if (tabName == "_cargo" || tabName == "_damage") {
        const playerId = document.getElementById("selectPlayer") ? $('#selectPlayer').text() : $('#playerSelector').val();
        console.log(playerId)
        if (playerId == "-") {
            return;
        }
    }
    $('._active_tab').removeClass('_active_tab');
    $('#' + tabName).addClass('_active_tab');

    $('._active_tab_button').removeClass('_active_tab_button');
    $('#' + tabName + '_button').addClass('_active_tab_button');
}

// Wrapper function to set an item to local storage.
function setLocalStorageItem(key, value) {
    if (typeof (Storage) !== "undefined" && localStorage != null) {
        localStorage.setItem(key, value);
    }
}

// Wrapper function to get an item from local storage, or default if local storage is not supported.
function getLocalStorageItem(key, defaultValue) {
    if (typeof (Storage) !== "undefined" && localStorage != null) {
        return localStorage.getItem(key);
    }

    return defaultValue;
}

// Wrapper function to remove an item from local storage
function removeLocalStorageItem(key) {
    if (typeof (Storage) !== "undefined" && localStorage != null) {
        return localStorage.removeItem(key);
    }
}

