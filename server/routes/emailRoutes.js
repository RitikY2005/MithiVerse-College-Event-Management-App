const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendInvites, sendFeeback } = require('../controllers/emailController');
const router = express.Router();

router.get('/send-invites', protect , sendInvites);
router.post('/send-feedback', protect , sendFeeback);

module.exports = router;