const bcrypt = require('bcrypt');

async function generarHash(plainTextPassword) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
}

async function compararHash(contrasena, hash) {
  if (!contrasena || !hash) {
    console.error("⚠️ compararHash recibió valores vacíos:", { contrasena, hash });
    throw new Error("data and hash arguments required");
  }

  return await bcrypt.compare(String(contrasena), String(hash));
}

module.exports = {
  generarHash,
  compararHash,
};
