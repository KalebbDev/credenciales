const dominiosPermitidos = (app) => {
  if (app.get('env') === 'production') {
    //return ['https://sipubet.tlaxcala.gob.mx'];
  } else if (app.get('env') === 'stg') {
    return ['http://10.50.230.95:9023'];
  } else {
    return [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:3000' 
    ];
  }
};

module.exports = dominiosPermitidos;
