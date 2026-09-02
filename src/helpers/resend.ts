export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "sankar@godjewellery.com",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Resend API Error:", data);
    throw new Error(data?.message || "Email sending failed");
  }

  return data;
}
