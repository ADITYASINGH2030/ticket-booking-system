const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');

router.post('/', async (req, res) => {
  try {
    const { userId, showId, seatNos } = req.body;
    if (!userId || !showId || !Array.isArray(seatNos) || seatNos.length === 0) {
      return res.status(400).json({ error: 'missing params' });
    }
    const result = await bookingService.bookSeats({ userId, showId, seatNos });
    if (!result.success) {
      return res.status(409).json({ status: 'FAILED', reason: result.reason });
    }
    res.json({ status: 'CONFIRMED', bookingId: result.bookingId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
