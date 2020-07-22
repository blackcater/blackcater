// Copyright (c) 2020 blackcater
// [Software Name] is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details.

const _ = require("lodash");
const axios = require("axios");
const { getDate } = require("../utils/util");

class GithubPlugin {
  constructor() {
    this.name = "github";
  }

  async apply(config, { log, render }) {
    const { latest } = _.defaults(_.clone(config), { latest: 5 });

    log.log("[GithubPlugin] checking environment...");

    if (!process.env.GH_TOKEN) {
      throw new Error("Please set GH_TOKEN in secrets page");
    }

    log.log("[GithubPlugin] fetching latest releases...");

    const { data } = await axios.post(
      "https://api.github.com/graphql",
      {
        query: `{
  viewer {
    login
    watching(first: ${latest}, orderBy: {field: PUSHED_AT, direction: DESC}, affiliations: OWNER) {
      nodes {
        releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            url
            tagName
            updatedAt
            name
          }
        }
        name
      }
    }
  }
}
`,
      },
      { headers: { Authorization: `bearer ${process.env.GH_TOKEN}` } }
    );

    log.log(`[GithubPlugin] formatting data...`);

    const { login, watching } = _.get(data, "data.viewer") || {};
    const releases = (_.get(watching, "nodes") || []).filter(
      (x) => _.get(x, "releases.nodes").length
    );

    log.log(`[GithubPlugin] updating README.md content...`);

    const content_prefix = `<!-- github_plugin_start -->

## ⛳️ Project Release

`;
    const content_suffix = `
<!-- github_plugin_end -->`;
    let content = ``;

    releases.forEach((release) => {
      const name = _.get(release, "name");
      const { name: message, url, tagName, updatedAt } = _.get(
        release,
        "releases.nodes[0]"
      );
      const date = new Date(updatedAt);

      content += `- <a href='${url}' target='_blank'>${name}@${tagName}</a> - ${getDate(
        date
      )}
${message ? `  <br/> ${message}\n` : ""}`;
    });

    if (!content) {
      content = `Nothing Released
`;
    }

    render(
      `${this.name}_plugin`,
      `${content_prefix}${content}${content_suffix}`
    );
  }
}

module.exports = GithubPlugin;
