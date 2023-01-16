import { config } from 'dotenv';
import { createTransport } from 'nodemailer';

config();

export function mailer(
  sendee: string,
  title: string,
  message: { html?: string; text?: string },
  senderName?: string,
) {
  console.log('Sent mail => ', {
    auth: {
      user: process.env.NOREPLY_EMAIL,
      pass: process.env.NOREPLY_PASSWORD,
    },
  });

  const transporter = createTransport({
    host: 'mail.teesas.com',
    port: 465,
    auth: {
      user: process.env.NOREPLY_EMAIL,
      pass: process.env.NOREPLY_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${senderName || 'Teesas Education'} <${process.env.NOREPLY_EMAIL}>`,
    to: sendee,
    subject: title,
    text: message.text,
    html: message.html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log('Error while sending email => ' + err);
        reject('Error while sending email' + err);
      } else {
        console.log('Email sent => ', info);
        resolve(info);
      }
    });
  });
}
