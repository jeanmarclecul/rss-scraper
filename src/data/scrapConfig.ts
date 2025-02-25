import { NewsSource } from "../models/types";

export const newsSources: NewsSource[] = [
  {
    name: "lemonde",
    url: "https://www.lemonde.fr/actualite-en-continu/",
    img: "https://www.lemonde.fr/thumbnail/journal/20250207/276/201?5796263",
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
    img: "https://www.premiere.fr/themes/custom/prem_thm/assets/images/logo.png",
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
    img: "https://www.ecranlarge.com/content/themes/ecran-large/assets/img/logo.svg",
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
    img: "https://www.ecranlarge.com/content/themes/ecran-large/assets/img/logo.svg",
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
    img: "https://assets-prod.gameblog.fr/assets/images/logo-gameblog-white.png?ver=a29b1cc92d1e8a949c61f62400ce49e2",
    selectors: {
      article: ".item.full.gameblog",
      title: ".item-content-header .title",
      summary: ".description.gameblog",
      image: ".thumbnail-unit.gameblog",
    },
  },
  {
    name: "fantabobgames",
    url: "https://www.youtube.com/@fantabobgames/videos/",
    img: "https://yt3.googleusercontent.com/DocgMJ9Ahj1iU9Z4HQEY7tKhxWt1cmRVBBMmCzp3cB1_mR_dobz45R3hQFVarQ7Ig6jbIfwXng=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    selectors: {
      article: "",
      title: "",
      summary: "",
      image: "",
    },
  },
  {
    name: "joueurdugrenier",
    url: "https://www.youtube.com/@joueurdugrenier/videos/",
    img: "https://yt3.googleusercontent.com/LHQ0TwB9lMJzyxC88DsSTKZxEgORRJdds2exi8HjwOD3iP_naSEEXY67GSymVJKlGeVwwoz3=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    selectors: {
      article: "",
      title: "",
      summary: "",
      image: "",
    },
  },
  {
    name: "benzaieTV",
    url: "https://www.youtube.com/@benzaieTV/videos/",
    img: "https://yt3.googleusercontent.com/a1TU8u3OC7gOWZX1X2s_stBjsLXUNEjTkhrq_QVd3eKETQAmzBx_dK2lHPz0uSYT612Wdp2Y=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
    selectors: {
      article: "",
      title: "",
      summary: "",
      image: "",
    },
  },
];
