const { fork } = require("child_process");
const chokidar = require("chokidar");
import { resolve } from "path";

export default class Run {
  private scriptPath: string;
  private subprocess: any = null;

  /**
   * run module
   * @param scriptPath
   * @param isWatch
   */
  constructor(scriptPath: string, isWatch: boolean) {
    this.scriptPath = scriptPath;
    const self = this;

    if (isWatch) {
      // manual restart
      console.log("to restart at any time, enter r");
      process.stdin.on("data", (data) => {
        if (data.toString() === "r\n") {
          self.restart();
        }
      });

      // watch files
      this.watch();
    }
  }

  /**
   * node run
   */
  public start = () => {
    const self = this;
    this.subprocess = fork(
      resolve(__dirname, "exec.js"),
      [this.scriptPath],
      [null, null, null, "ipc"]
    );

    // watch subprocess message
    this.subprocess.on("message", function (msg: any) {
      self.subprocess = null;
    });
  };

  /**
   * node restart
   */
  public restart = () => {
    console.log("restart...");
    if (this.subprocess) {
      process.kill(this.subprocess.pid);
    }
    this.start();
  };

  /**
   * watch files
   */
  public watch = () => {
    chokidar.watch("./server/**").on("change", (path: string) => {
      const suffix = path.split(".").pop() || "";
      if (["ts", "js", "mjs"].includes(suffix)) {
        console.log(`${path} was changed`);
        this.debounce(this.restart);
      }
    });
  };

  private timer: any = null;

  private debounce(fn: () => void): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(fn, 1500);
  }
}
