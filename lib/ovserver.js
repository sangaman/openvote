const PORT = process.env.PORT || 80;
const SNAPSHOT_PATH = process.env.SNAPSHOT_PATH || 'example/';

const fs = require('fs');
const express = require('express');
const hashJs = require('hash.js');
const ots = require('./ots');

const app = express();
app.use(express.static('public'));

/**
 * @param {boolean} verify - Whether the list of timestamps should include timestamp verification
 * information.
 * @returns An array of snapshot objects with file and timestamp information.
 */
async function listSnapshots(verify) {
  const snapshotList = [];
  const promisesList = [];
  const fileArr = fs.readdirSync(SNAPSHOT_PATH);
  for (let n = 0; n < fileArr.length; n += 1) {
    if (fileArr[n].endsWith('.txt')) {
      const filename = fileArr[n];
      const data = fs.readFileSync(SNAPSHOT_PATH + filename, 'utf8');
      const hash = hashJs.sha256().update(data).digest('hex');
      const snapshot = {
        filename,
        data,
        hash,
      };
      if (verify) {
        promisesList.push(ots.verify(SNAPSHOT_PATH + fileArr[n]));
      }
      snapshotList.push(snapshot);
    }
  }
  if (verify) {
    const verificationEpochs = await Promise.all(promisesList);
    for (let n = 0; n < verificationEpochs.length; n += 1) {
      snapshotList[n].verificationEpoch = verificationEpochs[n];
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
