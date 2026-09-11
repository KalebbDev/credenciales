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
    const mm = (valor) => valor * 2.83465;

    doc.pipe(res);

    // =====================================================
    // FRENTE
    // =====================================================

    // -----------------------------------------------------
    // FONDO COMPLETO DE LA TARJETA
    // -----------------------------------------------------

    doc.rect(0, 0, W, H)
      .fill("#F2F4F3");


    // =====================================================
    // ENCABEZADO SUPERIOR
    // =====================================================

    const headerY = 0;
    const headerH = mm(14);

    // Fondo morado
    doc.rect(
      0,
      headerY,
      W,
      headerH
    ).fill("#5B568F");


    // =====================================================
    // ÁREA RESERVADA PARA ESCUDO IZQUIERDO
    // =====================================================

    const escudoX = mm(4);
    const escudoY = mm(2);
    const escudoW = mm(11);
    const escudoH = mm(11);

    doc.image(
      path.join(__dirname, "../utils/eum.png"),
      escudoX,
      escudoY,
      {
        fit: [escudoW, escudoH],
        align: "center",
        valign: "center"
      }
    );


    // =====================================================
    // ÁREA RESERVADA PARA MANDALA CENTRAL
    // =====================================================

    const mandalaX = mm(27);
    const mandalaY = mm(3);
    const mandalaW = mm(4);
    const mandalaH = mm(4);

    doc.image(
      path.join(__dirname, "../utils/mandalas.png"),
      mandalaX,
      mandalaY,
      {
        fit: [mandalaW, mandalaH],
        align: "center",
        valign: "center"
      }
    );



    // =====================================================
    // ÁREA RESERVADA PARA LOGO TLAXCALA
    // =====================================================

    const logoTlaxX = mm(71);
    const logoTlaxY = mm(2);
    const logoTlaxW = mm(7);
    const logoTlaxH = mm(7);

    doc.image(
      path.join(__dirname, "../utils/tlax.png"),
      logoTlaxX,
      logoTlaxY,
      {
        fit: [logoTlaxW, logoTlaxH],
        align: "center",
        valign: "center"
      }
    );


    // =====================================================
    // TEXTO DE LA SECRETARÍA
    // =====================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(5.2) // tamaño de fuente aproximado para que encaje en 5mm de alto
      .fillColor("#E8E8EA")
      .text(
        "SECRETARÍA DE\nMOVILIDAD Y\nTRANSPORTE",
        mm(32.5), // posición X en mm
        mm(2.5),    // posición Y en mm
        {
          width: mm(15), // ancho en mm
          //height: mm(5), // alto en mm
          align: "left",
          lineGap: -1
        }
      );


    // =====================================================
    // LICENCIA PARA CONDUCIR
    // =====================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(4.4) // ajustado para que encaje en 2.5mm de alto
      .fillColor("#E8E8EA")
      .text(
        "LICENCIA PARA CONDUCIR",
        mm(28), // posición X en mm
        mm(10), // posición Y en mm
        {
          //width: mm(15), // ancho aproximado en mm (ajusta si quieres más espacio)
          height: mm(2.5), // alto en mm
          //align: "center"
        }
      );


    // =====================================================
    // TLAXCALA
    // =====================================================

    doc
      .font("Helvetica-Bold")
      .fontSize(8) // ajustado para que encaje en 2.3mm de alto
      .fillColor("#F1F1F3")
      .text(
        "TLAXCALA",
        mm(66), // posición X en mm
        mm(9),  // posición Y en mm
        {
          //width: mm(15),   // ancho aproximado en mm (ajusta si quieres más espacio)
          height: mm(2.3), // alto en mm
          //align: "center"
        }
      );


    // =====================================================
    // UNA NUEVA HISTORIA
    // =====================================================

    doc
      .font("Helvetica")
      .fontSize(2.8) // ajustado para que encaje en 1mm de alto
      .fillColor("#E8E8EA")
      .text(
        "UNA NUEVA HISTORIA",
        mm(67),   // posición X en mm
        mm(12.5), // posición Y en mm
        {
          //width: mm(15),   // ancho aproximado en mm (ajusta si quieres más espacio)
          height: mm(1),   // alto en mm
          //align: "center",
          characterSpacing: 0.5 // opcional si quieres más separación entre letras
        }
      );



    // =====================================================
    // FRANJA DORADA + VERDE
    // =====================================================

// Fondo morado
    doc

    // Línea dorada
    const lineaY = mm(14); // justo debajo del fondo morado
    const lineaH = mm(1);  // altura de 1mm
    const lineaDoradaW = mm(65);

    doc
      .rect(0, lineaY, lineaDoradaW, lineaH)
      .fill("#C9A227");

    // Línea verde
    const lineaVerdeX = lineaDoradaW;
    const lineaVerdeW = W - lineaDoradaW;

    doc
      .rect(lineaVerdeX, lineaY, lineaVerdeW, lineaH)
      .fill("#006400"); // verde institucional


    doc
      .rect(
        lineaVerdeX,
        lineaY,
        lineaVerdeW,
        lineaH
      )
      .fill("#719B68");


    // Línea fina inferior
    doc
      .moveTo(
        0,
        lineaY + lineaH
      )
      .lineTo(
        W,
        lineaY + lineaH
      )
      .lineWidth(0.35)
      .stroke("#D0D0D0");


    // =====================================================
    // MARCA DE PROTOTIPO
    // =====================================================



    doc.opacity(1);


    // =====================================================
    // AQUÍ CONTINÚA TU FOTO PRINCIPAL
    // =====================================================
    // =====================================================
    // FOTO PRINCIPAL
    // =====================================================

    // Espacio reservado para la foto
    const fotoX = mm(2);   // posición X inicial
    const fotoY = mm(18);  // posición Y inicial
    const fotoW = mm(20);  // ancho máximo permitido
    const fotoH = mm(21);  // alto máximo permitido

    if (rutaFoto) {
      try {
        doc.image(
          rutaFoto,
          fotoX,
          fotoY,
          {
            fit: [fotoW, fotoH],   // ajusta la foto dentro del espacio
            align: "center",
            valign: "center"
          }
        );
      } catch (error) {
        console.error("No se pudo cargar fotografía:", rutaFoto, error.message);
        // marco gris si falla la carga
        doc.rect(fotoX, fotoY, fotoW, fotoH).stroke("#888888");
      }
    } else {
      // marco gris si no hay foto
      doc.rect(fotoX, fotoY, fotoW, fotoH).stroke("#888888");
    }

    // =====================================================
    // NOMBRE
    // =====================================================

    dibujarTexto(
      doc,
      nombreCompleto,
      mm(23),   // posición X en mm
      mm(16),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,          // ajustado para que encaje en 2mm de alto
        color: "#111111",
        width: mm(30),      // ancho aproximado en mm (ajusta según el espacio disponible)
        //height: mm(2)       // alto en mm
      }
    );

    // =====================================================
    // CURP
    // =====================================================

    dibujarTexto(
      doc,
      "CURP",
      mm(23),   // posición X en mm
      mm(22),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 7.2,        // ajustado para que encaje en 1.5mm de alto
        color: "#111111",
        width: mm(30),    // ancho aproximado en mm 
        height: mm(1.5)   // alto en mm
      }
    );

    dibujarTexto(
      doc,
      datos.curp,
      mm(23),   // posición X en mm
      mm(24),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,
        //width: mm(30)
      }
    );

    // =====================================================
    // NACIONALIDAD
    // =====================================================

    dibujarTexto(
      doc,
      "NACIONALIDAD",
      mm(23),   // posición X en mm
      mm(27),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 7.2,
        width: mm(30)
      }
    );

    dibujarTexto(
      doc,
      String(datos.nacionalidad || "").toUpperCase(),
      mm(23),   // posición X en mm
      mm(29),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,
        width: mm(30)
      }
    );

    // =====================================================
    // EXPEDIDA
    // =====================================================

    dibujarTexto(
      doc,
      "EXPEDIDA",
      mm(23),   // posición X en mm
      mm(32),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 7.2,
        width: mm(30)
      }
    );

    dibujarTexto(
      doc,
      expedida,
      mm(23),   // posición X en mm
      mm(34),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,
        width: mm(30)
      }
    );

    // =====================================================
    // VENCIMIENTO
    // =====================================================

    dibujarTexto(
      doc,
      "VENCIMIENTO",
      mm(43),   // posición X en mm
      mm(32),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 7.2,
        width: mm(30)
      }
    );

    dibujarTexto(
      doc,
      vencimiento,
      mm(43),   // posición X en mm
      mm(34),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,
        width: mm(30)
      }
    );

    // =====================================================
    // VIGENCIA
    // =====================================================

    dibujarTexto(
      doc,
      "VIGENCIA",
      mm(23),   // posición X en mm
      mm(36.5),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 7.2,        // ajustado para que encaje en 1.5mm de alto
        //color: "#111111",
        width: mm(20),    // ancho aproximado en mm (ajusta según espacio disponible)
        height: mm(1.5)   // alto en mm
      }
    );

    dibujarTexto(
      doc,
      vigencia,
      mm(23),   // posición X en mm
      mm(38.5),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,
        width: mm(20)
      }
    );

    // =====================================================
    // TIPO
    // =====================================================

    dibujarTexto(
      doc,
      "TIPO",
      mm(69),   // posición X en mm
      mm(16),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,
        //width: mm(30),
        //align: "center"
      }
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(34)
      .text(
        licencia.tipo || "",
        mm(68),   // posición X en mm
        mm(20),   // posición Y en mm
        {
          //width: mm(30),
          //align: "center"
        }
      );

    // =====================================================
    // FOLIO
    // =====================================================

    dibujarTexto(
      doc,
      licencia.folio,
      mm(62),   // posición X en mm
      mm(41),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 8.2,          // ajustado para que encaje en ~2mm de alto
        color: "#111111",
        width: mm(20),    // ancho aproximado en mm (ajusta según espacio disponible)
        height: mm(2),    // alto en mm
        //align: "right"
      }
    );

    // =====================================================
    // NOMBRE DEL TIPO
    // =====================================================

    dibujarTexto(
      doc,
      String(licencia.nombreTipo || "").toUpperCase(),
      mm(62),     // posición X en mm
      mm(44.5),   // posición Y en mm
      {
        font: "Helvetica-Bold",
        size: 7.2,        // ajustado para que encaje en ~1.5–2mm de alto
        color: "#111111",
        //width: mm(25),    // ancho aproximado en mm (ajusta según espacio disponible)
        height: mm(2),    // alto en mm
        //align: "left"
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
        doc.save();              // guardar estado actual
        doc.opacity(0.18);       // aplicar transparencia

        doc.image(
          rutaFoto,
          mm(24.5),              // posición X en mm
          mm(42),                // posición Y en mm
          {
            fit: [mm(8), mm(10)], // máximo 8mm ancho × 10mm alto
            align: "center",
            valign: "center"
          }
        );

        doc.restore();           // restaurar estado
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