const _ = require("lodash");

class BadgePlugin {
  constructor() {
    this.name = "badge";
  }

  async apply(config, { log, render }) {
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

      content += `![${link}](${image})
`;
    });

    render(
      `${this.name}_plugin`,
      `${content_prefix}${content}${content_suffix}`
    );
  }
}

module.exports = BadgePlugin;
