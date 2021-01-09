import Module = require('module');

const runFile = () => {
  // tips of run 
  process.once('exit', function(code) {
    if(process.send) {
      process.send({ msg: 'process off'});
    }
  });

  // Create a local module instance based on `cwd`.
  const cwd = process.cwd();
  const scriptPath = process.argv[2];
  const module = new Module(scriptPath);
  module.filename = scriptPath;
  module.paths = (Module as any)._nodeModulePaths(cwd);

  // Prepend `tscn` arguments to CLI for child processes.
  const execPath = process.argv[1];
  process.execArgv.unshift(execPath);
  process.argv = [execPath, scriptPath];

  Module.runMain();
}

runFile();
