/**
 * @file Exports timestamping and verification functions for a file using OpenTimestamps.
 */

const OpenTimestamps = require('javascript-opentimestamps');
const fs = require('fs');

/**
 * Creates a timestamp file ending in '.ots' for a given file.
 * @param {string} fileName - A path to the file that will be stamped.
 */
exports.stamp = async (fileName) => {
  const detached = OpenTimestamps.DetachedTimestampFile
    .fromBytes(new OpenTimestamps.Ops.OpSHA256(), fs.readFileSync(`${fileName}`));
  await OpenTimestamps.stamp(detached);
  const fileOts = detached.serializeToBytes();
  fs.writeFileSync(`${fileName}.ots`, fileOts);
  console.log('snapshot stamped');
};

/**
 * Verifies the timestamp (ending in ots) for a given file.
 * @param {string} fileName
 * @returns The epoch for the timestamp, or false if the timestamp could not be verified.
 */
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
