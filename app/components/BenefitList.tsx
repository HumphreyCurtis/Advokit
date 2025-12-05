import Link from "next/link";
import WorriedButton from "./WorriedButton";
import { getAllBenefits } from "@/app/lib/benefits";

export default function BenefitList() {
  const benefits = getAllBenefits();

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Full list
      </h2>
      {/* Tile grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <Link
            key={String(benefit.id)}
            href={`/benefits/${benefit.slug}`}
            className="group block rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm transition 
                       hover:shadow-md hover:border-blue-500 focus-visible:outline-none 
                       focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
                       focus-visible:ring-offset-transparent"
          >
            <div className="flex items-center gap-3">
              {/* Number badge */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {index + 1}
              </span>

              {/* Title */}
              <h3 className="text-base font-semibold leading-snug md:text-lg">
                {benefit.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <WorriedButton />
    </div>
  );
}

// export default function BenefitList() {
//   const benefits = getAllBenefits();

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
//         Full list
//       </h2>
//       <ol className="list-decimal pl-5 space-y-3 mt-3">
//         {benefits.map((benefit) => (
//           <li key={String(benefit.id)}>
//             <h3 className="font-semibold">
//               <Link
//                 href={`/benefits/${benefit.slug}`}
//                 className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline underline-offset-2
// focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition"
//               >
//                 {benefit.title}
//               </Link>
//             </h3>
//           </li>
//         ))}
//       </ol>
//     </div>
//   );
// }

// <p className="text-sm text-gray-600">{benefit.info}</p>
