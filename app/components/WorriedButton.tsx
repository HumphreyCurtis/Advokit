import Link from "next/link";
import Image from "next/image";
import WorriedPerson from "@/public/images/barriers.png";

export default function WorriedButton() {
  return (
    <section
      aria-label="If you're feeling worried about your application"
      className="mt-6"
    >
      <Link
        href="/stories"
        aria-label="Read stories from people who have been through the process"
        className="group flex flex-col items-stretch gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-amber-50 ring-1 ring-black/5">
            <Image
              src={WorriedPerson} // change to your actual asset
              alt="Person looking worried but getting support"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="text-ml font-semibold uppercase tracking-wide text-amber-800">
              Feeling a tad worried?
            </p>
            <p className="mt-1 text-sm text-gray-800">
              If you&apos;re feeling overwhelmed, worried or concerned about
              your application, please refer to our{" "}
              <span className="font-semibold underline decoration-amber-500 decoration-2 underline-offset-2 group-hover:decoration-amber-600">
                Stories page
              </span>{" "}
              where you can learn advice from people who&apos;ve been through
              the process already.
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}
