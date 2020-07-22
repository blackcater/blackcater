const _ = require("lodash");
const path = require("path");

require("dotenv").config({
  path: path.resolve(process.cwd(), ".env.local"),
});

class Config {
  constructor() {
    this.config = require("../config.json");
  }

  getPluginConfig(name) {
    if (!name) {
      throw new Error("Plugin must have a name");
    }

    return _.get(this.config, `plugins.${name}`);
  }
}

module.exports = { Config };
