import type { Video } from "../types";
import YouTube from "./Youtube";

export default function VideoPlayer({ videos }: { videos: Video[] }) {
  if (!videos?.length) return null;

  return (
    <section aria-label="Related videos" className="space-y-4 mt-3">
      {videos.map(({ title, url }, i) => (
        <article
          key={url ?? i}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          {title && (
            <h2 className="mb-3 text-lg sm:text-xl font-semibold text-gray-800">
              {title}
            </h2>
          )}

          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <YouTube url={url} title={title ?? "YouTube video"} />
          </div>
        </article>
      ))}
    </section>
  );
}
