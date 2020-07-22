const fs = require("fs");
const path = require("path");

class Generator {
  constructor(filePath) {
    const dist = path.resolve(__dirname, filePath);

    this.content = fs.readFileSync(dist);
  }

  render() {}
}

module.exports = { Generator };
