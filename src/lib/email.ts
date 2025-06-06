import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  await resend.emails.send({
    from: "Vanguox <no-reply@vanguox.com>", // must be a verified sender
    to,
    subject,
    text,
  });
}
