const Event = require('../models/Event');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

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
    await sendEmail({
      email: user.email,
      subject: 'Event Registration Confirmation',
      name: user.name,
      eventTitle: event.title,
      category: event.category,
      date: new Date(event.date).toDateString(),
      time: event.time,
      venue: event.venue,
      price: event.price,
    });
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