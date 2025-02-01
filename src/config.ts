import { NewsSource } from './types';

export const newsSources: NewsSource[] = [
  {
    name: 'lemonde',
    url: 'https://www.lemonde.fr',
    selectors: {
      article: '.article',
      title: 'h3.article__title',
      summary: '.article__desc',
      image: '.article__image img'
    }
  },
  // Ajoutez d'autres sources ici avec leurs sélecteurs spécifiques
];