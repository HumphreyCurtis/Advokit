import type { ReactNode } from "react";

export type Benefit = {
  id: number;
  title: string;
  difficulty: number;
  value: number;
  info: string;
  slug: string;
  article?: Article;
};

export type Section = {
  id: string;
  title: string;
  body: string;
  className?: string;
  figure?: string;
  figureCaption?: string;
};

export type Article = { sections: Section[] };
