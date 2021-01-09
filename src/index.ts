#!/usr/bin/env node

import { resolve } from 'path';
import arg = require('arg');
import Run from './run';

const main = (argv: string[] = process.argv.slice(2)) => {
  // Get parameters
  const args = {
    ...arg({
      '--help': Boolean,
      '--version': Boolean,
      '--watch': Boolean,
      // Aliases.
      '-h': '--help',
      '-v': '--version',
      '-w': '--watch'
    }, {
      argv,
    })
  }
  const {
    '--help': help = false,
    '--version': version = false,
    '--watch': watch = false
  } = args;

  printHelp(help);
  printVersion(version);

  const cwd = process.cwd();
  const scriptPath = args._.length ? resolve(cwd, args._[0]) : undefined;
  if (scriptPath){
    const run = new Run(scriptPath, watch);
    run.start();
  } else {
    printHelp(true);
  }
}

/**
 * Output help tips
 * @param help
 */
const printHelp = (help: boolean) => {
  if (help) {
    console.log(
      `
      Usage: tscn  options | script.ts [ -w ]

      Options:

      -h, --help          Print CLI usage
      -v, --version       Print module version information
      `
    );
    process.exit(0);
  }
}

/**
 * Output project information
 * @param version 
 */
const printVersion = (version: boolean) => {
  if (version) {
    console.log(`v${require('../package.json').version}`)
    process.exit(0)
  }
} 

main();
