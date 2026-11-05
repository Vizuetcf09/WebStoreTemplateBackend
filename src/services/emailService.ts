import { Resend } from 'resend';

class EmailService {
  private resend: Resend | null = null;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey !== 'your_resend_api_key') {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('⚠️ [EmailService]: RESEND_API_KEY no está configurada en las variables de entorno. Los correos se simularán en consola.');
    }

    this.fromEmail = process.env.RESEND_FROM || 'Web Store <onboarding@resend.dev>';
  }

  async sendVerificationEmail(to: string, name: string, token: string): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:4200';
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifica tu correo electrónico</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #18181b; padding: 32px 40px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #a855f7; text-transform: uppercase; letter-spacing: 0.2em;">Web Store</p>
                    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 800;">Verificación de Cuenta</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #18181b; font-weight: 700;">¡Hola, ${name}!</h2>
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #52525b;">
                      Gracias por registrarte en <strong>Web Store</strong>. Para garantizar la seguridad de tu cuenta y activar tu acceso completo, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #18181b; color: #ffffff; font-weight: 700; font-size: 16px; text-decoration: none; padding: 14px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
                            Verificar mi correo electrónico
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #71717a; text-align: center;">
                      Este enlace expirará en <strong>24 horas</strong>.
                    </p>

                    <hr style="border: none; border-top: 1px solid #f4f4f5; margin: 32px 0 20px 0;">

                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #a1a1aa;">
                      Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
                      <a href="${verificationUrl}" target="_blank" style="color: #7c3aed; word-break: break-all;">${verificationUrl}</a>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 20px 40px; text-align: center; border-top: 1px solid #f4f4f5;">
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                      Si no creaste esta cuenta, puedes ignorar este correo de forma segura.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      if (this.resend) {
        const response = await this.resend.emails.send({
          from: this.fromEmail,
          to,
          subject: 'Verifica tu correo electrónico - Web Store',
          html: htmlContent
        });

        if (response.error) {
          console.error('❌ [Resend Error]:', response.error);
          return false;
        }

        console.log(`✅ [EmailService]: Correo de verificación enviado con éxito a ${to}`);
        return true;
      } else {
        console.log(`📧 [EmailService MOCK]: Simulación de envío a ${to}`);
        console.log(`🔗 [EmailService MOCK] Enlace de verificación: ${verificationUrl}`);
        return true;
      }
    } catch (error) {
      console.error('❌ [EmailService Error]:', error);
      return false;
    }
  }
}

export default new EmailService();

