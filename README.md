# fileinator

[![npm version](https://img.shields.io/npm/v/fileinator.svg)](https://www.npmjs.org/package/fileinator)
[![Build Status](https://api.cirrus-ci.com/github/JustinBeckwith/fileinator.svg)](https://cirrus-ci.com/github/JustinBeckwith/fileinator)
[![codecov](https://codecov.io/gh/JustinBeckwith/fileinator/branch/main/graph/badge.svg)](https://codecov.io/gh/JustinBeckwith/fileinator)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Behold my latest inator! Generate files full of random bytes.  Good for tests.

![inator](http://i.imgur.com/Hc9u9wz.jpg)

### Installation

`npm install -g fileinator`

### Usage
You can use the fileinator as a command line tool or as a library.  To use as a command line tool:

`fileinator make 10gb ./bigfile`

To use as a library, first install locally:
`npm install --save fileinator`

and then enjoy...

```js
const fileinator = require('../lib/fileinator');
const sizeParser = require('filesize-parser');

const size = sizeParser("20mb");
const path = "./data.dat";

fileinator.writeFile(size, path)
  .on('progress', (data) => {
    console.log(`${data.bytesWritten} of ${size} written`);
  }).on('done', () => {
    console.log(`Complete: ${path}`);
  });
```

See more in the [examples](examples/).

## License
[MIT License](LICENSE.md)

## Questions?
Feel free to submit an issue on the repository!
