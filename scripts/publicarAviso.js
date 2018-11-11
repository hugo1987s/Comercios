$(document).ready(function () {


  function readURL(input) {

    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#imgArticulo').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#btnExaminar").change(function () {
    readURL(this);
  });


});

function ConsultarPrecio(valorABuscar) {
  
  if(valorABuscar != "")
  {
      consultarProductos(valorABuscar);
  }
  
}