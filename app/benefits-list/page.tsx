import BenefitList from "../components/BenefitList";
import YouTube from "../components/Youtube";

export default function BenefitsList() {
  return (
    <main className="bg-advokit-page text-black-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-2 py-5 md:px-4 md:py-8">
        <details className="mt-5 bg-white/70 rounded-2xl p-4 ring-1 ring-black/5">
          <summary className="cursor-pointer text-2xl font-bold tracking-tight focus-visible:outline-none">
            What is the benefits list?
          </summary>

          <div className="pt-4">
            <YouTube
              url="https://youtu.be/W7I_e6EjRBs"
              title="Explaining the benefit list"
            />
          </div>
        </details>
        <section className="scroll-mt-24 mt-8">
          <BenefitList />
        </section>
      </div>
    </main>
  );
}
