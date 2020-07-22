const signale = require("signale");
const { Runner } = require("./runner");
const { Generator } = require("./generator");
const { Config } = require("./config");

async function start() {
  const config = new Config();
  const generator = new Generator("../README.md");
  const runner = new Runner(generator, config);

  try {
    // Load plugins
    await runner.loadPlugin("./plugins");
    // Run scripts
    await runner.run();
  } catch (err) {
    signale.error(err);
  }
}

start();
