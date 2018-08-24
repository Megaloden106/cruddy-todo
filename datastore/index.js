const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
Promise.promisifyAll(fs);

const getNextUniqueIdAsync = Promise.promisify(counter.getNextUniqueId);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  getNextUniqueIdAsync()
    .then((id) => {
      let filepath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFileAsync(filepath, text)
        .then(() => callback(null, {id, text}));
    });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var data = _.map(files, (file) => {
      let id = path.basename(file, '.txt');
      let filepath = path.join(exports.dataDir, file);
      return fs.readFileAsync(filepath).then((fileData) => {
        return {
          id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then((items) => {
        callback(null, items);
      });
  });
};

exports.readOne = (id, callback) => {
  let filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, (err, fileData) => {
    err ? callback(err, null) : callback(null, {id, text: fileData.toString()});
  });
};

exports.update = (id, text, callback) => {
  let filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(filepath, text, (err) => {
        err ? callback(err, null) : callback(null, {id, text});
      });
    }
  });
};

exports.delete = (id, callback) => {
  let filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(filepath, (err) => {
        err ? callback(err) : callback(null);
      });
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
