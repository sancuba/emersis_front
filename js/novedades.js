var novedades = [],
  novedadElegida = null;

$(document).ready(function () {
  getNovedades();
});

function getNovedades() {
  $("#novedades-container").empty();
  $.ajax({
    type: "GET",
    url: "https://emersis.casya.com.ar/api/v1/novedades",
    success: function (result) {
      novedades = result.novedades;
      novedades.forEach((novedad) => {
        var item =
          "<div>" +
          "<div class='card-header d-flex align-items-center justify-content-between'>" +
          "<h2 class='novedad-titulo'>" +
          novedad.titulo +
          "</h2>" +
          "<div>" +
          '<button class="btn btn-primary" style="margin-right: 10px;" onclick="editarNovedad(' +
          novedad.id +
          ')">Editar</button>' +
          '<button class="btn btn-danger" onclick="eliminarNovedad(' +
          novedad.id +
          ')">Eliminar</button>' +
          "</div>" +
          "</div>" +
          "<div class='card-body'>" +
          "<p style='font-weight: bold;'>" +
          (novedad.activo == true
            ? "<span style='color: #25a43f;'>Activo</span>"
            : "<span style='color: #d65252;'>Inactivo</span>") +
          "</p>" +
          "<p>" +
          novedad.descripcion +
          "</p>" +
          "</div>" +
          "</div>";
        $("#novedades-container").append(item);
      });
    },
    error: function (result) {},
    contentType: "application/json",
  });
}
function abrirCrearNovedad() {
  agregarArchivo();
  $("#novedad-crear-popup").fadeIn();
}
function cerrarCrearNovedad() {
  $("#novedad-crear-popup").fadeOut(function () {
    $(".novedad-archivo-container").empty();
  });
}
function guardarNovedad() {
  var titulo = $("#tituloNovedad").val();
  var descripcion = $("#descripcionNovedad").val();
  var activo = $("#activoNovedad").is(":checked");

  var json = {
    titulo: titulo,
    descripcion: descripcion,
    activo: activo,
  };
  var url = "https://emersis.casya.com.ar/api/v1/novedades";
  var type = "POST";
  if (novedadElegida != null) {
    url = url + "/" + novedadElegida.id;
    type = "PATCH";
  }
  $.ajax({
    type: type,
    url: url,
    data: JSON.stringify(json),
    success: function (response) {
      if ($(".novedad-archivo").length > 0) {
        guardarArchivos(response.novedad_id);
      } else {
        cerrarCrearNovedad();
        getNovedades();
      }
    },
    error: function (result) {
      console.log(result);
    },
    contentType: "application/json",
  });
}
function editarNovedad(id) {
  abrirCrearNovedad();
  novedadElegida = novedades.filter((n) => n.id === id)[0];
  $("#tituloNovedad").val(novedadElegida.titulo);
  $("#descripcionNovedad").val(novedadElegida.descripcion);
  $("#activoNovedad").prop("checked", novedadElegida.activo);
}
function eliminarNovedad(id) {
  $.ajax({
    type: "DELETE",
    url: "https://emersis.casya.com.ar/api/v1/novedades/" + id,
    success: function () {
      getNovedades();
    },
    error: function (result) {
      console.log(result);
    },
    contentType: "application/json",
  });
}
function agregarArchivo() {
  var item = '<input class="novedad-archivo" type="file" />';
  $(".novedad-archivo-container").append(item);
}
function guardarArchivos(id) {
  if (id == null && novedadElegida != null) {
    id = novedadElegida.id;
  }
  var data = new FormData();
  $(".novedad-archivo").each(function () {
    data.append("file", this.files[0]);
  });
  var i = 0;
  for (var value of data.values()) {
    i++;
  }
  if (i > 0) {
    $.ajax({
      type: "POST",
      url: "https://emersis.casya.com.ar/api/v1/novedades/" + id + "/files",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      success: function (result) {
        cerrarCrearNovedad();
        getNovedades();
      },
      error: function (result) {
        console.log(result);
      },
    });
  } else {
    cerrarCrearNovedad();
    getNovedades();
  }
}
