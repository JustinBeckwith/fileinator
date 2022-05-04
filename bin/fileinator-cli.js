#!/usr/bin/env node
'use strict';
import fileinator from '../lib/fileinator.js';
import sizeParser from 'filesize-parser';
import ProgressBar from 'progress';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv)).usage('Usage: $0 <size> <path>')
  .example('$0 make 2mb ./bigfile', 'Create a 2MB file named `bigfile` in the current directory.')
  .command('make <size> <path>', 'Make a big file', {}, function (argv) {
    console.log(`you want me to make a file that named ${argv.path} that's ${argv.size}`);
    const size = sizeParser(argv.size);

    const bar = new ProgressBar('creating [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      total: size
    });

    fileinator.writeFile(size, argv.path)
      .on('progress', (data) => {
        bar.tick(data.bytesWritten);
      }).on('done', () => {
        console.log(`Complete: ${argv.path}`);
      });
  })
  .help('h')
  .alias('h', 'help')
  .parse();
