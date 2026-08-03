export type Benefit = {
  id: number;
  title: string;
  difficulty: number;
  value: number;
  info: string;
  links: string;
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
  info?: string;
  transcript?: string;
};

export type Participant = {
  participantId: string; // pseudonymous id
  displayName?: string; // optional, user-chosen
  mode: "anonymous" | "named";
  consentedAtISO: string;
};

export type Role = "user" | "assistant" | "system";

export type SimpleSpeechRecognitionEvent = {
  results: SpeechRecognitionResult[]; // TS already knows this type
};

// Minimal shape of the Web Speech API recognition object. Only the members we
// actually use — the spec is still a draft and browser support varies.
export type SimpleSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SimpleSpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export type SimpleSpeechRecognitionConstructor = new () => SimpleSpeechRecognition;

// Chrome exposes this prefixed; neither is in TypeScript's DOM lib yet.
export type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SimpleSpeechRecognitionConstructor;
  webkitSpeechRecognition?: SimpleSpeechRecognitionConstructor;
};

export type InputMode = "typed" | "speech" | "unknown";
