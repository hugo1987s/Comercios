var map;
var listadodecomercios = JSON.parse(listadoComerciosJS);
var listadoAvisos = JSON.parse(listadoAvisosJS);


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

    var comercios = [];

    $("#divMapa").css("display", "block");
    $("#divGrilla").css("display", "block");

    $("#listaNegocios").empty();
    $("#listaAvisosRel").empty();


   
    for (let index = 0; index < listadodecomercios["comercios"].length; index++) {
        const value = listadodecomercios.comercios[index];

        if (value.Categoria.toLowerCase().indexOf(valorABuscar.toLowerCase()) >= 0) {
            var li = $('<li>');
            li.append(armarPopup(value));
            $("#listaNegocios").append(li);
            comercios.push(value);
        }
    }

    actualizarInfoComercios(comercios);
}


function actualizarInfoComercios(listaComercios) {

    var cluster = L.markerClusterGroup();
  
    for (i = 0; i < listaComercios.length; i++) {
        cluster.addLayers([
            L.marker([listaComercios[i].Latitud, listaComercios[i].Longitud]).bindPopup(armarPopup(listaComercios[i]))
        ])
        cargarAvisosRelacionados(listaComercios[i].IdComercio, listaComercios[i].Vendedor, listadoAvisos["avisos"]);
    }

    cluster.addTo(map);
    map.addLayer(cluster);
}

function armarPopup(datosComercio) {
    return '<h4>' + datosComercio.Vendedor + '</h4>' +
        '<b>Domicilio:</b> ' + datosComercio.Domicilio +
        '<br><b>Telefono:</b> ' + datosComercio.Telefono +
        '<br><b>Horario:</b> ' + datosComercio.Horario +
        '<hr>';
}

function armarAviso(datosAviso, nombreComercio) {
    return '<h4>' + datosAviso.Articulo + '</h4>' +
        '<b>Categoría:</b> ' + datosAviso.Categoria +
        '<br><b>Vendedor:</b> ' + nombreComercio +
        '<br><b>Precio:</b> ' + datosAviso.Precio +
        '<hr>';
}

function cargarAvisosRelacionados(codigoComercio, nombreComercio, avisos) {

    avisos.forEach(element => {
        if (element.CodigoComercio == codigoComercio) {
            var li = $('<li>');
            li.append(armarAviso(element, nombreComercio));
            $("#listaAvisosRel").append(li);
        }
    });
}

