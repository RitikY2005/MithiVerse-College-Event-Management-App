const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getMyRegistrations,
  unregisterFromEvent,
  removeUserFromEvent
} = require('../controllers/eventController');


const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(getEvents)
  .post(protect, authorize('admin'), createEvent);

router.get('/my-registrations', protect, getMyRegistrations);

router
  .route('/:id')
  .get(getEvent)
  .patch(protect, authorize('admin'), updateEvent)
  .delete(protect, authorize('admin'), deleteEvent);

router.route('/:id/register').post(protect, registerForEvent);
router.route('/:id/unregister').delete(protect, unregisterFromEvent);
router.delete(
  '/:eventId/unregister/:userId',
  protect,
  authorize('admin'),
  removeUserFromEvent
);


module.exports = router;
