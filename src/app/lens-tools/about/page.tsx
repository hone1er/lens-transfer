import { LensProfileDisplay } from "@/components/composed/LensProfileDisplay";

export default function AboutPage() {
  return (
    <main className="">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 p-4 md:p-6 lg:p-8">
        <LensProfileDisplay />
      </div>
    </main>
  );
}
