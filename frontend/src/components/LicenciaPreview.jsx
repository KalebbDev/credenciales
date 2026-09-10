import { useEffect, useState } from "react";

export default function LicenciaPreview({ licencia }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // o de tu contexto de auth
    if (!licencia || !token) return;

    fetch(`http://localhost:3020/api/v1/licencias/${licencia._id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener PDF");
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      })
      .catch(err => console.error("Error cargando PDF:", err));
  }, [licencia]);

  return pdfUrl ? (
    <iframe src={pdfUrl} style={{ width: "100%", height: "400px" }} title="Licencia PDF" />
  ) : (
    <p>Cargando licencia...</p>
  );
}
