export type Benefit = {
  id: number;
  title: string;
  difficulty: number;
  value: number;
  info: string;
  slug: string;
  article?: Article;
  resources?: Resource[];
  videos?: Video[];
};

export type Article = { sections: Section[] };

export type Section = {
  id: string;
  title: string;
  body: string;
  className?: string;
  figure?: string;
  figureCaption?: string;
  audio?: string;
  audioCaption?: string;
  youtubeVideo?: string;
};

export type InfoBox = {
  status: string;
  published: string;
};

export type Resource = {
  url: string;
  title?: string;
};

export type Video = {
  url: string;
  title?: string;
};
