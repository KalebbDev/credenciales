const { Kafka } = require('kafkajs');
const dependenciasService = require('../services/dependenciasService');

const kafka = new Kafka({
  clientId: 'gob-pub',
  brokers: [process.env.KAFKA_SERVER],
});
const consumer = kafka.consumer({ groupId: 'notificaciones' });

const suscribirseTopicActualizarDependencia = async (topic) => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ _topic, _partition, message }) => {
      //Service
      await dependenciasService.actualizarEstatusDependencia(JSON.parse(message.value.toString()));
    },
  });
};

module.exports = { suscribirseTopicActualizarDependencia };
