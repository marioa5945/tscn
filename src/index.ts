#!/usr/bin/env node

import { resolve } from 'path'
import arg = require('arg')

import Module = require('module')

export function main(argv: string[] = process.argv.slice(2)){
  // Get parameters
  const args = {
    ...arg({
      '--help': Boolean,
      '--version': Boolean,
      // Aliases.
      '-h': '--help',
      '-v': '--version',
    }, {
      argv,
    })
  }
  const {
    '--help': help = false,
    '--version': version = false,
  } = args;

  printHelp(help);

  printVersion(version);

  const cwd = process.cwd();
  const scriptPath = args._.length ? resolve(cwd, args._[0]) : undefined;

  if (scriptPath){
    // Create a local module instance based on `cwd`.
    const module = new Module(scriptPath)
    module.filename = scriptPath
    module.paths = (Module as any)._nodeModulePaths(cwd)

    // Prepend `ts-node` arguments to CLI for child processes.
    process.execArgv.unshift(__filename, ...process.argv.slice(2, process.argv.length - args._.length))
    process.argv = [process.argv[1]].concat(scriptPath || []).concat(args._.slice(1))
      
    Module.runMain()
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
      Usage: tscn [ options | script.ts ]

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
