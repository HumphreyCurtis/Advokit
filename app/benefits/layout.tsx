import Link from "next/link";
import { getAllBenefits } from "@/app/lib/benefits";
import type { Benefit } from "@/app/types";

export default function BenefitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const benefits = getAllBenefits(); // server-side

  return (
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

      {/* Let child layouts/pages control main & background */}
      <section className="md:ml-64">{children}</section>
    </div>
  );
}
