const _ = require("lodash");

class GithubPlugin {
  constructor() {
    this.name = "github";
  }

  async apply(config, { log, render }) {
    const { latest } = _.defaults({ latest: 5 }, _.clone(config));
  }
}

module.exports = GithubPlugin;
