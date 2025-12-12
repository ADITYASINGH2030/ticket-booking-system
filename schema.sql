CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

CREATE TABLE IF NOT EXISTS shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  total_seats INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  seat_no TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  UNIQUE(show_id, seat_no)
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  show_id UUID NOT NULL REFERENCES shows(id),
  status booking_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS booking_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_seats_show_status ON seats(show_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status_created_at ON bookings(status, created_at);
