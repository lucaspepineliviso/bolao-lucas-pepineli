import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(email: string, resetUrl: string): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const resendApiKey = process.env.RESEND_API_KEY;

  const subject = "Recuperação de Senha - Bolão Lucas Pepineli 2026";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; text-align: center;">Recuperação de Senha</h2>
      <p style="color: #334155; font-size: 16px;">Olá,</p>
      <p style="color: #334155; font-size: 16px; line-height: 1.5;">Você solicitou a recuperação de senha para a sua conta no <strong>Bolão Lucas Pepineli 2026</strong>. Clique no botão abaixo para criar uma nova senha:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
      </div>
      <p style="color: #64748b; font-size: 14px; line-height: 1.5;">Este link é válido por <strong>1 hora</strong>. Se você não solicitou essa alteração, ignore este e-mail.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:<br/>
      <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a></p>
    </div>
  `;

  if (smtpHost) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Bolão Lucas Pepineli" <no-reply@bolao2026.com.br>`,
        to: email,
        subject,
        html,
      });

      console.log(`E-mail de recuperação enviado via SMTP para: ${email}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail via SMTP:", error);
    }
  }

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: email,
          subject,
          html,
        }),
      });

      if (res.ok) {
        console.log(`E-mail de recuperação enviado via Resend para: ${email}`);
        return true;
      } else {
        const errText = await res.text();
        console.error("Erro da API Resend:", errText);
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail via Resend:", error);
    }
  }

  // Fallback em desenvolvimento
  console.log("\n==================================================");
  console.log(`[DESENVOLVIMENTO] E-mail de redefinição de senha para: ${email}`);
  console.log(`Link: ${resetUrl}`);
  console.log("==================================================\n");
  return true;
}
