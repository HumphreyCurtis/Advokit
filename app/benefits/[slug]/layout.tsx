import Link from "next/link";

export default function BenefitLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 md:py-10">
      <div className="grid gap-6 md:gap-10 md:grid-cols-[240px,1fr]">
        <h1>Sorcery</h1>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
