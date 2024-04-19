import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
require ('dotenv').config();

interface EmailOprions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOprions):Promise <void> => {
  const transporter:Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    service: process.env.SMTP_SERVICE,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const { email, subject, template, data } = options;

  // get the path of the template
  const templatePath = path.join(__dirname, `../mails/${template}`);

  // render the template
  const html:string = await ejs.renderFile(templatePath, data);

  const message = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(message);
}

export default sendMail;