/**
 * This is a simple example of using filinator
 * as a library.
 */

const fileinator = require('../lib/fileinator');
const sizeParser = require('filesize-parser');

const size = sizeParser('20mb');
const path = './data.dat';

fileinator
  .writeFile(size, path)
  .on('progress', (data) => {
    console.log(`${data.bytesWritten} of ${size} written`);
  })
  .on('done', () => {
    console.log(`Complete: ${path}`);
  });
