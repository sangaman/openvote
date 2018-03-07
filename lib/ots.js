const OpenTimestamps = require('javascript-opentimestamps');
const fs = require('fs');

exports.stamp = async (fileName) => {
  const detached = OpenTimestamps.DetachedTimestampFile
    .fromBytes(new OpenTimestamps.Ops.OpSHA256(), fs.readFileSync(`${fileName}`));
  await OpenTimestamps.stamp(detached);
  const fileOts = detached.serializeToBytes();
  fs.writeFileSync(`${fileName}.ots`, fileOts);
  console.log('snapshot stamped');
};

exports.verify = async (fileName) => {
  try {
    const detached = OpenTimestamps.DetachedTimestampFile
      .fromBytes(new OpenTimestamps.Ops.OpSHA256(), fs.readFileSync(`${fileName}`));
    const detachedOts = OpenTimestamps.DetachedTimestampFile.deserialize(fs.readFileSync(`${fileName}.ots`));
    const verifyResult = await OpenTimestamps.verify(detachedOts, detached);
    if (verifyResult) {
      return verifyResult;
    }
    console.error('result not verified!');
  } catch (err) {
    console.error(err);
  }
  return false;
};
