require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Tag = require('./src/models/Tag');
const Performer = require('./src/models/Performer');
const Merchant = require('./src/models/Merchant');
const Event = require('./src/models/Event');
const News = require('./src/models/News');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_manager';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

async function ensureUser(username, password, role) {
  const passwordHash = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate(
    { username },
    { username, passwordHash, role, active: true },
    { upsert: true, new: true }
  );
}

async function ensureTag(name, color, type = 'general') {
  const slug = slugify(name);
  return Tag.findOneAndUpdate(
    { slug },
    { name, slug, color, type },
    { upsert: true, new: true }
  );
}

async function ensurePerformer(payload) {
  const match = { name: payload.name };
  return Performer.findOneAndUpdate(match, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
}

async function ensureMerchant(payload) {
  const match = { name: payload.name };
  return Merchant.findOneAndUpdate(match, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
}

async function ensureEvent(payload) {
  return Event.findOneAndUpdate(
    { title: payload.title, day: payload.day },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function ensureNews(payload) {
  return News.findOneAndUpdate(
    { title: payload.title },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await mongoose.connect(uri);
  console.log('Connected to DB for seeding');

  const adminUsername = process.env.SEED_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_this_password';
  const organizerUsername = process.env.SEED_ORGANIZER_USERNAME || 'organizer';
  const organizerPassword = process.env.SEED_ORGANIZER_PASSWORD || 'change_this_password';

  const adminUser = await ensureUser(adminUsername, adminPassword, 'admin');
  const organizerUser = await ensureUser(organizerUsername, organizerPassword, 'organizer');

  const tagDefs = [
    { name: 'Gaming', color: '#ef4444', type: 'event' },
    { name: 'Cosplay', color: '#f59e0b', type: 'event' },
    { name: 'Fantasy', color: '#a855f7', type: 'general' },
    { name: 'Sci-Fi', color: '#3b82f6', type: 'general' },
    { name: 'Workshop', color: '#14b8a6', type: 'event' },
    { name: 'Deskové hry', color: '#22c55e', type: 'event' },
    { name: 'Umělec', color: '#f97316', type: 'performer' },
    { name: 'Prodejce', color: '#8b5cf6', type: 'merchant' }
  ];

  const tagMap = {};
  for (const def of tagDefs) {
    const tag = await ensureTag(def.name, def.color, def.type);
    tagMap[def.name] = tag._id;
  }

  const performerA = await ensurePerformer({
    name: 'Aster Kova',
    bio: 'Hrdinský průvodce fantasy světem s láskou k improvizaci a interaktivním show.',
    imageUrl: '',
    published: true,
    tagIds: [tagMap['Fantasy'], tagMap['Cosplay']]
  });

  const performerB = await ensurePerformer({
    name: 'Nova Circuit',
    bio: 'Elektronický performer, který spojuje hudbu, videoprojekce a futuristickou scénografii.',
    imageUrl: '',
    published: true,
    tagIds: [tagMap['Sci-Fi'], tagMap['Gaming']]
  });

  const performerC = await ensurePerformer({
    name: 'Kryštof Hruška',
    bio: 'Lektor deskových her s pravidelným výukovým programem pro nové i zkušené hráče.',
    imageUrl: '',
    published: true,
    tagIds: [tagMap['Deskové hry'], tagMap['Workshop']]
  });

  const merchantA = await ensureMerchant({
    name: 'Arcane Goods',
    description: 'Měkké a technické suvenýry inspirované fantastickými světy a fandomem.',
    website: 'https://example.com',
    imageUrl: '',
    published: true,
    tagIds: [tagMap['Fantasy'], tagMap['Prodejce']]
  });

  const merchantB = await ensureMerchant({
    name: 'Pixel & Paper',
    description: 'Knihy, plakáty a deskové hry s moderním grafickým stylem.',
    website: 'https://example.com',
    imageUrl: '',
    published: true,
    tagIds: [tagMap['Gaming'], tagMap['Deskové hry']]
  });

  const festivalDays = ['2026-10-15', '2026-10-16'];
  const events = [
    { title: 'Rytířská bitva v podsvětí', day: festivalDays[0], startTime: '10:00', endTime: '11:00', location: 'Hala A', status: 'published', tagIds: [tagMap['Fantasy'], tagMap['Cosplay']], performerIds: [performerA._id], description: 'Přivítejte fantasy show s interaktivním dobrodružstvím a kostýmovou výpravou.' },
    { title: 'Týdenní turnaj v aréně', day: festivalDays[0], startTime: '13:00', endTime: '14:30', location: 'Hala B', status: 'published', tagIds: [tagMap['Gaming'], tagMap['Sci-Fi']], performerIds: [performerB._id], description: 'Turnaj a závěrečná show ve stylu futuristické arény.' },
    { title: 'Workshop: Rychlý start do deskových her', day: festivalDays[1], startTime: '11:00', endTime: '12:30', location: 'Workshop Studio', status: 'published', tagIds: [tagMap['Workshop'], tagMap['Deskové hry']], performerIds: [performerC._id], description: 'Praktický workshop pro hráče i začátečníky v příznivém prostředí.' },
    { title: 'Speciální cosplay walk', day: festivalDays[1], startTime: '18:00', endTime: '19:00', location: 'Náměstí před hlavní halou', status: 'cancelled', tagIds: [tagMap['Cosplay']], performerIds: [performerA._id], description: 'Vystoupení a pomalý průchod s kostýmy v rámci večerního programu.', cancellationReason: 'Silný déšť a technické omezení' }
  ];

  for (const event of events) {
    await ensureEvent({ ...event, createdBy: adminUser._id, updatedBy: adminUser._id });
  }

  await ensureNews({
    title: 'Festival otevírá nové herní zóny',
    content: 'Na festivalu se letos rozšiřuje gaming zóna o interaktivní stánky a večerní turnaje. Všichni návštěvníci se mohou těšit na nová setkání a workshopy.',
    status: 'published',
    publishedAt: new Date(),
    authorId: organizerUser._id
  });

  await ensureNews({
    title: 'Připravujeme doplňkový program pro děti',
    content: 'Přidáváme nový program navržený pro děti a rodiny, včetně jednodušších workshopů, představení a relaxačních koutek.',
    status: 'draft',
    publishedAt: null,
    authorId: organizerUser._id
  });

  console.log('Seeding finished');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
