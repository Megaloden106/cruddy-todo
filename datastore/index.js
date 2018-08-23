const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
      err ? callback(err, null) : callback(null, {id: id, text: text});
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, fileData) => {
    err ? callback(err, null) : callback(null, {id: id, text: String(fileData)});
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var data = [];
    _.each(files, (file) => {
      data.push({
        id: file.replace('.txt', ''),
        text: file.replace('.txt', '')
      });
    });
    callback(null, data);
  })
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        err ? callback(err, null) : callback(null, {id: id, text: text});
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        err ? callback(err, null) : callback(null, null);
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
