export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          OOP Assignment 2
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          HydroCarbon Visualizer
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          A Next.js and Tailwind app for visualizing hydrocarbon class inheritance
          and polymorphic chemical reactions.
        </p>
      </section>
    </main>
  );
}
