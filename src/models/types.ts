export interface NewsSource {
  name: string;
  url: string;
  img: string;
  selectors: {
    article: string;
    title: string;
    summary: string;
    image: string;
  };
}

export interface Article {
  title: string;
  summary: string;
  imageUrl: string;
  url: string;
  date: Date;
}
