var Drawer = function() {
    return {
        drawIncidentInMap: drawIncidentInMap,
        drawTypesInList: drawTypesInList
    }

    /******************************************************************************
     * Función para dibujar un incidente en un mapa.
     */
    function drawIncidentInMap(incident, map) {
        console.log("Dibujando el incidente: " + incident.id);

		var info = incident.type.description;
		// Creamos un marker.		
		var p = L.marker(L.latLng(incident.coordinate.lat, incident.coordinate.lon))
			.bindPopup(info);

		p.addTo(map);		
	}

    /******************************************************************************
     * Función para listar los tipos de incidente en la página.
     */
    function drawTypesInList(types, nodeId) {        
		types.forEach(function(type) {
            var li = $('<li>');
            li.append(type.description + " (" + type.delay +")");
            $("#"+nodeId).append(li);
        });
    }

    /******************************************************************************
     * Función para dibujar un comercio en un mapa.
     */
    function drawMarketInMap(market, map) {
        console.log("Dibujando el comercio: " + market.id);

		var info = market.info;
		// Creamos un marker.		
		var p = L.marker(L.latLng(market.coordinate.lat, market.coordinate.lon))
			.bindPopup(info);

		p.addTo(map);		
	}
}
