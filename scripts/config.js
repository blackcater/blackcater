// Copyright (c) 2020 blackcater
// [Software Name] is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.

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
