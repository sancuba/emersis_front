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
      novedades = result.novedades.data;
      novedades.forEach((novedad) => {
        var item =
          "<div>" +
          "<div class='card-header d-flex align-items-center justify-content-between'>" +
          "<h2 class='novedad-titulo'>" +
          novedad.titulo +
          "</h2>" +
          "<div>" +
          '<button class="btn btn-info" style="margin-right: 10px;" onclick="verArchivosNovedad(' +
          novedad.id +
          ')">Archivos</button>' +
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
  $(".novedad-archivo").each(function (index) {
    data.append("file[" + index +"]", this.files[0]);
    data.append("description["+ index +"]", this.files[0].name);
  });
  $.ajax({
    type: "POST",
    url: "https://emersis.casya.com.ar/api/v1/novedades/" + id + "/files",
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    done: function (result) {
      cerrarCrearNovedad();
      getNovedades();
    },
    fail: function (result) {
      console.log(result);
    },
  });
}
function verArchivosNovedad(id) {
  $(".novedad-archivos-popup-container").fadeIn();
  $.ajax({
    type: "GET",
    url: "https://emersis.casya.com.ar/api/v1/novedades/" + id + "/files",
    success: function (result) {
      novedad = result;
      $("#novedad-archivos-popup").empty();
      if (novedad.files.length > 0) {
        novedad.files.forEach((file) => {
          var item =
            "<div class='novedad-archivos-popup-row'>" +
            "<label>" +
            file.descripcion +
            "</label>" +
            '<a class="novedad-archivos-popup-a" href="https://emersis.casya.com.ar/public/storage/' +
            file.file +
            '" download="' +
            file.descripcion +
            '" >Descargar</a>' +
            "</div>";
          $("#novedad-archivos-popup").append(item);
        });
      } else {
        var item =
          "<div>" + "<p style='margin: 0;'>No posee archivos</p>" + "</div>";
        $("#novedad-archivos-popup").append(item);
      }
    },
    error: function (result) {},
    contentType: "application/json",
  });
}
function cerrarArchivosPopup() {
  $(".novedad-archivos-popup-container").fadeOut(function () {
    $("#novedad-archivos-popup").empty();
  });
}
