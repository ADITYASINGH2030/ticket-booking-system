// Run after creating a show to stress test seat booking concurrency.
// Usage: node concurrency_test.js
const axios = require('axios');
const API = axios.create({ baseURL: 'http://localhost:4000/api', timeout: 10000 });

async function createShow() {
  const r = await API.post('/shows', { name: 'Test Show', startTime: new Date().toISOString(), totalSeats: 10 });
  return r.data.id;
}

async function fireRequests(showId) {
  const promises = [];
  for (let i=0;i<50;i++) {
    promises.push(API.post('/bookings', { userId:`user${i}`, showId, seatNos: ['1'] })
      .then(r => ({ ok:true, data: r.data }))
      .catch(e => ({ ok:false, error: e.response?.data || e.message })));
  }
  const results = await Promise.all(promises);
  console.log('successes', results.filter(r=>r.ok).length, 'failures', results.filter(r=>!r.ok).length);
  console.log(results.map(r => r.ok ? r.data : r.error));
}

async function main(){
  const showId = await createShow();
  console.log('Created show', showId);
  await fireRequests(showId);
}
main().catch(console.error);
