const PORT = process.env.PORT || 80;
const SNAPSHOT_PATH = process.env.SNAPSHOT_PATH || 'example/';

const fs = require('fs');
const express = require('express');
const ots = require('./ots');

const app = express();
app.use(express.static('public'));

app.get('/snapshotlist', (req, res) => {
  const snapshotList = [];
  const fileArr = fs.readdirSync(SNAPSHOT_PATH);
  for (let n = 0; n < fileArr.length; n += 1) {
    if (fileArr[n].endsWith('.txt')) {
      snapshotList.push({
        fileName: fileArr[n],
      });
    }
  }
  res.status(200).json({ snapshotList });
});

app.get('/snapshot/:filename', (req, res) => {
  const file = fs.readSync(SNAPSHOT_PATH + req.params.filename, 'utf8');
  res.status(200).json(JSON.stringify(file));
});

app.get('/verifysnapshots', async (req, res) => {
  const snapshotList = [];
  const fileArr = fs.readdirSync(SNAPSHOT_PATH);
  for (let n = 0; n < fileArr.length; n += 1) {
    if (fileArr[n].endsWith('.txt')) {
      const snapshot = {
        verificationEpoch: await ots.verify(SNAPSHOT_PATH + fileArr[n]),
        fileName: fileArr[n],
      };
      snapshotList.push(snapshot);
    }
  }
  res.status(200).json({ snapshotList });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`OpenVote listening on port ${PORT}`);
  }
});
