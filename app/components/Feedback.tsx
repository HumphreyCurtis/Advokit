export default function Feedback() {
  return (
    <section
      role="note"
      aria-label="Feedback"
      className="not-prose mt-6 rounded-xl border border-blue-300 bg-blue-50 p-5 text-sm text-blue-900 shadow-sm print:border-black print:bg-white"
    >
      <div className="flex items-start gap-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="mt-0.5 h-5 w-5 shrink-0"
        >
          <path d="M21 6h-2v9H7v2a1 1 0 0 0 1 1h9l4 4V7a1 1 0 0 0-1-1zM17 2H3a1 1 0 0 0-1 1v14l4-4h11a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
        </svg>

        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">
            Help Us Improve Advokit
          </h2>

          <p className="mt-1">
            We would really value your feedback about your experience using{" "}
            <strong>Advokit</strong>. Your comments (good or bad) can help us
            improve the toolkit.
          </p>

          <p className="mt-2">
            The form includes 15 short questions and takes around{" "}
            <strong>5–10 minutes</strong> to complete.
          </p>

          {/* Centered Button */}
          <div className="mt-5 flex justify-center">
            <a
              href="https://forms.gle/thtQ3AX2aqjXvG4E8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-blue-600 px-4 py-1.5 text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Give Feedback
            </a>
          </div>

          <p className="mt-4">
            Prefer to email or share additional suggestions? Contact{" "}
            <a
              href="mailto:filip.bircanin@kcl.ac.uk"
              className="font-medium text-blue-700 underline underline-offset-2"
            >
              filip.bircanin@kcl.ac.uk
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
