import Module = require("module");
import * as ts from "typescript";

/**
 * exec specified file
 */
const runFile = () => {
  // tips of run
  process.once("exit", function () {
    if (process.send) {
      process.send({ msg: "process off" });
    }
  });

  // Create a local module instance based on `cwd`.
  const cwd = process.cwd();
  const scriptPath = process.argv[2];
  register();
  const module = new Module(scriptPath);
  module.filename = scriptPath;
  module.paths = (Module as any)._nodeModulePaths(cwd);

  // Prepend `tscn` arguments to CLI for child processes.
  const execPath = process.argv[1];
  process.execArgv.unshift(execPath);
  process.argv = [execPath, scriptPath];

  Module.runMain();
};

/**
 * Register TypeScript compiler instance onto node.js
 */
function register() {
  const jsCompile = require.extensions[".js"]; // tslint:disable-line
  require.extensions[".ts"] = function (m: any, filename) {
    const _compile = m._compile;
    m._compile = function (code: string, fileName: string) {
      let { outputText } = ts.transpileModule(code, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      });
      return _compile.call(this, outputText, fileName);
    };
    return jsCompile(m, filename);
  };
}

runFile();
