# Fet-map integration

## Public map

### Head imports 
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-beta.1/leaflet.css"/>

<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>

<link href="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/css/fet.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/css/dashboard.css" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/@jaames/iro@5"></script>
```

### Content integration
Add [map.html](https://github.com/victorsmits/Fet-map/blob/master/html/map.html) content

### Custom js integration
At the end of body add
```html
    <!-- Core plugin JavaScript-->
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/vendor/jquery-easing/jquery.easing.min.js"></script>


    <!-- Page level plugins -->
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/vendor/chart.js/Chart.min.js"></script>

    <!-- Page level custom scripts -->
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/js/demo/chart-area-demo.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/js/demo/chart-pie-demo.js"></script>

    <!--  Custom script -->
    <script type="application/javascript" src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/Dashboard.js"></script>
    <script type="application/javascript" src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/fet.js"></script>
```

## Admin map

### Head imports
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-beta.1/leaflet.css"/>

<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>

<link href="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/css/fet.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/css/dashboard.css" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/@jaames/iro@5"></script>

<script src="https://www.amcharts.com/lib/4/core.js"></script>
<script src="https://www.amcharts.com/lib/4/charts.js"></script>
<script src="https://www.amcharts.com/lib/4/themes/animated.js"></script>
```

### Content integration 
Add [admin.html](https://github.com/victorsmits/Fet-map/blob/master/html/admin.html) content

### Custom js integration
At the end of body add

```html
    <!-- Core plugin JavaScript-->
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Page level plugins -->
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/vendor/chart.js/Chart.min.js"></script>

    <!-- Page level custom scripts -->
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/js/demo/chart-area-demo.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/js/demo/chart-pie-demo.js"></script>

    <!--  Custom script -->
    <script type="application/javascript" src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/fet_admin.js"></script>
    <script type="application/javascript" src="https://cdn.jsdelivr.net/gh/victorsmits/Fet-map/admin-chart.js"></script>
```
