'use strict';

const fs = require('fs');
const crypto = require('crypto');
const events = require('events');
const util = require('util');

const chunkSize = 20971520;

function Fileinator () {
  events.EventEmitter.call(this);
}
util.inherits(Fileinator, events.EventEmitter);

Fileinator.prototype.writeChunk = function (stream, bytesRemaining, callback) {
  const self = this;
  const currentChunkSize = (bytesRemaining >= chunkSize) ? chunkSize : bytesRemaining;
  crypto.randomBytes(currentChunkSize, (err, buffer) => {
    if (err) throw err;
    stream.write(buffer, (err) => {
      if (err) return callback(err);
      const br = bytesRemaining - buffer.length;
      self.emit('progress', {
        bytesRemaining: bytesRemaining,
        bytesWritten: buffer.length
      });
      if (br > 0) {
        callback.call(self, stream, br, self.writeChunk);
      } else {
        self.emit('done');
      }
    });
  });
};

Fileinator.prototype.writeFile = function (size, path) {
  const stream = fs.createWriteStream(path);
  this.writeChunk(stream, size, this.writeChunk);
  return this;
};

// create a new fileinator instance with each use
const api = {
  writeFile: (size, path) => {
    const f = new Fileinator();
    return f.writeFile(size, path);
  }
};

module.exports = api;
