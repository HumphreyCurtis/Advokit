import benefitData from "@/data/home.json";
import type { Benefit } from "@/app/types";

export function getAllBenefits(): Benefit[] {
  return benefitData;
}

export function getBenefitDataBySlug(slug: string): Benefit {
  const benefit = benefitData.find((b) => b.slug === slug);
  if (!benefit) {
    throw new Error(`Benefit with slug not found`);
  }
  console.log(benefit);
  return benefit;
}
