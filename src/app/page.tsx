import { LensApp } from "@/components/composed/LensApp";

export default function HomePage() {
  return (
    <main className="">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 p-4 md:p-6 lg:p-8">
        <LensApp />
      </div>
    </main>
  );
}
