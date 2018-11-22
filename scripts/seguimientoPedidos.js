var main = function () {
    var url = Config.url;
    var urlRequests = '/requests/';
    var urlDrivers = '/drivers/';
	var urlPositions='/positions';
	var urlIncidents= '/incidents/';
	var urlIncidentsTypes= '/incidenttypes/';

    var map = createMap('mapid');

	var layerDriver = L.layerGroup().addTo(map);
	var layerRequest = L.layerGroup().addTo(map);
	var layerIncident = L.layerGroup().addTo(map);

	drivers= [];

    // Creamos una carrera
	var race1k = new Race("1K", map);
	
	var removeRequest = function(){
		var request = document.getElementById('pedidos').value;
		if(request != ""){
		document.getElementById(request).remove();
		};
	};
	var responseExtract = function (attr, response) {
		return response[attr];
	};
	var extractRequest = function (response) {
		return responseExtract('request', response);
	};
	var extractDriver = function (response) {
		return responseExtract('driver', response);
	};
	var extractPositions = function (response){
		return responseExtract('positions',response);
	};
	var extractIncidents = function (response){
		console.log(responseExtract('incidents', response));
		return responseExtract('incidents', response);
	};
	var extractIncidentsTypes = function (response){
		console.log(responseExtract('incidents', response));
		return responseExtract('incidenttype', response);
	};
	var resDP = function (driver) {
	// pedimos las posiciones con el driver_id, y retornamos el driver completo
		return $.ajax(url + urlDrivers + driver.id + urlPositions)
	       .then(function(response){
				driver.positions = extractPositions(response);
	            return driver;
	        });
	};
	var searchDriver= function(response){
		var driver_id = responseExtract('driver_id',response);
		return	$.ajax(url + urlDrivers + driver_id)
				.then(response => {
					return extractDriver(response);
				});
	};

	var drawRequest = function(response){
		var myIcon = L.icon({
			iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF',
			iconSize: [25, 41],
			iconAnchor: [9, 40],
			popupAnchor: [-1, -36],
		});

		var receiver = responseExtract('receiver',response);
		var sender = responseExtract('sender',response);
		layerRequest.addLayer(L.circle(receiver, {
	        color: '#2ecc71',
	        fillColor: '#2ecc71',
	        fillOpacity: 0.2,
	        radius: 100
    	}));

		layerRequest.addLayer(L.circle(sender, {
	        color: '#2ecc71',
	        fillColor: '#2ecc71',
	        fillOpacity: 0.2,
	        radius: 100
    	}));

    	layerRequest.addLayer(L.marker(receiver,{icon:myIcon}).bindPopup("Cliente"));
		layerRequest.addLayer(L.marker(sender,{icon:myIcon}).bindPopup("Comercio"));
	};

	var infoDriver = function(driver){
		var car = responseExtract('car',driver);
		$("#conductores")
			.append($("<form>")
				.append($("<p>")
					.append("Nombre: "+ responseExtract('name', driver))
					.append($("<br>"))
					.append("Apellido: " + responseExtract('surname', driver))
					.append($("<br>"))
					.append("Puntaje: " + responseExtract('score', driver))
					.append($("<br>"))
					.append("Vehículo: " + responseExtract('description', car))
					.append($("<br>"))
					.append("Color Vehículo: " + responseExtract('color', car))
					.append($("<br>"))
					.append("Patente Vehículo: " + responseExtract('plateNumber', car))
					.append($("<br>"))
				)
				.append($("<input>")
					.attr({
						type:"button",
						value:"Elegir",
						id: responseExtract('id',driver)
					})
				)
			);	
	};

	var drawDrivers = function(response){
		response.forEach(element => {
			searchDriver(element)
			.then(driver => {
				drivers.push(driver);

				var id = responseExtract('id',driver),
					name= responseExtract('name', driver),
					surname= responseExtract('surname', driver);

				var myIcon = L.icon({
					iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF',
					iconSize: [25, 41],
					iconAnchor: [9, 40],
					popupAnchor: [-1, -36],
				});
				
				layerDriver.addLayer(L.marker(responseExtract('position', element),{icon:myIcon}).bindPopup(name +" "+surname));

				infoDriver(driver);

				$("#"+id).click(function(){
					$("#conductores").empty();
					drivers.forEach(d => {
						if(responseExtract('id',d) == id){
							var car = responseExtract('car',d);
							$("#conductores")
								.append($("<form>")
									.append($("<p>")
										.append("Nombre: "+ responseExtract('name', d))
										.append($("<br>"))
										.append("Apellido: " + responseExtract('surname', d))
										.append($("<br>"))
										.append("Puntaje: " + responseExtract('score', d))
										.append($("<br>"))
										.append("Vehículo: " + responseExtract('description', car))
										.append($("<br>"))
										.append("Color Vehículo: " + responseExtract('color', car))
										.append($("<br>"))
										.append("Patente Vehículo: " + responseExtract('plateNumber', car))
										.append($("<br>"))
									)
								);
							resDP(driver)
							.then(starTracing);
						}
					});
				});


			})
		})
	};

	var starTracing = function(driver){
		layerDriver.clearLayers();
		var name = responseExtract('name', driver),
			surname = responseExtract('surname', driver),
			positions = responseExtract('positions',driver);
		var runner = new Runner( name + " " + surname, positions);
		race1k.addRunner(runner);
		race1k.start();
	};

	var searchRequest = function(){
		var request = document.getElementById('pedidos').value;
			layerDriver.clearLayers();
			layerRequest.clearLayers();
			
		if(request != ""){
			document.getElementById('aceptar').style.display = 'none';
			document.getElementById('rechazar').style.display = 'none';
			document.getElementById('pedidos').style.display = 'none';
			$.ajax(url + urlRequests + request)
		    .then(extractRequest)
		    .then(response => {
				drawRequest(response);
				return responseExtract('availableDrivers', response);
			})
			.then(drawDrivers)
		}
	};

	var drawIncidents = function (response){

		var div = document.getElementById("incidents");

		response.forEach(element=> {

			var type_id = responseExtract('type_id', element);
			var form = document.createElement("FORM");

			$.ajax(url + urlIncidentsTypes + type_id)
			.then(extractIncidentsTypes)
			.then(response =>{
				var description = responseExtract('description', response);
				var delay = responseExtract('delay', response);
				var coordinate = responseExtract('coordinate', element);
				
				var myIcon = L.icon({
					iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|e85141&chf=a,s,ee00FFFF',
					iconSize: [25, 41],
					iconAnchor: [9, 40],
					popupAnchor: [-1, -36],
				});

				layerIncident.addLayer(L.marker(coordinate,{icon:myIcon}).bindPopup(description));

				layerIncident.addLayer(L.circle(coordinate, {
					color: '#AA0000',
					fillColor: '#AA0000',
					fillOpacity: 0.2,
					radius: 100
				}));
				
				var x = document.createElement("LABEL");
					 
				x.setAttribute("for", "info");
				x.appendChild(document.createTextNode("Tipo de incidente: " + description + " - Tiempo de demora: " + delay));
				form.insertBefore(x,document.getElementById("info"));

			})

			div.appendChild(form);
		});
	};

	var searchIncidents = function (){
		$.ajax(url + urlIncidents)
		.then(extractIncidents)
		.then(drawIncidents)
	};

	searchIncidents();

	$('#aceptar').click(searchRequest);
	$('#rechazar').click(removeRequest);
};

$(main);