const fs = require('fs');
const path = require('path');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: JSON.stringify({ message: 'Invalid JSON' }) }; }
  const { name, email, message } = body;
  if (!name || !email || !message) return { statusCode: 400, body: JSON.stringify({ message: 'All fields are required' }) };

  const dataDir = path.join(__dirname, '_data');
  const filePath = path.join(dataDir, 'messages.json');

  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    let msgs = [];
    try { msgs = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]'); } catch (e) { msgs = []; }

    const newMsg = { id: Math.random().toString(36).substr(2,9), name, email, message, date: new Date().toISOString() };
    msgs.push(newMsg);
    fs.writeFileSync(filePath, JSON.stringify(msgs, null, 2), 'utf8');
    console.log('New contact message saved', newMsg.id);

    // In production, you might also send an email notification here.
    return { statusCode: 201, body: JSON.stringify({ message: 'Message received' }) };
  } catch (err) {
    console.error('contact error', err);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
