import { EventEmitter } from 'node:events';

declare namespace fileinator {
  export function writeFile(size: number, path: string): EventEmitter;
}

export = fileinator;
