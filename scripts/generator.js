// Copyright (c) 2020 blackcater
// [Software Name] is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.

const fs = require("fs");
const path = require("path");

class Generator {
  constructor(filePath) {
    const dist = path.resolve(__dirname, filePath);

    this.dist = dist;
    this.content = fs.readFileSync(dist, { encoding: "utf-8" });
  }

  render(name, newContent) {
    if (!name) return;

    const reg = new RegExp(
      `<!-- ${name}_start -->([\\s\\S]*?)<!-- ${name}_end -->`,
      "mg"
    );

    this.content = this.content.replace(reg, newContent);
  }

  update() {
    fs.writeFileSync(this.dist, this.content, { encoding: "utf-8" });
  }
}

module.exports = { Generator };
