const nodemailer = require('nodemailer');

async function enviarCorreoNotificacion(correo, mensaje) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.correotlaxcala.gob.mx',
      port: 465,
      secure: true, // Usar SSL
      auth: {
        user: 'no.reply@correotlaxcala.gob.mx',
        pass: process.env.CORREO_PASSWORD || '', // Contraseña del correo
      },
      tls: {
        rejectUnauthorized: false, // Opciones SSL/TLS equivalentes a PHP
      },
    });
    const info = await transporter.sendMail({
      from: '"Notificaciones OMG" <no.reply@correotlaxcala.gob.mx>', // Remitente
      to: correo, // Destinatario
      subject: 'Notificación de Atención Ciudadana', // Asunto
      html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>🔔 Nueva Notificación</title>
                <style>
                    :root {
                        color-scheme: light dark;
                        --bg-color-light: #ffffff;
                        --bg-color-dark: #1e1e2f;
                        --text-color-light: #333333;
                        --text-color-dark: #e0e0e0;
                        --header-color-light: #6a0dad;
                        --header-color-dark: #9d4edd;
                        --button-bg-light: #8338ec;
                        --button-bg-dark: #c77dff;
                    }
        
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Segoe UI', sans-serif;
                        background-color: var(--bg-color-light);
                        color: var(--text-color-light);
                    }
        
                    .container {
                        max-width: 600px;
                        margin: auto;
                        background-color: var(--bg-color-light);
                        border-radius: 10px;
                        box-shadow: 0 0 12px rgba(120, 85, 160, 0.15);
                        overflow: hidden;
                        transition: background-color 0.3s, color 0.3s;
                    }
        
                    .header {
                        background-color: var(--header-color-light);
                        color: #ffffff;
                        padding: 24px;
                        text-align: center;
                    }
                    
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    
                    .body {
                        padding: 24px;
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    
                    .body p {
                        margin: 16px 0;
                    }
                    
                    .cta {
                        display: inline-block;
                        margin: 24px auto 0;
                        background-color: var(--button-bg-light);
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                        text-align: center;
                    }
                    
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                        padding: 16px;
                    }
                    
                    /* Modo Oscuro */
                    @media (prefers-color-scheme: dark) {
                        body {
                            background-color: var(--bg-color-dark);
                            color: var(--text-color-dark);
                        }
                        
                        .container {
                            background-color: var(--bg-color-dark);
                            color: var(--text-color-dark);
                        }
                        
                        .header {
                            background-color: var(--header-color-dark);
                        }
                        
                        .cta {
                            background-color: var(--button-bg-dark);
                        }
                        
                        .footer {
                            color: #aaa;
                        }
                    }
                    
                    @media (max-width: 600px) {
                        .body, .header {
                            padding: 16px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔔 ¡Tienes una nueva notificación!</h1>
                    </div>
                    <div class="body">
                        <p>👋 Hola,</p>
                        <p>📬 ${mensaje}</p>
                        <p>🧐 Te recomendamos revisar la plataforma lo antes posible para estar al tanto de las novedades.</p>
                        <div style="text-align:center;">
                            <a href="https://sipubet.tlaxcala.gob.mx" class="cta">🚀 Ir al sistema</a>
                        </div>
                    </div>
                    <div class="footer">
                        © 2025 Departamento de Desarrollo Tecnológico · Gobierno del Estado de Tlaxcala 🌐
                    </div>
                </div>
            </body>
            </html>`, // HTML del mensaje
    });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

module.exports = enviarCorreoNotificacion;
