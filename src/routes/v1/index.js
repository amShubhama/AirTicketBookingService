const express = require('express');
const { BookingController } = require('../../controllers/index');

const router = express.Router();

router.post('/bookings', BookingController.create);
router.get('/bookings', (req, res) => res.send('Working'));

module.exports = router;