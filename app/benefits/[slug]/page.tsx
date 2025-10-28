import { getBenefitDataBySlug } from "@/app/lib/benefits";

export default async function BenefitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const benefit = getBenefitDataBySlug(slug);

  return <h1>{benefit.title}</h1>;
}
