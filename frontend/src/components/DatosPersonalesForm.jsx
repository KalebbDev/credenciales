import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LicenciaPage from "./LicenciaPage";

function RegistroLicenciaCompleto({
  onSaved,
  ciudadano = null,
  ciudadanoId = null,
  datosIniciales = null,
  licenciaInicial = null,
  licenciaId = null,
  modo = "crear",
}) {
  // ==========================================================
  // SABER SI ESTAMOS EDITANDO
  // ==========================================================
  const esEdicion = modo === "editar";

  // ==========================================================
  // FORMATEAR FECHA PARA INPUT TYPE DATE
  // ==========================================================
  const fechaInput = (fecha) => {
    if (!fecha) return "";

    return String(fecha).split("T")[0];
  };

  // ==========================================================
  // DATOS PERSONALES
  // ==========================================================
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    curp: "",
    nacionalidad: "",
    tipoSanguineo: "",
    donador: false,
    alergias: false,
    nacimiento: "",
    telefono: "",
    fotografia: null,
    firma: null,
  });

  // ==========================================================
  // DATOS LICENCIA
  // ==========================================================
  const [licencia, setLicencia] = useState({
    antiguedad: "",
    expedida: "",
    vencimiento: "",
    tipo: "",
    matricula: "",
    nombreTipo: "",
    folio: "",
    periodo: "2",
  });

  const [guardando, setGuardando] = useState(false);

  // ==========================================================
  // ARCHIVOS ACTUALES EN EDICIÓN
  // ==========================================================
  const [fotografiaActual, setFotografiaActual] = useState("");
  const [firmaActual, setFirmaActual] = useState("");

  // ==========================================================
  // CONTROLAR VISTA PREVIA
  // ==========================================================
  const [mostrarVistaPrevia, setMostrarVistaPrevia] =
    useState(false);

  const [
    ciudadanoRegistradoId,
    setCiudadanoRegistradoId,
  ] = useState(null);

  // ==========================================================
  // CARGAR DATOS CUANDO SE EDITA
  // ==========================================================
  useEffect(() => {
  if (!esEdicion) return;

  // ======================================================
  // DATOS PERSONALES
  // ======================================================
  const datos =
    datosIniciales ||
    ciudadano?.datosPersonales;

  if (datos) {
    setDatosPersonales({
      nombre:
        datos.nombre || "",

      apellidoPaterno:
        datos.apellidoPaterno || "",

      apellidoMaterno:
        datos.apellidoMaterno || "",

      curp:
        datos.curp || "",

      nacionalidad:
        datos.nacionalidad || "",

      tipoSanguineo:
        datos.tipoSanguineo || "",

      donador:
        Boolean(datos.donador),

      alergias:
        Boolean(datos.alergias),

      nacimiento:
        fechaInput(datos.nacimiento),

      telefono:
        datos.telefono || "",

      fotografia: null,
      firma: null,
    });

    setFotografiaActual(
      datos.fotografia || ""
    );

    setFirmaActual(
      datos.firma || ""
    );
  }

  // ======================================================
  // DATOS DE LICENCIA
  // ======================================================
  if (licenciaInicial) {
    setLicencia({
      antiguedad:
        fechaInput(
          licenciaInicial.antiguedad
        ),

      expedida:
        fechaInput(
          licenciaInicial.expedida
        ),

      vencimiento:
        fechaInput(
          licenciaInicial.vencimiento
        ),

      tipo:
        licenciaInicial.tipo || "",

      matricula:
        licenciaInicial.matricula || "",

      nombreTipo:
        licenciaInicial.nombreTipo || "",

      folio:
        licenciaInicial.folio || "",

      periodo:
        String(
          licenciaInicial.periodo || "2"
        ),
    });
  }
}, [
  esEdicion,
  ciudadano,
  datosIniciales,
  licenciaInicial,
]);

  // ==========================================================
  // CAMBIOS DATOS PERSONALES
  // ==========================================================
  const handleDatosChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    if (type === "checkbox") {
      setDatosPersonales((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    if (type === "file") {
      setDatosPersonales((prev) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));

      return;
    }

    setDatosPersonales((prev) => ({
      ...prev,

      [name]:
        name === "curp"
          ? value.toUpperCase()
          : value,
    }));
  };

  // ==========================================================
  // CAMBIOS LICENCIA
  // ==========================================================
  const handleLicenciaChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...licencia,
      [name]: value,
    };

    // Calcular vencimiento automáticamente
    if (
      (name === "expedida" ||
        name === "periodo") &&
      updated.expedida
    ) {
      const fecha = new Date(
        `${updated.expedida}T00:00:00`
      );

      const años = parseInt(
        updated.periodo,
        10
      );

      if (!isNaN(años)) {
        fecha.setFullYear(
          fecha.getFullYear() + años
        );

        updated.vencimiento = fecha
          .toISOString()
          .split("T")[0];
      }
    }

    setLicencia(updated);
  };

  // ==========================================================
  // SWEETALERT DE VALIDACIÓN
  // ==========================================================
  const alertaCampo = (
    titulo,
    texto
  ) => {
    return Swal.fire({
      icon: "warning",
      title: titulo,
      text: texto,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#7c3aed",
    });
  };

  // ==========================================================
  // VALIDAR DATOS PERSONALES
  // ==========================================================
  const validarDatosPersonales =
    async () => {
      if (!datosPersonales.nombre.trim()) {
        await alertaCampo(
          "Nombre requerido",
          "Ingresa el nombre del ciudadano."
        );

        return false;
      }

      if (
        !datosPersonales.apellidoPaterno.trim()
      ) {
        await alertaCampo(
          "Apellido paterno requerido",
          "Ingresa el apellido paterno."
        );

        return false;
      }

      if (
        !datosPersonales.apellidoMaterno.trim()
      ) {
        await alertaCampo(
          "Apellido materno requerido",
          "Ingresa el apellido materno."
        );

        return false;
      }

      if (!datosPersonales.curp.trim()) {
        await alertaCampo(
          "CURP requerida",
          "Ingresa la CURP del ciudadano."
        );

        return false;
      }

      if (
        datosPersonales.curp.trim()
          .length !== 18
      ) {
        await alertaCampo(
          "CURP no válida",
          "La CURP debe contener exactamente 18 caracteres."
        );

        return false;
      }

      if (
        !datosPersonales.nacionalidad
      ) {
        await alertaCampo(
          "Nacionalidad requerida",
          "Selecciona la nacionalidad."
        );

        return false;
      }

      if (
        !datosPersonales.tipoSanguineo
      ) {
        await alertaCampo(
          "Tipo sanguíneo requerido",
          "Selecciona el tipo sanguíneo."
        );

        return false;
      }

      if (
        !datosPersonales.nacimiento
      ) {
        await alertaCampo(
          "Fecha requerida",
          "Selecciona la fecha de nacimiento."
        );

        return false;
      }

      if (
        !datosPersonales.telefono.trim()
      ) {
        await alertaCampo(
          "Teléfono requerido",
          "Ingresa el teléfono del ciudadano."
        );

        return false;
      }

      return true;
    };

  // ==========================================================
  // VALIDAR LICENCIA
  // ==========================================================
  const validarLicencia =
    async () => {
      if (!licencia.antiguedad) {
        await alertaCampo(
          "Antigüedad requerida",
          "Selecciona la fecha de antigüedad."
        );

        return false;
      }

      if (!licencia.expedida) {
        await alertaCampo(
          "Fecha de expedición requerida",
          "Selecciona la fecha de expedición."
        );

        return false;
      }

      if (!licencia.tipo) {
        await alertaCampo(
          "Tipo de licencia requerido",
          "Selecciona el tipo de licencia."
        );

        return false;
      }

      if (!licencia.matricula.trim()) {
        await alertaCampo(
          "Matrícula requerida",
          "Ingresa la matrícula."
        );

        return false;
      }

      if (!licencia.nombreTipo) {
        await alertaCampo(
          "Nombre de licencia requerido",
          "Selecciona el nombre de la licencia."
        );

        return false;
      }

      if (!licencia.folio.trim()) {
        await alertaCampo(
          "Folio requerido",
          "Ingresa el folio."
        );

        return false;
      }

      return true;
    };

  // ==========================================================
  // PREPARAR FORMDATA DEL CIUDADANO
  // ==========================================================
  const crearFormDataCiudadano = () => {
    const datosEnviar =
      new FormData();

    datosEnviar.append(
      "nombre",
      datosPersonales.nombre
    );

    datosEnviar.append(
      "apellidoPaterno",
      datosPersonales.apellidoPaterno
    );

    datosEnviar.append(
      "apellidoMaterno",
      datosPersonales.apellidoMaterno
    );

    datosEnviar.append(
      "curp",
      datosPersonales.curp
    );

    datosEnviar.append(
      "nacionalidad",
      datosPersonales.nacionalidad
    );

    datosEnviar.append(
      "tipoSanguineo",
      datosPersonales.tipoSanguineo
    );

    datosEnviar.append(
      "donador",
      datosPersonales.donador
    );

    datosEnviar.append(
      "alergias",
      datosPersonales.alergias
    );

    datosEnviar.append(
      "nacimiento",
      datosPersonales.nacimiento
    );

    datosEnviar.append(
      "telefono",
      datosPersonales.telefono
    );

    if (
      datosPersonales.fotografia instanceof
      File
    ) {
      datosEnviar.append(
        "fotografia",
        datosPersonales.fotografia
      );
    }

    if (
      datosPersonales.firma instanceof
      File
    ) {
      datosEnviar.append(
        "firma",
        datosPersonales.firma
      );
    }

    return datosEnviar;
  };

  // ==========================================================
  // ACTUALIZAR CIUDADANO
  // ==========================================================
  const actualizarCiudadano =
    async () => {
      const id =
        ciudadanoId ||
        ciudadano?._id;

      if (!id) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "No se encontró el identificador del ciudadano.",
          confirmButtonText: "Aceptar",
          confirmButtonColor: "#dc2626",
        });

        return;
      }

      const confirmar =
        await Swal.fire({
          icon: "question",

          title:
            "Actualizar información",

          text:
            "¿Deseas guardar los cambios realizados?",

          showCancelButton: true,

          confirmButtonText:
            "Sí, actualizar",

          cancelButtonText:
            "Cancelar",

          confirmButtonColor:
            "#2563eb",

          cancelButtonColor:
            "#64748b",
        });

      if (!confirmar.isConfirmed) {
        return;
      }

      const token =
        localStorage.getItem("token");

      setGuardando(true);

      Swal.fire({
        title:
          "Actualizando información...",

        text:
          "Estamos guardando los cambios del ciudadano.",

        allowOutsideClick: false,
        allowEscapeKey: false,

        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const datosEnviar =
          crearFormDataCiudadano();

        const res = await fetch(
          `http://localhost:3020/api/v1/ciudadanos/${id}`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: datosEnviar,
          }
        );

        let data = {};

        try {
          data = await res.json();
        } catch (error) {
          data = {};
        }

        if (!res.ok) {
          throw new Error(
            data?.message ||
              "No se pudo actualizar la información."
          );
        }

        await Swal.fire({
          icon: "success",

          title:
            "¡Información actualizada!",

          text:
            "Los datos del ciudadano fueron actualizados correctamente.",

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "#16a34a",
        });

        if (
          typeof onSaved ===
          "function"
        ) {
          await onSaved(data);
        }
      } catch (error) {
        console.error(
          "Error al actualizar:",
          error
        );

        await Swal.fire({
          icon: "error",
          iconColor: "#dc2626",

          title:
            "No se pudo actualizar",

          text:
            error.message ||
            "Ocurrió un error al guardar los cambios.",

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "#dc2626",
        });
      } finally {
        setGuardando(false);
      }
    };

  // ==========================================================
  // GUARDAR TODO
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosValidos =
      await validarDatosPersonales();

    if (!datosValidos) return;

    // ======================================================
    // MODO EDICIÓN
    // ======================================================
    if (esEdicion) {
      await actualizarCiudadano();
      return;
    }

    // ======================================================
    // MODO REGISTRO
    // ======================================================
    const licenciaValida =
      await validarLicencia();

    if (!licenciaValida) return;

    const confirmar =
      await Swal.fire({
        icon: "question",

        title:
          "Registrar licencia",

        text:
          "¿Deseas guardar los datos del ciudadano y registrar su licencia?",

        showCancelButton: true,

        confirmButtonText:
          "Sí, registrar",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#16a34a",

        cancelButtonColor:
          "#64748b",
      });

    if (!confirmar.isConfirmed) {
      return;
    }

    const token =
      localStorage.getItem("token");

    setGuardando(true);

    Swal.fire({
      title:
        "Registrando información...",

      text:
        "Estamos guardando los datos del ciudadano y su licencia.",

      allowOutsideClick: false,
      allowEscapeKey: false,

      didOpen: () =>
        Swal.showLoading(),
    });

    try {
      // ======================================================
      // 1. REGISTRAR CIUDADANO
      // ======================================================
      const datosEnviar =
        crearFormDataCiudadano();

      const resCiudadano =
        await fetch(
          "http://localhost:3020/api/v1/ciudadanos",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: datosEnviar,
          }
        );

      const dataCiudadano =
        await resCiudadano.json();

      if (!resCiudadano.ok) {
        throw new Error(
          dataCiudadano?.message ||
            "No se pudo registrar al ciudadano."
        );
      }

      const nuevoCiudadanoId =
        dataCiudadano?.ciudadano?._id ||
        dataCiudadano?._id;

      if (!nuevoCiudadanoId) {
        throw new Error(
          "El ciudadano fue registrado, pero no se obtuvo su identificador."
        );
      }

      // ======================================================
      // 2. REGISTRAR LICENCIA
      // ======================================================
      const resLicencia =
        await fetch(
          `http://localhost:3020/api/v1/licencias/${nuevoCiudadanoId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              licencia
            ),
          }
        );

      const dataLicencia =
        await resLicencia.json();

      if (!resLicencia.ok) {
        throw new Error(
          dataLicencia?.message ||
            "El ciudadano fue registrado, pero ocurrió un error al guardar la licencia."
        );
      }

      await Swal.fire({
        icon: "success",

        title:
          "¡Registro completado!",

        text:
          "El ciudadano y la licencia fueron registrados correctamente.",

        confirmButtonText:
          "Ver licencia",

        confirmButtonColor:
          "#16a34a",
      });

      // ======================================================
      // MOSTRAR VISTA PREVIA
      // ======================================================
      setCiudadanoRegistradoId(
        nuevoCiudadanoId
      );

      setMostrarVistaPrevia(true);
    } catch (error) {
      console.error(
        "Error:",
        error
      );

      await Swal.fire({
        icon: "error",
        iconColor: "#dc2626",

        title:
          "No se pudo completar el registro",

        text:
          error.message ||
          "Ocurrió un error durante el registro.",

        confirmButtonText:
          "Aceptar",

        confirmButtonColor:
          "#dc2626",
      });
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================================
  // MOSTRAR VISTA PREVIA
  // ==========================================================
  if (
    mostrarVistaPrevia &&
    ciudadanoRegistradoId &&
    !esEdicion
  ) {
    return (
      <LicenciaPage
        ciudadanoId={
          ciudadanoRegistradoId
        }
        setShowLicencia={(mostrar) => {
          if (!mostrar) {
            setMostrarVistaPrevia(false);

            setCiudadanoRegistradoId(
              null
            );

            setDatosPersonales({
              nombre: "",
              apellidoPaterno: "",
              apellidoMaterno: "",
              curp: "",
              nacionalidad: "",
              tipoSanguineo: "",
              donador: false,
              alergias: false,
              nacimiento: "",
              telefono: "",
              fotografia: null,
              firma: null,
            });

            setLicencia({
              antiguedad: "",
              expedida: "",
              vencimiento: "",
              tipo: "",
              matricula: "",
              nombreTipo: "",
              folio: "",
              periodo: "2",
            });

            setFotografiaActual("");
            setFirmaActual("");
          }
        }}
      />
    );
  }

  return (
    <div style={styles.page}>
      {/* ======================================================
          ENCABEZADO PRINCIPAL
      ======================================================= */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>
            <i
              className={
                esEdicion
                  ? "bi bi-person-gear"
                  : "bi bi-person-vcard-fill"
              }
            ></i>
          </div>

          <div>
            <h1 style={styles.title}>
              {esEdicion
                ? "Editar Ciudadano"
                : "Registro de Licencia"}
            </h1>

            <p style={styles.subtitle}>
              {esEdicion
                ? "Actualiza la información personal del ciudadano"
                : "Captura de datos del ciudadano e información de la licencia"}
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          TARJETA PRINCIPAL
      ======================================================= */}
      <div style={styles.mainCard}>
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {/* ==================================================
              SECCIÓN 1 - DATOS PERSONALES
          =================================================== */}
          <SectionHeader
            icon="bi bi-person-lines-fill"
            title="Datos personales"
            description="Información básica de identificación del ciudadano"
            iconStyle={
              styles.sectionIconBlue
            }
          />

          <div style={styles.grid}>
            <Field
              label="Nombre"
              required
              icon="bi bi-person-fill"
              iconColor="#0f766e"
            >
              <input
                style={styles.input}
                name="nombre"
                value={
                  datosPersonales.nombre
                }
                onChange={
                  handleDatosChange
                }
                placeholder="Nombre(s)"
              />
            </Field>

            <Field
              label="Apellido paterno"
              required
              icon="bi bi-person-badge-fill"
              iconColor="#2563eb"
            >
              <input
                style={styles.input}
                name="apellidoPaterno"
                value={
                  datosPersonales.apellidoPaterno
                }
                onChange={
                  handleDatosChange
                }
                placeholder="Apellido paterno"
              />
            </Field>

            <Field
              label="Apellido materno"
              required
              icon="bi bi-person-badge"
              iconColor="#7c3aed"
            >
              <input
                style={styles.input}
                name="apellidoMaterno"
                value={
                  datosPersonales.apellidoMaterno
                }
                onChange={
                  handleDatosChange
                }
                placeholder="Apellido materno"
              />
            </Field>

            <Field
              label="CURP"
              required
              icon="bi bi-card-heading"
              iconColor="#d97706"
            >
              <input
                style={styles.input}
                name="curp"
                value={
                  datosPersonales.curp
                }
                onChange={
                  handleDatosChange
                }
                maxLength={18}
                placeholder="CURP"
              />

              <span style={styles.counter}>
                {
                  datosPersonales.curp
                    .length
                }
                /18
              </span>
            </Field>

            <Field
              label="Nacionalidad"
              required
              icon="bi bi-globe-americas"
              iconColor="#0891b2"
            >
              <select
                style={styles.select}
                name="nacionalidad"
                value={
                  datosPersonales.nacionalidad
                }
                onChange={
                  handleDatosChange
                }
              >
                <option value="">
                  Selecciona una opción
                </option>

                <option value="Mexicana">
                  Mexicana
                </option>

                <option value="Extranjera">
                  Extranjera
                </option>
              </select>
            </Field>

            <Field
              label="Tipo sanguíneo"
              required
              icon="bi bi-droplet-fill"
              iconColor="#dc2626"
            >
              <select
                style={styles.select}
                name="tipoSanguineo"
                value={
                  datosPersonales.tipoSanguineo
                }
                onChange={
                  handleDatosChange
                }
              >
                <option value="">
                  Selecciona tipo sanguíneo
                </option>

                {[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "O+",
                  "O-",
                  "AB+",
                  "AB-",
                ].map((tipo) => (
                  <option
                    value={tipo}
                    key={tipo}
                  >
                    {tipo}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Fecha de nacimiento"
              required
              icon="bi bi-calendar-event-fill"
              iconColor="#7c3aed"
            >
              <input
                style={styles.input}
                type="date"
                name="nacimiento"
                value={
                  datosPersonales.nacimiento
                }
                onChange={
                  handleDatosChange
                }
              />
            </Field>

            <Field
              label="Teléfono"
              required
              icon="bi bi-telephone-fill"
              iconColor="#16a34a"
            >
              <input
                style={styles.input}
                name="telefono"
                value={
                  datosPersonales.telefono
                }
                onChange={
                  handleDatosChange
                }
                placeholder="Número telefónico"
              />
            </Field>
          </div>

          {/* ==================================================
              SECCIÓN 2 - INFORMACIÓN ADICIONAL
          =================================================== */}
          <SectionHeader
            icon="bi bi-heart-pulse-fill"
            title="Información adicional"
            description="Información médica relevante del ciudadano"
            iconStyle={
              styles.sectionIconRed
            }
          />

          <div style={styles.optionGrid}>
            <OptionCard
              title="Donador"
              text="El ciudadano es donador de sangre"
              name="donador"
              checked={
                datosPersonales.donador
              }
              onChange={
                handleDatosChange
              }
              icon="bi bi-droplet-fill"
              iconStyle={
                styles.greenOptionIcon
              }
            />

            <OptionCard
              title="Alergias"
              text="El ciudadano presenta algún tipo de alergia"
              name="alergias"
              checked={
                datosPersonales.alergias
              }
              onChange={
                handleDatosChange
              }
              icon="bi bi-exclamation-triangle-fill"
              iconStyle={
                styles.orangeOptionIcon
              }
            />
          </div>

          {/* ==================================================
              SECCIÓN 3 - ARCHIVOS
          =================================================== */}
          <SectionHeader
            icon="bi bi-paperclip"
            title="Fotografía y firma"
            description={
              esEdicion
                ? "Puedes conservar los archivos actuales o seleccionar nuevos"
                : "Archivos asociados al ciudadano"
            }
            iconStyle={
              styles.sectionIconPurple
            }
          />

          <div style={styles.fileGrid}>
            <FileCard
              title="Fotografía"
              text={
                esEdicion
                  ? "Selecciona otra fotografía solo si deseas sustituir la actual"
                  : "Selecciona la fotografía del ciudadano"
              }
              icon="bi bi-camera-fill"
              iconStyle={
                styles.blueFileIcon
              }
            >
              {/* FOTO ACTUAL */}
              {esEdicion &&
                fotografiaActual &&
                !(datosPersonales.fotografia instanceof File) && (
                  <div
                    style={
                      styles.currentFile
                    }
                  >
                    <i className="bi bi-image-fill"></i>

                    <span>
                      Fotografía actual conservada
                    </span>
                  </div>
                )}

              <input
                type="file"
                name="fotografia"
                accept="image/*"
                onChange={
                  handleDatosChange
                }
                style={
                  styles.fileInput
                }
              />

              {datosPersonales.fotografia instanceof
                File && (
                <span
                  style={
                    styles.selectedFile
                  }
                >
                  <i className="bi bi-check-circle-fill"></i>{" "}
                  {
                    datosPersonales
                      .fotografia.name
                  }
                </span>
              )}
            </FileCard>

            <FileCard
              title="Firma"
              text={
                esEdicion
                  ? "Selecciona otra firma solo si deseas sustituir la actual"
                  : "Selecciona una imagen de la firma"
              }
              icon="bi bi-pen-fill"
              iconStyle={
                styles.purpleFileIcon
              }
            >
              {/* FIRMA ACTUAL */}
              {esEdicion &&
                firmaActual &&
                !(datosPersonales.firma instanceof File) && (
                  <div
                    style={
                      styles.currentFile
                    }
                  >
                    <i className="bi bi-pen-fill"></i>

                    <span>
                      Firma actual conservada
                    </span>
                  </div>
                )}

              <input
                type="file"
                name="firma"
                accept="image/*"
                onChange={
                  handleDatosChange
                }
                style={
                  styles.fileInput
                }
              />

              {datosPersonales.firma instanceof
                File && (
                <span
                  style={
                    styles.selectedFile
                  }
                >
                  <i className="bi bi-check-circle-fill"></i>{" "}
                  {
                    datosPersonales
                      .firma.name
                  }
                </span>
              )}
            </FileCard>
          </div>

          {/* ==================================================
              SOLO MOSTRAR LICENCIA CUANDO NO ESTAMOS EDITANDO
          =================================================== */}
          {!esEdicion && (
            <>
              {/* ==================================================
                  SECCIÓN 4 - VIGENCIA
              =================================================== */}
              <SectionHeader
                icon="bi bi-calendar-check-fill"
                title="Vigencia de la licencia"
                description="Fechas y periodo de validez de la licencia"
                iconStyle={
                  styles.sectionIconOrange
                }
              />

              <div style={styles.grid}>
                <Field
                  label="Antigüedad"
                  required
                  icon="bi bi-calendar-event"
                  iconColor="#0f766e"
                >
                  <input
                    type="date"
                    style={styles.input}
                    name="antiguedad"
                    value={
                      licencia.antiguedad
                    }
                    onChange={
                      handleLicenciaChange
                    }
                  />
                </Field>

                <Field
                  label="Fecha de expedición"
                  required
                  icon="bi bi-calendar-plus"
                  iconColor="#2563eb"
                >
                  <input
                    type="date"
                    style={styles.input}
                    name="expedida"
                    value={
                      licencia.expedida
                    }
                    onChange={
                      handleLicenciaChange
                    }
                  />
                </Field>

                <Field
                  label="Periodo de vigencia"
                  required
                  icon="bi bi-hourglass-split"
                  iconColor="#d97706"
                >
                  <select
                    style={styles.select}
                    name="periodo"
                    value={
                      licencia.periodo
                    }
                    onChange={
                      handleLicenciaChange
                    }
                  >
                    <option value="2">
                      2 años
                    </option>

                    <option value="5">
                      5 años
                    </option>
                  </select>
                </Field>

                <Field
                  label="Fecha de vencimiento"
                  icon="bi bi-calendar-x-fill"
                  iconColor="#dc2626"
                >
                  <input
                    type="date"
                    style={{
                      ...styles.input,
                      ...styles.readOnly,
                    }}
                    name="vencimiento"
                    value={
                      licencia.vencimiento
                    }
                    readOnly
                  />

                  <span
                    style={
                      styles.helper
                    }
                  >
                    Se calcula automáticamente
                  </span>
                </Field>
              </div>

              {/* ==================================================
                  SECCIÓN 5 - DATOS LICENCIA
              =================================================== */}
              <SectionHeader
                icon="bi bi-card-checklist"
                title="Datos de la licencia"
                description="Información identificativa del documento"
                iconStyle={
                  styles.sectionIconGreen
                }
              />

              <div style={styles.grid}>
                <Field
                  label="Tipo de licencia"
                  required
                  icon="bi bi-tag-fill"
                  iconColor="#7c3aed"
                >
                  <select
                    style={styles.select}
                    name="tipo"
                    value={
                      licencia.tipo
                    }
                    onChange={
                      handleLicenciaChange
                    }
                  >
                    <option value="">
                      Selecciona el tipo
                    </option>

                    <option value="B">
                      B
                    </option>

                    <option value="C">
                      C
                    </option>

                    <option value="D">
                      D
                    </option>
                  </select>
                </Field>

                <Field
                  label="Nombre del tipo"
                  required
                  icon="bi bi-card-text"
                  iconColor="#0891b2"
                >
                  <select
                    style={styles.select}
                    name="nombreTipo"
                    value={
                      licencia.nombreTipo
                    }
                    onChange={
                      handleLicenciaChange
                    }
                  >
                    <option value="">
                      Selecciona una opción
                    </option>

                    <option value="CHOFER">
                      CHOFER
                    </option>

                    <option value="AUTOMOVILISTA">
                      AUTOMOVILISTA
                    </option>

                    <option value="MOTOCICLISTA">
                      MOTOCICLISTA
                    </option>
                  </select>
                </Field>

                <Field
                  label="Matrícula"
                  required
                  icon="bi bi-upc-scan"
                  iconColor="#16a34a"
                >
                  <input
                    style={styles.input}
                    name="matricula"
                    value={
                      licencia.matricula
                    }
                    onChange={
                      handleLicenciaChange
                    }
                    placeholder="Ingresa la matrícula"
                  />
                </Field>

                <Field
                  label="Folio"
                  required
                  icon="bi bi-file-earmark-text-fill"
                  iconColor="#d97706"
                >
                  <input
                    style={styles.input}
                    name="folio"
                    value={
                      licencia.folio
                    }
                    onChange={
                      handleLicenciaChange
                    }
                    placeholder="Ingresa el folio"
                  />
                </Field>
              </div>
            </>
          )}

          {/* ==================================================
              FOOTER
          =================================================== */}
          <div style={styles.footer}>
            <div
              style={
                styles.requiredInfo
              }
            >
              <i
                className="bi bi-info-circle-fill"
                style={{
                  color: "#2563eb",
                }}
              ></i>

              Los campos marcados con{" "}
              <strong>*</strong> son
              obligatorios
            </div>

            <button
              type="submit"
              disabled={guardando}
              style={{
                ...styles.saveButton,

                ...(esEdicion
                  ? styles.updateButton
                  : {}),

                ...(guardando
                  ? styles.disabledButton
                  : {}),
              }}
            >
              {guardando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>

                  {esEdicion
                    ? "Actualizando..."
                    : "Registrando..."}
                </>
              ) : (
                <>
                  <i
                    className={
                      esEdicion
                        ? "bi bi-check-circle-fill"
                        : "bi bi-floppy-fill"
                    }
                  ></i>

                  {esEdicion
                    ? "Guardar cambios"
                    : "Registrar licencia"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTES VISUALES
// ============================================================

function SectionHeader({
  icon,
  title,
  description,
  iconStyle,
}) {
  return (
    <div style={styles.sectionHeader}>
      <div
        style={{
          ...styles.sectionIcon,
          ...iconStyle,
        }}
      >
        <i className={icon}></i>
      </div>

      <div>
        <h3
          style={styles.sectionTitle}
        >
          {title}
        </h3>

        <p
          style={
            styles.sectionDescription
          }
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  icon,
  iconColor,
  children,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}

        {required && (
          <span style={styles.required}>
            *
          </span>
        )}
      </label>

      <div style={styles.inputWrapper}>
        <i
          className={icon}
          style={{
            ...styles.inputIcon,
            color: iconColor,
          }}
        ></i>

        {children}
      </div>
    </div>
  );
}

function OptionCard({
  title,
  text,
  name,
  checked,
  onChange,
  icon,
  iconStyle,
}) {
  return (
    <label
      style={{
        ...styles.optionCard,

        ...(checked
          ? styles.optionActive
          : {}),
      }}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={
          styles.hiddenCheckbox
        }
      />

      <div
        style={{
          ...styles.optionIcon,
          ...iconStyle,
        }}
      >
        <i className={icon}></i>
      </div>

      <div style={{ flex: 1 }}>
        <strong
          style={
            styles.optionTitle
          }
        >
          {title}
        </strong>

        <span
          style={
            styles.optionText
          }
        >
          {text}
        </span>
      </div>

      <div
        style={{
          ...styles.checkBox,

          ...(checked
            ? styles.checkBoxActive
            : {}),
        }}
      >
        {checked && (
          <i className="bi bi-check-lg"></i>
        )}
      </div>
    </label>
  );
}

function FileCard({
  title,
  text,
  icon,
  iconStyle,
  children,
}) {
  return (
    <div style={styles.fileCard}>
      <div
        style={{
          ...styles.fileIcon,
          ...iconStyle,
        }}
      >
        <i className={icon}></i>
      </div>

      <div
        style={
          styles.fileContent
        }
      >
        <strong
          style={
            styles.fileTitle
          }
        >
          {title}
        </strong>

        <span
          style={
            styles.fileDescription
          }
        >
          {text}
        </span>

        {children}
      </div>
    </div>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f7ff",
    padding: "30px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  // ==========================================================
  // HEADER
  // ==========================================================
  header: {
    background:
      "linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a78bfa 100%)",

    borderRadius: "20px",

    padding: "28px 32px",

    color: "#ffffff",

    marginBottom: "24px",

    boxShadow:
      "0 12px 30px rgba(76,29,149,0.18)",
  },

  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  headerIcon: {
    width: "58px",
    height: "58px",
    minWidth: "58px",

    borderRadius: "16px",

    background:
      "rgba(255,255,255,0.18)",

    border:
      "1px solid rgba(255,255,255,0.20)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "27px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    opacity: 0.85,
  },

  // ==========================================================
  // CONTENEDOR
  // ==========================================================
  mainCard: {
    background: "#ffffff",

    borderRadius: "20px",

    border:
      "1px solid #eeeaff",

    boxShadow:
      "0 8px 30px rgba(30,27,75,0.07)",

    padding: "28px",
  },

  // ==========================================================
  // SECCIONES
  // ==========================================================
  sectionHeader: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    marginTop: "30px",

    marginBottom: "18px",

    paddingBottom: "12px",

    borderBottom:
      "1px solid #f1f5f9",
  },

  sectionIcon: {
    width: "42px",
    height: "42px",
    minWidth: "42px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "18px",
  },

  sectionIconBlue: {
    background: "#dbeafe",
    color: "#2563eb",
  },

  sectionIconRed: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  sectionIconPurple: {
    background: "#ede9fe",
    color: "#7c3aed",
  },

  sectionIconOrange: {
    background: "#ffedd5",
    color: "#ea580c",
  },

  sectionIconGreen: {
    background: "#dcfce7",
    color: "#16a34a",
  },

  sectionTitle: {
    margin: 0,
    color: "#312e81",
    fontSize: "16px",
    fontWeight: "700",
  },

  sectionDescription: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  // ==========================================================
  // GRID
  // ==========================================================
  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",

    gap: "18px 20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    color: "#334155",
    fontSize: "13px",
    fontWeight: "600",
  },

  required: {
    color: "#dc2626",
    marginLeft: "4px",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  inputIcon: {
    position: "absolute",

    left: "14px",

    top: "23px",

    transform:
      "translateY(-50%)",

    zIndex: 2,

    fontSize: "15px",

    pointerEvents: "none",
  },

  input: {
    width: "100%",

    height: "46px",

    boxSizing: "border-box",

    padding:
      "0 14px 0 42px",

    border:
      "1px solid #dbe2ea",

    borderRadius: "11px",

    outline: "none",

    fontSize: "13px",

    color: "#334155",

    background: "#ffffff",

    boxShadow:
      "0 2px 7px rgba(15,23,42,0.03)",
  },

  select: {
    width: "100%",

    height: "46px",

    boxSizing: "border-box",

    padding:
      "0 35px 0 42px",

    border:
      "1px solid #dbe2ea",

    borderRadius: "11px",

    outline: "none",

    fontSize: "13px",

    color: "#334155",

    background: "#ffffff",
  },

  readOnly: {
    background: "#f8fafc",
    color: "#64748b",
    cursor: "not-allowed",
  },

  helper: {
    display: "block",
    marginTop: "5px",
    marginLeft: "2px",
    color: "#94a3b8",
    fontSize: "10px",
  },

  counter: {
    position: "absolute",

    right: "10px",

    bottom: "-17px",

    color: "#94a3b8",

    fontSize: "10px",
  },

  // ==========================================================
  // OPCIONES
  // ==========================================================
  optionGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px,1fr))",

    gap: "15px",
  },

  optionCard: {
    position: "relative",

    display: "flex",

    alignItems: "center",

    gap: "13px",

    padding: "16px",

    border:
      "1px solid #e2e8f0",

    borderRadius: "13px",

    cursor: "pointer",

    background: "#ffffff",
  },

  optionActive: {
    borderColor: "#c4b5fd",
    background: "#faf9ff",
  },

  hiddenCheckbox: {
    position: "absolute",
    opacity: 0,
  },

  optionIcon: {
    width: "40px",
    height: "40px",
    minWidth: "40px",

    borderRadius: "11px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  greenOptionIcon: {
    background: "#dcfce7",
    color: "#16a34a",
  },

  orangeOptionIcon: {
    background: "#ffedd5",
    color: "#ea580c",
  },

  optionTitle: {
    display: "block",

    color: "#334155",

    fontSize: "13px",
  },

  optionText: {
    display: "block",

    marginTop: "2px",

    color: "#94a3b8",

    fontSize: "11px",
  },

  checkBox: {
    width: "23px",
    height: "23px",
    minWidth: "23px",

    borderRadius: "7px",

    border:
      "2px solid #cbd5e1",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#ffffff",
  },

  checkBoxActive: {
    background: "#7c3aed",
    borderColor: "#7c3aed",
  },

  // ==========================================================
  // ARCHIVOS
  // ==========================================================
  fileGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px,1fr))",

    gap: "15px",
  },

  fileCard: {
    display: "flex",

    alignItems: "flex-start",

    gap: "15px",

    padding: "18px",

    border:
      "1px dashed #cbd5e1",

    borderRadius: "14px",

    background: "#fafafa",
  },

  fileIcon: {
    width: "46px",
    height: "46px",
    minWidth: "46px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "20px",
  },

  blueFileIcon: {
    background: "#dbeafe",
    color: "#2563eb",
  },

  purpleFileIcon: {
    background: "#ede9fe",
    color: "#7c3aed",
  },

  fileContent: {
    display: "flex",

    flexDirection: "column",

    flex: 1,

    minWidth: 0,
  },

  fileTitle: {
    color: "#312e81",

    fontSize: "13px",
  },

  fileDescription: {
    marginTop: "2px",

    color: "#94a3b8",

    fontSize: "11px",
  },

  fileInput: {
    marginTop: "9px",

    fontSize: "11px",

    maxWidth: "100%",
  },

  selectedFile: {
    marginTop: "7px",

    color: "#16a34a",

    fontSize: "11px",

    fontWeight: "600",
  },

  currentFile: {
    display: "inline-flex",

    alignItems: "center",

    gap: "6px",

    marginTop: "8px",

    padding: "6px 9px",

    borderRadius: "8px",

    background: "#ecfdf5",

    color: "#15803d",

    fontSize: "11px",

    fontWeight: "600",

    width: "fit-content",
  },

  // ==========================================================
  // FOOTER
  // ==========================================================
  footer: {
    marginTop: "35px",

    paddingTop: "20px",

    borderTop:
      "1px solid #f1f5f9",

    display: "flex",

    alignItems: "center",

    justifyContent:
      "space-between",

    flexWrap: "wrap",

    gap: "15px",
  },

  requiredInfo: {
    display: "flex",

    alignItems: "center",

    gap: "7px",

    color: "#94a3b8",

    fontSize: "11px",
  },

  saveButton: {
    minWidth: "220px",

    height: "47px",

    border: "none",

    borderRadius: "11px",

    background: "#16a34a",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: "600",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "9px",

    boxShadow:
      "0 5px 15px rgba(22,163,74,0.20)",
  },

  updateButton: {
    background: "#2563eb",

    boxShadow:
      "0 5px 15px rgba(37,99,235,0.20)",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
};

export default RegistroLicenciaCompleto;