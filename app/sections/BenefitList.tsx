import benefitData from "@/data/home.json";
import Link from "next/link";

type Benefit = {
  id: number | string;
  title: string;
  difficulty: number | string;
  value: number | string;
  info: string;
};

export default function BenefitList() {
  const benefits = benefitData as Benefit[]; // ensure it's an array

  return (
    <div>
      <ol className="list-decimal pl-5 space-y-3">
        {benefits.map((benefit) => (
          <li key={String(benefit.id)}>
            <h3 className="font-semibold">
              <Link
                href={`/benefits/${benefit.id}`}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline underline-offset-2
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition"
              >
                {benefit.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600">{benefit.info}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
