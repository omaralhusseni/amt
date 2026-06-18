import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Trip from './models/Trip.js';

dotenv.config();

const MONGODB_URI = "mongodb+srv://omaralhussoo_db_user:o7FQGDpu3LrjxDMP@cluster0.v59itln.mongodb.net/?appName=Cluster0";

async function main() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding trips');

  // clear existing trips
  await Trip.deleteMany({});
  console.log('Cleared existing Trip documents');

  const sampleTrips = [
    {
      name: 'Siwa Oasis Escape',
      subtitle: 'A serene desert oasis experience',
      description: 'Explore the salt lakes, hot springs and date palms of Siwa. Perfect for a short restorative trip.',
      images: [
        'https://picsum.photos/seed/siwa1/800/600',
        'https://picsum.photos/seed/siwa2/800/600',
        'https://picsum.photos/seed/siwa3/800/600',
      ],
      interested: 124,
      schedules: [
        {
          name: 'Classic 2-day',
          price_per_person: 120,
          days: [
            [
              { time: '08:00', activity: { name: 'Arrival & Breakfast', description: 'Meet and greet, light breakfast', images: [], place: 'Siwa Village' } },
              { time: '10:00', activity: { name: 'Salt Lake Walk', description: 'Walk on the salt flats and photography', images: [], place: 'Shali' } },
            ],
            [
              { time: '07:00', activity: { name: 'Hot Spring Dip', description: 'Relax in warm natural springs', images: [], place: 'Ain al-Muftella' } },
              { time: '14:00', activity: { name: 'Cultural Tour', description: 'Visit local craftsmen and markets', images: [], place: 'Local Market' } },
            ],
          ],
        },
        {
          name: 'Adventure 3-day',
          price_per_person: 180,
          days: [
            [
              { time: '09:00', activity: { name: 'Desert Safari', description: '4x4 adventure in the dunes', images: [], place: 'Great Sand Sea' } },
              { time: '17:00', activity: { name: 'Stargazing', description: 'Guided stargazing session', images: [], place: 'Desert Camp' } },
            ],
            [
              { time: '08:00', activity: { name: 'Lake Excursion', description: 'Boat and lake side picnic', images: [], place: 'Siwa Lakes' } },
            ],
            [
              { time: '09:00', activity: { name: 'Visit Oracle Temple', description: 'Historical site visit', images: [], place: 'Temple of the Oracle' } },
            ],
          ],
        },
      ],
    },

    {
      name: 'Red Sea Reef Snorkel',
      subtitle: 'Snorkel pristine reefs on the Red Sea',
      description: 'A water-focused trip with snorkeling and relaxation on the coast.',
      images: [
        'https://picsum.photos/seed/redsea1/800/600',
        'https://picsum.photos/seed/redsea2/800/600',
      ],
      interested: 256,
      schedules: [
        {
          name: '2-day Snorkel',
          price_per_person: 140,
          days: [
            [
              { time: '09:00', activity: { name: 'Boat Outing', description: 'Snorkeling at the reef', images: [], place: 'Coral Garden' } },
              { time: '15:00', activity: { name: 'Beach Relax', description: 'Free time on the beach', images: [], place: 'Private Beach' } },
            ],
            [
              { time: '10:00', activity: { name: 'Sunset Cruise', description: 'Short cruise and light dinner', images: [], place: 'Red Sea' } },
            ],
          ],
        },
      ],
    },

    {
      name: 'Luxor & Aswan Highlights',
      subtitle: 'Ancient temples and Nile cruises',
      description: 'See the major pharaonic sites and enjoy a short felucca trip on the Nile.',
      images: [
        'https://picsum.photos/seed/luxor1/800/600',
        'https://picsum.photos/seed/luxor2/800/600',
        'https://picsum.photos/seed/luxor3/800/600',
      ],
      interested: 512,
      schedules: [
        {
          name: '3-day Classic',
          price_per_person: 220,
          days: [
            [
              { time: '08:00', activity: { name: 'Valley of the Kings', description: 'Visit royal tombs', images: [], place: 'Valley of the Kings' } },
              { time: '13:00', activity: { name: 'Lunch & Museum', description: 'Visit the local museum', images: [], place: 'Luxor Museum' } },
            ],
            [
              { time: '09:00', activity: { name: 'Karnak Temple', description: 'Explore Karnak complex', images: [], place: 'Karnak' } },
              { time: '17:00', activity: { name: 'Felucca Ride', description: 'Sunset felucca on the Nile', images: [], place: 'Nile' } },
            ],
            [
              { time: '07:00', activity: { name: 'Aswan Transfer', description: 'Travel to Aswan and visit Philae', images: [], place: 'Philae Temple' } },
            ],
          ],
        },
      ],
    },
  ];

  const created = await Trip.insertMany(sampleTrips);
  console.log(`Inserted ${created.length} trips`);

  await mongoose.disconnect();
  console.log('Disconnected. Seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
