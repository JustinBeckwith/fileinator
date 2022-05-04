
import assert from 'assert';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import sizeParser from 'filesize-parser';
import { describe, it } from 'mocha';

import fileinator from '../lib/fileinator.js';

describe('fileinator', function () {
  it('should generate the correctly sized file', function (done) {
    const path = uuid();
    const size = sizeParser('20mb');
    fileinator.writeFile(size, path)
      .on('done', () => {
        fs.stat(path, (err, stats) => {
          if (err) throw err;
          assert.strictEqual(stats.size, size);
          fs.unlink(path, () => {
            done();
          });
        });
      });
  });

  it('should handle noneven chunk sizes', function (done) {
    const size = sizeParser('25mb');
    const path = uuid();
    fileinator.writeFile(size, path)
      .on('done', () => {
        fs.stat(path, (err, stats) => {
          if (err) throw err;
          assert.strictEqual(stats.size, size);
          fs.unlink(path, () => {
            done();
          });
        });
      });
  });

  it('should report progress that adds up to the total', function (done) {
    const size = sizeParser('25mb');
    const path = uuid();
    let bytesWritten = 0;
    fileinator.writeFile(size, path)
      .on('progress', (data) => {
        bytesWritten += data.bytesWritten;
      }).on('done', () => {
        assert.strictEqual(size, bytesWritten);
        fs.unlink(path, () => {
          done();
        });
      });
  });
});
