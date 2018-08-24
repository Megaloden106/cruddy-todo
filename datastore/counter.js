const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

const Promise = require('bluebird');
Promise.promisifyAll(fs);

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => (
  fs.readFileAsync(exports.counterFile)
    .then(fileData => callback(null, Number(fileData)))
);

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFileAsync(exports.counterFile, counterString)
    .then(() => callback(null, counterString));
};

// Public API - Fix this function //////////////////////////////////////////////

var readCounterAsync = Promise.promisify(readCounter);
var writeCounterAsync = Promise.promisify(writeCounter);

exports.getNextUniqueId = (cb) => (
  readCounterAsync()
    .then((counter) => writeCounterAsync(counter + 1))
    .then((uniqueId) => cb(null, uniqueId))
);

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
