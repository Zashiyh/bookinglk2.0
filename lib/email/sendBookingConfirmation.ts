import nodemailer from "nodemailer";

interface BookingEmailData {
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomName: string;
  checkIn: string | Date;
  checkOut: string | Date;
  guests: number;
  nights: number;
  roomTotal: number;
  serviceFee: number;
  total: number;
  currency: string;
}

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER or GMAIL_APP_PASSWORD is missing in .env.local"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
}

function formatDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-LK").format(
    Number(value) || 0
  );
}

export async function sendBookingConfirmationEmail(
  data: BookingEmailData
) {
  const transporter = getTransporter();

  if (!data.guestEmail) {
    throw new Error("Guest email is missing.");
  }

  const guestName =
    data.guestName.trim() || "Guest";

  await transporter.sendMail({
    from: `"BookingLK" <${process.env.GMAIL_USER}>`,
    to: data.guestEmail,
    subject: `Booking Confirmed • ${data.bookingReference}`,

    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Booking Confirmed</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial,Helvetica,sans-serif;
    color:#18181b;
  "
>

<div
  style="
    max-width:650px;
    margin:0 auto;
    padding:40px 20px;
  "
>

  <!-- Header -->

  <div
    style="
      background:#111111;
      border-radius:24px 24px 0 0;
      padding:30px;
      text-align:center;
    "
  >

    <h1
      style="
        margin:0;
        color:#D4AF37;
        font-size:28px;
      "
    >
      BookingLK
    </h1>

    <p
      style="
        margin:8px 0 0;
        color:#d4d4d8;
        font-size:14px;
      "
    >
      Your stay, beautifully booked.
    </p>

  </div>

  <!-- Main -->

  <div
    style="
      background:#ffffff;
      padding:35px 30px;
    "
  >

    <!-- Success -->

    <div
      style="
        text-align:center;
        margin-bottom:30px;
      "
    >

      <div
        style="
          display:inline-block;
          width:58px;
          height:58px;
          line-height:58px;
          border-radius:50%;
          background:#ecfdf5;
          color:#059669;
          font-size:28px;
        "
      >
        ✓
      </div>

      <h2
        style="
          margin:18px 0 8px;
          font-size:25px;
        "
      >
        Booking Confirmed
      </h2>

      <p
        style="
          margin:0;
          color:#71717a;
          font-size:14px;
        "
      >
        Hi ${guestName}, your reservation has been confirmed.
      </p>

    </div>

    <!-- Reference -->

    <div
      style="
        background:#fafafa;
        border:1px solid #e4e4e7;
        border-radius:18px;
        padding:22px;
        margin-bottom:25px;
      "
    >

      <p
        style="
          margin:0 0 8px;
          color:#71717a;
          font-size:12px;
          text-transform:uppercase;
          letter-spacing:1px;
        "
      >
        Booking Reference
      </p>

      <div
        style="
          font-size:24px;
          font-weight:bold;
          letter-spacing:1px;
        "
      >
        ${data.bookingReference}
      </div>

    </div>

    <!-- Stay Details -->

    <h3
      style="
        font-size:18px;
        margin:0 0 15px;
      "
    >
      Stay details
    </h3>

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        border-collapse:collapse;
        font-size:14px;
      "
    >

      <tr>
        <td
          style="
            padding:10px 0;
            color:#71717a;
          "
        >
          Hotel
        </td>

        <td
          align="right"
          style="
            padding:10px 0;
            font-weight:bold;
          "
        >
          ${data.hotelName}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:10px 0;
            color:#71717a;
          "
        >
          Room
        </td>

        <td
          align="right"
          style="
            padding:10px 0;
            font-weight:bold;
          "
        >
          ${data.roomName}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:10px 0;
            color:#71717a;
          "
        >
          Check-in
        </td>

        <td
          align="right"
          style="
            padding:10px 0;
            font-weight:bold;
          "
        >
          ${formatDate(data.checkIn)}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:10px 0;
            color:#71717a;
          "
        >
          Check-out
        </td>

        <td
          align="right"
          style="
            padding:10px 0;
            font-weight:bold;
          "
        >
          ${formatDate(data.checkOut)}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:10px 0;
            color:#71717a;
          "
        >
          Guests
        </td>

        <td
          align="right"
          style="
            padding:10px 0;
            font-weight:bold;
          "
        >
          ${data.guests}
        </td>
      </tr>

      <tr>
        <td
          style="
            padding:10px 0;
            color:#71717a;
          "
        >
          Nights
        </td>

        <td
          align="right"
          style="
            padding:10px 0;
            font-weight:bold;
          "
        >
          ${data.nights}
        </td>
      </tr>

    </table>

    <!-- Price -->

    <div
      style="
        border-top:1px solid #e4e4e7;
        margin-top:20px;
        padding-top:20px;
      "
    >

      <div
        style="
          display:flex;
          justify-content:space-between;
          margin-bottom:10px;
        "
      >
        <span style="color:#71717a;">
          Room total
        </span>

        <strong>
          ${data.currency}
          ${formatPrice(data.roomTotal)}
        </strong>
      </div>

      <div
        style="
          display:flex;
          justify-content:space-between;
          margin-bottom:15px;
        "
      >
        <span style="color:#71717a;">
          Service fee
        </span>

        <strong>
          ${data.currency}
          ${formatPrice(data.serviceFee)}
        </strong>
      </div>

      <div
        style="
          background:#111111;
          color:#ffffff;
          border-radius:16px;
          padding:18px;
        "
      >

        <strong>Total</strong>

        <strong
          style="
            float:right;
            color:#D4AF37;
            font-size:20px;
          "
        >
          ${data.currency}
          ${formatPrice(data.total)}
        </strong>

        <div style="clear:both;"></div>

      </div>

    </div>

    <!-- Reminder -->

    <div
      style="
        margin-top:30px;
        padding:18px;
        border-radius:16px;
        background:#fffbeb;
        border:1px solid #fef3c7;
      "
    >

      <strong>
        Keep your booking reference
      </strong>

      <p
        style="
          margin:7px 0 0;
          color:#71717a;
          font-size:13px;
          line-height:1.6;
        "
      >
        Your booking reference is
        <strong>${data.bookingReference}</strong>.
        Keep it safe for future access.
      </p>

    </div>

  </div>

  <!-- Footer -->

  <div
    style="
      background:#111111;
      border-radius:0 0 24px 24px;
      padding:25px;
      text-align:center;
    "
  >

    <p
      style="
        margin:0;
        color:#a1a1aa;
        font-size:12px;
      "
    >
      © ${new Date().getFullYear()} BookingLK
    </p>

    <p
      style="
        margin:7px 0 0;
        color:#71717a;
        font-size:11px;
      "
    >
      Thank you for booking with us.
    </p>

  </div>

</div>

</body>
</html>
`,
  });
}