const _ = require("lodash");
const axios = require("axios");
const { getDate } = require("../utils/util");

class GithubPlugin {
  constructor() {
    this.name = "github";
  }

  async apply(config, { log, render }) {
    const { latest } = _.defaults({ latest: 5 }, _.clone(config));

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
    watching(first: ${latest}, orderBy: {field: PUSHED_AT, direction: DESC}) {
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

## ⛳️ <a href="https://github.com/${login}" target="_blank">Project Release</a>

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
${message ? `  > ${message}\n` : ""}`;
    });

    render(
      `${this.name}_plugin`,
      `${content_prefix}${content}${content_suffix}`
    );
  }
}

module.exports = GithubPlugin;
