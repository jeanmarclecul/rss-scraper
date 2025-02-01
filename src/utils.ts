import * as Cheerio from "cheerio";

export function getHtml(html: any, query: string, type: string): any {
  var $ = Cheerio.load(html);
  //console.log($(query).first());
  if (type == "alt") return $(query).first().attr("alt");
  if (type == "title") return $(query).first().attr("title");
  if (type == "src") {
    if ($(query).first().attr("data-src") == undefined) {
      return $(query).first().attr("src");
    } else {
      return $(query).first().attr("data-src");
    }
  }
  if (type == "txt") return $(query).first().text();
  if (type == "url") return $("a").first().attr("href");
  if (type == "html") {
    return $(query).first().html();
  } else {
    const htmlList: string[] = [];
    const htmlElements = $(query);
    htmlElements.each((i, element) => {
      htmlList.push($(element).html() || "");
    });
    return htmlList;
  }
}
