// backend/seed.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Usuario = require("./models/usuario");

async function runSeed() {
  await mongoose.connect("mongodb://localhost:27017/miapp");

  const existe = await Usuario.findOne({ rol: "SUPER_ADMINISTRADOR" });
  if (!existe) {
    const hashed = await bcrypt.hash("123456", 10);
    await Usuario.create({
      nombre: "Super Admin",
      correo: "admin@correo.com",
      contrasena: hashed,
      rol: "SUPER_ADMINISTRADOR",
      clave_estatus: 1
    });
    console.log("✅ Super Admin creado");
  } else {
    console.log("Ya existe un Super Admin");
  }

  mongoose.disconnect();
}

runSeed();
