// Copyright (c) 2020 blackcater
// [Software Name] is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.

const _ = require("lodash");

class BadgePlugin {
  constructor() {
    this.name = "badge";
  }

  async apply(config, { log, render }) {
    if (!config) return;

    const { badges } = _.defaults(_.clone(config), { badges: [] });

    log.log(`[BadgePlugin] updating README.md content...`);

    const content_prefix = `<!-- badge_plugin_start -->

---

`;
    const content_suffix = `
<!-- badge_plugin_end -->`;
    let content = ``;

    (badges || []).forEach((badge) => {
      const { image, link } = badge;

      content += `<a href="${link}" alt="${link}"><img src="${image}"></a>
`;
    });

    render(
      `${this.name}_plugin`,
      `${content_prefix}${content}${content_suffix}`
    );
  }
}

module.exports = BadgePlugin;
