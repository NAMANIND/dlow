"use server";
import { Resend } from "resend";

const Sendemail = async (to, subject, html) => {
  const resend = new Resend("re_aJERcAMq_7VbJ8k5RKbFTR6MqXedcz3Zu");

  try {
    await resend.emails.send({
      from: "admin@infinityfundltd.in",
      to: to,
      subject: subject,
      html: html, // Changed 'react' to 'html'
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default Sendemail;
