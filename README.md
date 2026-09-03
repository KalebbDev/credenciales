# Credenciales

Sistema web para credenciales institucionales.  
Incluye **backend (Node/Express + MongoDB)** y **frontend (React)**.

---

## 🚀 Requisitos previos
- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local o remoto)
- Opcional: [Docker](https://www.docker.com/)

---

## 📂 Estructura del proyecto
credenciales/
backend/      # API REST con Express
frontend/     # Aplicación React
.env.example  # Variables de entorno de ejemplo

---

## ⚙️ Configuración de entorno
1. Copia el archivo `.env.example` y renómbralo a `.env` en **backend** y **frontend**:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env

##Levantar proyecto backend
cd backend
npm install
npm start
El backend se levantará en http://localhost:3000.

##levantar proyecto frontend
cd frontend
npm install
npm start
El frontend se levantará en http://localhost:3001
Si prefieres levantar todo con Docker:

con docker solo haces

docker compose up --build