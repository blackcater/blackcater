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
    if (!config) return;

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
    repositories(first: 20, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}, affiliations: [OWNER, ORGANIZATION_MEMBER], isFork: false, isLocked: false) {
      nodes {
        releases(first: 1) {
          nodes {
            url
            tagName
            updatedAt
            name
            isPrerelease
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

    const { login, repositories } = _.get(data, "data.viewer") || {};
    const repos = (_.get(repositories, "nodes") || [])
      .filter((x) => (_.get(x, "releases.nodes") || []).length)
      .slice(0, latest);

    log.log(`[GithubPlugin] updating README.md content...`);

    const content_prefix = `<!-- github_plugin_start -->

## ⛳️ Project Release

`;
    const content_suffix = `
<!-- github_plugin_end -->`;
    let content = ``;

    repos.forEach((repo) => {
      const name = _.get(repo, "name");
      const { name: message, url, tagName, updatedAt, isPrerelease } = _.get(
        repo,
        "releases.nodes[0]"
      );
      const date = new Date(updatedAt);

      content += `- <a href='${url}' target='_blank'>${name}@${tagName}${isPrerelease ? `<sup>pre-release</sup>` : ""}</a> - ${getDate(
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
