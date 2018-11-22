var Race = function(name, map) {
    this.name = name;
    this.map = map;
    this.runnersData = [];

    this.addRunner = function(runner) {
        //Creamos el layer en el mapa para ese runner
        var runnerLayer = L.layerGroup().addTo(this.map);
        // Agregamos el layer al control
        this.map.layersControl.addOverlay(runnerLayer, runner.name);

        var myIcon = L.icon({
                iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF',
                iconSize: [25, 41],
                iconAnchor: [9, 40],
                popupAnchor: [-1, -36],
        });

        var updater = function(newPosition) {
            var layers = runnerLayer.getLayers();
            if(layers.length > 0){
                layers[0].setLatLng(newPosition);
            }
            else{
                runnerLayer.addLayer(L.marker(newPosition,{icon:myIcon}).bindPopup(runner.name));
            }
        }

        this.runnersData.push({
            runner: runner,
            updater: updater
        })
    }

    this.start = function() {
        this.runnersData.forEach(function(data) {
            var runner = data.runner;
            runner.run(data.updater);
        });
    }
};