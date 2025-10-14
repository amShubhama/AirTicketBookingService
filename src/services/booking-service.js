const { default: axios } = require('axios');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { BookingRepository } = require('../repositories/index');
const { ServiceError } = require('../utils/errors');
const { StatusCodes } = require('http-status-codes');

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            if (data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError(
                    'Something went wrong in the booking process',
                    'Insufficient seats check total available seats',
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }

            const totalCost = flightData.price * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, { totalSeats: flightData.totalSeats - booking.noOfSeats });
            const finalBooking = await this.bookingRepository.update(booking.id, { status: "Booked" });
            return finalBooking;

        } catch (error) {
            console.log(error);
            if (error.name == 'RepositoryError' || error.name == 'ValidationError')
                throw error;
            throw new ServiceError();
            throw error;
        }
    }
}

module.exports = BookingService;