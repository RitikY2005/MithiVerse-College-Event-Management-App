const asyncHandler = require("../middleware/asyncHandler");
const Event = require("../models/Event");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

exports.sendInvites = asyncHandler(async (req, res, next) => {
  let { emails, eventId } = req.query;

  if (!emails || !eventId) {
    return next(new ErrorResponse("Please provide emails and eventId", 400));
  }
  emails = emails.split(',').map(email => email.trim()).filter(email => email.length > 0);
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorResponse("Event not found", 404));
  }

  // start server side event to notify client about email status 
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  for (const email of [...emails]) {

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new ErrorResponse(`Invalid email address: ${email}`, 400));
    }

    const subject = `You're invited to ${event.title} on Mithiverse!`;
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #0f0f1a; padding: 20px; color: #ffffff;">
    
                <div style="max-width: 600px; margin: auto; background-color: #1E1E2F; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
      
      <!-- Image -->
      <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 250px; object-fit: cover;" />

      <!-- Content -->
      <div style="padding: 20px;">
        
        <!-- Title -->
        <h1 style="margin: 0 0 10px 0; font-size: 24px;">
          ${event.title}
        </h1>

        <!-- Category -->
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #aaa;">
          ${event.category}
        </p>

        <!-- Description -->
        <p style="margin: 10px 0 20px 0; line-height: 1.6; color: #ddd;">
          ${event.description}
        </p>

        <!-- Event Details -->
        <div style="margin-bottom: 20px; font-size: 14px; color: #ccc;">
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Venue:</strong> ${event.venue}</p>
          <p><strong>Price:</strong> ₹${event.price}</p>
          <p><strong>Seats:</strong> ${event.capacity - event.registeredUsers.length} left</p>
        </div>

        <!-- CTA Button -->
        <a 
          href="${process.env.FRONTEND_URL}/events/${event._id}" 
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          View Event
        </a>

      </div>
        </div>

            <!-- Footer -->
        <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
      You're receiving this because you were invited to an event.
     </p>

     </div>
        `;
    const text = `You're invited to ${event.title} on Mithiverse! View details at ${process.env.FRONTEND_URL}/events/${event._id}`;
    const emailOptions = {
      email: email,
      subject: subject,
      htmlTemplate: htmlTemplate,
      text: text
    }





    try {
      await sendEmail(emailOptions);
      const responseData = {
        success: true,
        action: "progess",
        message: "Invitation sent on " + email,
      }
      await res.write(`data:${JSON.stringify(responseData)}\n\n`);
    } catch (error) {
      const responseData = {
        success: false,
        action: "progress",
        message: "Failed to send invitation on " + email,
      }
      await res.write(`data:${JSON.stringify(responseData)}\n\n`);
    }


  };

  await res.write(`data:${JSON.stringify({ success: false, message: "sent all emails", action: "complete" })}\n\n`);
  res.end();

});

exports.sendFeeback = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new ErrorResponse('Please provide all fields', 400));
  }

  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Feedback Received</title>
</head>

<body style="margin:0; padding:0; background-color:#0f172a; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0; background-color:#0f172a;">
    <tr>
      <td align="center">

        <!-- MAIN CONTAINER -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#020617; border-radius:12px; overflow:hidden; border:1px solid #1e293b;">

          <!-- HEADER -->
          <tr>
            <td style="padding: 24px; background: linear-gradient(90deg, #00BFA6, #1DE9B6); text-align:center;">
              <h1 style="margin:0; color:#020617; font-size:24px; font-weight:bold;">
                New Feedback Received
              </h1>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 30px; color:#e2e8f0;">

              <p style="margin:0 0 20px; font-size:16px;">
                You have received a new feedback submission from your website.
              </p>

              <!-- USER DETAILS -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                
                <tr>
                  <td style="padding:10px 0; color:#94a3b8;">Name</td>
                  <td style="padding:10px 0; text-align:right; font-weight:bold; color:#ffffff;">
                    ${name}
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0; color:#94a3b8;">Email</td>
                  <td style="padding:10px 0; text-align:right; font-weight:bold; color:#ffffff;">
                    ${email}
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 0; color:#94a3b8;">Subject</td>
                  <td style="padding:10px 0; text-align:right; font-weight:bold; color:#ffffff;">
                    ${subject}
                  </td>
                </tr>

              </table>

              <!-- MESSAGE BOX -->
              <div style="margin-top:20px;">
                <p style="margin-bottom:10px; color:#94a3b8;">Message</p>

                <div style="
                  background:#020617;
                  border:1px solid #1e293b;
                  border-radius:8px;
                  padding:16px;
                  color:#e2e8f0;
                  line-height:1.6;
                  white-space:pre-line;
                ">
                  ${message}
                </div>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px; text-align:center; font-size:12px; color:#64748b;">
              This message was sent from your MithiVerse website feedback form.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

  const emailOptions = {
    email: process.env.FEEDBACK_EMAIL,
    subject: `Feedback on mithiverse webiste from ${name}`,
    text: message,
    htmlTemplate: htmlTemplate
  }

  await sendEmail(emailOptions);

  res.status(200).json({
    success:true,
    message:"Email sent "
  });


});


