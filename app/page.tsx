import BenefitTable from "./components/BenefitTable";
import BenefitList from "./components/BenefitList";
import Disclaimer from "./components/Disclaimer";
import Beginning from "./components/Beginning";

export default function Home() {
  return (
    <main className="bg-advokit-page text-black-900">
      <div className="mx-auto max-w-5xl px-2 py-5">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Advokit</h1>
          <p className="text-base text-black-600 md:text-lg">
            Community assembled advice, tips and resources made by people with
            aphasia for fellow benefit applicants.
          </p>
        </header>
        <Disclaimer />
        <Beginning />
        <div className="mt-5 space-y-12">
          <section id="benefits-list" className="scroll-mt-24">
            <div className="mt-4 rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
              <BenefitList />
            </div>
          </section>
          <section id="benefits-table" className="scroll-mt-24">
            <div className="mt-2">
              <BenefitTable />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
