const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,        // Your Gmail
    pass: process.env.EMAIL_PASS,   // App Password
  },
});

// ✅ Booking Confirmation Email
exports.sendBookingConfirmation = async (to, booking) => {
  const mailOptions = {
    from: `"Flight Booking" <${process.env.EMAIL}>`,
    to,
    subject: 'Your Flight Booking Confirmation ✈️',
    html: `
      <h2>Booking Confirmed ✅</h2>
      <p><strong>Flight:</strong> ${booking.flight.flightNumber}</p>
      <p><strong>From:</strong> ${booking.flight.origin} ➡ ${booking.flight.destination}</p>
      <p><strong>Departure:</strong> ${new Date(booking.flight.departureTime).toLocaleString()}</p>
      <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
      <h4>Passenger(s):</h4>
      <ul>
        ${booking.passengers.map(p => `<li>${p.name}</li>`).join('')}
      </ul>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📨 Booking confirmation sent:', info.messageId);
};

// ✅ Cancellation Email
exports.sendCancellationEmail = async (to, booking) => {
  const mailOptions = {
    from: `"Flight Booking" <${process.env.EMAIL}>`,
    to,
    subject: 'Flight Booking Cancelled ❌',
    html: `
      <h2>Your booking has been cancelled</h2>
      <p><strong>Flight:</strong> ${booking.flight.flightNumber}</p>
      <p><strong>Route:</strong> ${booking.flight.origin} ➡ ${booking.flight.destination}</p>
      <p><strong>Departure:</strong> ${new Date(booking.flight.departureTime).toLocaleString()}</p>
      <p><strong>Amount Refunded:</strong> ₹${booking.totalPrice}</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📨 Cancellation email sent:', info.messageId);
};
