const mongoose = require('mongoose');

const conectarMongoDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB conectada exitosamente ✅');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

module.exports = conectarMongoDB;
