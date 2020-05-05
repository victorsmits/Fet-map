# Fet-map

## JSON

### Connected Players ID

```
{
    "id" : Number,
}
```

- *id* : Id of a player connected to Promods

### Player position
```
{
    "Name" : STRING,
    "Player" : STRING,
    "x": Number,
    "y": Number,
    "Team": String
}
```

- *Name* : Player steam name.
- *Player* : In game player name.
- *x* : x position in game.
- *y* : y position in game.
- *Team* : truck brand.

## To add/import

### Import at the end of body
- ```<script type="application/javascript" src="fet.js"></script>```

### Import in head
- ```<script src="https://cdn.jsdelivr.net/npm/@jaames/iro@5"></script>``` 
- ```<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-beta.1/leaflet.css"/>```
- ```` <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>````
- **UPDATE** css/fet.css

## Map integration

### map _line : 232_

`````html
<div id="map"></div>
`````

### Control

#### search bar    _line : 185_

````html
<form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100" id="searchForm">
    <div class="input-group">
        <input type="text" class="form-control bg-light border-1 small"
               placeholder="Search player"
               aria-label="Search"
               aria-describedby="basic-addon2"
               id="search">
        <div class="input-group-append">
            <button class="btn btn-primary" type="submit">
                <i class="fas fa-search fa-sm"></i>
            </button>
        </div>
    </div>
</form>
````

#### selector    _line : 204_

`````html
<select class="selector form-control bg-light border-1 small" id="playerSelector"
        style="margin-right: 1em;">
    <option value="-">–- Select Player --</option>
</select>
<select class="selector form-control bg-light border-1 small" id="TeamSelector">
    <option value="all">All team</option>
</select>
`````

#### color picker modal _line : 174_

```html
<div class="modal fade" id="exampleModal" tabindex="-2" role="dialog"
     aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-body picker-position">
                <div id="picker" onmouseup="colorUpdate()"></div>
            </div>
        </div>
    </div>
</div>
```

#### color picker bouton _line : 225_

```html
<button class="btn btn-primary btn-icon-split" id="openPicker" data-toggle="modal"
        data-placement="right" data-target="#exampleModal"
        title="Changer le fond de la carte"><i class="fas fa-palette"></i>
</button>
`````

