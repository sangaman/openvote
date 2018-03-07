const PORT = process.env.PORT || 80;
const SNAPSHOT_PATH = process.env.SNAPSHOT_PATH || 'example/';

const fs = require('fs');
const express = require('express');
const ots = require('./ots');

const app = express();
app.use(express.static('public'));

async function listSnapshots(verify) {
  const snapshotList = [];
  const fileArr = fs.readdirSync(SNAPSHOT_PATH);
  for (let n = 0; n < fileArr.length; n += 1) {
    if (fileArr[n].endsWith('.txt')) {
      const filename = fileArr[n];
      const data = fs.readFileSync(SNAPSHOT_PATH + filename, 'utf8');
      const snapshot = {
        filename,
        data,
      };
      if (verify) {
        snapshot.verificationEpoch = await ots.verify(SNAPSHOT_PATH + fileArr[n]);
      }
      snapshotList.push(snapshot);
    }
  }

  return snapshotList;
}

app.get('/snapshotlist', async (req, res) => {
  res.status(200).json(await listSnapshots());
});

app.get('/snapshot/:filename', (req, res) => {
  const file = fs.readFileSync(SNAPSHOT_PATH + req.params.filename, 'utf8');
  res.status(200).json(JSON.parse(file));
});

app.get('/verifysnapshots', async (req, res) => {
  res.status(200).json(await listSnapshots(true));
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`OpenVote listening on port ${PORT}`);
  }
});
