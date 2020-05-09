# Fet-map API intégration

## Public map

### Connected players
List of players id
```json
[
    0, ...
]
```

 - *id* : Multiplayer id

 URL example : ".../connectedPlayers

 ### Player position
 Position of one player
 ```json
 {
     "name": "String",
     "x": 0,
     "y": 0,
     "team": "String"
 }
 ```

 - *name* : Player name
 - *x*: x position
 - *y*: y position
 - *team*: player team

 URL example : ".../playerPosition/:playerId

 ### Player data
 If it's posible some informations about a player
 ```json
{
    "truck": {
        "speed": 0,
        "fuel": 0,
        "fuelCapacity": 0,
        "wearEngine": 0,
		"wearTransmission": 0,
		"wearCabin":0,
		"wearChassis": 0,
		"wearWheels": 0
	},
	"trailer": {
		"wear": 0,
		"mass": 0,
		"attached": 1
	},
	"cargo": {
		"wear": 0
	},
	"job": {
		"income": 0,
		"destCity": "String",
		"destCompany": "String"
	}
}
 ```
 - *truck* : Truck data
	- *speed* : Truck speed
	- *fuel* : Truck fuel
	- *fuelCapacity* : Truck fuel capacity
	- *wearEngine* : Truck engine damage
	- *wearTransmission* : Truck transmission damage
	- *wearCabin* : Truck cabin damage
	- *wearChassis* : Truck chassis damage
	- *wearWheels* : Truck wheels damage
- *trailer* : Trailer data
	- *wear* : Trailer damage
	- *mass* : Mass of trailler in kg
	- *attached* : Trailler attached to the Truck
- *cargo* : Cargo data
	- *wear* : Cargo damage
- *job* : Mission data
	- *income* : Income of the mission
	- *destCity* : City of destination
	- *destCompany* : Company of destination

URL example : ".../playerData/:playerId

## Admin map

### FET players
List of all players of FET with id
```json
[
    {
        "id": 0,
        "name": "String"
    }, 
    ...
]
```
 - *id* : Player id
 - *name*: Player name

 URL example : ".../players

 ### Player trajects
 List of all traject for a player id
 ```json
[
    {
        "id": 0,
        "source": "String",
        "destination": "String",
        "date": "Datetime"
    },
    ...
]
 ```
 - *id*: Traject id
 - *source*: Traject city source
 - *destination*: Traject city destination
 - *date*: Traject date

 URL example : ".../playerTrajects/:playerId

 ### Player traject position
 List of all position of a player for a traject id
 ```json
 [
     {
         "x": 0,
         "y": 0,
         "speed": 0
     },
     ...
 ]
 ```

 - *x*: x position
 - *y*: y position
 - *speed*: truck speed

 URL example : ".../traject/:trajectId

 ## Next step
 [HTML integration](https://github.com/victorsmits/Fet-map/blob/master/implement.md)
