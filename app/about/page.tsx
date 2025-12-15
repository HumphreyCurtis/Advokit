export default function About() {
  return (
    <main className="bg-advokit-about text-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        {/* Page title */}
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          About Advokit
        </h1>
        <p className="mt-3 text-gray-800">
          Advokit is a community-built toolkit to help people with aphasia and
          their supporters navigate disability benefits and public services. It
          draws on a multi-stage co-design study exploring current digital
          welfare experiences and more inclusive futures.
        </p>

        {/* What Advokit offers */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            What Advokit offers
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
            <li>
              Plain-language tips for key benefits and practical steps that
              successful applicants use - even encouragement to get started!
            </li>
            <li>
              Real stories: Recorded stories about people with aphasia's benefit
              experiences including their insights and experience.
            </li>
            <li>
              Community-informed red flags and workarounds for digital portals,
              phone systems, and assessments.
            </li>
            <li>
              Accessible formats: larger text, clear hierarchy, read-aloud
              support, and multimedia where helpful.
            </li>
          </ul>
        </section>

        {/* Partners */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Our partners
          </h2>
          <p className="mt-2 text-gray-800">
            Built in partnership between <strong>Aphasia Re-Connect</strong> and{" "}
            <strong> King’s College London</strong>, with contributions from 40+
            people with aphasia, speech and language therapists (SLTs), and
            caregivers in London and online.
          </p>
        </section>

        {/* Quick stats */}
        <section className="mt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
              <div className="text-2xl font-bold">42</div>
              <div className="text-xs text-gray-600">Total participants</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-xs text-gray-600">Workshops</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="text-xs text-gray-600">Study stages</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
              <div className="text-2xl font-bold">£20/hr</div>
              <div className="text-xs text-gray-600">Participant honoraria</div>
            </div>
          </div>
          <p className="sr-only">
            The study ran across 4 stages and 8 workshops with 42 participants.
          </p>
        </section>

        {/* Aphasia Re-Connect */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Who are Aphasia Re-Connect?
          </h2>

          <p className="mt-2 max-w-3xl text-gray-800">
            Aphasia Re-Connect is a UK charity that brings people with aphasia
            together, creating a peer support network to help people live life,
            discover opportunity, and build confidence and wellbeing.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
            <li>
              <strong>Peer-led support:</strong> people with aphasia take active
              roles as peer supporters, advisors and befrienders, working in
              equal partnership to design and run services.
            </li>
            <li>
              <strong>Groups & activities:</strong> online and in-person groups
              such as conversation, reading, workers’ forum, and access-to-work
              support.
            </li>
            <li>
              <strong>Who they are:</strong> founded and coordinated by Dr Sally
              McVicker, alongside a wider team and volunteers.
            </li>
          </ul>
          <p className="mt-2 text-gray-800">
            Learn more or get in touch via their website:{" "}
            <a
              href="https://aphasiareconnect.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50"
            >
              Visit Aphasia Re-Connect
              <span aria-hidden="true">↗</span>
            </a>
          </p>
          <p className="mt-2 max-w-3xl text-gray-800">
            Aphasia Re-Connect is a UK charity that brings people with aphasia
            together, creating a peer support network to help people live life,
            discover opportunity, and build confidence and wellbeing.
          </p>
        </section>

        {/* Co-design process */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Co-design process
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
            <li>
              <strong>Stage 1:</strong> Advisory board, unstructured interviews,
              and support during a live Universal Credit migration call.
            </li>
            <li>
              <strong>Stage 2:</strong> Ranking services with tangible{" "}
              <em>Help</em> and <em>Feelings</em> cards to map importance and
              difficulty.
            </li>
            <li>
              <strong>Stage 3:</strong> Journey-mapping barriers and
              facilitators using <em>Where</em> and <em>Barrier</em> cards.
            </li>
            <li>
              <strong>Stage 4:</strong> Speculative design-fiction videos to
              discuss risks and hopes for AI-automated services.
            </li>
          </ul>
        </section>

        {/* What we heard */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            What we heard
          </h2>
          <p className="mt-2 max-w-3xl text-gray-800">
            Co-designers highlighted the realities of navigating digital welfare
            and identified recurring challenges:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
            <li>
              <strong>Performing disability:</strong> pressure to “prove”
              impairment and the emotional cost of assessments.
            </li>
            <li>
              <strong>Geographies of inequity:</strong> uneven access shaped by
              region, class, and local service cuts.
            </li>
            <li>
              <strong>Digital bureaucracy:</strong> logins, portals, uploads,
              and long phone queues that exclude.
            </li>
            <li>
              <strong>Accessibility paradox:</strong> systems “for access” that
              trap people in limbo.
            </li>
            <li>
              <strong>Hostile design:</strong> deterrence, outsourcing, and
              fragmented responsibility.
            </li>
          </ul>
        </section>

        {/* What we envisioned */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            What we envisioned together
          </h2>
          <p className="mt-2 text-gray-800">
            Co-designers imagined more caring, transparent, and accountable
            futures for AI in welfare:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-800">
            <li>
              <strong>Patient, multimodal dialogues:</strong> slow turn-taking,
              options to speak, type, or use visuals; involve trusted
              supporters.
            </li>
            <li>
              <strong>Human-in-the-loop:</strong> a clear path to a named person
              when needed (a “radar-key” style escalation).
            </li>
            <li>
              <strong>Open and truthful infrastructure:</strong> public,
              auditable systems that explain decisions and surface real
              entitlements.
            </li>
          </ul>
        </section>

        {/* Ethics & acknowledgments */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ethics & acknowledgments
          </h2>
          <p className="mt-2 text-gray-800">
            The study received university ethics approval; participants could
            pause or withdraw at any time and were compensated for their time.
            We thank every co-designer, SLT, and caregiver who shared their
            expertise and lived experience.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-10 mb-6">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Contact
          </h2>
          <p className="mt-2 max-w-3xl text-gray-800">
            To collaborate or share feedback from your community group, please
            reach out.
          </p>
        </section>
      </div>
    </main>
  );
}
