import nodemailer from "nodemailer";
import { config } from "../config/config.js";
export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    service: config.SMTP_SERVICE,
    auth: {
      user: config.SMTP_EMAIL,
      pass: config.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: config.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
