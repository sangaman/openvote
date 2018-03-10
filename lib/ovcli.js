const fs = require('fs');
const ots = require('./ots');
const MongoClient = require('mongodb').MongoClient;


const DB_NAME = process.env.DB_NAME || 'openvote';
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017';

let db;

/**
 * Adds voters to the database and creates a snapshot and timestamp of the voters collection.
 * @param {number} count - The number of voters to register.
 * @param {string} path - The path to save the snapshot file of the voters collection.
 */
async function register(count, path) {
  // start with a fresh database
  try {
    await db.collection('voters').remove();
  } catch (err) {
    console.error(err);
  }
  const voters = [];
  for (let n = 0; n < count; n += 1) {
    // generate a random alphanumeric 8 character voter id
    const voter = {
      _id: Math.random().toString(36).substring(2, 10),
    };
    console.log(voter._id.length);
    await db.collection('voters').insertOne(voter);
    voters.push(voter._id);
  }
  fs.writeFileSync(path, JSON.stringify(voters));
  try {
    await ots.stamp(path);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Submits votes and creates a snapshot and timestamp of the votes collection.
 * @param {number} count - The number of votes to randomly simulate.
 * @param {string} path - The path to save the snapshot file of the votes collection.
 */
async function vote(count, path) {
  // make random votes and take a snapshot
  const voters = await db.collection('voters').find({ voted: { $exists: false } }).toArray();
  if (voters.length === 0) {
    console.log('no more voters left to vote');
  } else {
    for (let n = 0; n < count && n < voters.length; n += 1) {
      const voteObj = {
        vote: Math.random() >= 0.5 ? 'Dewey' : 'Truman',
        voterId: voters[n]._id,
        date: new Date().toJSON(),
      };

      await db.collection('votes').insertOne(voteObj);
      await db.collection('voters').updateOne({ _id: voters[n]._id }, { $set: { voted: true } });
    }
    if (voters.length <= 2) {
      console.log('all remaining voters have voted');
    }
    const votes = await db.collection('votes').find().toArray();
    fs.writeFileSync(path, JSON.stringify(votes));
    try {
      await ots.stamp(path);
    } catch (err) {
      console.error(err);
    }
  }
}

MongoClient.connect(DB_URL).then(async (connection) => {
  db = connection.db(DB_NAME);
  if (process.argv[2] === 'register') {
    const count = process.argv[3] || 10;
    const path = process.argv[4] || 'example/voters.txt';
    await register(count, path);
  } else if (process.argv[2] === 'vote') {
    const count = process.argv[3] || 2;
    let path = process.argv[4] || `example/snapshot${new Date().toJSON()}.txt`;
    path = path.replace(/:/g, '');
    await vote(count, path);
  } else {
    console.error('unrecognized command');
  }
  connection.close();
});
