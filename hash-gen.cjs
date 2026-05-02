const bcrypt = require('bcryptjs');

const password = process.env.PASSWORD_TO_HASH || process.argv[2];

if (!password || password.length < 12) {
  console.error('Usage: PASSWORD_TO_HASH="<strong-password>" node hash-gen.cjs');
  console.error('The password must be at least 12 characters.');
  process.exit(1);
}

console.log(bcrypt.hashSync(password, 12));
