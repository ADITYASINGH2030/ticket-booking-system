const db = require('../db');

async function expirePendingBookings() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT id FROM bookings WHERE status='PENDING' AND created_at < now() - interval '2 minutes' FOR UPDATE SKIP LOCKED`
    );
    for (const b of rows) {
      const seatRes = await client.query(`SELECT seat_id FROM booking_seats WHERE booking_id = $1`, [b.id]);
      const seatIds = seatRes.rows.map(r => r.seat_id);
      if (seatIds.length) {
        await client.query(`UPDATE seats SET status='AVAILABLE' WHERE id = ANY($1::uuid[])`, [seatIds]);
      }
      await client.query(`UPDATE bookings SET status='FAILED', updated_at = now() WHERE id=$1`, [b.id]);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('expiry error', err);
  } finally {
    client.release();
  }
}

// Run periodically when required in production or during dev if desired:
// setInterval(expirePendingBookings, 30 * 1000);
module.exports = { expirePendingBookings };
