const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },

    description: {
      type: String,
      required: [true, 'Please add a description'],
    },

    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Technical', 'Cultural', 'Sports', 'Workshop'],
    },

    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
      default: 0,
    },

    date: {
      type: Date,
      required: [true, 'Please add a date'],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: 'Event date cannot be in the past',
      },
    },

    registrationDeadline: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value <= this.date;
        },
        message:
          'Registration deadline must be before event date',
      },
    },

    time: {
      type: String,
      required: [true, 'Please add a time'],
    },

    venue: {
      type: String,
      required: [true, 'Please add a venue'],
    },

    capacity: {
      type: Number,
      required: [true, 'Please add a capacity'],
      min: 1,
    },

    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },

    registeredUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// ===============================
// EVENT STATUS
// ===============================
EventSchema.methods.getEventStatus = function () {
  const now = new Date();
  const eventDate = new Date(this.date);

  return eventDate < now ? 'completed' : 'upcoming';
};

// ===============================
// REGISTRATION CHECK
// ===============================
EventSchema.methods.isRegistrationOpen = function () {
  const now = new Date();

  const deadline = this.registrationDeadline
    ? new Date(this.registrationDeadline)
    : new Date(this.date);

  if (deadline < now) return false;

  if (this.registeredUsers.length >= this.capacity)
    return false;

  return true;
};

// ===============================
// PREVENT UPDATING PAST EVENTS
// ===============================
EventSchema.pre('findOneAndUpdate', async function (next) {
  const event = await this.model.findOne(this.getQuery());

  if (!event) return next();

  if (new Date(event.date) < new Date()) {
    return next(
      new Error('Cannot edit an event that has already occurred')
    );
  }

  next();
});

module.exports = mongoose.model('Event', EventSchema);
