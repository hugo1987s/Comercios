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

    var latitud = [0];
    var longitud = [0];
    var index = 0;

    $("#divMapa").css("display", "block");
    $("#divGrilla").css("display", "block");

    $.getJSON("Json/articlesData.json", function (data) {

        $("#listaNegocios").empty();

        $.each(data, function (index, value) {
            if (value.Categoria.toLowerCase().indexOf(valorABuscar.toLowerCase()) >= 0) {
                var li = $('<li>');
                li.append(value.Vendedor + " (" + value.Categoria + ")");
                $("#listaNegocios").append(li);

                latitud.push(value.Latitud);
                longitud.push(value.Longitud);
            }
        });

        /*
        $("#tblProductos > tbody").html("");
        $.each(data, function (index, value) {

            // if (  value.Categoria == valorABuscar) {
            if (value.Categoria.toLowerCase().indexOf(valorABuscar.toLowerCase()) >= 0) {
                $('#tblProductos > tbody:last').append('<tr><td>'
                    + value.Categoria + '</td><td>'
                    + value.Articulo + '</td><td>'
                    + value.Precio + '</td><td>'
                    + value.Vendedor + '</td></tr>');

                latitud.push(value.Latitud);
                longitud.push(value.Longitud);
            }


        });
*/
        mostrarComercios(latitud, longitud);

    });
}



function mostrarComercios(latitud, longitud) {



    var ungsLocation = [-34.5221554, -58.7000067];

    /*  L.polygon([
        L.latLng(-34.515594, -58.705654),
        L.latLng(-34.523503, -58.714062),
        L.latLng(-34.519177, -58.719890),
        L.latLng(-34.511089, -58.711374),
        L.latLng(-34.514062, -58.707909),
        L.latLng(-34.513824, -58.707584)
    ]).addTo(map);
    */

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
