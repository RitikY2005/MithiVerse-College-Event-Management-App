const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const htmlTemplate = `
  <div style="margin:0; padding:0; background-color:#121212; font-family: 'Segoe UI', Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0" 
            style="background: linear-gradient(135deg, #1E1E2F, #2A2A3D); 
                   border-radius:16px; 
                   overflow:hidden; 
                   box-shadow:0 8px 40px rgba(0,0,0,0.6);">

            <!-- Header -->
            <tr>
              <td align="center" 
                style="padding:30px 20px;
                       background: linear-gradient(135deg, #00BFA6, #1DE9B6);
                       color:#FFFFFF;">
                <h1 style="margin:0; font-size:26px; letter-spacing:1px;">
                  MithiVerse
                </h1>
                <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
                  Registration Confirmed 🎉
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:35px 30px; color:#E0E0E0;">

                <h2 style="margin-top:0; color:#FFFFFF; font-size:20px;">
                  Hello ${options.name || 'Participant'},
                </h2>

                <p style="color:#A0A0A0; font-size:14px; line-height:1.6;">
                  You’ve successfully registered for the following event.
                  We’re excited to have you join us!
                </p>

                <!-- Event Card -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="margin:25px 0; 
                         background: linear-gradient(135deg, #1E1E2F, #2A2A3D);
                         border-radius:12px;
                         padding:20px;">
                  <tr>
                    <td style="color:#E0E0E0; font-size:14px; line-height:1.8;">
                      <strong style="color:#FFFFFF;">Event:</strong> ${options.eventTitle}<br/>
                      <strong style="color:#FFFFFF;">Category:</strong> ${options.category}<br/>
                      <strong style="color:#FFFFFF;">Date:</strong> ${options.date}<br/>
                      <strong style="color:#FFFFFF;">Time:</strong> ${options.time}<br/>
                      <strong style="color:#FFFFFF;">Venue:</strong> ${options.venue}<br/>
                      <strong style="color:#FFFFFF;">Price:</strong> ₹${options.price}
                    </td>
                  </tr>
                </table>

                <p style="color:#A0A0A0; font-size:14px; line-height:1.6;">
                  You can manage your registrations or explore more events on our platform.
                </p>

                <!-- CTA Button -->
                <div style="text-align:center; margin:35px 0;">
                  <a href="${process.env.FRONTEND_URL}" 
                     style="display:inline-block;
                            padding:14px 28px;
                            background: linear-gradient(135deg, #00BFA6, #1DE9B6);
                            color:#FFFFFF;
                            text-decoration:none;
                            border-radius:8px;
                            font-size:14px;
                            font-weight:600;
                            letter-spacing:0.5px;">
                    Visit MithiVerse
                  </a>
                </div>

                <p style="color:#A0A0A0; font-size:13px;">
                  If you have any questions, feel free to contact the event organizer.
                </p>

                <p style="margin-top:30px; color:#E0E0E0; font-size:14px;">
                  Best regards,<br/>
                  <strong style="color:#FFFFFF;">Team MithiVerse</strong>
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center"
                style="padding:18px;
                       background:#121212;
                       color:#A0A0A0;
                       font-size:12px;">
                © ${new Date().getFullYear()} MithiVerse. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `;

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: `You have successfully registered for ${options.eventTitle}.`,
    html: htmlTemplate,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;