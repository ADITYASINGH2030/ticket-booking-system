const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { name, startTime, totalSeats } = req.body;
    if (!name || !startTime || !totalSeats) return res.status(400).send('missing');
    const r = await db.query(
      `INSERT INTO shows (name, start_time, total_seats) VALUES ($1, $2, $3) RETURNING id`,
      [name, startTime, totalSeats]
    );
    const showId = r.rows[0].id;

    const inserts = [];
    for (let i = 1; i <= totalSeats; i++) {
      inserts.push(db.query(`INSERT INTO seats (show_id, seat_no) VALUES ($1, $2)`, [showId, String(i)]));
    }
    await Promise.all(inserts);
    res.json({ id: showId });
  } catch (err) {
    console.error(err);
    res.status(500).send('err');
  }
});

router.get('/', async (req, res) => {
  const r = await db.query(`SELECT id, name, start_time, total_seats FROM shows ORDER BY start_time`);
  res.json(r.rows);
});

router.get('/:id/seats', async (req, res) => {
  const showId = req.params.id;
  const r = await db.query(`SELECT id, seat_no, status FROM seats WHERE show_id=$1 ORDER BY seat_no`, [showId]);
  res.json(r.rows);
});

module.exports = router;
