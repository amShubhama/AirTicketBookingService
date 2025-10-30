const express = require('express');

const { BookingController } = require('../../controllers');
const { authenticateUser } = require('../../middlewares/index');

const router = express.Router();

router.post(
    '/',
    authenticateUser,
    BookingController.createBooking
);

router.post(
    '/payments',
    BookingController.makePayment
);

module.exports = router;