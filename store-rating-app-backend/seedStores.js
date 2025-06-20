// seedStores.js
const { Store } = require('./models');

const seedStores = async () => {
  const stores = [
    { name: 'Fresh Mart', address: '12 Green Street, Pune' },
    { name: 'Tech World', address: '55 Silicon Valley Road, Pune' },
    { name: 'Book Haven', address: '78 Knowledge Park, Pune' },
    { name: 'Fit Zone Gym', address: '22 Fitness Avenue, Pune' },
    { name: 'Sweet Bites', address: '14 Dessert Lane, Pune' },
    { name: 'Cloth & Style', address: '88 Fashion Blvd, Pune' },
    { name: 'Auto Care', address: '9 Garage Road, Pune' },
    { name: 'Gadget Hub', address: '101 Electronics Market, Pune' },
    { name: 'Daily Needs', address: '5 Supermart Complex, Pune' },
    { name: 'Bloom Flower Shop', address: '43 Garden Street, Pune' },
  ];

  try {
    await Store.bulkCreate(stores);
    console.log('✅ 10 stores seeded successfully!');
    process.exit(); // exit the script
  } catch (err) {
    console.error('❌ Failed to seed stores:', err);
  }
};

seedStores();
