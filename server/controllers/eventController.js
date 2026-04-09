const Event = require('../models/Event');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const Payment = require('../models/Payment');

// Utility function to attach status info
const attachEventMeta = (event) => {
  
  const obj = event.toObject();
  obj.status = event.getEventStatus();
  obj.isRegistrationOpen = event.isRegistrationOpen();
  return obj;
};

// ==============================
// @desc    Get all events
// ==============================
exports.getEvents = asyncHandler(async (req, res, next) => {
  const { search, category, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  const events = await Event.find(query)
    .populate('registeredUsers', 'name email')
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const count = await Event.countDocuments(query);

  const updatedEvents = events.map((event) => attachEventMeta(event));

  res.status(200).json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    data: updatedEvents,
  });
});

// ==============================
// @desc    Get single event
// ==============================
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('registeredUsers', 'name email');

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: attachEventMeta(event),
  });
});

// ==============================
// @desc    Create event
// ==============================
exports.createEvent = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: attachEventMeta(event),
  });
});

// ==============================
// @desc    Update event
// ==============================
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found`, 404));
  }

  if (event.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: attachEventMeta(event),
  });
});

// ==============================
// @desc    Delete event
// ==============================
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found`, 404));
  }

  if (event.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized`, 401));
  }

  await event.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// ==============================
// @desc    Register for event
// ==============================
exports.registerForEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Event not found`, 404));
  }

  // 🔥 NEW: Check expiry
  if (!event.isRegistrationOpen()) {
    return next(new ErrorResponse('Registration is closed for this event', 400));
  }

  const alreadyRegistered = event.registeredUsers.find(
    (user) => user.toString() === req.user.id
  );

  if (alreadyRegistered) {
    return next(new ErrorResponse('Already registered', 400));
  }

  event.registeredUsers.push(req.user.id);
  await event.save();

  const user = await User.findById(req.user.id);

  
  try {
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
                    Hello ${user.name || 'Participant'},
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
                        <strong style="color:#FFFFFF;">Event:</strong> ${event.title}<br/>
                        <strong style="color:#FFFFFF;">Category:</strong> ${event.category}<br/>
                        <strong style="color:#FFFFFF;">Date:</strong> ${event.date}<br/>
                        <strong style="color:#FFFFFF;">Time:</strong> ${event.time}<br/>
                        <strong style="color:#FFFFFF;">Venue:</strong> ${event.venue}<br/>
                        <strong style="color:#FFFFFF;">Price:</strong> ₹${event.price}
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
    const emailOptions={
      email:user.email,
      subject:`You have successfully registered for ${event.title}`,
      htmlTemplate:htmlTemplate,
      text:`Hello ${user.name},\n\nYou’ve successfully registered for the event "${event.title}".\n\nEvent Details:\n- Category: ${event.category}\n- Date: ${new Date(event.date).toDateString()}\n- Time: ${event.time}\n- Venue: ${event.venue}\n- Price: ₹${event.price}\n\nYou can manage your registrations or explore more events on our platform.\n\nBest regards,\nTeam MithiVerse`
    };
    await sendEmail(emailOptions);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({
    success: true,
    data: attachEventMeta(event),
  });
});

// ==============================
// @desc    Get my registrations
// ==============================
exports.getMyRegistrations = asyncHandler(async (req, res, next) => {
  const events = await Event.find({
    registeredUsers: req.user.id,
  });
  
  const updatedEvents = events.map((event) => attachEventMeta(event));
  
  


  res.status(200).json({
    success: true,
    count: events.length,
    data: updatedEvents,
  });
});

// ==============================
// @desc    Unregister
// ==============================
exports.unregisterFromEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  const isRegistered = event.registeredUsers.includes(req.user.id);

  if (!isRegistered) {
    return next(new ErrorResponse('Not registered for this event', 400));
  }

  event.registeredUsers = event.registeredUsers.filter(
    (userId) => userId.toString() !== req.user.id
  );

  // 🔥 NEW: If event is paid, also handle payment cancellation/refund logic here 
  if(event.price> 0){
     const payment= await Payment.findOne({userId:req.user.id,eventId:event._id});

     if(payment){
        await payment.deleteOne();
     }
  }

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Successfully unregistered',
  });
});

exports.removeUserFromEvent = asyncHandler(async (req, res, next) => {
  const { eventId, userId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorResponse('Event not found', 404));
  }

  event.registeredUsers = event.registeredUsers.filter(
    (id) => id.toString() !== userId
  );

  await event.save();

  res.status(200).json({
    success: true,
    message: 'User removed from event',
  });
});