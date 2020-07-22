const fs = require("fs");
const path = require("path");
const signale = require("signale");
const _ = require("lodash");

class Runner {
  constructor(generator, config) {
    this.plugins = [];
    this.generator = generator;
    this.config = config;
  }

  loadPlugin(rawPath) {
    const dist = path.resolve(__dirname, rawPath);
    let pluginPaths = [];

    if (fs.statSync(dist).isDirectory()) {
      const subPaths = fs.readdirSync(dist);

      subPaths.forEach((subPath) => {
        const pluginPath = path.resolve(dist, subPath);

        if (fs.statSync(pluginPath).isFile() && !/^\./.test(pluginPath)) {
          pluginPaths.push(pluginPath);
        }
      });
    } else {
      pluginPaths = [dist];
    }

    this.plugins = _.uniqWith(
      [
        ...this.plugins,
        ...pluginPaths.map((pluginPath) => {
          const Constr = require(pluginPath);

          return new Constr();
        }),
      ],
      (x, y) => x.name === y.name
    );
  }

  async run() {
    const api = {
      log: signale,
      render: this.generator.render,
    };

    for await (const plugin of this.plugins) {
      await plugin.apply(this.config.getPluginConfig(plugin.name), api);
    }
  }
}

module.exports = { Runner };
