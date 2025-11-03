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
      {figure && (
        <figure className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <img
            src={figure}
            alt={figureCaption ?? ""} // accessible fallback
            className="h-auto w-full"
          />
          {/* Only render caption if provided */}
          {figureCaption && (
            <figcaption className="px-4 py-3 text-sm text-gray-600">
              {figureCaption}
            </figcaption>
          )}
        </figure>
      )}
      {audio && audioCaption && (
        <AudioPlayer src={audio} caption={audioCaption} />
      )}
      {youtubeVideo && <YouTube url={youtubeVideo} title="Demo clip" />}
    </section>
  );
}
