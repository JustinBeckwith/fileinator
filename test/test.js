import assert from 'node:assert';
import { once } from 'node:events';
import { rm, stat } from 'node:fs/promises';
import { describe, it } from 'node:test';
import sizeParser from 'filesize-parser';
import { v4 as uuid } from 'uuid';

import fileinator from '../lib/fileinator.js';

async function writeFileAndStat(size, path) {
  const writer = fileinator.writeFile(size, path);
  await once(writer, 'done');
  return stat(path);
}

describe('fileinator', () => {
  it('should generate the correctly sized file', async (t) => {
    const path = uuid();
    t.after(() => rm(path, { force: true }));
    const size = sizeParser('20mb');
    const stats = await writeFileAndStat(size, path);
    assert.strictEqual(stats.size, size);
  });

  it('should handle noneven chunk sizes', async (t) => {
    const size = sizeParser('25mb');
    const path = uuid();
    t.after(() => rm(path, { force: true }));
    const stats = await writeFileAndStat(size, path);
    assert.strictEqual(stats.size, size);
  });

  it('should report progress that adds up to the total', async (t) => {
    const size = sizeParser('25mb');
    const path = uuid();
    t.after(() => rm(path, { force: true }));
    let bytesWritten = 0;
    const writer = fileinator.writeFile(size, path).on('progress', (data) => {
      bytesWritten += data.bytesWritten;
    });
    await once(writer, 'done');
    assert.strictEqual(size, bytesWritten);
  });
});
