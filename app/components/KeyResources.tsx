import type { Resource } from "../types";

export default function KeyResources({ resources }: { resources: Resource[] }) {
  if (!resources.length) return null;
  return (
    <section
      id="key-resources"
      className="not-prose mt-8 rounded-lg border border-gray-200 bg-white p-4"
    >
      <h2 className="mb-3 text-lg font-semibold">
        Further downloadable resources and links
      </h2>
      <ul className="list-disc pl-5 space-y-1">
        {resources.map((r, i) => {
          const url = typeof r === "string" ? r : r.url;
          const title = typeof r === "string" ? r : (r.title ?? r.url);
          return (
            <li key={i}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline-offset-2 hover:underline wrap-break-word"
              >
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
