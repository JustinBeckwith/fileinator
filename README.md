# fileinator

[![npm version](https://img.shields.io/npm/v/fileinator.svg)](https://www.npmjs.org/package/fileinator)
[![codecov](https://codecov.io/gh/JustinBeckwith/fileinator/branch/main/graph/badge.svg)](https://codecov.io/gh/JustinBeckwith/fileinator)
[![code style: biome](https://img.shields.io/badge/code_style-biome-60a5fa?logo=biome)](https://biomejs.dev/)

![fileinator](https://raw.githubusercontent.com/JustinBeckwith/fileinator/main/site/fileinator.webp)

> Behold my latest inator! Generate files full of random bytes.  Good for tests.

![inator](http://i.imgur.com/Hc9u9wz.jpg)

## Installation

`npm install -g fileinator`

## Usage

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
