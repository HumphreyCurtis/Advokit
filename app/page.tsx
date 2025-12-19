import Link from "next/link";
import Image from "next/image";
import Disclaimer from "./components/Disclaimer";
import ThinkingImage from "@/public/images/help-with-form.png";
import ApplicationImage from "@/public/images/mountain.png";
import CommunityImage from "@/public/images/sunflower.png";
import QuestionMark from "@/public/images/speech-therapy.png";
import YouTube from "./components/Youtube";

/* Data for homescreen tiles */
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
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Advokit</h1>
          <p className="text-base text-black-600 md:text-lg">
            This site is made by people with aphasia. It helps people apply for
            benefits.
          </p>
        </header>

        <div className="mb-5">
          <Disclaimer />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            What is Advokit?
          </h2>
          <YouTube
            url="https://youtu.be/ABHzo2Y0Y-U"
            title="Introducing Advokit"
          />
        </div>

        {/* Tile grid */}
        <section
          aria-label="Choose where you are in your benefits journey"
          className="mt-8 md:mt-5"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            Pick an option below
          </h2>
          <p className="mt-1 text-sm text-black-600 mb-3">
            What describes your current situation?
          </p>

          {/* Maps through tiles array to build 2X2 grid of tiles on homescreen */}
          <div className="grid gap-4 sm:grid-cols-2">
            {tiles.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:bg-blue-50 hover:ring-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2 focus-visible:ring-offset-advokit-page"
              >
                <div className="relative flex h-36 sm:h-40 md:h-44 items-center justify-center bg-black/5 overflow-hidden">
                  <Image
                    src={tile.imageSrc}
                    alt={tile.imageAlt}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-black/5 to-transparent" />
                </div>
                <div className="p-4 md:p-5">
                  <h2 className="text-xl font-semibold tracking-tight">
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
