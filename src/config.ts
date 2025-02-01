import { NewsSource } from "./types";

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
    name: "premiereseries",
    url: "https://www.premiere.fr/Series/News-Series",
    selectors: {
      article: ".col-sm-6",
      title: ".thumbnail-heading",
      summary: ".thumbnail-heading",
      image: ".thumbnail-header",
    },
  },
  // Ajoutez d'autres sources ici avec leurs sélecteurs spécifiques
];

//document.querySelectorAll('.teaser.teaser--inline-picture').forEach(function (e) {console.log(e.querySelectorAll('.teaser__title')[0].innerText)})
