// Copyright (c) 2020 blackcater
// [Software Name] is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.

const _ = require("lodash");
const { WakaTimeClient, RANGE } = require("wakatime-client");

class WakatimePlugin {
  constructor() {
    this.name = "wakatime";
  }

  async apply(config, { log, render }) {
    if (!config) return;

    const { latest } = _.defaults(_.clone(config), { latest: 5 });

    log.log("[WakatimePlugin] checking environment...");

    if (!process.env.WAKATIME_TOKEN) {
      throw new Error("Please set WAKATIME_TOKEN in secrets page");
    }

    log.log("[WakatimePlugin] fetching summary information...");

    const wakatime = new WakaTimeClient(process.env.WAKATIME_TOKEN);
    const stats = await wakatime.getMyStats({ range: RANGE.LAST_7_DAYS });

    log.log(`[WakatimePlugin] updating README.md content...`);

    const content_prefix = `<!-- wakatime_plugin_start -->

## 🌗 Weekly Development Breakdown

`;
    const content_suffix = `
<!-- wakatime_plugin_end -->`;
    let content = await this.genContent(stats, latest);

    if (content) {
      content = `\`\`\`text
${content}
\`\`\`
`;
    }

    render(
      `${this.name}_plugin`,
      `${content_prefix}${content}${content_suffix}`
    );
  }

  // copied from https://github.com/matchai/waka-box/blob/master/index.js
  async genContent(stats, max) {
    const lines = [];

    for (let i = 0; i < Math.min(stats.data.languages.length, max); i++) {
      const data = stats.data.languages[i];
      const { name, percent, text: time } = data;

      const line = [
        name.padEnd(11),
        time.padEnd(14),
        this.generateBarChart(percent, 21),
        String(percent.toFixed(1)).padStart(5) + "%",
      ];

      lines.push(line.join(" "));
    }

    if (lines.length === 0) return "";

    return lines.join("\n");
  }

  generateBarChart(percent, size) {
    const syms = "░▏▎▍▌▋▊▉█";

    const frac = Math.floor((size * 8 * percent) / 100);
    const barsFull = Math.floor(frac / 8);
    if (barsFull >= size) {
      return syms.substring(8, 9).repeat(size);
    }
    const semi = frac % 8;

    return [
      syms.substring(8, 9).repeat(barsFull),
      syms.substring(semi, semi + 1),
    ]
      .join("")
      .padEnd(size, syms.substring(0, 1));
  }
}

module.exports = WakatimePlugin;
