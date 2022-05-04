'use strict';

import fs from 'fs';
import crypto from 'crypto';
import events from 'events';

const chunkSize = 20971520;

class Fileinator extends events.EventEmitter {
  writeChunk (stream, bytesRemaining, callback) {
    const currentChunkSize = (bytesRemaining >= chunkSize) ? chunkSize : bytesRemaining;
    crypto.randomBytes(currentChunkSize, (err, buffer) => {
      if (err) throw err;
      stream.write(buffer, (err) => {
        if (err) return callback(err);
        const br = bytesRemaining - buffer.length;
        this.emit('progress', {
          bytesRemaining: bytesRemaining,
          bytesWritten: buffer.length
        });
        if (br > 0) {
          callback.call(this, stream, br, this.writeChunk);
        } else {
          this.emit('done');
        }
      });
    });
  }

  writeFile (size, path) {
    const stream = fs.createWriteStream(path);
    this.writeChunk(stream, size, this.writeChunk);
    return this;
  }
}

const api = {
  writeFile: function (size, path) {
    const f = new Fileinator();
    return f.writeFile(size, path);
  }
};

// create a new fileinator instance with each use
export default api;
