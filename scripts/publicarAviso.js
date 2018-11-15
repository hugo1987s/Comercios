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

  $("#divConsultaExterna").css("display", "none");
  $("#divAviso").width("200%");


  $( "#formAviso" ).submit(function( event ) {
    $("input[type=text]").val("");
    $("textarea").val("");
    $("input[type=number]").val("");
    $("select").prop('selectedIndex',0);
    
    alert('Aviso publicado correctamente!');
    
  });
});

function ConsultarPrecio(valorABuscar) {
  
  if(valorABuscar != "")
  {
      consultarProductos(valorABuscar);
      $("#divConsultaExterna").css("display", "block");
      $("#divAviso").width("100%");
  }
  
}