// temporary script - test-db.js (in your root folder)
const { Store } = require('./models');

(async () => {
  const stores = await Store.findAll();
  console.log('All stores:', stores.map(s => s.name));
})();
