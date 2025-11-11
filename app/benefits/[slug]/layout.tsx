import type { ReactNode } from "react";
import { getBenefitDataBySlug } from "@/app/lib/benefits";

const bgByDifficulty: Record<1 | 2 | 3, string> = {
  1: "bg-advokit-green",
  2: "bg-advokit-amber",
  3: "bg-advokit-red",
};

export default async function BenefitPageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const benefit = getBenefitDataBySlug(slug);
  const bg = benefit ? bgByDifficulty[benefit.difficulty as 1 | 2 | 3] : "";

  return (
    <main className={`min-h-dvh p-4 md:p-6 ${bg}`}>
      <div className="mx-auto w-full max-w-4xl">{children}</div>
    </main>
  );
}

// export default function BenefitLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const benefits = getAllBenefits();

//   return (
//     // Push everything below your fixed header (assumes h-16 / 64px)
//     <div>
//       {/* Desktop-only sidebar below header */}
//       <nav
//         aria-label="Benefits (desktop)"
//         className="fixed top-16 bottom-0 hidden md:block w-64 overflow-y-auto border-r border-gray-200 bg-white p-4"
//       >
//         <ul className="space-y-2">
//           {benefits.map((b) => (
//             <li key={b.slug}>
//               <Link
//                 href={`/benefits/${b.slug}`}
//                 className="block rounded-md px-3 py-2 text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
//               >
//                 {b.title}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Main content (full-width on mobile, offset on desktop) */}
//       <main className="p-4 md:ml-64 md:p-6">
//         <div className="mx-auto w-full max-w-4xl">{children}</div>
//       </main>
//     </div>
//   );
// }
