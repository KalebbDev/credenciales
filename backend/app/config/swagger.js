const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API OFICIALÍA DE PARTES',
      version: '1.0.0',
      description: 'Documentación de la API perteneciente a el Sistema de Oficialia de Partes',
    },
    servers: [
      {
        url: 'http://localhost:3020/api/v1',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Rutas donde están los comentarios tipo Swagger
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
