/* DEBUG */

L.marker(game_coord_to_pixels(3000, 3000), {icon: getTeamIcon("Volvo")}).addTo(map)
L.marker(game_coord_to_pixels(6000, 3000), {icon: getTeamIcon("Mercedes-Benz")}).addTo(map)
L.marker(game_coord_to_pixels(9000, 3000), {icon: getTeamIcon("Scania")}).addTo(map)
L.marker(game_coord_to_pixels(12000, 3000), {icon: getTeamIcon("MAN")}).addTo(map)
L.marker(game_coord_to_pixels(15000, 3000), {icon: getTeamIcon("Renault Trucks")}).addTo(map)
L.marker(game_coord_to_pixels(18000, 3000), {icon: getTeamIcon("Iveco")}).addTo(map)
L.marker(game_coord_to_pixels(21000, 3000), {icon: getTeamIcon("DAF")}).addTo(map)


// EU TEST
v = game_coord_to_pixels(EU.CalaisInGame.x, EU.CalaisInGame.y)
P = game_coord_to_pixels(EU.ParisInGame.x, EU.ParisInGame.y)

L.marker(v).bindPopup('Calais').addTo(map);
L.marker(P).bindPopup('paris').addTo(map);

console.log("correction x : " + ((EU.ParisOnMap.lat - P[0]) + UK.x))
console.log("correction y : " + ((EU.ParisOnMap.long - P[1]) + UK.y))

L.marker([EU.ParisOnMap.lat, EU.ParisOnMap.long]).bindPopup('Paris goal').addTo(map);
L.marker([EU.CalaisOnMap.lat, EU.CalaisOnMap.long]).bindPopup('Calais goal').addTo(map);

// UK TEST
//
Lon = game_coord_to_pixels(UK.LondonInGame.x, UK.LondonInGame.y)
Man = game_coord_to_pixels(UK.ManchesterInGame.x, UK.ManchesterInGame.y)

L.marker(Lon).bindPopup('London').addTo(map);
L.marker(Man).bindPopup('Manchester').addTo(map);

L.marker([UK.LondonOnMap.lat, UK.LondonOnMap.long]).bindPopup('London goal').addTo(map);
L.marker([UK.ManchesterOnMap.lat, UK.ManchesterOnMap.long]).bindPopup('Manchester goal').addTo(map);

console.log(Man)

console.log("correction x : " + ((UK.ManchesterOnMap.lat - Man[0]) + UK.x))
console.log("correction y : " + ((UK.ManchesterOnMap.long - Man[1]) + UK.y))

// // DEBUGGING CODE BELOW!
let marker1 = L.marker([0, 0]).bindPopup('marker1').addTo(map);
let marker2 = L.marker([1, 1]).bindPopup('marker2').addTo(map);
let marker3 = L.marker([256, 256]).bindPopup('marker3').addTo(map);
let marker4 = L.marker([MAX_X / 2, MAX_Y / 2]).bindPopup('marker4').addTo(map);
let marker5 = L.marker([MAX_X / 1, MAX_Y / 2]).bindPopup('marker5').addTo(map);
let marker6 = L.marker([MAX_X / 2, MAX_Y / 1]).bindPopup('marker6').addTo(map);
let marker7 = L.marker([MAX_X / 1, MAX_Y / 1]).bindPopup('marker7').addTo(map);

// For version 1.0
// https://github.com/Leaflet/Leaflet/issues/3736
let DebugLayer = L.GridLayer.extend({
    createTile: function (coords) {
        // create a <canvas> element for drawing
        var tile = L.DomUtil.create('canvas', 'leaflet-tile');

        // setup tile width and height according to the options
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;

        // get a canvas context and draw something on it using coords.x, coords.y and coords.z
        var context = tile.getContext('2d');

        context.beginPath();
        context.rect(0, 0, 256, 256);
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.stroke();

        context.font = "20px Arial";
        context.fillStyle = 'white';
        context.fillText(coords.x + " / " + coords.y + " / " + coords.z, 80, 140);

        // return the tile so it can be rendered on screen
        return tile;
    }
});

new DebugLayer().addTo(map);

//
//
// // For versions earlier than 1.0
// // https://github.com/Leaflet/Leaflet/issues/2776
let debugLayer = L.tileLayer.canvas({
    minZoom: 0,
    maxZoom: 7,
    continuousWorld: true,
});

debugLayer.drawTile = function (canvas, point, zoom) {
    let context = canvas.getContext('2d');

    context.beginPath();
    context.rect(0, 0, 256, 256);
    context.lineWidth = 2;
    context.strokeStyle = 'white';
    context.stroke();

    context.font = "20px Arial";
    context.fillStyle = 'white';
    context.fillText(point.x + " / " + point.y + " / " + zoom, 80, 140);
}
debugLayer.addTo(map);
