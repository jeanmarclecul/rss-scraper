import { NewsSource } from "../src/models/types";

export const newsSources: NewsSource[] = [
  {
    name: "lemonde",
    url: "https://www.lemonde.fr/actualite-en-continu/",
    selectors: {
      article: ".teaser.teaser--inline-picture",
      title: ".teaser__title",
      summary: ".teaser__desc",
      image: ".teaser__figure--page",
    },
  },
  {
    name: "premiere-series",
    url: "https://www.premiere.fr/Series/News-Series",
    selectors: {
      article: ".col-sm-6",
      title: ".thumbnail-heading",
      summary: ".thumbnail-heading",
      image: ".thumbnail",
    },
  },
  {
    name: "ecranlarge-series",
    url: "https://www.ecranlarge.com/series",
    selectors: {
      article: ".relative.mb-3",
      title: ".relative.font-bold.js-shaved",
      summary: ".relative.font-bold.js-shaved",
      image: ".rounded.overflow-hidden",
    },
  },
  {
    name: "ecranlarge-films",
    url: "https://www.ecranlarge.com/films",
    selectors: {
      article: ".relative.mb-3",
      title: ".relative.font-bold.js-shaved",
      summary: ".relative.font-bold.js-shaved",
      image: ".rounded.overflow-hidden",
    },
  },
  {
    name: "gameblog",
    url: "https://www.gameblog.fr/",
    selectors: {
      article: ".item.full.gameblog",
      title: ".item-content-header .title",
      summary: ".description.gameblog",
      image: ".thumbnail-unit.gameblog",
    },
  },
];
