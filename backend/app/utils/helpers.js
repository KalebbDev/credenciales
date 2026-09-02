function primeraLetraMayuscula(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function fechaHoraDeFecha(fecha) {
  return `${fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
}

module.exports = {
  primeraLetraMayuscula,
  fechaHoraDeFecha,
};
