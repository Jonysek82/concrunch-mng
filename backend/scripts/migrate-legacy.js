require('dotenv').config();
const mongoose = require('mongoose');

const sourceUri = process.env.LEGACY_MONGODB_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/concrunch_manager';
const identityUri = process.env.IDENTITY_MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_identity';
const festivalUri = process.env.FESTIVAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_festival';
const collections = {
  identity: ['users'],
  festival: ['events', 'performers', 'merchants', 'news', 'tags']
};

const copyCollection = async (source, destination, name) => {
  const documents = await source.collection(name).find({}).toArray();
  if (documents.length === 0) {
    console.log(`${name}: no legacy records`);
    return;
  }

  const operations = documents.map((document) => ({
    updateOne: {
      filter: { _id: document._id },
      update: { $setOnInsert: document },
      upsert: true
    }
  }));
  const result = await destination.collection(name).bulkWrite(operations, { ordered: false });
  console.log(`${name}: ${result.upsertedCount} records copied; existing records left unchanged`);
};

const migrate = async () => {
  const source = await mongoose.createConnection(sourceUri).asPromise();
  let identity;
  let festival;

  try {
    identity = await mongoose.createConnection(identityUri).asPromise();
    festival = await mongoose.createConnection(festivalUri).asPromise();
    if (identity.name === festival.name) {
      throw new Error('Identity and festival services must use separate MongoDB databases');
    }

    for (const name of collections.identity) {
      await copyCollection(source.db, identity.db, name);
    }
    for (const name of collections.festival) {
      await copyCollection(source.db, festival.db, name);
    }
  } finally {
    await Promise.all([
      source.close(),
      identity ? identity.close() : Promise.resolve(),
      festival ? festival.close() : Promise.resolve()
    ]);
  }
};

migrate().catch((err) => {
  console.error('Legacy database migration failed:', err);
  process.exitCode = 1;
});
