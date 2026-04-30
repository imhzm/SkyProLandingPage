const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Admin@2026', 10);
console.log(hash);