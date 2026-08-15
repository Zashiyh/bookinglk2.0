import nodemailer from "nodemailer";

interface SendSecurityOTPParams {
  email: string;
  firstName: string;
  otp: string;
  purpose:
    | "CHANGE_PASSWORD"
    | "CHANGE_EMAIL";
}

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

export async function sendSecurityOTP({
  email,
  firstName,
  otp,
  purpose,
}: SendSecurityOTPParams) {
  const isPasswordChange =
    purpose === "CHANGE_PASSWORD";

  const subject = isPasswordChange
    ? "BookingLK Password Change Verification"
    : "BookingLK Email Change Verification";

  const title = isPasswordChange
    ? "Verify your password change"
    : "Verify your new email address";

  const description = isPasswordChange
    ? "Someone requested to change the password of your BookingLK account. Enter the verification code below to continue."
    : "Someone requested to change the email address of your BookingLK account. Enter the verification code below to continue.";

  await transporter.sendMail({
    from: `"BookingLK Security" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,

    text: `${title}

Hi ${firstName || "Guest"},

${description}

Verification code: ${otp}

This code expires in 10 minutes.

If you did not request this change, please secure your BookingLK account immediately.

BookingLK Security Team`,

    html: `
      <div style="
        margin:0;
        padding:40px 20px;
        background:#070707;
        font-family:Arial,Helvetica,sans-serif;
        color:#ffffff;
      ">
        <div style="
          max-width:560px;
          margin:auto;
          background:#111111;
          border:1px solid #292929;
          border-radius:20px;
          padding:36px;
        ">

          <div style="
            font-size:26px;
            font-weight:700;
            color:#D4AF37;
            margin-bottom:28px;
          ">
            BookingLK
          </div>

          <h1 style="
            margin:0 0 12px;
            font-size:24px;
            color:#ffffff;
          ">
            ${title}
          </h1>

          <p style="
            margin:0 0 24px;
            line-height:1.7;
            color:#aaaaaa;
            font-size:15px;
          ">
            Hi ${firstName || "Guest"},
            <br /><br />
            ${description}
          </p>

          <div style="
            text-align:center;
            margin:30px 0;
            padding:24px;
            border:1px solid rgba(212,175,55,0.25);
            border-radius:16px;
            background:rgba(212,175,55,0.06);
          ">
            <div style="
              color:#888888;
              font-size:12px;
              margin-bottom:10px;
              text-transform:uppercase;
              letter-spacing:1px;
            ">
              Verification Code
            </div>

            <div style="
              font-size:34px;
              font-weight:700;
              letter-spacing:8px;
              color:#D4AF37;
            ">
              ${otp}
            </div>
          </div>

          <p style="
            color:#888888;
            font-size:13px;
            line-height:1.6;
          ">
            This verification code expires in
            <strong style="color:#ffffff;">
              10 minutes
            </strong>.
          </p>

          <p style="
            margin-top:24px;
            color:#777777;
            font-size:12px;
            line-height:1.6;
          ">
            If you did not request this change,
            please secure your BookingLK account
            immediately.
          </p>

          <div style="
            margin-top:30px;
            padding-top:20px;
            border-top:1px solid #292929;
            color:#555555;
            font-size:12px;
          ">
            BookingLK Security Team
          </div>

        </div>
      </div>
    `,
  });
}