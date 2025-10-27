import benefitData from "@/data/home.json";

export default function BenefitPage({ params }: { params: { slug: string } }) {
  const benefits = benefitData;
  console.log(benefits);
  return <h1>Hello World!</h1>;
}
