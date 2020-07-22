const fs = require("fs");
const _ = require("lodash");
const axios = require("axios");
const { parseString: parseXml } = require("xml2js");

class BlogPlugin {
  constructor() {
    this.name = "blog";
  }

  async apply(config, { log, render }) {
    const { rss_url, latest } = _.defaults({ latest: 5 }, _.clone(config));

    log.log("[BlogPlugin] checking environment of...");

    if (!rss_url) {
      throw new Error("Please configure blog.rss_url");
    }

    log.log(`[BlogPlugin] loading xml content from ${rss_url}...`);

    // const data = fs.readFileSync("./rss.xml") || (await axios.get(rss_url));

    // if (!data) {
    //   throw new Error(`Cannot load '${rss_url}'`);
    // }

    // const result = await new Promise((resolve, reject) => {
    //   parseXml(data, (err, result) => {
    //     if (err) {
    //       return reject(err);
    //     }

    //     console.log(result);

    //     resolve(result);
    //   });
    // });

    // log.log(_.get(result, "rss.channel[0].item"));
  }
}

module.exports = BlogPlugin;
