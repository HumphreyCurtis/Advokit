import Link from "next/link";
import { getAllBenefits } from "@/app/lib/benefits";

export default function BenefitLayout({
  children,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const benefits = getAllBenefits();
  console.log(benefits);

  return (
    // Push everything below your fixed header (assumes h-16 / 64px)
    <div>
      {/* Desktop-only sidebar below header */}
      <nav
        aria-label="Benefits (desktop)"
        className="fixed top-16 bottom-0 hidden md:block w-64 overflow-y-auto border-r border-gray-200 bg-white p-4"
      >
        <ul className="space-y-2">
          {benefits.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/benefits/${b.slug}`}
                className="block rounded-md px-3 py-2 text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
              >
                {b.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content (full-width on mobile, offset on desktop) */}
      <main className="p-4 md:ml-64 md:p-6">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

// <div className="relative md:hidden">
//   <nav
//     aria-label="Benefits (mobile)"
//     className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
//   >
//     <ul className="flex gap-3 pl-4 pr-4 pb-3 pt-1 whitespace-nowrap">
//       {benefits.map((benefit) => (
//         <li key={benefit.slug} className="snap-start">
//           <Link
//             href={`/benefits/${benefit.slug}`}
//             className="inline-flex items-center rounded-md px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
//           >
//             {benefit.title}
//           </Link>
//         </li>
//       ))}
//     </ul>
//   </nav>
//   <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white to-transparent" />
// </div>
