import BenefitTable from "./sections/BenefitTable";
import BenefitList from "./sections/BenefitList";

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      <div className="mx-auto max-w-5xl px-2 py-5">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Advokit</h1>
          <p className="text-base text-gray-600 md:text-lg">
            Community assembled advice, tips and resources made by people with
            aphasia for fellow post-stroke benefit applicants.
          </p>
        </header>
        <div className="mt-10 space-y-12">
          <section id="benefits-list" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Full list
            </h2>
            <div className="mt-4 rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
              <BenefitList />
            </div>
          </section>
          <section id="benefits-table" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Ranking table
            </h2>
            <div className="mt-4">
              <BenefitTable />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
