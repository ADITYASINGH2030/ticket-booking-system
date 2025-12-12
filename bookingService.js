const db = require('../db');

async function bookSeats({ userId, showId, seatNos }) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const selectQuery = `
      SELECT id, seat_no
      FROM seats
      WHERE show_id = $1 AND seat_no = ANY($2::text[]) AND status = 'AVAILABLE'
      FOR UPDATE
    `;
    const { rows } = await client.query(selectQuery, [showId, seatNos]);

    if (rows.length !== seatNos.length) {
      await client.query('ROLLBACK');
      return { success: false, reason: 'Seats not available' };
    }

    const seatIdsArray = rows.map(r => r.id);
    await client.query(`UPDATE seats SET status='BOOKED' WHERE id = ANY($1::uuid[])`, [seatIdsArray]);

    const insertBooking = `
      INSERT INTO bookings (user_id, show_id, status)
      VALUES ($1, $2, 'CONFIRMED') RETURNING id
    `;
    const res = await client.query(insertBooking, [userId, showId]);
    const bookingId = res.rows[0].id;

    await client.query(`INSERT INTO booking_seats (booking_id, seat_id)
      SELECT $1, id FROM seats WHERE id = ANY($2::uuid[])`, [bookingId, seatIdsArray]);

    await client.query('COMMIT');
    return { success: true, bookingId };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('booking error', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { bookSeats };
