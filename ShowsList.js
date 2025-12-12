import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShowsList() {
  const [shows, setShows] = useState([]);
  useEffect(() => {
    axios.get((process.env.REACT_APP_API_BASE || 'http://localhost:4000') + '/api/shows')
      .then(r => setShows(r.data))
      .catch(e => console.error(e));
  }, []);
  return (
    <div>
      <h2>Shows</h2>
      {shows.length === 0 ? <p>No shows</p> : (
        <ul>
          {shows.map(s => <li key={s.id}>{s.name} - seats: {s.total_seats}</li>)}
        </ul>
      )}
    </div>
  );
}
