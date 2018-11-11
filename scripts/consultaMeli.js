

function consultarProductos(prodABuscar) {
    var url = Config.urlMeli;
    var urlGeneralByText = 'q=';

    // OPCIÓN 3: Promises. Request asincrónico evitando el callbackhell.   ****

    var requestProductos = function (productoABuscar) {
        return $.ajax(url + urlGeneralByText + productoABuscar);
    }
    var responseExtract = function (attr, response) {
        console.log(response[attr]);
        return response[attr]
    }

    var mostrarDatos = function (response) {
        $('#spanExtenalData').empty();
        if (response.length > 0) {

            response.forEach(element => {
                $('#spanExtenalData').append('<h4>' + element.title + '</h4>');
                $('#spanExtenalData').append('<table id="tbl' + element.id + '"><tbody></tbody></table>');
                var filaNueva = '<tr class="filaCentrada"><td class="columnaCentrada">  <img id="imgProds" src="' + element.thumbnail + '"  alt="Imagen" /> </td><td class="columnaCentrada"> <h4>' + element.currency_id + ' ' + Math.round(element.price*100)/100 + '</h4> </td></tr>';
                $('#tbl' + element.id + ' tbody').append(filaNueva);
                $('#spanExtenalData').append('</br>');
            });
        }
        else { $('#spanExtenalData').append('<h4>No se encontraron elementos</h4>'); }
    }

    var extractResults = function (response) {
        return responseExtract('results', response);
    }

    // comenzamos la ejecución:
    var objs = requestProductos(prodABuscar)			// pedimos el producto al servidor
        .then(extractResults)
        .then(mostrarDatos)
        .done(function () {
            console.log("Fin.");
        });


}
