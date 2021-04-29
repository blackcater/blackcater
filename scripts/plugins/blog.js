// Copyright (c) 2020 blackcater
// [Software Name] is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.

const _ = require("lodash");
const axios = require("axios");
const { parseString: parseXml } = require("xml2js");
const { getDate } = require("../utils/util");

class BlogPlugin {
  constructor() {
    this.name = "blog";
  }

  async apply(config, { log, render }) {
    if (!config) return;

    const { url, rss_url, latest } = _.defaults(_.clone(config), { latest: 5 });

    log.log("[BlogPlugin] checking configuration...");

    if (!url) {
      throw new Error("Please configure blog.url");
    }

    if (!rss_url) {
      throw new Error("Please configure blog.rss_url");
    }

    log.log(`[BlogPlugin] loading xml content from ${rss_url}...`);

    const { data } = await axios.get(rss_url);

    if (!data) {
      throw new Error(`Cannot load '${rss_url}'`);
    }

    log.log(`[BlogPlugin] parsing xml content...`);

    const result = await new Promise((resolve, reject) => {
      parseXml(data, (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });

    log.log(`[BlogPlugin] updating README.md content...`);

    const items = _.get(result, "rss.channel[0].item");
    const content_prefix = `<!-- blog_plugin_start -->

## ✏️ Recent Blog

`;
    const content_suffix = `
<!-- blog_plugin_end -->`;
    let content = ``;

    items.slice(0, latest).forEach((item) => {
      const title = item.title[0];
      const link = item.link[0];
      const date = item.pubDate[0];

      content += `- <a href='${link}' target='_blank'>${title}</a> - ${getDate(
        date
      )}
`;
    });

    render(
      `${this.name}_plugin`,
      `${content_prefix}${content}${content_suffix}`
    );
  }
}

module.exports = BlogPlugin;
