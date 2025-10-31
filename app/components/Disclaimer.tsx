// app/components/Disclaimer.jsx
export default function Disclaimer() {
  return (
    <section
      role="note"
      aria-label="Disclaimer"
      className={`not-prose rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm print:border-black print:bg-white mt-6`}
    >
      <div className="flex items-start gap-3">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="mt-0.5 h-5 w-5 shrink-0"
        >
          <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
        </svg>

        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">Disclaimer</h2>
          <p className="mt-1">
            We co-design this site with people and communities living with
            aphasia in London. The information here is general and may not fit
            every case. Rules and forms can change, and councils or assessors
            may do things differently.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>This is not legal advice.</li>
            <li>
              Everyone’s needs are different; you may face unique challenges.
            </li>
            <li>
              Please check official sources and, if you can, speak to an
              adviser.
            </li>
          </ul>
          <p className="mt-2">
            See{" "}
            <a
              href="https://www.gov.uk/browse/benefits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline underline-offset-2"
            >
              GOV.UK – Benefits
            </a>{" "}
            or{" "}
            <a
              href="https://www.citizensadvice.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline underline-offset-2"
            >
              Citizens Advice
            </a>{" "}
            for up-to-date guidance.
          </p>
        </div>
      </div>
    </section>
  );
}
