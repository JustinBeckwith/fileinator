import assert from 'node:assert';
import { once } from 'node:events';
import { stat, unlink } from 'node:fs/promises';
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
  it('should generate the correctly sized file', async () => {
    const path = uuid();
    const size = sizeParser('20mb');
    const stats = await writeFileAndStat(size, path);
    assert.strictEqual(stats.size, size);
    await unlink(path);
  });

  it('should handle noneven chunk sizes', async () => {
    const size = sizeParser('25mb');
    const path = uuid();
    const stats = await writeFileAndStat(size, path);
    assert.strictEqual(stats.size, size);
    await unlink(path);
  });

  it('should report progress that adds up to the total', async () => {
    const size = sizeParser('25mb');
    const path = uuid();
    let bytesWritten = 0;
    const writer = fileinator.writeFile(size, path).on('progress', (data) => {
      bytesWritten += data.bytesWritten;
    });
    await once(writer, 'done');
    assert.strictEqual(size, bytesWritten);
    await unlink(path);
  });
});
