import Link from "next/link";
import { getAllBenefits } from "@/app/lib/benefits";

export default function BenefitList() {
  const benefits = getAllBenefits();

  return (
    <div>
      <ol className="list-decimal pl-5 space-y-3">
        {benefits.map((benefit) => (
          <li key={String(benefit.id)}>
            <h3 className="font-semibold">
              <Link
                href={`/benefits/${benefit.slug}`}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline underline-offset-2
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition"
              >
                {benefit.title}
              </Link>
            </h3>
          </li>
        ))}
      </ol>
    </div>
  );
}

// <p className="text-sm text-gray-600">{benefit.info}</p>
