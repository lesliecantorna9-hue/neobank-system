const API_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : window.location.origin + '/.netlify/functions';

console.log("Neo Bank API Target:", API_URL);

document.addEventListener('DOMContentLoaded', () => {
  console.log('Frontend loaded');
});