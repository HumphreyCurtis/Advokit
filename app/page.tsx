// import BenefitTable from "./components/BenefitTable";
// import BenefitList from "./components/BenefitList";
// import Beginning from "./components/Beginning";
import Link from "next/link";
import Image from "next/image";
import Disclaimer from "./components/Disclaimer";
import ThinkingImage from "@/public/images/thinking.jpg";
import ApplicationImage from "@/public/images/pen-paper.jpg";
import CommunityImage from "@/public/images/community.jpg";
import QuestionMark from "@/public/images/question-mark.jpg";

const tiles = [
  {
    title: "I'm thinking of applying...",
    href: "/benefits-table",
    imageSrc: ThinkingImage,
    imageAlt: "Person considering whether to start a benefits application",
    description: "Where to start, what to expect, and how to get support.",
  },
  {
    title: "I've started a benefits application!",
    href: "/benefits-list",
    imageSrc: ApplicationImage,
    imageAlt: "Form and laptop on a table with notes",
    description: "Tips for filling in forms, assessments, and appeals.",
  },
  {
    title: "Real People. Real Stories.",
    href: "/stories",
    imageSrc: CommunityImage,
    imageAlt: "Group of people sharing experiences together",
    description: "Hear from people with aphasia about their welfare journeys.",
  },
  {
    title: "Who are we?",
    href: "/about",
    imageSrc: QuestionMark,
    imageAlt: "Advokit team working together around a table",
    description: "Find out more about the people behind Advokit.",
  },
];

export default function Home() {
  return (
    <main className="bg-advokit-page text-black-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-2 py-5 md:px-4 md:py-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Advokit</h1>
          <p className="text-base text-black-600 md:text-lg">
            Community assembled advice, tips and resources made by people with
            aphasia for fellow benefit applicants.
          </p>
        </header>

        <div className="mt-6">
          <Disclaimer />
        </div>

        {/* Tile grid */}
        <section
          aria-label="Choose where you are in your benefits journey"
          className="mt-8 md:mt-10"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {tiles.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-advokit-page focus-visible:ring-black-900"
              >
                <div className="relative flex h-36 sm:h-40 md:h-44 items-center justify-center bg-black/5">
                  <Image
                    src={tile.imageSrc}
                    alt={tile.imageAlt}
                    width={240}
                    height={160}
                    className="max-h-full w-auto object-contain"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-black/5 to-transparent" />
                </div>{" "}
                <div className="p-4 md:p-5">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {tile.title}
                  </h2>
                  <p className="mt-1 text-sm text-black-600">
                    {tile.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
// <div className="mt-5 space-y-12">
//   <section id="benefits-list" className="scroll-mt-24">
//     <div className="mt-4 rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
//       <BenefitList />
//     </div>
//   </section>
//   <section id="benefits-table" className="scroll-mt-24">
//     <div className="mt-2">
//       <BenefitTable />
//     </div>
//   </section>
// </div>
