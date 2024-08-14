"use server";
import { Resend } from "resend";

const Sendemail = async (to, subject, html) => {
  const resend = new Resend("re_39pwxCko_H6jU6QouHSEgRYLF4czWCzuZ");

  try {
    await resend.emails.send({
      from: ["Admin@infinityfundltd.in", "infinityfundltd535@gmail.com"],
      to: to,
      subject: subject,
      html: html, // Changed 'react' to 'html'
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default Sendemail;
