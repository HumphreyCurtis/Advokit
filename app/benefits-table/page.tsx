import BenefitTable from "../components/BenefitTable";
import YouTube from "../components/Youtube";

export default function BenefitsTable() {
  return (
    <main className="bg-advokit-page text-black-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-2 py-5 md:px-4 md:py-8">
        <div className="mt-5 space-y-8">
          <details className="bg-white/70 rounded-2xl p-4 ring-1 ring-black/5">
            <summary className="cursor-pointer text-2xl font-bold tracking-tight">
              What is the benefit ranking table?
            </summary>

            <div className="pt-4">
              <YouTube
                url="https://youtu.be/NL-K2_eSozs"
                title="Explaining the benefit table"
              />
            </div>
          </details>
          <div>
            <BenefitTable />
          </div>
        </div>
      </div>
    </main>
  );
}
