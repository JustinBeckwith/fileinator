import assert from 'node:assert';
import fs from 'node:fs';
import sizeParser from 'filesize-parser';
import { describe, it } from 'mocha';
import { v4 as uuid } from 'uuid';

import fileinator from '../lib/fileinator.js';

describe('fileinator', () => {
  it('should generate the correctly sized file', (done) => {
    const path = uuid();
    const size = sizeParser('20mb');
    fileinator.writeFile(size, path).on('done', () => {
      fs.stat(path, (err, stats) => {
        if (err) throw err;
        assert.strictEqual(stats.size, size);
        fs.unlink(path, () => {
          done();
        });
      });
    });
  });

  it('should handle noneven chunk sizes', (done) => {
    const size = sizeParser('25mb');
    const path = uuid();
    fileinator.writeFile(size, path).on('done', () => {
      fs.stat(path, (err, stats) => {
        if (err) throw err;
        assert.strictEqual(stats.size, size);
        fs.unlink(path, () => {
          done();
        });
      });
    });
  });

  it('should report progress that adds up to the total', (done) => {
    const size = sizeParser('25mb');
    const path = uuid();
    let bytesWritten = 0;
    fileinator
      .writeFile(size, path)
      .on('progress', (data) => {
        bytesWritten += data.bytesWritten;
      })
      .on('done', () => {
        assert.strictEqual(size, bytesWritten);
        fs.unlink(path, () => {
          done();
        });
      });
  });
});
