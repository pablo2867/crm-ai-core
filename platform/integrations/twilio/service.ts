import twilio from "twilio";

function getTwilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    throw new Error("TWILIO_NOT_CONFIGURED");
  }

  return {
    accountSid,
    authToken,
    from,
  };
}

export async function sendWhatsAppMessage({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  const config = getTwilioConfig();

  const client = twilio(
    config.accountSid,
    config.authToken,
  );

  const normalizedTo = to.startsWith("whatsapp:")
    ? to
    : `whatsapp:${to}`;

  const message = await client.messages.create({
    from: config.from,
    to: normalizedTo,
    body,
  });

  return {
    sid: message.sid,
    status: message.status,
    to: message.to,
    from: message.from,
    body: message.body,
  };
}
