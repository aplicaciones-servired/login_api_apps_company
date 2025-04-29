import { EMAIL_USER_GMAIL, EMAIL_PASS_GMAIL } from '../configs/envSchema';
import { createTransport } from 'nodemailer';

interface Dates {
  email: string;
  token: string;
}

const template = (token: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperación de Contraseña</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .container {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .command-box {
          background-color: #f7f7f7;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
          margin: 20px 0;
          font-family: 'Courier New', Courier, monospace;
          position: relative;
        }

        .copy-instructions {
          font-size: 0.9em;
          color: #555;
          margin-top: 10px;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <p>
          Se ha solicitado el restablecimiento de la contraseña, anexando una generación de token de seguridad el cual tiene una vigencia de 10 minutos.
        </p>
        <p>
          Este token es necesario para poder recuperar tu contraseña. continuando con el proceso, en el paso número 3
        </p>
        <strong>Seleccione y copie el siguiente token de seguridad:</strong>
        <div class="command-box" contenteditable="true">
          <code id="command">
            <strong>
              ${token}
            </strong>
          </code>
        </div>
      </div>
    </body>

    </html>
  `;
}

export async function SendEmailRestorePassword(info: Dates) {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER_GMAIL,
      pass: EMAIL_PASS_GMAIL
    }
  });

  const mailOptions = {
    from: EMAIL_USER_GMAIL,
    to: info.email,
    subject: 'Recuperación De Contraseña',
    html: template(info.token)
  }

  await transporter.sendMail(mailOptions);

  return 'Email Enviado';
}