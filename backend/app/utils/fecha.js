function agregarDiasFecha(fecha, prioridad) {
  let dias = 0;
  if (prioridad.toLocaleLowerCase() === 'urgente') {
    dias += 1;
  } else if (prioridad.toLocaleLowerCase() === 'importante') {
    dias += 2;
  } else {
    dias += 3;
  }
  const nuevaFecha = new Date(fecha);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
}

function calcularDiferencia(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (fin < inicio) {
    return new Date(fechaFin).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
  }

  const diffMs = fin - inicio;
  const minutosTotales = Math.floor(diffMs / (1000 * 60));
  const dias = Math.floor(minutosTotales / (60 * 24));
  const horas = Math.floor((minutosTotales % (60 * 24)) / 60);
  const minutos = minutosTotales % 60;

  return formatearDuracion({ dias, horas, minutos });
}

function calcularDesfase(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (inicio <= fin) {
    return 'Sin atraso';
  }

  const diffMs = inicio - fin;
  const minutosTotales = Math.floor(diffMs / (1000 * 60));
  const dias = Math.floor(minutosTotales / (60 * 24));
  const horas = Math.floor((minutosTotales % (60 * 24)) / 60);
  const minutos = minutosTotales % 60;

  return formatearDuracion({ dias, horas, minutos });
}

function formatearDuracion({ dias = 0, horas = 0, minutos = 0 }) {
  const partes = [];

  if (dias) {
    partes.push(`${dias} día${dias !== 1 ? 's' : ''}`);
  }
  if (horas) {
    partes.push(`${horas} hora${horas !== 1 ? 's' : ''}`);
  }
  if (minutos || partes.length === 0) {
    partes.push(`${minutos} minuto${minutos !== 1 ? 's' : ''}`);
  }

  return partes.join(', ');
}

module.exports = {
  agregarDiasFecha,
  calcularDiferencia,
  calcularDesfase,
};
