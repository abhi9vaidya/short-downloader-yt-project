// startup check -cookie file hai ya nhi 
const fs = require('fs');
const path = require('path');

// local mein cookies.txt use karo, production mein /etc/secrets se
const COOKIE_PATH = process.env.COOKIE_FILE_PATH || 
  (process.env.NODE_ENV === 'production' ? '/etc/secrets/cookies.txt' : path.join(__dirname, 'cookies.txt'));

if (fs.existsSync(COOKIE_PATH)) {
  console.log(`Cookie file mil gayi: ${COOKIE_PATH}`);
} else {
  console.log(`Cookie file nahi mili: ${COOKIE_PATH}`);
  // agar cookie nahi hai toh crash karna hai? uncomment karo:
  // process.exit(1);
}
