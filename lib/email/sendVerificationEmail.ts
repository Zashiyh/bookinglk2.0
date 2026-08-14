import nodemailer from "nodemailer";

interface SendVerificationEmailParams {
  email: string;
  firstName: string;
  code: string;
}

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

export async function sendVerificationEmail({
  email,
  firstName,
  code,
}: SendVerificationEmailParams) {
  if (!gmailUser) {
    throw new Error("GMAIL_USER is missing in .env.local");
  }

  if (!gmailAppPassword) {
    throw new Error(
      "GMAIL_APP_PASSWORD is missing in .env.local"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  // Verify SMTP connection before sending
  await transporter.verify();

  const info = await transporter.sendMail({
    from: `"BookingLK" <${gmailUser}>`,
    to: email,
    subject: "Verify your BookingLK account",

    text: `Hi ${firstName},

Thank you for creating your BookingLK account.

Your BookingLK verification code is:

${code}

This code will expire in 10 minutes.

If you did not create this account, you can safely ignore this email.

BookingLK
Discover Sri Lanka. Stay Your Way.
`,

    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your BookingLK account</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial,Helvetica,sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 20px;"
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
          "
        >

          <!-- HEADER -->

          <tr>
            <td
              style="
                background:#111111;
                padding:32px;
                text-align:center;
              "
            >
              <div
                style="
                  color:#d4af37;
                  font-size:28px;
                  font-weight:bold;
                "
              >
                BookingLK
              </div>

              <div
                style="
                  color:#aaaaaa;
                  margin-top:8px;
                  font-size:13px;
                "
              >
                Discover Sri Lanka. Stay Your Way.
              </div>
            </td>
          </tr>

          <!-- CONTENT -->

          <tr>
            <td style="padding:40px 32px;">

              <h1
                style="
                  margin:0 0 15px;
                  color:#111111;
                  font-size:26px;
                "
              >
                Verify your email
              </h1>

              <p
                style="
                  color:#555555;
                  font-size:15px;
                  line-height:1.7;
                "
              >
                Hi ${firstName},
              </p>

              <p
                style="
                  color:#555555;
                  font-size:15px;
                  line-height:1.7;
                "
              >
                Thanks for creating your BookingLK account.
                Enter the verification code below to complete
                your registration.
              </p>

              <!-- OTP -->

              <div
                style="
                  margin:30px 0;
                  padding:25px;
                  background:#faf8f0;
                  border:1px solid #eadfb8;
                  border-radius:15px;
                  text-align:center;
                "
              >

                <div
                  style="
                    color:#777777;
                    font-size:12px;
                    text-transform:uppercase;
                    letter-spacing:2px;
                    margin-bottom:10px;
                  "
                >
                  Verification Code
                </div>

                <div
                  style="
                    color:#111111;
                    font-size:36px;
                    font-weight:bold;
                    letter-spacing:10px;
                  "
                >
                  ${code}
                </div>

              </div>

              <p
                style="
                  color:#777777;
                  font-size:13px;
                  text-align:center;
                "
              >
                This code expires in
                <strong>10 minutes</strong>.
              </p>

              <p
                style="
                  color:#999999;
                  font-size:12px;
                  line-height:1.6;
                  margin-top:30px;
                "
              >
                If you did not create a BookingLK account,
                you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->

          <tr>
            <td
              style="
                background:#fafafa;
                padding:25px;
                text-align:center;
                border-top:1px solid #eeeeee;
              "
            >
              <div
                style="
                  color:#999999;
                  font-size:12px;
                "
              >
                © BookingLK
              </div>

              <div
                style="
                  color:#bbbbbb;
                  font-size:11px;
                  margin-top:5px;
                "
              >
                Discover Sri Lanka. Stay Your Way.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`,
  });

  console.log("VERIFICATION_EMAIL_SENT:", {
    messageId: info.messageId,
    to: email,
  });

  return info;
}