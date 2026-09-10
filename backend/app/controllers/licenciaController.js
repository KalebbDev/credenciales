const licenciaService = require("../services/licenciaService");
const Ciudadano = require("../models/ciudadano");
const printer = require("pdf-to-printer");
const fs = require("fs");

exports.crearLicencia = async (req, res) => {
  try {
    const licencia = await licenciaService.agregarLicencia(req.params.ciudadanoId, req.body);
    res.json({ message: "Licencia creada correctamente", licencia });
  } catch (err) {
    res.status(500).json({ message: "Error al crear licencia", error: err.message });
  }
};

exports.listarLicencias = async (req, res) => {
  try {
    const licencias = await licenciaService.obtenerLicencias(req.params.ciudadanoId);
    res.json(licencias);
  } catch (err) {
    res.status(500).json({ message: "Error al listar licencias", error: err.message });
  }
};

exports.editarLicencia = async (req, res) => {
  try {
    const licencia = await licenciaService.editarLicencia(req.params.ciudadanoId, req.params.licenciaId, req.body);
    if (!licencia) return res.status(404).json({ message: "Licencia no encontrada" });
    res.json({ message: "Licencia actualizada correctamente", licencia });
  } catch (err) {
    res.status(500).json({ message: "Error al editar licencia", error: err.message });
  }
};

exports.eliminarLicencia = async (req, res) => {
  try {
    const eliminado = await licenciaService.eliminarLicencia(req.params.ciudadanoId, req.params.licenciaId);
    if (!eliminado) return res.status(404).json({ message: "Licencia no encontrada" });
    res.json({ message: "Licencia eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar licencia", error: err.message });
  }
};

exports.listarTodasLicencias = async (req, res) => {
  try {
    const licencias = await licenciaService.obtenerTodasLicencias();
    res.json(licencias);
  } catch (err) {
    res.status(500).json({ message: "Error al listar todas las licencias", error: err.message });
  }
};
const PDFDocument = require("pdfkit");
const path = require("path");


function formatearFecha(fecha) {
  if (!fecha) return "";

  const d = new Date(fecha);

  if (isNaN(d.getTime())) return "";

  const dia = String(d.getUTCDate()).padStart(2, "0");
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const anio = d.getUTCFullYear();

  return `${dia}/${mes}/${anio}`;
}

function calcularVigencia(expedida, vencimiento) {
  if (!expedida || !vencimiento) return "";

  const inicio = new Date(expedida);
  const fin = new Date(vencimiento);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    return "";
  }

  return `${fin.getUTCFullYear() - inicio.getUTCFullYear()} AÑOS`;
}

function obtenerRutaUpload(ruta) {
  if (!ruta) return null;

  const nombreArchivo = path.basename(ruta);

  return path.join(
    __dirname,
    "../uploads",
    nombreArchivo
  );
}

function dibujarTexto(doc, texto, x, y, opciones = {}) {
  doc
    .font(opciones.font || "Helvetica")
    .fontSize(opciones.size || 7)
    .fillColor(opciones.color || "#111111")
    .text(texto || "", x, y, {
      width: opciones.width,
      align: opciones.align || "left",
      lineBreak: opciones.lineBreak !== false
    });
}


exports.generarLicenciaPDF = async (req, res) => {

  try {

    const { licenciaId } = req.params;

    // =====================================================
    // BUSCAR CIUDADANO
    // =====================================================

    const ciudadano = await Ciudadano.findOne({
      "licencias._id": licenciaId
    });

    if (!ciudadano) {
      return res.status(404).json({
        status: 404,
        message: "Licencia no encontrada"
      });
    }

    // =====================================================
    // BUSCAR LICENCIA
    // =====================================================

    const licencia = ciudadano.licencias.id(licenciaId);

    if (!licencia) {
      return res.status(404).json({
        status: 404,
        message: "Licencia no encontrada"
      });
    }

    const datos = ciudadano.datosPersonales;

    // =====================================================
    // DATOS
    // =====================================================

    const nombreCompleto = [
      datos.nombre,
      datos.apellidoPaterno,
      datos.apellidoMaterno
    ]
      .filter(Boolean)
      .join(" ")
      .toUpperCase();

    const expedida = formatearFecha(
      licencia.expedida
    );

    const vencimiento = formatearFecha(
      licencia.vencimiento
    );

    const nacimiento = formatearFecha(
      datos.nacimiento
    );

    const antiguedad = formatearFecha(
      licencia.antiguedad
    );

    const vigencia = calcularVigencia(
      licencia.expedida,
      licencia.vencimiento
    );

    // =====================================================
    // RUTAS DE IMÁGENES
    // =====================================================

    const rutaFoto = obtenerRutaUpload(
      datos.fotografia
    );

    const rutaFirma = obtenerRutaUpload(
      datos.firma
    );

    // =====================================================
    // PDF
    // =====================================================

    const W = 242.65;
    const H = 153.07;

    const doc = new PDFDocument({
      size: [W, H],
      margin: 0
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="licencia-${licenciaId}.pdf"`
    );

    doc.pipe(res);

    // =====================================================
    // =====================================================
    // FRENTE
    // =====================================================
    // =====================================================

    // -----------------------------------------------------
    // Fondo
    // -----------------------------------------------------

    doc
      .rect(0, 0, W, H)
      .fill("#F3F5F4");

    // -----------------------------------------------------
    // Encabezado
    // -----------------------------------------------------

    doc
      .rect(0, 0, W, 43)
      .fill("#57509A");

    // Línea dorada
    doc
      .rect(0, 42.5, W, 2)
      .fill("#C89B59");

    // -----------------------------------------------------
    // Encabezado institucional
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "SECRETARÍA DE",
      91,
      8,
      {
        font: "Helvetica-Bold",
        size: 8.5,
        color: "#FFFFFF",
        width: 95
      }
    );

    dibujarTexto(
      doc,
      "MOVILIDAD Y",
      91,
      17,
      {
        font: "Helvetica-Bold",
        size: 8.5,
        color: "#FFFFFF",
        width: 95
      }
    );

    dibujarTexto(
      doc,
      "TRANSPORTE",
      91,
      26,
      {
        font: "Helvetica-Bold",
        size: 8.5,
        color: "#FFFFFF",
        width: 95
      }
    );

    dibujarTexto(
      doc,
      "LICENCIA PARA CONDUCIR",
      88,
      36,
      {
        font: "Helvetica-Bold",
        size: 7,
        color: "#FFFFFF",
        width: 125,
        align: "center"
      }
    );

    // -----------------------------------------------------
    // Marca de prototipo
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "DOCUMENTO DE EJEMPLO — SIN VALIDEZ OFICIAL",
      5,
      46,
      {
        font: "Helvetica-Bold",
        size: 4.8,
        color: "#A52A2A",
        width: 232,
        align: "center"
      }
    );

    // =====================================================
    // FOTO PRINCIPAL
    // =====================================================

    const fotoX = 10;
    const fotoY = 56;
    const fotoW = 59;
    const fotoH = 73;

    if (rutaFoto) {

      try {

        doc.image(
          rutaFoto,
          fotoX,
          fotoY,
          {
            fit: [fotoW, fotoH],
            align: "center",
            valign: "center"
          }
        );

      } catch (error) {

        console.error(
          "No se pudo cargar fotografía:",
          rutaFoto,
          error.message
        );

        doc
          .rect(
            fotoX,
            fotoY,
            fotoW,
            fotoH
          )
          .stroke("#888888");
      }

    } else {

      doc
        .rect(
          fotoX,
          fotoY,
          fotoW,
          fotoH
        )
        .stroke("#888888");
    }

    // =====================================================
    // NOMBRE
    // =====================================================

    dibujarTexto(
      doc,
      nombreCompleto,
      77,
      57,
      {
        font: "Helvetica",
        size: 8.2,
        color: "#111111",
        width: 112
      }
    );

    // =====================================================
    // CURP
    // =====================================================

    dibujarTexto(
      doc,
      "CURP",
      77,
      73,
      {
        font: "Helvetica",
        size: 7.2,
        width: 100
      }
    );

    dibujarTexto(
      doc,
      datos.curp,
      77,
      81,
      {
        font: "Helvetica-Bold",
        size: 7.2,
        width: 112
      }
    );

    // =====================================================
    // NACIONALIDAD
    // =====================================================

    dibujarTexto(
      doc,
      "NACIONALIDAD",
      77,
      93,
      {
        font: "Helvetica",
        size: 7.2,
        width: 100
      }
    );

    dibujarTexto(
      doc,
      String(datos.nacionalidad || "").toUpperCase(),
      77,
      101,
      {
        font: "Helvetica-Bold",
        size: 7.2,
        width: 100
      }
    );

    // =====================================================
    // EXPEDIDA
    // =====================================================

    dibujarTexto(
      doc,
      "EXPEDIDA",
      77,
      113,
      {
        font: "Helvetica",
        size: 6.5,
        width: 50
      }
    );

    dibujarTexto(
      doc,
      expedida,
      77,
      121,
      {
        font: "Helvetica-Bold",
        size: 6.5,
        width: 50
      }
    );

    // =====================================================
    // VENCIMIENTO
    // =====================================================

    dibujarTexto(
      doc,
      "VENCIMIENTO",
      128,
      113,
      {
        font: "Helvetica",
        size: 6.5,
        width: 60
      }
    );

    dibujarTexto(
      doc,
      vencimiento,
      128,
      121,
      {
        font: "Helvetica-Bold",
        size: 6.5,
        width: 60
      }
    );

    // =====================================================
    // VIGENCIA
    // =====================================================

    dibujarTexto(
      doc,
      "VIGENCIA",
      77,
      134,
      {
        font: "Helvetica",
        size: 6.5,
        width: 50
      }
    );

    dibujarTexto(
      doc,
      vigencia,
      77,
      142,
      {
        font: "Helvetica-Bold",
        size: 6.5,
        width: 55
      }
    );

    // =====================================================
    // TIPO
    // =====================================================

    dibujarTexto(
      doc,
      "TIPO",
      190,
      56,
      {
        font: "Helvetica",
        size: 7.5,
        width: 40
      }
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(34)
      .fillColor("#15915D")
      .text(
        licencia.tipo || "",
        185,
        66,
        {
          width: 45,
          align: "center"
        }
      );

    // =====================================================
    // FOLIO
    // =====================================================

    dibujarTexto(
      doc,
      licencia.folio,
      172,
      116,
      {
        font: "Helvetica-Bold",
        size: 8,
        width: 63,
        align: "right"
      }
    );

    // =====================================================
    // NOMBRE DEL TIPO
    // =====================================================

    dibujarTexto(
      doc,
      String(
        licencia.nombreTipo || ""
      ).toUpperCase(),
      165,
      128,
      {
        font: "Helvetica-Bold",
        size: 6.8,
        width: 70,
        align: "right"
      }
    );

    // =====================================================
    // SEGUNDA FOTO TENUE
    // =====================================================
    //
    // Es la pequeña fotografía que aparece debajo de la
    // zona de vencimiento en la referencia.
    //
    // No utilizamos efectos holográficos ni patrones.
    // =====================================================

    if (rutaFoto) {

      try {

        doc.save();

        doc.opacity(0.18);

        doc.image(
          rutaFoto,
          126,
          125,
          {
            fit: [38, 25],
            align: "center",
            valign: "center"
          }
        );

        doc.restore();

      } catch (error) {

        console.error(
          "No se pudo cargar fotografía secundaria:",
          error.message
        );
      }
    }


    // =====================================================
    // =====================================================
    // REVERSO
    // =====================================================
    // =====================================================

    doc.addPage({
      size: [W, H],
      margin: 0
    });

    // -----------------------------------------------------
    // Fondo
    // -----------------------------------------------------

    doc
      .rect(0, 0, W, H)
      .fill("#F2F4F3");

    // =====================================================
    // FRANJA VERTICAL
    // =====================================================
    //
    // Esta es la zona gris que observamos en el extremo
    // derecho de la referencia.
    // =====================================================

    doc
      .rect(
        213,
        0,
        29.65,
        H
      )
      .fill("#D9DDDC");

    // Línea divisoria

    doc
      .moveTo(213, 0)
      .lineTo(213, H)
      .lineWidth(0.8)
      .stroke("#B8BCBB");

    // =====================================================
    // FOLIO DEL REVERSO
    // =====================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(6.5)
      .fillColor("#666666")
      .text(
        licencia.folio || "",
        216,
        8,
        {
          width: 23,
          align: "center"
        }
      );

    // =====================================================
    // AVISO DE PROTOTIPO
    // =====================================================

    dibujarTexto(
      doc,
      "DOCUMENTO DE EJEMPLO",
      15,
      8,
      {
        font: "Helvetica-Bold",
        size: 5,
        color: "#A52A2A",
        width: 180,
        align: "center"
      }
    );

    dibujarTexto(
      doc,
      "SIN VALIDEZ OFICIAL",
      15,
      15,
      {
        font: "Helvetica-Bold",
        size: 5,
        color: "#A52A2A",
        width: 180,
        align: "center"
      }
    );

    // =====================================================
    // COLUMNA IZQUIERDA
    // =====================================================

    // -----------------------------------------------------
    // DONADOR
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "DONADOR:",
      15,
      30,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    dibujarTexto(
      doc,
      datos.donador ? "SI" : "NO",
      15,
      40,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    // -----------------------------------------------------
    // ALERGIAS
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "ALERGIAS:",
      15,
      53,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    let alergias = datos.alergias;

    if (
      alergias === false ||
      alergias === "false" ||
      !alergias
    ) {
      alergias = "NO";
    }

    dibujarTexto(
      doc,
      String(alergias).toUpperCase(),
      15,
      63,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    // =====================================================
    // DATOS DERECHA
    // =====================================================

    // -----------------------------------------------------
    // TIPO SANGUÍNEO
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "TIPO SANGUÍNEO:",
      120,
      30,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 80
      }
    );

    dibujarTexto(
      doc,
      datos.tipoSanguineo,
      120,
      40,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 70
      }
    );

    // -----------------------------------------------------
    // TELÉFONO
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "TELÉFONO:",
      120,
      53,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 70
      }
    );

    dibujarTexto(
      doc,
      datos.telefono,
      120,
      63,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    // -----------------------------------------------------
    // NACIMIENTO
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "NACIMIENTO:",
      120,
      76,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    dibujarTexto(
      doc,
      nacimiento,
      120,
      86,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    // -----------------------------------------------------
    // ANTIGÜEDAD
    // -----------------------------------------------------

    dibujarTexto(
      doc,
      "ANTIGÜEDAD:",
      120,
      99,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    dibujarTexto(
      doc,
      antiguedad,
      120,
      109,
      {
        font: "Helvetica-Bold",
        size: 7,
        width: 75
      }
    );

    // =====================================================
    // FIRMA
    // =====================================================

    /*
     * Firma del ciudadano.
     */

    if (rutaFirma) {

      try {

        doc.image(
          rutaFirma,
          72,
          94,
          {
            fit: [45, 25],
            align: "center",
            valign: "center"
          }
        );

      } catch (error) {

        console.error(
          "No se pudo cargar firma:",
          error.message
        );
      }
    }

    // Línea de firma

    doc
      .moveTo(65, 121)
      .lineTo(125, 121)
      .lineWidth(0.6)
      .stroke("#222222");

    dibujarTexto(
      doc,
      "FIRMA DEL TITULAR",
      65,
      123,
      {
        font: "Helvetica-Bold",
        size: 5.5,
        width: 60,
        align: "center"
      }
    );

    // =====================================================
    // ESPACIO PARA RESPONSABLE
    // =====================================================

    /*
     * Estos datos todavía no existen en el JSON.
     * Por eso dejamos el espacio reservado.
     */

    doc
      .moveTo(15, 112)
      .lineTo(58, 112)
      .lineWidth(0.6)
      .stroke("#222222");

    dibujarTexto(
      doc,
      "NOMBRE / CARGO",
      15,
      114,
      {
        font: "Helvetica-Bold",
        size: 5,
        width: 43,
        align: "center"
      }
    );

    // =====================================================
    // SEGUNDO RESPONSABLE
    // =====================================================

    doc
      .moveTo(15, 132)
      .lineTo(58, 132)
      .lineWidth(0.6)
      .stroke("#222222");

    dibujarTexto(
      doc,
      "FIRMA / RESPONSABLE",
      15,
      134,
      {
        font: "Helvetica-Bold",
        size: 5,
        width: 43,
        align: "center"
      }
    );

    // =====================================================
    // TEXTO INFERIOR
    // =====================================================

    dibujarTexto(
      doc,
      "DOCUMENTO DE PRUEBA PARA EL SISTEMA DE LICENCIAS",
      65,
      140,
      {
        font: "Helvetica-Bold",
        size: 4.5,
        color: "#555555",
        width: 140,
        align: "center"
      }
    );

    // =====================================================
    // TERMINAR PDF
    // =====================================================

    doc.end();

  } catch (err) {

    console.error(
      "ERROR GENERANDO LICENCIA PDF:",
      err
    );

    if (!res.headersSent) {

      return res.status(500).json({
        status: 500,
        message: "Error al generar PDF",
        error: err.message
      });

    }
  }
};