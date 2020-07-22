// Copyright (c) 2020 blackcater
// [Software Name] is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.

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
