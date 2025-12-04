import BenefitList from "../components/BenefitList";

export default function BenefitsList() {
  return (
    <main className="bg-advokit-page text-black-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-2 py-5 md:px-4 md:py-8">
        <section className="scroll-mt-24">
          <div className="mt-4 rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
            <BenefitList />
          </div>
        </section>
      </div>
    </main>
  );
}
