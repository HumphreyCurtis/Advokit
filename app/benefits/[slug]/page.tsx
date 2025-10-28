import { use } from "react";
import { notFound } from "next/navigation";
import benefitData from "@/data/home.json";
import type { Benefit } from "@/app/types";

// type Item = { slug: string; title: string }; // Rewrite by forming proper external Types file

// export async function generateStaticParams() {
//   const items = (await import("@/data/home.json")).default as Item[];
//   return items.map((b) => ({ slug: b.slug }));
// }

export function getAllBenefits(): Benefit[] {
  return benefitData;
}

// Move to library
export function getBenefitDataBySlug(slug: string): Benefit {
  const benefit = benefitData.find((b) => b.slug === slug);
  if (!benefit) {
    throw new Error(`Benefit with slug not found`);
  }
  console.log(benefit);
  return benefit;
}

// Taken from NextJS course -- rewrite the page call
// export async function getModelById(id: string | number): Promise<Model> {
//   const foundModel = modelsData.find(
//     (model: Model) => model.id.toString() === id.toString()
//   )
//   if (!foundModel) {
//     throw new Error(`Model with id ${id} not found`)
//   }
//   return foundModel
// }

export default async function BenefitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const benefit = getBenefitDataBySlug(slug);

  // const { slug } = use(params); // unwrap Promise
  // const pageBenefit = (benefitData as Item[]).find((b) => b.slug === slug);
  // if (!pageBenefit) notFound();
  return <h1>{benefit.title}</h1>;
}
