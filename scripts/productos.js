var map;

function init() {
    $(document).ready(function () {
        $("#divMapa").css("display", "none");
        $("#divGrilla").css("display", "none");
    });

    map = createMap('divMapa');

}
function borrarCapas() {
    var i = 0;

    map.eachLayer(function (layer) {
        if (i > 0)
            map.removeLayer(layer);
        i = i + 1;
    });
}


function buscarArticulos(valorABuscar) {

    if (valorABuscar.trim() == "") {
        alert('Ingrese una categoria a buscar!')
        return;
    }

    borrarCapas();

    var latitud = [];
    var longitud = [];
    var index = 0;

    var comercios = [];

    $("#divMapa").css("display", "block");
    $("#divGrilla").css("display", "block");

    $.getJSON("Json/Comercios.json", function (data) {
        $("#listaNegocios").empty();
        $.each(data, function (index, value) {
            if (value.Categoria.toLowerCase().indexOf(valorABuscar.toLowerCase()) >= 0) {
                
                var li = $('<li>');
                //li.append(value.Vendedor + " (" + value.Categoria + ")");
                li.append(armarPopup(value));
                $("#listaNegocios").append(li);

                latitud.push(value.Latitud);
                longitud.push(value.Longitud);
                
                comercios.push(value);
                //mostrarComercios(value);
            }
        });
        //mostrarComercios(latitud, longitud);
        mostrarComercios(comercios);
    });
}



function mostrarComercios(listaComercios) {

    var cluster = L.markerClusterGroup();

    for (i = 0; i < listaComercios.length; i++) {
        cluster.addLayers([
            L.marker([listaComercios[i].Latitud, listaComercios[i].Longitud]).bindPopup(armarPopup(listaComercios[i]))
        ])
    }
    cluster.addTo(map);
    map.addLayer(cluster);
}

function armarPopup(datosComercio)
{
    return '<h4>'+ datosComercio.Vendedor + '</h4>' +
    '<b>Domicilio:</b> ' + datosComercio.Domicilio +
    '<br><b>Telefono:</b> ' + datosComercio.Telefono +
    '<br><b>Horario:</b> ' + datosComercio.Horario +
    '<hr>';
}

/*
function mostrarComercios(latitud, longitud) {
    var ungsLocation = [-34.5221554, -58.7000067];

    var ungsMarker = L.marker(ungsLocation);
    ungsMarker.addTo(map);

    var cluster = L.markerClusterGroup();
    //map.layersControl.removeFrom();

    for (i = 1; i < latitud.length; i++) {
        var latLong = "[" + latitud[i] + "," + longitud[i] + "]";
        cluster.addLayers([
            ungsMarker,
            L.marker([latitud[i], longitud[i]])
        ])
    }
    cluster.addTo(map);
    map.addLayer(cluster);
}
*/

//L.marker([latitud[i], longitud[i]]).bindPopup(info);