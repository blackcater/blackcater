const fs = require("fs");
const path = require("path");

class Generator {
  constructor(filePath) {
    const dist = path.resolve(__dirname, filePath);

    this.content = fs.readFileSync(dist, { encoding: "utf-8" });
  }

  render(name, newContent) {
    const reg = new RegExp(
      `<!-- ${name}_start -->([\\s\\S]*?)<!-- ${name}_end -->`,
      "mg"
    );

    this.content = this.content.replace(reg, newContent);
  }
}

module.exports = { Generator };
