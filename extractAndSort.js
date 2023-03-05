const { Command } = require("commander");
const cheerio = require("cheerio");
const axios = require("axios");

const poesiskolan = async () => {
  const url = "https://tidningenskriva.se/category/poesiskolan/";

  await axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const articles = [];
      $("div.archive-inner").each((i, el) => {
        const link = $(el).find("a").attr("href");
        const h3Content = $(el).find("h3").text().trim();
        // find a tag within span with id date
        const span = $(el).find("span.date");
        const a = $(span).find("a");
        aContent = $(a).text().trim();
        // split string at space and take first element and third element
        const issue = aContent.split(" ")[1];
        const year = aContent.split(" ")[2];
        articles.push(`${year} ${issue} ${h3Content} -> ${link}`);
      });
      articles.sort();
      let s;
      articles.forEach((a) => {
        s += a + "\n";
      });
      console.log(s);
    })
    .catch((error) => {
      console.log(error);
    });
};

const program = new Command();
program.parse(process.argv);

usecase = program.args[1];

switch (usecase) {
  case "poesiskolan":
    poesiskolan();
    break;
  default:
    console.log("Unknown usecase");
}
