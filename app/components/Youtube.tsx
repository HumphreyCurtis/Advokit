type Props = { url?: string; title?: string };

function toEmbedUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim());

    // Accept common patterns: watch, youtu.be, shorts
    let id =
      (u.hostname.includes("youtu.be") && u.pathname.slice(1)) ||
      (u.pathname.startsWith("/shorts/") && u.pathname.split("/")[2]) ||
      (u.searchParams.get("v") ?? "");

    id = id.replace(/[^\w-]/g, ""); // basic sanitize
    if (!id) return null;

    // Start time: supports t=90, t=1m30s, or start=90
    const t = u.searchParams.get("t") ?? u.searchParams.get("start") ?? "";
    const start = /^\d+$/.test(t)
      ? Number(t)
      : /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/.test(t)
        ? (() => {
            const [, h, m, s] = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/)!;
            return Number(h || 0) * 3600 + Number(m || 0) * 60 + Number(s || 0);
          })()
        : 0;

    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      ...(start ? { start: String(start) } : {}),
    });

    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  } catch {
    return null;
  }
}

export default function YouTube({ url, title = "YouTube video" }: Props) {
  if (!url) return null;

  const embed = toEmbedUrl(url);

  if (!embed) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm aspect-video mt-3">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={embed}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
