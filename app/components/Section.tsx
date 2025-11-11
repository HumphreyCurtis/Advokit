import type { Section } from "../types";
import AudioPlayer from "./AudioPlayer";
import YouTube from "./Youtube";

export default function Section({
  id,
  title,
  body,
  figure,
  figureCaption,
  audio,
  audioCaption,
  youtubeVideo,
}: Section) {
  return (
    <section
      id={id}
      className={"prose prose-gray max-w-none scroll-mt-16 prose prose gray"}
    >
      <h2 className="mt-10 mb-3 text-2xl font-semibold leading-tight decoration-2">
        {title}
      </h2>
      <p>{body}</p>
    </section>
  );
}
