import BenefitTable from "../components/BenefitTable";

export default function BenefitsTable() {
  return (
    <main className="bg-advokit-page text-black-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-2 py-5 md:px-4 md:py-8">
        <div className="mt-5 space-y-12">
          <div className="mt-2">
            <BenefitTable />
          </div>
        </div>
      </div>
    </main>
  );
}
